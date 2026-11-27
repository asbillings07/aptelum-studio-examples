/* Controlled browser-policy failures and lifecycle races; visual QA is separate. */
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, fs.existsSync(path.join(root, 'pilots'))
  ? 'pilots/mirror-mirror/assets/hero-motion.js' : 'assets/hero-motion.js'), 'utf8');
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
function setup({reduce=false, saveData=false, present=true, deny=false, deferred=false}={}) {
  const events = () => ({handlers:{},addEventListener(k,f){this.handlers[k]=f;},fire(k){this.handlers[k]?.();}});
  const caption={textContent:''};
  const control = {...events(),hidden:true,attrs:{},setAttribute(k,v){this.attrs[k]=v;},querySelector:()=>caption};
  let complete;
  const video={...events(),dataset:{videoSrc:'/assets/hero-video.mp4'},src:'',paused:true,calls:0,muted:false,
    getAttribute(k){return this[k];},
    play(){this.calls++;if(deny)return Promise.reject(new Error('NotAllowedError'));
      if(deferred)return new Promise(resolve=>{complete=()=>{this.paused=false;this.fire('playing');resolve();};});
      this.paused=false;this.fire('playing');return Promise.resolve();},
    pause(){this.paused=true;this.fire('pause');}};
  const classes = new Set();
  const hero={querySelector:q=>q==='video'?video:control,classList:{add:k=>classes.add(k),remove:k=>classes.delete(k)}};
  const document={...events(),hidden:false,querySelector:()=>present?hero:null};
  const media={...events(),matches:reduce};
  const connection={...events(),saveData};
  const window=events();let visibility;
  window.IntersectionObserver=function(callback){visibility=callback;this.observe=()=>{};};
  vm.runInNewContext(script,{document,window,navigator:{connection},matchMedia:()=>media,IntersectionObserver:window.IntersectionObserver});
  return {control,video,document,window,media,connection,enter:()=>visibility?.([{isIntersecting:true}]),leave:()=>visibility?.([{isIntersecting:false}]),ready:()=>classes.has('video-ready'),complete:()=>complete?.()};
}
test('loads once when visible, muted, and provides working pause/play',async()=>{
 const s=setup();assert.equal(s.video.src,'');s.enter();await flush();
 assert.equal(s.video.muted,true);assert.equal(s.video.paused,false);assert.equal(s.ready(),true);
 assert.equal(s.control.attrs['aria-label'],'Pause background video');
 s.control.fire('click');assert.equal(s.video.paused,true);s.control.fire('click');await flush();assert.equal(s.video.paused,false);
});
test('reduced motion and data saving avoid all video requests; preference changes require manual restart',async()=>{
 for(const options of [{reduce:true},{saveData:true}]){
  const s=setup(options);s.enter();assert.equal(s.video.src,'');assert.equal(s.control.hidden,true);
 }
 const s=setup();s.enter();await flush();s.media.matches=true;s.media.fire('change');assert.equal(s.video.paused,true);assert.equal(s.ready(),false);
 s.media.matches=false;s.media.fire('change');assert.equal(s.video.paused,true);s.control.fire('click');await flush();assert.equal(s.video.paused,false);
});
test('manual pause survives viewport and visibility changes; automatic pauses can resume',async()=>{
 const s=setup();s.enter();await flush();s.leave();assert.equal(s.video.paused,true);s.enter();await flush();assert.equal(s.video.paused,false);
 s.control.fire('click');s.leave();s.enter();s.document.hidden=true;s.document.fire('visibilitychange');s.document.hidden=false;s.document.fire('visibilitychange');
 assert.equal(s.video.paused,true);
 s.control.fire('click');await flush();s.window.fire('pagehide');assert.equal(s.video.paused,true);
});
test('autoplay denial retains the poster and does not retry on visibility events',async()=>{
 const s=setup({deny:true});s.enter();await flush();assert.equal(s.ready(),false);assert.equal(s.video.calls,1);
 s.leave();s.enter();s.document.fire('visibilitychange');await flush();assert.equal(s.video.calls,1);
 s.control.fire('click');await flush();assert.equal(s.video.calls,2);assert.equal(s.control.attrs['aria-label'],'Play background video');
});
test('failed asset keeps a readable still and permanently disables the broken control',async()=>{
 const s=setup();s.enter();await flush();s.video.fire('error');assert.equal(s.ready(),false);assert.equal(s.video.paused,true);assert.equal(s.control.hidden,true);
 s.leave();s.enter();assert.equal(s.video.calls,1);
});
test('late playback after a pause cannot revive motion',async()=>{
 const s=setup({deferred:true});s.enter();s.control.fire('click');s.complete();await flush();assert.equal(s.video.paused,true);assert.equal(s.ready(),false);
});
test('interior pages do not acquire effects',()=>{const s=setup({present:false});assert.deepEqual(s.document.handlers,{});assert.deepEqual(s.window.handlers,{});});
