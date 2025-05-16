var n=Object.defineProperty;var d=(a,r,t)=>r in a?n(a,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[r]=t;var i=(a,r,t)=>d(a,typeof r!="symbol"?r+"":r,t);import{j as l}from"./index-CjXOYCek.js";let p=class extends HTMLElement{constructor(){super();i(this,"_propsToUpgrade",{});i(this,"shadow");i(this,"template");i(this,"defaultProps");i(this,"isAttached",!1);this.shadow=this.attachShadow({mode:"open"}),this.template=document.createElement("template")}storePropsToUpgrade(t){t.forEach(e=>{this.hasOwnProperty(e)&&this[e]!==void 0&&(this._propsToUpgrade[e]=this[e],delete this[e])})}upgradeStoredProps(){Object.entries(this._propsToUpgrade).forEach(([t,e])=>{this.setAttribute(t,e)})}reflect(t){t.forEach(e=>{Object.defineProperty(this,e,{set(s){"string,number".includes(typeof s)?this.setAttribute(e,s.toString()):this.removeAttribute(e)},get(){return this.getAttribute(e)}})})}applyDefaultProps(t){this.defaultProps=t,Object.entries(t).forEach(([e,s])=>{this[e]=this[e]||s.toString()})}};var c=':host{align-items:center;display:inline-flex;flex-shrink:0;height:var(--uib-size);justify-content:center;width:var(--uib-size)}:host([hidden]){display:none}.container{animation:rotate calc(var(--uib-speed)*4) linear infinite;height:var(--uib-size);position:relative;width:var(--uib-size)}@keyframes rotate{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.particle{align-items:center;display:flex;height:100%;justify-content:center;left:0;position:absolute;top:0;width:100%}.particle:first-child{--uib-delay:0;transform:rotate(8deg)}.particle:nth-child(2){--uib-delay:-0.4;transform:rotate(36deg)}.particle:nth-child(3){--uib-delay:-0.9;transform:rotate(72deg)}.particle:nth-child(4){--uib-delay:-0.5;transform:rotate(90deg)}.particle:nth-child(5){--uib-delay:-0.3;transform:rotate(144deg)}.particle:nth-child(6){--uib-delay:-0.2;transform:rotate(180deg)}.particle:nth-child(7){--uib-delay:-0.6;transform:rotate(216deg)}.particle:nth-child(8){--uib-delay:-0.7;transform:rotate(252deg)}.particle:nth-child(9){--uib-delay:-0.1;transform:rotate(300deg)}.particle:nth-child(10){--uib-delay:-0.8;transform:rotate(324deg)}.particle:nth-child(11){--uib-delay:-1.2;transform:rotate(335deg)}.particle:nth-child(12){--uib-delay:-0.5;transform:rotate(290deg)}.particle:nth-child(13){--uib-delay:-0.2;transform:rotate(240deg)}.particle:before{--uib-d:calc(var(--uib-delay)*var(--uib-speed));animation:orbit var(--uib-speed) linear var(--uib-d) infinite;background-color:var(--uib-color);border-radius:50%;content:"";flex-shrink:0;height:17.5%;position:absolute;transition:background-color .3s ease;width:17.5%}@keyframes orbit{0%{opacity:.65;transform:translate(calc(var(--uib-size)*.5)) scale(.73684)}5%{opacity:.58;transform:translate(calc(var(--uib-size)*.4)) scale(.684208)}10%{opacity:.51;transform:translate(calc(var(--uib-size)*.3)) scale(.631576)}15%{opacity:.44;transform:translate(calc(var(--uib-size)*.2)) scale(.578944)}20%{opacity:.37;transform:translate(calc(var(--uib-size)*.1)) scale(.526312)}25%{opacity:.3;transform:translate(0) scale(.47368)}30%{opacity:.37;transform:translate(calc(var(--uib-size)*-.1)) scale(.526312)}35%{opacity:.44;transform:translate(calc(var(--uib-size)*-.2)) scale(.578944)}40%{opacity:.51;transform:translate(calc(var(--uib-size)*-.3)) scale(.631576)}45%{opacity:.58;transform:translate(calc(var(--uib-size)*-.4)) scale(.684208)}50%{opacity:.65;transform:translate(calc(var(--uib-size)*-.5)) scale(.73684)}55%{opacity:.72;transform:translate(calc(var(--uib-size)*-.4)) scale(.789472)}60%{opacity:.79;transform:translate(calc(var(--uib-size)*-.3)) scale(.842104)}65%{opacity:.86;transform:translate(calc(var(--uib-size)*-.2)) scale(.894736)}70%{opacity:.93;transform:translate(calc(var(--uib-size)*-.1)) scale(.947368)}75%{opacity:1;transform:translate(0) scale(1)}80%{opacity:.93;transform:translate(calc(var(--uib-size)*.1)) scale(.947368)}85%{opacity:.86;transform:translate(calc(var(--uib-size)*.2)) scale(.894736)}90%{opacity:.79;transform:translate(calc(var(--uib-size)*.3)) scale(.842104)}95%{opacity:.72;transform:translate(calc(var(--uib-size)*.4)) scale(.789472)}to{opacity:.65;transform:translate(calc(var(--uib-size)*.5)) scale(.73684)}}';class o extends p{constructor(){super();i(this,"_attributes",["size","color","speed"]);i(this,"size");i(this,"color");i(this,"speed");this.storePropsToUpgrade(this._attributes),this.reflect(this._attributes)}static get observedAttributes(){return["size","color","speed"]}connectedCallback(){this.upgradeStoredProps(),this.applyDefaultProps({size:45,color:"black",speed:1.75}),this.template.innerHTML=`
      <div class="container">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
      <style>
        :host{
          --uib-size: ${this.size}px;
          --uib-color: ${this.color};
          --uib-speed: ${this.speed}s;
        }
        ${c}
      </style>
    `,this.shadow.replaceChildren(this.template.content.cloneNode(!0))}attributeChangedCallback(){const t=this.shadow.querySelector("style");t&&(t.innerHTML=`
      :host{
        --uib-size: ${this.size}px;
        --uib-color: ${this.color};
        --uib-speed: ${this.speed}s;
      }
      ${c}
    `)}}var h={register:(a="l-quantum")=>{customElements.get(a)||customElements.define(a,class extends o{})},element:o};h.register();const m=({size:a="45",speed:r="1.75"})=>l.jsx("div",{className:"flex justify-center mt-4",children:l.jsx("l-quantum",{size:a,speed:r,color:"#e2692c"})});export{m as L};
