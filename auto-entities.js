!function(t){var e={};function i(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(s,r,function(e){return t[e]}.bind(null,r));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);const s=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),r=s.prototype.html;s.prototype.css;function n(){return document.querySelector("home-assistant").hass}const a=n().callWS({type:"config/area_registry/list"}),o=n().callWS({type:"config/device_registry/list"}),c=n().callWS({type:"config/entity_registry/list"});async function u(){return window.cardToolsData=window.cardToolsData||{areas:await a,devices:await o,entities:await c},window.cardToolsData}function l(t){const e=window.cardToolsData;let i=[];if(!t)return i;for(const s of e.devices)s.area_id===t.area_id&&i.push(s);return i}function f(t){const e=window.cardToolsData;let i=[];if(!t)return i;for(const s of e.entities)s.device_id===t.id&&i.push(s.entity_id);return i}function d(t,e){if("string"==typeof e&&"string"==typeof t&&(t.startsWith("/")&&t.endsWith("/")||-1!==t.indexOf("*"))){return t.startsWith("/")||(t=`/^${t=t.replace(/\./g,".").replace(/\*/g,".*")}$/`),new RegExp(t.slice(1,-1)).test(e)}if("string"==typeof t){if(t.startsWith("<="))return parseFloat(e)<=parseFloat(t.substr(2));if(t.startsWith(">="))return parseFloat(e)>=parseFloat(t.substr(2));if(t.startsWith("<"))return parseFloat(e)<parseFloat(t.substr(1));if(t.startsWith(">"))return parseFloat(e)>parseFloat(t.substr(1));if(t.startsWith("!"))return parseFloat(e)!=parseFloat(t.substr(1));if(t.startsWith("="))return parseFloat(e)==parseFloat(t.substr(1))}return t===e}function h(t,e){return function(i){const s="string"==typeof i?t.states[i]:t.states[i.entity];if(!i)return!1;for(const[r,n]of Object.entries(e))switch(r.split(" ")[0]){case"options":case"sort":break;case"domain":if(!d(n,s.entity_id.split(".")[0]))return!1;break;case"entity_id":if(!d(n,s.entity_id))return!1;break;case"state":if(!d(n,s.state))return!1;break;case"name":if(!s.attributes.friendly_name||!d(n,s.attributes.friendly_name))return!1;break;case"group":if(!(n.startsWith("group.")&&t.states[n]&&t.states[n].attributes.entity_id&&t.states[n].attributes.entity_id.includes(s.entity_id)))return!1;break;case"attributes":for(const[t,e]of Object.entries(n)){let i=t.split(" ")[0],r=s.attributes;for(;i&&r;){let t;[t,i]=i.split(":"),r=r[t]}if(void 0===r||void 0!==e&&!d(e,r))return!1}break;case"not":if(h(t,n)(i))return!1;break;case"device":if(!window.cardToolsData||!window.cardToolsData.devices)return!1;let e=!1;for(const t of window.cardToolsData.devices)d(n,t.name)&&f(t).includes(s.entity_id)&&(e=!0);if(!e)return!1;break;case"area":if(!window.cardToolsData||!window.cardToolsData.areas)return!1;let r=!1;for(const t of window.cardToolsData.areas)d(n,t.name)&&l(t).flatMap(f).includes(s.entity_id)&&(r=!0);if(!r)return!1;break;case"last_changed":if(!d(n,((new Date).getTime()-new Date(s.last_changed).getTime())/6e4))return!1;break;case"last_updated":if(!d(n,((new Date).getTime()-new Date(s.last_updated).getTime())/6e4))return!1;break;default:return!1}return!0}}function g(t,e){return"string"==typeof e&&(e={method:e}),function(i,s){const r="string"==typeof i?t.states[i]:t.states[i.entity],n="string"==typeof s?t.states[s]:t.states[s.entity];if(void 0===r||void 0===n)return 0;const[a,o]=e.reverse?[-1,1]:[1,-1];function c(t,i){return e.ignore_case&&t.toLowerCase&&(t=t.toLowerCase()),e.ignore_case&&i.toLowerCase&&(i=i.toLowerCase()),e.numeric&&(isNaN(parseFloat(t))&&isNaN(parseFloat(i))||(t=isNaN(parseFloat(t))?void 0:parseFloat(t),i=isNaN(parseFloat(i))?void 0:parseFloat(i))),void 0===t&&void 0===i?0:void 0===t?a:void 0===i?o:t<i?o:t>i?a:0}switch(e.method){case"domain":return c(r.entity_id.split(".")[0],n.entity_id.split(".")[0]);case"entity_id":return c(r.entity_id,n.entity_id);case"friendly_name":case"name":return c(r.attributes.friendly_name||r.entity_id.split(".")[1],n.attributes.friendly_name||n.entity_id.split(".")[1]);case"state":return c(r.state,n.state);case"attribute":let t=r.attributes,i=n.attributes,s=e.attribute;for(;s;){let e;if([e,s]=s.split(":"),t=t[e],i=i[e],void 0===t&&void 0===i)return 0;if(void 0===t)return a;if(void 0===i)return o}return c(t,i);case"last_changed":case"last_updated":return e.numeric=!0,c(new Date(n.last_changed).getTime(),new Date(r.last_changed).getTime());case"last_triggered":return null==r.attributes.last_triggered||null==n.attributes.last_triggered?0:(e.numeric=!0,c(new Date(n.attributes.last_triggered).getTime(),new Date(r.attributes.last_triggered).getTime()));default:return 0}}}function p(t,e,i=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},i)i.dispatchEvent(t);else{var s=document.querySelector("home-assistant");(s=(s=(s=(s=(s=(s=(s=(s=(s=(s=(s=s&&s.shadowRoot)&&s.querySelector("home-assistant-main"))&&s.shadowRoot)&&s.querySelector("app-drawer-layout partial-panel-resolver"))&&s.shadowRoot||s)&&s.querySelector("ha-panel-lovelace"))&&s.shadowRoot)&&s.querySelector("hui-root"))&&s.shadowRoot)&&s.querySelector("ha-app-layout #view"))&&s.firstElementChild)&&s.dispatchEvent(t)}}u();const y="custom:";function _(t,e){const i=document.createElement("hui-error-card");return i.setConfig({type:"error",error:t,origConfig:e}),i}function m(t,e){if(!e||"object"!=typeof e||!e.type)return _(`No ${t} type configured`,e);let i=e.type;if(i=i.startsWith(y)?i.substr(y.length):`hui-${i}-${t}`,customElements.get(i))return function(t,e){const i=document.createElement(t);try{i.setConfig(e)}catch(t){return _(t,e)}return i}(i,e);const s=_(`Custom element doesn't exist: ${i}.`,e);s.style.display="None";const r=setTimeout(()=>{s.style.display=""},2e3);return customElements.whenDefined(i).then(()=>{clearTimeout(r),p("ll-rebuild",{},s)}),s}customElements.define("auto-entities",class extends s{static get properties(){return{hass:{}}}setConfig(t){if(!t||!t.card)throw new Error("Invalid configuration");this._config?(this._config=t,this.hass=this.hass):(this._config=t,this.hass=n(),this._getEntities(),this.cardConfig={entities:this.entities,...t.card},this.card=function(t){return m("card",t)}(this.cardConfig)),u().then(()=>this._getEntities())}_getEntities(){let t=[];if(this._config.entities&&(t=t.concat(this._config.entities).map(t=>"string"==typeof t?{entity:t}:t)),!this.hass||!this._config.filter)return t;if(this._config.filter.include){const e=Object.keys(this.hass.states).map(t=>new Object({entity:t}));for(const i of this._config.filter.include){if(void 0!==i.type){t.push(i);continue}let s=e.filter(h(this.hass,i)).map(t=>JSON.parse(JSON.stringify(new Object({...t,...i.options})).replace(/this.entity_id/g,t.entity)));void 0!==i.sort&&(s=s.sort(g(this.hass,i.sort))),t=t.concat(s)}}if(this._config.filter.exclude)for(const e of this._config.filter.exclude)t=t.filter(t=>"string"!=typeof t&&void 0===t.entity||!h(this.hass,e)(t));if(this._config.sort&&(t=t.sort(g(this.hass,this._config.sort)),this._config.sort.count)){const e=this._config.sort.first||0;t=t.slice(e,e+this._config.sort.count)}if(this._config.unique){function e(t,i){return typeof t==typeof i&&("object"!=typeof t?t===i:!Object.keys(t).some(t=>!Object.keys(i).includes(t))&&Object.keys(t).every(s=>e(t[s],i[s])))}let i=[];for(const s of t)i.some(t=>e(t,s))||i.push(s);t=i}this.entities=t}set entities(t){(function(t,e){if(t===e)return!0;if(null==t||null==e)return!1;if(t.length!=e.length)return!1;for(var i=0;i<t.length;i++)if(JSON.stringify(t[i])!==JSON.stringify(e[i]))return!1;return!0})(t,this._entities)||(this._entities=t,this.cardConfig={...this.cardConfig,entities:this._entities},0===t.length&&!1===this._config.show_empty?(this.style.display="none",this.style.margin="0"):(this.style.display=null,this.style.margin=null))}get entities(){return this._entities}set cardConfig(t){this._cardConfig=t,this.card&&this.card.setConfig(t)}get cardConfig(){return this._cardConfig}updated(t){t.has("hass")&&this.hass&&(this.card.hass=this.hass,setTimeout(()=>this._getEntities(),0))}createRenderRoot(){return this}render(){return r`
    ${this.card}`}getCardSize(){let t=0;return this.card&&this.card.getCardSize&&(t=this.card.getCardSize()),1===t&&this.entities.length&&(t=this.entities.length),0===t&&this._config.filter&&this._config.filter.include&&(t=Object.keys(this._config.filter.include).length),t||1}}),p("ll-rebuild",{})}]);