/* Controlled lifecycle tests; browser rendering is checked separately. */
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, fs.existsSync(path.join(root, 'pilots'))
  ? 'pilots/mirror-mirror/assets/hero-motion.js' : 'assets/hero-motion.js'), 'utf8');
function setup(reduce = false, present = true) {
  const events = () => ({handlers:{},addEventListener(k,f){this.handlers[k]=f;},fire(k){this.handlers[k]?.();}});
  const control = {...events(),hidden:true,attrs:{},setAttribute(k,v){this.attrs[k]=v;}};
  const classes = new Set();
  const hero = {querySelector:()=>control,classList:{contains:k=>classes.has(k),remove:k=>classes.delete(k),toggle:(k,on)=>on?classes.add(k):classes.delete(k)}};
  const document = {...events(),hidden:false,querySelector:()=>present?hero:null};
  const media = {...events(),matches:reduce};
  const window = events();
  let visibility;
  window.IntersectionObserver = function(callback) {visibility=callback; this.observe=()=>{};};
  vm.runInNewContext(script,{document,window,matchMedia:()=>media,IntersectionObserver:window.IntersectionObserver});
  return {control,hero,document,window,media,leave:()=>visibility([{isIntersecting:false}]),playing:()=>classes.has('playing')};
}
test('starts still and only starts after explicit play; pause remains available',()=>{
  const s=setup(); assert.equal(s.playing(),false); assert.equal(s.control.hidden,false);
  s.control.fire('click'); assert.equal(s.playing(),true); assert.equal(s.control.attrs['aria-label'],'Pause still-image motion study');
  s.control.fire('click'); assert.equal(s.playing(),false); assert.equal(s.control.attrs['aria-pressed'],'false');
});
test('reduced motion hides playback and changes stop motion without resuming',()=>{
  const s=setup(true); assert.equal(s.control.hidden,true); s.control.fire('click'); assert.equal(s.playing(),false);
  s.media.matches=false; s.media.fire('change'); assert.equal(s.control.hidden,false); assert.equal(s.playing(),false);
  s.control.fire('click'); s.media.matches=true; s.media.fire('change'); assert.equal(s.playing(),false); assert.equal(s.control.hidden,true);
});
test('backgrounding, leaving the viewport and leaving the page pause playback',()=>{
  const s=setup(); s.control.fire('click'); s.document.hidden=true; s.document.fire('visibilitychange'); assert.equal(s.playing(),false);
  s.control.fire('click'); assert.equal(s.playing(),false);
  s.document.hidden=false; s.document.fire('visibilitychange'); assert.equal(s.playing(),false);
  s.control.fire('click'); s.leave(); assert.equal(s.playing(),false);
  s.control.fire('click'); s.window.fire('pagehide'); assert.equal(s.playing(),false);
});
test('interior pages without a motion hero do not acquire controls or effects',()=>{
  const s=setup(false,false); assert.equal(s.control.hidden,true); assert.deepEqual(s.document.handlers,{}); assert.deepEqual(s.window.handlers,{});
});
