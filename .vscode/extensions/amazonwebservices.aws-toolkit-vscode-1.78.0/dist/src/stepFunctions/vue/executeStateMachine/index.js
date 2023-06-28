(()=>{"use strict";var I={3744:(e,p)=>{var c;c={value:!0},p.Z=(_,y)=>{const f=_.__vccOpts||_;for(const[V,S]of y)f[V]=S;return f}}},N={};function m(e){var p=N[e];if(p!==void 0)return p.exports;var c=N[e]={exports:{}};return I[e](c,c.exports,m),c.exports}m.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var v={};(()=>{m.r(v);const e=Vue,p={id:"app"},c={class:"container button-container",style:{"justify-content":"space-between"}},_=(0,e.createElementVNode)("br",null,null,-1),y=(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("label",{class:"input-header"}," Execution Input ")],-1),f=(0,e.createElementVNode)("br",null,null,-1),V=(0,e.createElementVNode)("label",{for:"textarea"}," Provide JSON ",-1),S=(0,e.createElementVNode)("label",{for:"file"}," Select a file ",-1),D=(0,e.createElementVNode)("br",null,null,-1),M={class:"custom-file-upload"},F={class:"custom-file-name"},J=(0,e.createElementVNode)("br",null,null,-1),T=(0,e.createElementVNode)("br",null,null,-1),j=["readonly","placeholder"];function P(n,t,i,s,a,r){return(0,e.openBlock)(),(0,e.createElementBlock)("div",p,[(0,e.createElementVNode)("div",c,[(0,e.createElementVNode)("h1",null,(0,e.toDisplayString)(n.initialData.name),1),(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("input",{type:"submit",onClick:t[0]||(t[0]=(...o)=>n.sendInput&&n.sendInput(...o)),value:"Execute"})])]),_,y,f,(0,e.createElementVNode)("div",null,[(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"radio","onUpdate:modelValue":t[1]||(t[1]=o=>n.inputChoice=o),value:"textarea"},null,512),[[e.vModelRadio,n.inputChoice]]),V]),(0,e.createElementVNode)("div",null,[(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"radio","onUpdate:modelValue":t[2]||(t[2]=o=>n.inputChoice=o),value:"file"},null,512),[[e.vModelRadio,n.inputChoice]]),S]),(0,e.createElementVNode)("div",{style:(0,e.normalizeStyle)({visibility:n.fileInputVisible?"visible":"hidden"})},[D,(0,e.createElementVNode)("label",M,[(0,e.createElementVNode)("input",{type:"file",onChange:t[3]||(t[3]=o=>n.processFile(o))},null,32),(0,e.createTextVNode)(" Choose File ")]),(0,e.createElementVNode)("span",F,(0,e.toDisplayString)(n.selectedFile),1),J,T],4),(0,e.createElementVNode)("div",{style:(0,e.normalizeStyle)({visibility:n.textAreaVisible?"visible":"hidden"})},[(0,e.withDirectives)((0,e.createElementVNode)("textarea",{style:{width:"100%","margin-bottom":"10px"},rows:"10","onUpdate:modelValue":t[4]||(t[4]=o=>n.executionInput=o),readonly:n.inputChoice=="file",placeholder:n.placeholderJson},null,8,j),[[e.vModelText,n.executionInput]])],4)])}/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class b{static registerGlobalCommands(){const t=new Event("remount");window.addEventListener("message",i=>{const{command:s}=i.data;s==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(a=>this.removeListener(a)),window.dispatchEvent(t))})}static addListener(t){this.messageListeners.add(t),window.addEventListener("message",t)}static removeListener(t){this.messageListeners.delete(t),window.removeEventListener("message",t)}static sendRequest(t,i,s){const a=JSON.parse(JSON.stringify(s)),r=new Promise((o,h)=>{const l=g=>{const d=g.data;if(t===d.id)if(this.removeListener(l),window.clearTimeout(u),d.error===!0){const E=JSON.parse(d.data);h(new Error(E.message))}else d.event?(typeof s[0]!="function"&&h(new Error(`Expected frontend event handler to be a function: ${i}`)),o(this.registerEventHandler(i,s[0]))):o(d.data)},u=setTimeout(()=>{this.removeListener(l),h(new Error(`Timed out while waiting for response: id: ${t}, command: ${i}`))},3e5);this.addListener(l)});return vscode.postMessage({id:t,command:i,data:a}),r}static registerEventHandler(t,i){const s=a=>{const r=a.data;if(r.command===t){if(!r.event)throw new Error(`Expected backend handler to be an event emitter: ${t}`);i(r.data)}};return this.addListener(s),{dispose:()=>this.removeListener(s)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(t,i)=>{var s;if(typeof i!="string"){console.warn(`Tried to index webview client with non-string property: ${String(i)}`);return}if(i==="init"){const r=(s=vscode.getState())!=null?s:{};if(r.__once)return()=>Promise.resolve();vscode.setState(Object.assign(r,{__once:!0}))}const a=(this.counter++).toString();return(...r)=>this.sendRequest(a,i,r)}})}}b.counter=0,b.initialized=!1,b.messageListeners=new Set;/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const w=new Set;window.addEventListener("remount",()=>w.clear());const z={created(){var n,t,i,s,a;if(this.$data===void 0)return;const r=(n=vscode.getState())!=null?n:{};this.$options._count=((t=this.$options._count)!=null?t:0)+1;const o=(s=this.id)!=null?s:`${(i=this.name)!=null?i:`DEFAULT-${w.size}`}-${this.$options._count}`;if(this.$options._unid=o,w.has(o)){console.warn(`Component "${o}" already exists. State-saving functionality will be disabled.`);return}w.add(o);const h=(a=r[o])!=null?a:{};Object.keys(this.$data).forEach(l=>{var u;this.$data[l]=(u=h[l])!=null?u:this.$data[l]}),Object.keys(this.$data).forEach(l=>{this.$watch(l,u=>{var g,d;const E=(g=vscode.getState())!=null?g:{},H=Object.assign((d=E[o])!=null?d:{},{[l]:u!==void 0?JSON.parse(JSON.stringify(u)):void 0});vscode.setState(Object.assign(E,{[o]:H}))},{deep:!0})})}},C=`{
	"key1": "value1",
	"key2": "value2",
	"key3": "value3"
}`,L=b.create(),A={name:"",region:"",arn:""},R=(0,e.defineComponent)({async created(){var n;this.initialData=(n=await L.init())!=null?n:this.initialData},data:()=>({initialData:A,executionInput:"",isReadOnly:!1,inputChoice:"textarea",placeholderJson:C,selectedFile:"",fileInputVisible:!1,textAreaVisible:!0}),watch:{inputChoice:function(n,t){this.handleInputChange(n)}},methods:{handleInputChange:function(n){switch(n){case"file":this.selectedFile="No file selected",this.placeholderJson="",this.executionInput="",this.fileInputVisible=!0;break;case"textarea":this.placeholderJson=C,this.executionInput="",this.fileInputVisible=!1;break}},processFile:function(n){console.log(n),console.log(n.target);const t=n.target;if(t.files&&t.files.length>0){const i=new FileReader;i.onload=s=>{if(s.target){const a=s.target.result;this.executionInput=a}},i.onerror=s=>{throw s},i.readAsText(t.files[0]),this.selectedFile=t.files[0].name,this.textAreaVisible=!0}},sendInput:function(){L.executeStateMachine(this.executionInput)}},mixins:[z]});var U=m(3744);const q=(0,U.Z)(R,[["render",P]]);/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const O=()=>(0,e.createApp)(q),k=O();k.mount("#vue-app"),window.addEventListener("remount",()=>{k.unmount(),O().mount("#vue-app")})})();var x=this;for(var $ in v)x[$]=v[$];v.__esModule&&Object.defineProperty(x,"__esModule",{value:!0})})();

//# sourceMappingURL=index.js.map