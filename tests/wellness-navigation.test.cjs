const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/wellness-navigation.js'),'utf8');
function fixture(){
 const listeners={}, local={}, media={};
 const inside={}, outside={};let focused=0;
 const trigger={focus(){focused++;doc.activeElement=trigger;}};
 const home={focus(){doc.activeElement=home;}};
 const menu={open:true,querySelector:()=>trigger,closest:()=>({querySelector:()=>home}),contains:t=>[inside,trigger,menu].includes(t),addEventListener:(k,f)=>local[k]=f};
 const doc={activeElement:inside,querySelectorAll:()=>[menu],addEventListener:(k,f)=>listeners[k]=f};
 vm.runInNewContext(source,{document:doc,matchMedia:()=>({addEventListener:(k,f)=>media[k]=f})});
 return {listeners,local,media,menu,doc,inside,outside,trigger,home,focused:()=>focused};
}
test('Escape returns focus only when the user was inside the open menu',()=>{
 const f=fixture();let prevented=0;
 f.listeners.keydown({key:'Escape',preventDefault(){prevented++;}});
 assert.equal(f.menu.open,false);assert.equal(f.focused(),1);assert.equal(prevented,1);
 f.menu.open=true;f.doc.activeElement=f.outside;
 f.listeners.keydown({key:'Escape',preventDefault(){}});assert.equal(f.focused(),1);
});
test('inside interaction preserves the panel; outside click and focus departure close it',()=>{
 const f=fixture();f.listeners.click({target:f.inside});assert.equal(f.menu.open,true);
 f.local.focusout({relatedTarget:f.trigger});assert.equal(f.menu.open,true);
 f.listeners.click({target:f.outside});assert.equal(f.menu.open,false);
 f.menu.open=true;f.local.focusout({relatedTarget:f.outside});assert.equal(f.menu.open,false);assert.equal(f.focused(),0);
});
test('desktop transition preserves visible focus and leaves unrelated focus alone',()=>{
 const f=fixture();f.media.change({matches:false});assert.equal(f.menu.open,true);
 f.media.change({matches:true});assert.equal(f.menu.open,false);assert.equal(f.doc.activeElement,f.home);
 f.menu.open=true;f.doc.activeElement=f.outside;f.media.change({matches:true});
 assert.equal(f.menu.open,false);assert.equal(f.doc.activeElement,f.outside);
});
