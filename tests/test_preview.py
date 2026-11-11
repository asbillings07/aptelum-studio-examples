"""Verify the deployed artifact and refusal paths without any provider access."""
import base64
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]


def build(root, **env):
    clean_env = {k: v for k, v in os.environ.items() if not k.startswith('VERCEL')}
    return subprocess.run(['node', str(root / 'scripts/build-preview.mjs')],
                          env={**clean_env, **env}, text=True, capture_output=True, timeout=30)


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids, self.scripts, self.tags = [], set(), [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append(tag)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for name in ('href', 'src'):
            if attrs.get(name):
                self.links.append(attrs[name])
        if tag == 'script':
            self.scripts.append(attrs)


class PreviewTests(unittest.TestCase):
    def test_complete_artifact(self):
        result = build(ROOT, VERCEL='1', VERCEL_ENV='preview', VERCEL_URL='studio-test.vercel.app')
        self.assertEqual(result.returncode, 0, result.stderr)
        output = ROOT / 'dist'
        inventory = json.loads((ROOT / 'site-files.json').read_text())
        actual = sorted(str(p.relative_to(output)) for p in output.rglob('*') if p.is_file())
        self.assertEqual(actual, sorted(inventory))
        pages = {p: Page((output / p).read_text()) for p in inventory if p.endswith('.html')}
        self.assertEqual(len(pages), 52)
        for brand in ('forma', 'vale', 'morrow', 'threadline', 'northstar', 'vector-harbor'):
            self.assertIn(f'{brand}/index.html', pages)
        for path, page in pages.items():
            text = (output / path).read_text()
            self.assertNotIn('/aptelum-studio-examples/', text, path)
            self.assertNotIn('GitHub Pages', text, path)
            self.assertIn('noindex', text, path)
            self.assertIn('no-referrer', text, path)
            self.assertIn('Content-Security-Policy', text, path)
            self.assertFalse({'form', 'iframe'} & set(page.tags), path)
            for link in page.links:
                url = urlsplit(urljoin('https://preview.test/' + path, link))
                if url.netloc != 'preview.test':
                    self.assertEqual(url.scheme, 'https', (path, link))
                    continue
                target = unquote(url.path).lstrip('/')
                if url.path.endswith('/'):
                    target += 'index.html'
                self.assertIn(target, inventory, (path, link, target))
                if url.fragment and target in pages:
                    self.assertIn(unquote(url.fragment), pages[target].ids, (path, link))
            for script in page.scripts:
                self.assertEqual(script.get('src'), '/assets/technology-theme.js', path)
                digest = base64.b64encode(hashlib.sha256((output / 'assets/technology-theme.js').read_bytes()).digest()).decode()
                self.assertEqual(script.get('integrity'), 'sha256-' + digest, path)
            # The only prose change is the hosting disclosure, not a design rewrite.
            def normalized(value):
                value = re.sub(r'<p>[\s\S]*?</p>', lambda m: '' if ('GitHub Pages' in m[0] or 'Vercel hosts this preview' in m[0]) else m[0], value)
                return value.replace('https://asbillings07.github.io/aptelum-studio-examples/', '/').replace('/aptelum-studio-examples/', '/')
            self.assertEqual(normalized(text), normalized((ROOT / path).read_text()), path)
        for path in inventory:
            if not path.endswith(('.html', '.xml')):
                self.assertEqual((ROOT / path).read_bytes(), (output / path).read_bytes(), path)
            if path.endswith('.css'):
                css = (output / path).read_text()
                self.assertNotIn('@import', css, path)
                for link in re.findall(r'url\([\s\'"]*([^\)\'"\s]+)', css):
                    url = urlsplit(urljoin('https://preview.test/' + path, link))
                    self.assertEqual(url.netloc, 'preview.test', path)
                    self.assertIn(unquote(url.path).lstrip('/'), inventory, (path, link))
        self.assertNotIn('github.io', (output / 'vale/sitemap.xml').read_text())
        self.assertIn('https://studio-test.vercel.app/vale/', (output / 'vale/sitemap.xml').read_text())
        config = json.loads((ROOT / 'vercel.json').read_text())
        self.assertEqual(config['git']['deploymentEnabled'], {'main': False})
        self.assertEqual(config['outputDirectory'], 'dist')

    def fixture(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        root = Path(tmp.name)
        (root / 'scripts').mkdir()
        shutil.copyfile(ROOT / 'scripts/build-preview.mjs', root / 'scripts/build-preview.mjs')
        (root / 'index.html').write_text('<html><body>Example</body></html>')
        (root / 'site-files.json').write_text('["index.html"]')
        return root

    def test_production_and_unknown_environment_stop_before_output(self):
        for env in ({'VERCEL_ENV': 'production'}, {'VERCEL': '1'}, {'VERCEL_ENV': 'unexpected'}):
            root = self.fixture()
            result = build(root, **env)
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse((root / 'dist').exists())

    def test_missing_source_stops_without_replacing_prior_output(self):
        root = self.fixture()
        (root / 'index.html').unlink()
        (root / 'dist').mkdir()
        (root / 'dist/known-good.txt').write_text('retained')
        self.assertNotEqual(build(root).returncode, 0)
        self.assertEqual((root / 'dist/known-good.txt').read_text(), 'retained')

    def test_unlisted_private_files_never_enter_output(self):
        root = self.fixture()
        (root / '.env').write_text('SYNTHETIC=not-a-secret')
        (root / 'private-note.md').write_text('synthetic private fixture')
        self.assertEqual(build(root).returncode, 0)
        self.assertEqual([p.name for p in (root / 'dist').iterdir()], ['index.html'])

    def test_symlinks_traversal_and_duplicate_inventory_rejected(self):
        for paths in (['../index.html'], ['index.html', 'index.html'], ['.env'], ['scripts/build-preview.mjs']):
            root = self.fixture()
            (root / 'site-files.json').write_text(json.dumps(paths))
            self.assertNotEqual(build(root).returncode, 0)
        root = self.fixture()
        (root / 'other.html').write_text('synthetic')
        (root / 'index.html').unlink()
        (root / 'index.html').symlink_to(root / 'other.html')
        self.assertNotEqual(build(root).returncode, 0)
        root = self.fixture()
        (root / 'dist').symlink_to(root / 'scripts', target_is_directory=True)
        self.assertNotEqual(build(root).returncode, 0)
        self.assertTrue((root / 'scripts/build-preview.mjs').is_file())

    def test_bad_preview_hostname_rejected(self):
        self.assertNotEqual(build(self.fixture(), VERCEL_URL='attacker.example/path').returncode, 0)


if __name__ == '__main__':
    unittest.main()
