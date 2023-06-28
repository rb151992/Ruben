(()=>{var ce={5114:(e,o,i)=>{"use strict";i.r(o),i.d(o,{default:()=>S});var l=i(7537),d=i.n(l),p=i(3645),E=i.n(p),V=E()(d());V.push([e.id,`
.preload-transition[data-v-5e540a72] {
    transition: none !important;
}
.settings-title[data-v-5e540a72] {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0;
    padding: 0;
}
.sub-pane[data-v-5e540a72] {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
[data-v-5e540a72] .sub-pane div:first-child {
    margin-top: 0;
}
.collapse-leave-from[data-v-5e540a72] {
    max-height: var(--max-height);
}
.collapse-leave-active[data-v-5e540a72] {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active[data-v-5e540a72] {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to[data-v-5e540a72] {
    max-height: var(--max-height);
    padding: 1rem;
}
.collapse-button[data-v-5e540a72] {
    display: none;
}
input[type='checkbox'] ~ label .collapse-button[data-v-5e540a72] {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: -4px 0 0 0;
    padding: 0;
    font-size: 2em;
    opacity: 0.8;
    color: var(--vscode-foreground);
    transition: transform 0.5s;
    transform: rotate(180deg);
    text-align: right;
}
input[type='checkbox']:checked ~ label .collapse-button[data-v-5e540a72] {
    transform: rotate(90deg);
}
.settings-panel[data-v-5e540a72] {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}
.panel-header[data-v-5e540a72] {
    display: flex;
    align-items: center;
    width: 100%;
}
`,"",{version:3,sources:["webpack://./src/webviews/components/settingsPanel.vue"],names:[],mappings:";AA4FA;IACI,2BAA2B;AAC/B;AACA;IACI,8CAA8C,EAAE,iCAAiC;IACjF,iBAAiB;IACjB,SAAS;IACT,UAAU;AACd;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,gBAAgB;AACpB;AACA;IACI,aAAa;AACjB;AACA;IACI,6BAA6B;AACjC;AACA;IACI,0DAA0D;IAC1D,kBAAkB;IAClB,eAAe;IACf,aAAa;AACjB;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,eAAe;AACnB;AACA;IACI,6BAA6B;IAC7B,aAAa;AACjB;AAEA;IACI,aAAa;AACjB;AAEA;IACI,qBAAqB;IACrB,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,UAAU;IACV,cAAc;IACd,YAAY;IACZ,+BAA+B;IAC/B,0BAA0B;IAC1B,yBAAyB;IACzB,iBAAiB;AACrB;AAEA;IACI,wBAAwB;AAC5B;AAEA;IACI,yCAAyC;IACzC,cAAc;AAClB;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,WAAW;AACf",sourcesContent:[`/*! * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. * SPDX-License-Identifier: Apache-2.0 */

<template>
    <div :id="id" class="settings-panel">
        <div class="header">
            <input
                v-bind:id="buttonId"
                style="display: none"
                type="checkbox"
                v-if="collapseable || startCollapsed"
                v-model="collapsed"
            />
            <label :for="buttonId" class="panel-header">
                <i class="preload-transition collapse-button icon icon-vscode-chevron-up" ref="icon"></i>
                <span class="settings-title">{{ title }}</span>
            </label>
            <p class="soft no-spacing mt-8">{{ description }}</p>
        </div>
        <transition
            @enter="updateHeight"
            @beforeLeave="updateHeight"
            :name="collapseable || startCollapsed ? 'collapse' : ''"
        >
            <div ref="subPane" v-show="!collapsed" class="sub-pane">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { WebviewApi } from 'vscode-webview'
import { defineComponent } from 'vue'
import saveData from '../mixins/saveData'

declare const vscode: WebviewApi<{ [key: string]: VueModel }>

let count = 0

interface VueModel {
    collapsed: boolean
    buttonId: string
    lastHeight?: number
    subPane?: HTMLElement
}

/**
 * Settings panel is header + body, which may be collapseable
 */
export default defineComponent({
    name: 'settings-panel',
    props: {
        id: String,
        startCollapsed: Boolean,
        collapseable: Boolean,
        title: String,
        description: String,
    },
    data() {
        count += 1
        return {
            collapsed: this.$props.startCollapsed ?? false,
            buttonId: \`settings-panel-button-\${count}\`,
            lastHeight: undefined,
        } as VueModel
    },
    mixins: [saveData],
    methods: {
        updateHeight(el: Element & { style?: CSSStyleDeclaration }) {
            if (el.style) {
                this.lastHeight = el.scrollHeight
                el.style.setProperty('--max-height', \`\${this.lastHeight}px\`)
            }
        },
    },
    mounted() {
        this.subPane = this.$refs.subPane as HTMLElement | undefined
        this.lastHeight = this.collapsed ? this.lastHeight : this.subPane?.scrollHeight ?? this.lastHeight

        // TODO: write 'initial-style' as a directive
        // it will force a style until the first render
        // or just use Vue's transition element, but this is pretty heavy
        this.$nextTick(() => {
            setTimeout(() => {
                ;(this.$refs.icon as HTMLElement | undefined)?.classList.remove('preload-transition')
            }, 100)
        })
    },
})
<\/script>

<style scoped>
.preload-transition {
    transition: none !important;
}
.settings-title {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0;
    padding: 0;
}
.sub-pane {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
:deep(.sub-pane div:first-child) {
    margin-top: 0;
}
.collapse-leave-from {
    max-height: var(--max-height);
}
.collapse-leave-active {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to {
    max-height: var(--max-height);
    padding: 1rem;
}

.collapse-button {
    display: none;
}

input[type='checkbox'] ~ label .collapse-button {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: -4px 0 0 0;
    padding: 0;
    font-size: 2em;
    opacity: 0.8;
    color: var(--vscode-foreground);
    transition: transform 0.5s;
    transform: rotate(180deg);
    text-align: right;
}

input[type='checkbox']:checked ~ label .collapse-button {
    transform: rotate(90deg);
}

.settings-panel {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}

.panel-header {
    display: flex;
    align-items: center;
    width: 100%;
}
</style>
`],sourceRoot:""}]);const S=V},895:(e,o,i)=>{"use strict";i.r(o),i.d(o,{default:()=>S});var l=i(7537),d=i.n(l),p=i(3645),E=i.n(p),V=E()(d());V.push([e.id,`form[data-v-13f4324c] {
    padding: 15px;
}
.section-header[data-v-13f4324c] {
    margin: 0px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
}
textarea[data-v-13f4324c] {
    max-width: 100%;
}
.config-item[data-v-13f4324c] {
    border-bottom: 1px solid var(--vscode-menubar-selectionBackground);
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 8px 0px;
}
.col2[data-v-13f4324c] {
    grid-column: 2;
}
.data-view[data-v-13f4324c] {
    display: none;
    border: dashed rgb(218, 31, 31) 1px;
    color: rgb(218, 31, 31);
}
.required[data-v-13f4324c] {
    color: red;
}
#form-title[data-v-13f4324c] {
    font-size: large;
    font-weight: bold;
}
.form-buttons[data-v-13f4324c] {
    margin-left: 20px;
}
.margin-bottom-16[data-v-13f4324c] {
    margin-bottom: 16px;
}
#target-type-selector[data-v-13f4324c] {
    margin-bottom: 15px;
    margin-left: 8px;
}
`,"",{version:3,sources:["webpack://./src/lambda/vue/configEditor/samInvoke.css"],names:[],mappings:"AAAA;IACI,aAAa;AACjB;AACA;IACI,WAAW;IACX,mBAAmB;IACnB,aAAa;IACb,2BAA2B;AAC/B;AACA;IACI,eAAe;AACnB;AACA;IACI,kEAAkE;IAClE,aAAa;IACb,8BAA8B;IAC9B,gBAAgB;AACpB;AACA;IACI,cAAc;AAClB;AACA;IACI,aAAa;IACb,mCAAmC;IACnC,uBAAuB;AAC3B;AACA;IACI,UAAU;AACd;AACA;IACI,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,iBAAiB;AACrB;AACA;IACI,mBAAmB;AACvB;AACA;IACI,mBAAmB;IACnB,gBAAgB;AACpB",sourcesContent:[`form[data-v-13f4324c] {
    padding: 15px;
}
.section-header[data-v-13f4324c] {
    margin: 0px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
}
textarea[data-v-13f4324c] {
    max-width: 100%;
}
.config-item[data-v-13f4324c] {
    border-bottom: 1px solid var(--vscode-menubar-selectionBackground);
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 8px 0px;
}
.col2[data-v-13f4324c] {
    grid-column: 2;
}
.data-view[data-v-13f4324c] {
    display: none;
    border: dashed rgb(218, 31, 31) 1px;
    color: rgb(218, 31, 31);
}
.required[data-v-13f4324c] {
    color: red;
}
#form-title[data-v-13f4324c] {
    font-size: large;
    font-weight: bold;
}
.form-buttons[data-v-13f4324c] {
    margin-left: 20px;
}
.margin-bottom-16[data-v-13f4324c] {
    margin-bottom: 16px;
}
#target-type-selector[data-v-13f4324c] {
    margin-bottom: 15px;
    margin-left: 8px;
}
`],sourceRoot:""}]);const S=V},3645:e=>{"use strict";e.exports=function(o){var i=[];return i.toString=function(){return this.map(function(d){var p="",E=typeof d[5]!="undefined";return d[4]&&(p+="@supports (".concat(d[4],") {")),d[2]&&(p+="@media ".concat(d[2]," {")),E&&(p+="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {")),p+=o(d),E&&(p+="}"),d[2]&&(p+="}"),d[4]&&(p+="}"),p}).join("")},i.i=function(d,p,E,V,S){typeof d=="string"&&(d=[[null,d,void 0]]);var P={};if(E)for(var O=0;O<this.length;O++){var L=this[O][0];L!=null&&(P[L]=!0)}for(var M=0;M<d.length;M++){var g=[].concat(d[M]);E&&P[g[0]]||(typeof S!="undefined"&&(typeof g[5]=="undefined"||(g[1]="@layer".concat(g[5].length>0?" ".concat(g[5]):""," {").concat(g[1],"}")),g[5]=S),p&&(g[2]&&(g[1]="@media ".concat(g[2]," {").concat(g[1],"}")),g[2]=p),V&&(g[4]?(g[1]="@supports (".concat(g[4],") {").concat(g[1],"}"),g[4]=V):g[4]="".concat(V)),i.push(g))}},i}},7537:e=>{"use strict";e.exports=function(o){var i=o[1],l=o[3];if(!l)return i;if(typeof btoa=="function"){var d=btoa(unescape(encodeURIComponent(JSON.stringify(l)))),p="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(d),E="/*# ".concat(p," */");return[i].concat([E]).join(`
`)}return[i].join(`
`)}},3744:(e,o)=>{"use strict";var i;i={value:!0},o.Z=(l,d)=>{const p=l.__vccOpts||l;for(const[E,V]of d)p[E]=V;return p}},5232:(e,o,i)=>{var l=i(5114);l.__esModule&&(l=l.default),typeof l=="string"&&(l=[[e.id,l,""]]),l.locals&&(e.exports=l.locals);var d=i(5346).Z,p=d("4da7c7a0",l,!1,{})},7690:(e,o,i)=>{var l=i(895);l.__esModule&&(l=l.default),typeof l=="string"&&(l=[[e.id,l,""]]),l.locals&&(e.exports=l.locals);var d=i(5346).Z,p=d("78b2c3dc",l,!1,{})},5346:(e,o,i)=>{"use strict";i.d(o,{Z:()=>q});function l(s,h){for(var u=[],c={},r=0;r<h.length;r++){var B=h[r],y=B[0],U=B[1],T=B[2],J=B[3],I={id:s+":"+r,css:U,media:T,sourceMap:J};c[y]?c[y].parts.push(I):u.push(c[y]={id:y,parts:[I]})}return u}var d=typeof document!="undefined";if(typeof DEBUG!="undefined"&&DEBUG&&!d)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var p={},E=d&&(document.head||document.getElementsByTagName("head")[0]),V=null,S=0,P=!1,O=function(){},L=null,M="data-vue-ssr-id",g=typeof navigator!="undefined"&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function q(s,h,u,c){P=u,L=c||{};var r=l(s,h);return j(r),function(y){for(var U=[],T=0;T<r.length;T++){var J=r[T],I=p[J.id];I.refs--,U.push(I)}y?(r=l(s,y),j(r)):r=[];for(var T=0;T<U.length;T++){var I=U[T];if(I.refs===0){for(var $=0;$<I.parts.length;$++)I.parts[$]();delete p[I.id]}}}}function j(s){for(var h=0;h<s.length;h++){var u=s[h],c=p[u.id];if(c){c.refs++;for(var r=0;r<c.parts.length;r++)c.parts[r](u.parts[r]);for(;r<u.parts.length;r++)c.parts.push(F(u.parts[r]));c.parts.length>u.parts.length&&(c.parts.length=u.parts.length)}else{for(var B=[],r=0;r<u.parts.length;r++)B.push(F(u.parts[r]));p[u.id]={id:u.id,refs:1,parts:B}}}}function W(){var s=document.createElement("style");return s.type="text/css",E.appendChild(s),s}function F(s){var h,u,c=document.querySelector("style["+M+'~="'+s.id+'"]');if(c){if(P)return O;c.parentNode.removeChild(c)}if(g){var r=S++;c=V||(V=W()),h=z.bind(null,c,r,!1),u=z.bind(null,c,r,!0)}else c=W(),h=G.bind(null,c),u=function(){c.parentNode.removeChild(c)};return h(s),function(y){if(y){if(y.css===s.css&&y.media===s.media&&y.sourceMap===s.sourceMap)return;h(s=y)}else u()}}var X=function(){var s=[];return function(h,u){return s[h]=u,s.filter(Boolean).join(`
`)}}();function z(s,h,u,c){var r=u?"":c.css;if(s.styleSheet)s.styleSheet.cssText=X(h,r);else{var B=document.createTextNode(r),y=s.childNodes;y[h]&&s.removeChild(y[h]),y.length?s.insertBefore(B,y[h]):s.appendChild(B)}}function G(s,h){var u=h.css,c=h.media,r=h.sourceMap;if(c&&s.setAttribute("media",c),L.ssrId&&s.setAttribute(M,h.id),r&&(u+=`
/*# sourceURL=`+r.sources[0]+" */",u+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),s.styleSheet)s.styleSheet.cssText=u;else{for(;s.firstChild;)s.removeChild(s.firstChild);s.appendChild(document.createTextNode(u))}}}},Y={};function w(e){var o=Y[e];if(o!==void 0)return o.exports;var i=Y[e]={id:e,exports:{}};return ce[e](i,i.exports,w),i.exports}w.n=e=>{var o=e&&e.__esModule?()=>e.default:()=>e;return w.d(o,{a:o}),o},w.d=(e,o)=>{for(var i in o)w.o(o,i)&&!w.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:o[i]})},w.o=(e,o)=>Object.prototype.hasOwnProperty.call(e,o),w.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var H={};(()=>{"use strict";w.r(H);const e=Vue,o=t=>((0,e.pushScopeId)("data-v-13f4324c"),t=t(),(0,e.popScopeId)(),t),i={class:"invoke-lambda-form"},l=o(()=>(0,e.createElementVNode)("h1",null,"Edit SAM Debug Configuration",-1)),d={class:"container button-container",id:"invoke-button-container"},p=o(()=>(0,e.createElementVNode)("code",null,"type:aws-sam",-1)),E=o(()=>(0,e.createElementVNode)("strong",null,"Invoke",-1)),V=o(()=>(0,e.createElementVNode)("label",{for:"target-type-selector"},"Invoke Target Type",-1)),S=["value"],P={class:"data-view"},O={key:0,class:"target-code"},L={class:"config-item"},M=o(()=>(0,e.createElementVNode)("label",{for:"select-directory"},"Project Root",-1)),g={class:"data-view"},q={class:"config-item"},j=o(()=>(0,e.createElementVNode)("label",{for:"lambda-handler"},"Lambda Handler",-1)),W={class:"data-view"},F={class:"config-item"},X=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),z=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),G=["value"],s={class:"data-view"},h={key:1,class:"target-template"},u=o(()=>(0,e.createElementVNode)("br",null,null,-1)),c={class:"config-item"},r=o(()=>(0,e.createElementVNode)("label",{for:"template-path"},"Template Path",-1)),B={class:"data-view"},y={class:"config-item"},U=o(()=>(0,e.createElementVNode)("label",{for:"logicalID"},"Resource (Logical Id)",-1)),T={class:"data-view"},J={class:"config-item"},I=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),$=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),pe=["value"],ue={class:"data-view"},me={key:2,class:"target-apigw"},ve=o(()=>(0,e.createElementVNode)("br",null,null,-1)),he={class:"config-item"},ge=o(()=>(0,e.createElementVNode)("label",{for:"template-path"},"Template Path",-1)),fe={class:"data-view"},_e={class:"config-item"},Ae=o(()=>(0,e.createElementVNode)("label",{for:"logicalID"},"Resource (Logical Id)",-1)),be={class:"config-item"},ye=o(()=>(0,e.createElementVNode)("label",{for:"runtime-selector"},"Runtime",-1)),Ce=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose a runtime...",-1)),Ee=["value"],Ve={class:"data-view"},Ne={class:"config-item"},ke=o(()=>(0,e.createElementVNode)("label",{for:"path"},"Path",-1)),Be={class:"config-item"},we=o(()=>(0,e.createElementVNode)("label",{for:"http-method-selector"},"HTTP Method",-1)),Ie=o(()=>(0,e.createElementVNode)("option",{disabled:""},"Choose an HTTP Method",-1)),Se=["value"],Te={class:"data-view"},Me={class:"config-item"},De=o(()=>(0,e.createElementVNode)("label",{for:"query-string"},"Query String",-1)),Pe={class:"config-item"},Oe=o(()=>(0,e.createElementVNode)("label",{for:"headers"},"Headers",-1)),Le=["data-invalid"],Ue={key:0,class:"input-validation col2"},Re={key:3},Je=o(()=>(0,e.createElementVNode)("h3",null,"aws",-1)),$e={class:"config-item"},He=o(()=>(0,e.createElementVNode)("label",{for:"awsConnection"},"Credentials:",-1)),je={class:"config-item"},We=o(()=>(0,e.createElementVNode)("label",{for:"region"},"Region",-1)),Fe=o(()=>(0,e.createElementVNode)("h3",null,"lambda",-1)),ze={class:"config-item"},xe=o(()=>(0,e.createElementVNode)("label",{for:""},"Environment Variables",-1)),Ke=["data-invalid"],Ze={key:0,class:"input-validation col2"},qe={class:"config-item"},Xe=o(()=>(0,e.createElementVNode)("label",{for:"memory"},"Memory (MB)",-1)),Ge={class:"config-item"},Ye=o(()=>(0,e.createElementVNode)("label",{for:"timeoutSec"},"Timeout (s)",-1)),Qe=o(()=>(0,e.createElementVNode)("h3",null,"sam",-1)),et={class:"config-item"},tt=o(()=>(0,e.createElementVNode)("label",{for:"buildArguments"},"Build Arguments",-1)),nt={class:"config-item"},at=o(()=>(0,e.createElementVNode)("label",{for:"containerBuild"},"Container Build",-1)),ot={class:"config-item"},it=o(()=>(0,e.createElementVNode)("label",{for:"dockerNetwork"},"Docker Network",-1)),st={class:"config-item"},lt=o(()=>(0,e.createElementVNode)("label",{for:"localArguments"},"Local Arguments",-1)),rt={class:"config-item"},dt=o(()=>(0,e.createElementVNode)("label",{for:"skipNewImageCheck"},"Skip New Image Check",-1)),ct={class:"config-item"},pt=o(()=>(0,e.createElementVNode)("label",{for:"templateParameters"},"Template - Parameters",-1)),ut=["data-invalid"],mt={key:0,class:"input-validation col2"},vt=o(()=>(0,e.createElementVNode)("h3",null,"api",-1)),ht={class:"config-item"},gt=o(()=>(0,e.createElementVNode)("label",{for:"querystring"},"Query String",-1)),ft={class:"config-item"},_t=o(()=>(0,e.createElementVNode)("label",{for:"stageVariables"},"Stage Variables",-1)),At=["data-invalid"],bt={key:0,class:"input-validation col2"},yt={class:"config-item"},Ct=o(()=>(0,e.createElementVNode)("label",{for:"clientCerificateId"},"Client Certificate ID",-1)),Et={class:"config-item"},Vt=o(()=>(0,e.createElementVNode)("label",{for:"apiPayload"},"API Payload",-1)),Nt=["data-invalid"],kt={key:0,class:"input-validation col2"},Bt=o(()=>(0,e.createElementVNode)("br",null,null,-1)),wt={class:"data-view"},It={key:0,class:"input-validation"};function St(t,n,m,f,b,A){const _=(0,e.resolveComponent)("settings-panel");return(0,e.openBlock)(),(0,e.createElementBlock)("form",i,[l,(0,e.createElementVNode)("div",d,[(0,e.createElementVNode)("button",{class:"",onClick:n[0]||(n[0]=(0,e.withModifiers)((...a)=>t.launch&&t.launch(...a),["prevent"]))},"Invoke"),(0,e.createElementVNode)("button",{class:"form-buttons",onClick:n[1]||(n[1]=(0,e.withModifiers)((...a)=>t.loadConfig&&t.loadConfig(...a),["prevent"]))},"Load Existing Config"),(0,e.createElementVNode)("button",{class:"form-buttons",onClick:n[2]||(n[2]=(0,e.withModifiers)((...a)=>t.save&&t.save(...a),["prevent"]))},"Save")]),(0,e.createElementVNode)("p",null,[(0,e.createElementVNode)("em",null,[(0,e.createTextVNode)(" Using this form you can create, edit, and run launch-configs of "),p,(0,e.createTextVNode)(". When you "),E,(0,e.createTextVNode)(" the launch config, "+(0,e.toDisplayString)(t.company)+" Toolkit calls SAM CLI and attaches the debugger to the code running in a local Docker container. ",1)])]),(0,e.createVNode)(_,{id:"config-panel",title:"Configuration",description:""},{default:(0,e.withCtx)(()=>[V,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"target-types",id:"target-type-selector","onUpdate:modelValue":n[3]||(n[3]=a=>t.launchConfig.invokeTarget.target=a)},[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.targetTypes,(a,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:a.value,key:v},(0,e.toDisplayString)(a.name),9,S))),128))],512),[[e.vModelSelect,t.launchConfig.invokeTarget.target]]),(0,e.createElementVNode)("span",P,(0,e.toDisplayString)(t.launchConfig.invokeTarget.target),1),t.launchConfig.invokeTarget.target==="code"?((0,e.openBlock)(),(0,e.createElementBlock)("div",O,[(0,e.createElementVNode)("div",L,[M,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"select-directory",type:"text","onUpdate:modelValue":n[4]||(n[4]=a=>t.launchConfig.invokeTarget.projectRoot=a),placeholder:"Enter a directory"},null,512),[[e.vModelText,t.launchConfig.invokeTarget.projectRoot]]),(0,e.createElementVNode)("span",g,"the selected directory: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.projectRoot),1)]),(0,e.createElementVNode)("div",q,[j,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text",placeholder:"Enter the lambda handler",name:"lambda-handler",id:"lambda-handler","onUpdate:modelValue":n[5]||(n[5]=a=>t.launchConfig.invokeTarget.lambdaHandler=a)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.lambdaHandler]]),(0,e.createElementVNode)("span",W,"lamda handler :"+(0,e.toDisplayString)(t.launchConfig.invokeTarget.lambdaHandler),1)]),(0,e.createElementVNode)("div",F,[X,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":n[6]||(n[6]=a=>t.launchConfig.lambda.runtime=a)},[z,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(a,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:a,key:v},(0,e.toDisplayString)(a),9,G))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",s,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)])])):t.launchConfig.invokeTarget.target==="template"?((0,e.openBlock)(),(0,e.createElementBlock)("div",h,[(0,e.createElementVNode)("button",{class:"margin-bottom-16",onClick:n[7]||(n[7]=(0,e.withModifiers)((...a)=>t.loadResource&&t.loadResource(...a),["prevent"]))},"Load Resource"),u,(0,e.createElementVNode)("div",c,[r,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"template-path-button",type:"text","onUpdate:modelValue":n[8]||(n[8]=a=>t.launchConfig.invokeTarget.templatePath=a),placeholder:"Enter the template path..."},null,512),[[e.vModelText,t.launchConfig.invokeTarget.templatePath]]),(0,e.createElementVNode)("span",B,"Template path from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.templatePath),1)]),(0,e.createElementVNode)("div",y,[U,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"template-logical-id",id:"template-logical-id",type:"text",placeholder:"Enter a resource","onUpdate:modelValue":n[9]||(n[9]=a=>t.launchConfig.invokeTarget.logicalId=a)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.logicalId]]),(0,e.createElementVNode)("span",T," Logical Id from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.logicalId),1)]),(0,e.createElementVNode)("div",J,[I,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":n[10]||(n[10]=a=>t.launchConfig.lambda.runtime=a)},[$,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(a,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:a,key:v},(0,e.toDisplayString)(a),9,pe))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",ue,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)])])):t.launchConfig.invokeTarget.target==="api"?((0,e.openBlock)(),(0,e.createElementBlock)("div",me,[(0,e.createElementVNode)("button",{onClick:n[11]||(n[11]=(0,e.withModifiers)((...a)=>t.loadResource&&t.loadResource(...a),["prevent"]))},"Load Resource"),ve,(0,e.createElementVNode)("div",he,[ge,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"template-path-button",type:"text","onUpdate:modelValue":n[12]||(n[12]=a=>t.launchConfig.invokeTarget.templatePath=a),placeholder:"Enter the template path..."},null,512),[[e.vModelText,t.launchConfig.invokeTarget.templatePath]]),(0,e.createElementVNode)("span",fe,"Template path from data: "+(0,e.toDisplayString)(t.launchConfig.invokeTarget.templatePath),1)]),(0,e.createElementVNode)("div",_e,[Ae,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"template-logical-id",id:"template-logical-id",type:"text",placeholder:"Enter a resource","onUpdate:modelValue":n[13]||(n[13]=a=>t.launchConfig.invokeTarget.logicalId=a)},null,512),[[e.vModelText,t.launchConfig.invokeTarget.logicalId]])]),(0,e.createElementVNode)("div",be,[ye,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"runtimeType","onUpdate:modelValue":n[14]||(n[14]=a=>t.launchConfig.lambda.runtime=a)},[Ce,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.runtimes,(a,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:a,key:v},(0,e.toDisplayString)(a),9,Ee))),128))],512),[[e.vModelSelect,t.launchConfig.lambda.runtime]]),(0,e.createElementVNode)("span",Ve,"runtime in data: "+(0,e.toDisplayString)(t.launchConfig.lambda.runtime),1)]),(0,e.createElementVNode)("div",Ne,[ke,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[15]||(n[15]=a=>t.launchConfig.api.path=a)},null,512),[[e.vModelText,t.launchConfig.api.path]])]),(0,e.createElementVNode)("div",Be,[we,(0,e.withDirectives)((0,e.createElementVNode)("select",{name:"http-method","onUpdate:modelValue":n[16]||(n[16]=a=>t.launchConfig.api.httpMethod=a)},[Ie,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.httpMethods,(a,v)=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{value:a.toLowerCase(),key:v},(0,e.toDisplayString)(a),9,Se))),128))],512),[[e.vModelSelect,t.launchConfig.api.httpMethod]]),(0,e.createElementVNode)("span",Te,(0,e.toDisplayString)(t.launchConfig.api.httpMethod),1)]),(0,e.createElementVNode)("div",Me,[De,(0,e.withDirectives)((0,e.createElementVNode)("input",{name:"query-string",id:"query-string",type:"text",cols:"15",rows:"2",placeholder:"Enter a query","onUpdate:modelValue":n[17]||(n[17]=a=>t.launchConfig.api.querystring=a)},null,512),[[e.vModelText,t.launchConfig.api.querystring]])]),(0,e.createElementVNode)("div",Pe,[Oe,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[18]||(n[18]=a=>t.headers.value=a),placeholder:"Enter as valid JSON","data-invalid":!!t.headers.errorMsg},null,8,Le),[[e.vModelText,t.headers.value]]),t.headers.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Ue," Error parsing JSON: "+(0,e.toDisplayString)(t.headers.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)])])):((0,e.openBlock)(),(0,e.createElementBlock)("div",Re,"Select an Invoke Target"))]),_:1}),(0,e.createVNode)(_,{id:"more-fields-panel",title:"Additional Fields",description:"","start-collapsed":""},{default:(0,e.withCtx)(()=>[Je,(0,e.createElementVNode)("div",$e,[He,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[19]||(n[19]=a=>t.launchConfig.aws.credentials=a)},null,512),[[e.vModelText,t.launchConfig.aws.credentials]])]),(0,e.createElementVNode)("div",je,[We,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[20]||(n[20]=a=>t.launchConfig.aws.region=a)},null,512),[[e.vModelText,t.launchConfig.aws.region]])]),Fe,(0,e.createElementVNode)("div",ze,[xe,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text",placeholder:"Enter as valid JSON","onUpdate:modelValue":n[21]||(n[21]=a=>t.environmentVariables.value=a),"data-invalid":!!t.environmentVariables.errorMsg},null,8,Ke),[[e.vModelText,t.environmentVariables.value]]),t.environmentVariables.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",Ze," Error parsing JSON: "+(0,e.toDisplayString)(t.environmentVariables.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),(0,e.createElementVNode)("div",qe,[Xe,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"number","onUpdate:modelValue":n[22]||(n[22]=a=>t.launchConfig.lambda.memoryMb=a)},null,512),[[e.vModelText,t.launchConfig.lambda.memoryMb,void 0,{number:!0}]])]),(0,e.createElementVNode)("div",Ge,[Ye,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"number","onUpdate:modelValue":n[23]||(n[23]=a=>t.launchConfig.lambda.timeoutSec=a)},null,512),[[e.vModelText,t.launchConfig.lambda.timeoutSec,void 0,{number:!0}]])]),(0,e.createCommentVNode)(` <div class="config-item">
                <label for="pathMappings">Path Mappings</label>
                <input type="text" v-model="launchConfig.lambda.pathMappings" >
            </div> `),Qe,(0,e.createElementVNode)("div",et,[tt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[24]||(n[24]=a=>t.launchConfig.sam.buildArguments=a),placeholder:"Enter as a comma separated list"},null,512),[[e.vModelText,t.launchConfig.sam.buildArguments]])]),(0,e.createElementVNode)("div",nt,[at,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"checkbox",name:"containerBuild",id:"containerBuild","onUpdate:modelValue":n[25]||(n[25]=a=>t.containerBuild=a)},null,512),[[e.vModelCheckbox,t.containerBuild]])]),(0,e.createElementVNode)("div",ot,[it,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[26]||(n[26]=a=>t.launchConfig.sam.dockerNetwork=a)},null,512),[[e.vModelText,t.launchConfig.sam.dockerNetwork]])]),(0,e.createElementVNode)("div",st,[lt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[27]||(n[27]=a=>t.launchConfig.sam.localArguments=a),placeholder:"Enter as a comma separated list"},null,512),[[e.vModelText,t.launchConfig.sam.localArguments]])]),(0,e.createElementVNode)("div",rt,[dt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"checkbox",name:"skipNewImageCheck",id:"skipNewImageCheck","onUpdate:modelValue":n[28]||(n[28]=a=>t.skipNewImageCheck=a)},null,512),[[e.vModelCheckbox,t.skipNewImageCheck]])]),(0,e.createElementVNode)("div",ct,[pt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[29]||(n[29]=a=>t.parameters.value=a),"data-invalid":!!t.parameters.errorMsg},null,8,ut),[[e.vModelText,t.parameters.value]]),t.parameters.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",mt," Error parsing JSON: "+(0,e.toDisplayString)(t.parameters.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),vt,(0,e.createElementVNode)("div",ht,[gt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[30]||(n[30]=a=>t.launchConfig.api.querystring=a)},null,512),[[e.vModelText,t.launchConfig.api.querystring]])]),(0,e.createElementVNode)("div",ft,[_t,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[31]||(n[31]=a=>t.stageVariables.value=a),"data-invalid":!!t.stageVariables.errorMsg,placeholder:"Enter as valid JSON"},null,8,At),[[e.vModelText,t.stageVariables.value]]),t.stageVariables.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",bt," Error parsing JSON: "+(0,e.toDisplayString)(t.stageVariables.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),(0,e.createElementVNode)("div",yt,[Ct,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[32]||(n[32]=a=>t.launchConfig.api.clientCertificateId=a)},null,512),[[e.vModelText,t.launchConfig.api.clientCertificateId]])]),(0,e.createElementVNode)("div",Et,[Vt,(0,e.withDirectives)((0,e.createElementVNode)("input",{type:"text","onUpdate:modelValue":n[33]||(n[33]=a=>t.apiPayload.value=a),placeholder:"Enter as valid JSON","data-invalid":!!t.apiPayload.errorMsg},null,8,Nt),[[e.vModelText,t.apiPayload.value]]),t.apiPayload.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",kt," Error parsing JSON: "+(0,e.toDisplayString)(t.apiPayload.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)])]),_:1}),(0,e.createVNode)(_,{id:"payload-panel",title:"Payload",description:"","start-collapsed":""},{default:(0,e.withCtx)(()=>[(0,e.createElementVNode)("button",{class:"margin-bottom-16",onClick:n[34]||(n[34]=(0,e.withModifiers)((...a)=>t.loadPayload&&t.loadPayload(...a),["prevent"]))},"Load Sample Payload"),Bt,(0,e.withDirectives)((0,e.createElementVNode)("textarea",{name:"lambda-payload",id:"lambda-payload",cols:"60",rows:"5","onUpdate:modelValue":n[35]||(n[35]=a=>t.payload.value=a)},null,512),[[e.vModelText,t.payload.value]]),(0,e.createElementVNode)("span",wt,"payload from data: "+(0,e.toDisplayString)(t.payload),1),t.payload.errorMsg?((0,e.openBlock)(),(0,e.createElementBlock)("div",It,"Error parsing JSON: "+(0,e.toDisplayString)(t.payload.errorMsg),1)):(0,e.createCommentVNode)("v-if",!0)]),_:1})])}const zt=t=>(_pushScopeId("data-v-5e540a72"),t=t(),_popScopeId(),t),Tt=["id"],Mt={class:"header"},Dt=["id"],Pt=["for"],Ot={class:"preload-transition collapse-button icon icon-vscode-chevron-up",ref:"icon"},Lt={class:"settings-title"},Ut={class:"soft no-spacing mt-8"},Rt={ref:"subPane",class:"sub-pane"};function Jt(t,n,m,f,b,A){return(0,e.openBlock)(),(0,e.createElementBlock)("div",{id:t.id,class:"settings-panel"},[(0,e.createElementVNode)("div",Mt,[t.collapseable||t.startCollapsed?(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("input",{key:0,id:t.buttonId,style:{display:"none"},type:"checkbox","onUpdate:modelValue":n[0]||(n[0]=_=>t.collapsed=_)},null,8,Dt)),[[e.vModelCheckbox,t.collapsed]]):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("label",{for:t.buttonId,class:"panel-header"},[(0,e.createElementVNode)("i",Ot,null,512),(0,e.createElementVNode)("span",Lt,(0,e.toDisplayString)(t.title),1)],8,Pt),(0,e.createElementVNode)("p",Ut,(0,e.toDisplayString)(t.description),1)]),(0,e.createVNode)(e.Transition,{onEnter:t.updateHeight,onBeforeLeave:t.updateHeight,name:t.collapseable||t.startCollapsed?"collapse":"",persisted:""},{default:(0,e.withCtx)(()=>[(0,e.withDirectives)((0,e.createElementVNode)("div",Rt,[(0,e.renderSlot)(t.$slots,"default",{},void 0,!0)],512),[[e.vShow,!t.collapsed]])]),_:3},8,["onEnter","onBeforeLeave","name"])],8,Tt)}/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const x=new Set;window.addEventListener("remount",()=>x.clear());const te={created(){var t,n,m,f,b;if(this.$data===void 0)return;const A=(t=vscode.getState())!=null?t:{};this.$options._count=((n=this.$options._count)!=null?n:0)+1;const _=(f=this.id)!=null?f:`${(m=this.name)!=null?m:`DEFAULT-${x.size}`}-${this.$options._count}`;if(this.$options._unid=_,x.has(_)){console.warn(`Component "${_}" already exists. State-saving functionality will be disabled.`);return}x.add(_);const a=(b=A[_])!=null?b:{};Object.keys(this.$data).forEach(v=>{var N;this.$data[v]=(N=a[v])!=null?N:this.$data[v]}),Object.keys(this.$data).forEach(v=>{this.$watch(v,N=>{var C,k;const R=(C=vscode.getState())!=null?C:{},Z=Object.assign((k=R[_])!=null?k:{},{[v]:N!==void 0?JSON.parse(JSON.stringify(N)):void 0});vscode.setState(Object.assign(R,{[_]:Z}))},{deep:!0})})}};let ne=0;const $t=(0,e.defineComponent)({name:"settings-panel",props:{id:String,startCollapsed:Boolean,collapseable:Boolean,title:String,description:String},data(){var t;return ne+=1,{collapsed:(t=this.$props.startCollapsed)!=null?t:!1,buttonId:`settings-panel-button-${ne}`,lastHeight:void 0}},mixins:[te],methods:{updateHeight(t){t.style&&(this.lastHeight=t.scrollHeight,t.style.setProperty("--max-height",`${this.lastHeight}px`))}},mounted(){var t,n;this.subPane=this.$refs.subPane,this.lastHeight=this.collapsed?this.lastHeight:(n=(t=this.subPane)==null?void 0:t.scrollHeight)!=null?n:this.lastHeight,this.$nextTick(()=>{setTimeout(()=>{var m;(m=this.$refs.icon)==null||m.classList.remove("preload-transition")},100)})}});var Kt=w(5232),ae=w(3744);const Ht=(0,ae.Z)($t,[["render",Jt],["__scopeId","data-v-5e540a72"]]);/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class K{static registerGlobalCommands(){const n=new Event("remount");window.addEventListener("message",m=>{const{command:f}=m.data;f==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(b=>this.removeListener(b)),window.dispatchEvent(n))})}static addListener(n){this.messageListeners.add(n),window.addEventListener("message",n)}static removeListener(n){this.messageListeners.delete(n),window.removeEventListener("message",n)}static sendRequest(n,m,f){const b=JSON.parse(JSON.stringify(f)),A=new Promise((_,a)=>{const v=C=>{const k=C.data;if(n===k.id)if(this.removeListener(v),window.clearTimeout(N),k.error===!0){const R=JSON.parse(k.data);a(new Error(R.message))}else k.event?(typeof f[0]!="function"&&a(new Error(`Expected frontend event handler to be a function: ${m}`)),_(this.registerEventHandler(m,f[0]))):_(k.data)},N=setTimeout(()=>{this.removeListener(v),a(new Error(`Timed out while waiting for response: id: ${n}, command: ${m}`))},3e5);this.addListener(v)});return vscode.postMessage({id:n,command:m,data:b}),A}static registerEventHandler(n,m){const f=b=>{const A=b.data;if(A.command===n){if(!A.event)throw new Error(`Expected backend handler to be an event emitter: ${n}`);m(A.data)}};return this.addListener(f),{dispose:()=>this.removeListener(f)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(n,m)=>{var f;if(typeof m!="string"){console.warn(`Tried to index webview client with non-string property: ${String(m)}`);return}if(m==="init"){const A=(f=vscode.getState())!=null?f:{};if(A.__once)return()=>Promise.resolve();vscode.setState(Object.assign(A,{__once:!0}))}const b=(this.counter++).toString();return(...A)=>this.sendRequest(b,m,A)}})}}K.counter=0,K.initialized=!1,K.messageListeners=new Set;/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const D=K.create();function oe(t){var n,m,f,b,A,_,a,v,N,C,k;return{type:"aws-sam",request:"direct-invoke",name:"",aws:{credentials:"",region:"",...t!=null&&t.aws?t.aws:{}},invokeTarget:{target:"template",templatePath:"",logicalId:"",lambdaHandler:"",projectRoot:"",...t==null?void 0:t.invokeTarget},lambda:{runtime:(n=t==null?void 0:t.lambda)==null?void 0:n.runtime,memoryMb:void 0,timeoutSec:void 0,environmentVariables:{},...t==null?void 0:t.lambda,payload:{json:(f=(m=t==null?void 0:t.lambda)==null?void 0:m.payload)!=null&&f.json?t.lambda.payload.json:{},path:(A=(b=t==null?void 0:t.lambda)==null?void 0:b.payload)!=null&&A.path?t.lambda.payload.path:""}},sam:{buildArguments:void 0,containerBuild:!1,dockerNetwork:"",localArguments:void 0,skipNewImageCheck:!1,...t!=null&&t.sam?t.sam:{},template:{parameters:(a=(_=t==null?void 0:t.sam)==null?void 0:_.template)!=null&&a.parameters?t.sam.template.parameters:{}}},api:{path:"",httpMethod:"get",clientCertificateId:"",querystring:"",headers:{},stageVariables:{},...t!=null&&t.api?t.api:{},payload:{json:(N=(v=t==null?void 0:t.api)==null?void 0:v.payload)!=null&&N.json?t.api.payload.json:{},path:(k=(C=t==null?void 0:t.api)==null?void 0:C.payload)!=null&&k.path?t.api.payload.path:""}}}}function ie(){return{containerBuild:!1,skipNewImageCheck:!1,launchConfig:oe(),payload:{value:"",errorMsg:""},apiPayload:{value:"",errorMsg:""},environmentVariables:{value:"",errorMsg:""},parameters:{value:"",errorMsg:""},headers:{value:"",errorMsg:""},stageVariables:{value:"",errorMsg:""}}}const jt=(0,e.defineComponent)({name:"sam-invoke",components:{settingsPanel:Ht},created(){D.init().then(t=>this.parseConfig(t)),D.getRuntimes().then(t=>{this.runtimes=t}),D.getCompanyName().then(t=>{this.company=t})},mixins:[te],data(){return{...ie(),msg:"Hello",company:"",targetTypes:[{name:"Code",value:"code"},{name:"Template",value:"template"},{name:"API Gateway (Template)",value:"api"}],runtimes:[],httpMethods:["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"]}},methods:{resetJsonErrors(){this.payload.errorMsg="",this.environmentVariables.errorMsg="",this.headers.errorMsg="",this.stageVariables.errorMsg=""},launch(){const t=this.formatConfig();t&&D.invokeLaunchConfig(t)},save(){const t=this.formatConfig();t&&D.saveLaunchConfig(t)},loadConfig(){D.loadSamLaunchConfig().then(t=>this.parseConfig(t))},parseConfig(t){var n,m,f,b,A,_,a,v,N,C,k,R,Z,re,de;if(!t)return;const Ft=this.company;this.clearForm(),this.launchConfig=oe(t),(n=t.lambda)!=null&&n.payload&&(this.payload.value=JSON.stringify(t.lambda.payload.json,void 0,4)),(m=t.lambda)!=null&&m.environmentVariables&&(this.environmentVariables.value=JSON.stringify((f=t.lambda)==null?void 0:f.environmentVariables)),(A=(b=t.sam)==null?void 0:b.template)!=null&&A.parameters&&(this.parameters.value=JSON.stringify((a=(_=t.sam)==null?void 0:_.template)==null?void 0:a.parameters)),(v=t.api)!=null&&v.headers&&(this.headers.value=JSON.stringify((N=t.api)==null?void 0:N.headers)),(C=t.api)!=null&&C.stageVariables&&(this.stageVariables.value=JSON.stringify((k=t.api)==null?void 0:k.stageVariables)),this.containerBuild=(Z=(R=t.sam)==null?void 0:R.containerBuild)!=null?Z:!1,this.skipNewImageCheck=(de=(re=t.sam)==null?void 0:re.skipNewImageCheck)!=null?de:!1,this.msg=`Loaded config ${t}`,this.company=Ft},loadPayload(){this.resetJsonErrors(),D.getSamplePayload().then(t=>{!t||(this.payload.value=JSON.stringify(JSON.parse(t),void 0,4))})},loadResource(){this.resetJsonErrors(),D.getTemplate().then(t=>{!t||(this.launchConfig.invokeTarget.target="template",this.launchConfig.invokeTarget.logicalId=t.logicalId,this.launchConfig.invokeTarget.templatePath=t.template)})},formatFieldToStringArray(t){if(!t)return;const n=/\s*,\s*/g;return t.trim().split(n)},formatStringtoJSON(t){if(t.errorMsg="",t.value)try{return JSON.parse(t.value)}catch(n){throw t.errorMsg=n.message,n}},formatConfig(){var t,n,m,f;this.resetJsonErrors();let b,A,_,a,v,N;try{b=this.formatStringtoJSON(this.payload),A=this.formatStringtoJSON(this.environmentVariables),_=this.formatStringtoJSON(this.headers),a=this.formatStringtoJSON(this.stageVariables),v=this.formatStringtoJSON(this.parameters),N=this.formatStringtoJSON(this.apiPayload)}catch(k){return}const C=JSON.parse(JSON.stringify(this.launchConfig));return{...C,lambda:{...C.lambda,payload:{...C.payload,json:b},environmentVariables:A},sam:{...C.sam,buildArguments:this.formatFieldToStringArray((n=(t=C.sam)==null?void 0:t.buildArguments)==null?void 0:n.toString()),localArguments:this.formatFieldToStringArray((f=(m=C.sam)==null?void 0:m.localArguments)==null?void 0:f.toString()),containerBuild:this.containerBuild,skipNewImageCheck:this.skipNewImageCheck,template:{parameters:v}},api:C.api?{...C.api,headers:_,stageVariables:a,payload:{json:N}}:void 0}},clearForm(){const t=ie();Object.keys(t).forEach(n=>this.$data[n]=t[n])}}});var qt=w(7690);const Wt=(0,ae.Z)(jt,[["render",St],["__scopeId","data-v-13f4324c"]]);/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const se=()=>(0,e.createApp)(Wt),le=se();le.mount("#vue-app"),window.addEventListener("remount",()=>{le.unmount(),se().mount("#vue-app")})})();var Q=this;for(var ee in H)Q[ee]=H[ee];H.__esModule&&Object.defineProperty(Q,"__esModule",{value:!0})})();

//# sourceMappingURL=index.js.map