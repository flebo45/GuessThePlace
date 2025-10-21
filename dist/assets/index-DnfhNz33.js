var tp=Object.defineProperty;var ep=(i,t,e)=>t in i?tp(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var eh=(i,t,e)=>ep(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const h of a.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function e(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=e(o);fetch(o.href,a)}})();class np{constructor(t,e,r){this.url=t,this.lat=e,this.lng=r}}const ip="https://graph.mapillary.com",rp="MLY|24471568689210680|a71d8529e468cdfe6474f2cc950bad3b",nh=[{name:"North America (Est)",bbox:[-90,25,-65,50]},{name:"North America (Ovest)",bbox:[-125,30,-100,50]},{name:"Europe Centrale",bbox:[0,45,20,55]},{name:"Europe Occidentale",bbox:[-10,40,5,55]},{name:"Asia Orientale (Giappone/Corea)",bbox:[120,30,145,45]},{name:"Asia Meridionale (India)",bbox:[70,15,90,30]},{name:"South America (Brasile/Argentina)",bbox:[-60,-40,-40,-15]},{name:"Oceania (Australia/Nuova Zelanda)",bbox:[140,-40,180,-20]}];function sp(i){const t=[];for(let r=0;r<i;r++){const o=nh[Math.floor(Math.random()*nh.length)],[a,h,f,p]=o.bbox,g=a+Math.random()*(f-a),w=h+Math.random()*(p-h);t.push([g-.01,w-.01,g+.01,w+.01])}return t}async function op(i,t=10){const e=i.join(","),o=`${ip}/images?access_token=${rp}&fields=id,thumb_1024_url,geometry&bbox=${e}&limit=${t}`;try{const a=await fetch(o);if(!a.ok)return[];const h=await a.json();return h.data?h.data.map(f=>({url:f.thumb_1024_url,coordinates:f.geometry.coordinates})):[]}catch{return[]}}function ap(i,t,e=.05){const[r,o]=i,[a,h]=t,f=r-a,p=o-h;return Math.sqrt(f*f+p*p)<e}async function Ul(i=5,t=200,e=20){const r=[],o=sp(t),h=(await Promise.all(o.map(f=>op(f,e)))).flat().filter(Boolean);for(const f of h){if(!(f!=null&&f.coordinates))continue;if(!r.some(g=>ap(f.coordinates,g.coordinates))&&(r.push(f),r.length>=i))break}return r.length<i?(console.warn(`Solo ${r.length} immagini trovate, nuovo tentativo...`),Ul(i,t*2,e)):r.slice(0,i)}async function up(i=5){return(await Ul(i)).map(e=>{const[r,o]=e.coordinates;return new np(e.url,o,r)})}function cp(i,t){const e=w=>w*Math.PI/180,o=e(t.lat-i.lat),a=e(t.lng-i.lng),h=e(i.lat),f=e(t.lat),p=Math.sin(o/2)*Math.sin(o/2)+Math.sin(a/2)*Math.sin(a/2)*Math.cos(h)*Math.cos(f);return 6371*(2*Math.atan2(Math.sqrt(p),Math.sqrt(1-p)))}function hp(i){return i>=1e4?0:Math.round(500*(1-i/1e4))}class lp{constructor(t,e,r){this.lat=t,this.lng=e,this.roundNumber=r}}class dp{constructor(t,e=null){this.roundNumber=t,this.truth=e,this.guess=null,this.distanceKm=null,this.score=null}}class fp{constructor(){this.user=null,this.isAuthenticated=!1,this.authReady=!1,this.listeners=[],this.resetGame()}setUser(t){this.user=t,this.isAuthenticated=!0,this.authReady=!0,this.notify()}clearUser(){this.user=null,this.isAuthenticated=!1,this.authReady=!0,this.notify()}setAuthReady(){this.authReady=!0,this.notify()}getUser(){return this.user}notify(){this.listeners.forEach(t=>t(this))}subscribe(t){this.listeners.push(t)}resetGame(){this.currentRound=0,this.totalRounds=5,this.rounds=[]}startNewGame(t){this.resetGame(),this.rounds=(t||[]).map((e,r)=>new dp(r+1,e)),this.totalRounds=Math.max(this.rounds.length,this.totalRounds),this.currentRound=this.rounds.length>0?1:0}recordGuess(t){const e=this.currentRound-1;e>=0&&e<this.rounds.length&&(this.rounds[e].guess=t)}recordScore(t,e=null){const r=this.currentRound-1;r>=0&&r<this.rounds.length&&(this.rounds[r].score=t,e!==null&&(this.rounds[r].distanceKm=e))}nextRound(){return this.currentRound<this.totalRounds?(this.currentRound++,!0):(this.currentRound++,!1)}isGameOver(){return this.currentRound>this.totalRounds}getCurrentPhoto(){const t=this.currentRound-1;return t>=0&&t<this.rounds.length&&this.rounds[t].truth?this.rounds[t].truth:null}getCurrentRoundNumber(){return this.currentRound}getCurrentRoundEntity(){const t=this.currentRound-1;return t>=0&&t<this.rounds.length?this.rounds[t]:null}getRound(t){const e=t-1;return e>=0&&e<this.rounds.length?this.rounds[e]:null}getRounds(){return this.rounds.slice()}getTotalScore(){return this.rounds.reduce((t,e)=>t+(e.score||0),0)}resetAll(){this.clearUser(),this.resetGame()}}const ce=new fp;class mp{constructor(){this.state=ce}async startNewGame(t=5){const e=await up(t);this.state.startNewGame(e)}getCurrentPhoto(){return this.state.getCurrentPhoto()?this.state.getCurrentPhoto():null}isGameOver(){return this.state.isGameOver()}confirmGuess({lat:t,lng:e}){const r=new lp(t,e,this.state.getCurrentRoundNumber()),o=this.state.getCurrentPhoto(),a=cp(r,o),h=hp(a);return this.state.recordGuess(r),this.state.recordScore(h,a),{score:h,distance:a}}nextRound(){return this.state.nextRound()}getTotalScore(){return this.state.getTotalScore()}getCurrentRound(){return this.state.currentRound}}class pp{constructor(t){if(!(t instanceof HTMLElement))throw new Error("GameMap expects a DOM element, not an ID string");this.map=L.map(t,{worldCopyJump:!1,maxBounds:[[-85,-180],[85,180]],maxBoundsViscosity:1,minZoom:2,maxZoom:5}).setView([20,0],2),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,bounds:[[-85,-180],[85,180]],attribution:"© OpenStreetMap contributors",noWrap:!0}).addTo(this.map),this.guessMarker=null,this.solutionMarker=null,this.line=null,this.interactive=!0,this.map.on("click",e=>{this.interactive&&(this.setGuessMarker(e.latlng),this.onMapClickCallback&&this.onMapClickCallback(e.latlng))})}setOnMapClick(t){this.onMapClickCallback=t}setInteractive(t){this.interactive=!!t}enableInteraction(){this.setInteractive(!0)}disableInteraction(){this.setInteractive(!1)}reset(){this.guessMarker&&(this.map.removeLayer(this.guessMarker),this.guessMarker=null),this.solutionMarker&&(this.map.removeLayer(this.solutionMarker),this.solutionMarker=null),this.line&&(this.map.removeLayer(this.line),this.line=null)}setGuessMarker(t){this.guessMarker?this.guessMarker.setLatLng(t):this.guessMarker=L.marker(t,{draggable:!1}).addTo(this.map)}showSolutionMarker(t){this.solutionMarker?this.solutionMarker.setLatLng(t):this.solutionMarker=L.marker(t).addTo(this.map)}showLineBetweenMarkers(){if(this.guessMarker&&this.solutionMarker){const t=[this.guessMarker.getLatLng(),this.solutionMarker.getLatLng()];this.line?this.line.setLatLngs(t):this.line=L.polyline(t,{color:"red",weight:3}).addTo(this.map)}}}class _p{constructor(t){this.mapContainerId=t;const e=document.getElementById(t);if(!e)throw new Error("Map container not found");this.gameMap=new pp(e)}onMapClick(t){this.gameMap.setOnMapClick(t)}setInteractive(t){this.gameMap&&typeof this.gameMap.setInteractive=="function"&&this.gameMap.setInteractive(t)}disableInteraction(){this.setInteractive(!1)}enableInteraction(){this.setInteractive(!0)}reset(){this.gameMap.reset()}showSolution(t){this.gameMap.showSolutionMarker(t)}showLineBetween(){this.gameMap.showLineBetweenMarkers()}invalidateSize(){this.gameMap&&this.gameMap.map&&this.gameMap.map.invalidateSize()}}class gp{constructor(t){this.root=t,this.container=null,this.mapContainer=null,this.photoElement=null,this.confirmButton=null,this.nextButton=null,this.statusElement=null,this.handlers={}}renderGameUI(){this.root.innerHTML=`
      <div class="game-ui-container">
        <div id="status" class="game-status"></div>
        <div class="photo-container">
          <img id="photoElement" alt="Guess the location" class="game-photo hidden" />
        </div>
        
        <div class="scoreboard">
          <h3>Round scores</h3>
          <ul id="scoreList" class="score-list"></ul>
        </div>
        
        <div class="controls">
          <button id="confirmGuessBtn" disabled>Confirm Guess</button>
          <button id="nextRoundBtn" disabled>Next Round</button>
        </div>  
      </div>
      <div id="map"></div>
    `,this.container=this.root.querySelector(".game-ui-container"),this.mapContainer=this.root.querySelector("#map"),this.photoElement=this.root.querySelector("#photoElement"),this.confirmButton=this.root.querySelector("#confirmGuessBtn"),this.nextButton=this.root.querySelector("#nextRoundBtn"),this.scoreListEl=this.root.querySelector("#scoreList"),this.statusElement=this.root.querySelector("#status"),this.confirmButton.addEventListener("click",()=>{var t,e;(e=(t=this.handlers).onConfirmGuess)==null||e.call(t)}),this.nextButton.addEventListener("click",()=>{var t,e;(e=(t=this.handlers).onNextRound)==null||e.call(t)})}on(t,e){this.handlers[t]=e}setPhoto(t){this.photoElement&&(t?(this.photoElement.src=t,this.photoElement.classList.remove("hidden")):(this.photoElement.classList.add("hidden"),this.photoElement.removeAttribute("src")))}setStatus(t){this.statusElement&&(this.statusElement.textContent=t)}clearStatus(){this.statusElement&&(this.statusElement.textContent="")}setConfirmEnabled(t){this.confirmButton&&(this.confirmButton.disabled=!t)}showNextButton(t){this.nextButton&&(this.nextButton.disabled=!t)}addRoundScore(t,e,r){if(this.scoreListEl){const o=document.createElement("li");o.textContent=`Round ${t}: ${e} points (${r.toFixed(2)} km)`,this.scoreListEl.appendChild(o)}}showGameOver(t){this.setStatus(`Game over! Total score: ${t}`)}reset(){this.photoElement&&(this.photoElement.classList.add("hidden"),this.photoElement.removeAttribute("src")),this.nextButton&&(this.nextButton.disabled=!0),this.scoreListEl&&(this.scoreListEl.innerHTML=""),this.clearStatus()}getMapContainerId(){return"map"}}const yp=()=>{};var ih={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl=function(i){const t=[];let e=0;for(let r=0;r<i.length;r++){let o=i.charCodeAt(r);o<128?t[e++]=o:o<2048?(t[e++]=o>>6|192,t[e++]=o&63|128):(o&64512)===55296&&r+1<i.length&&(i.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(i.charCodeAt(++r)&1023),t[e++]=o>>18|240,t[e++]=o>>12&63|128,t[e++]=o>>6&63|128,t[e++]=o&63|128):(t[e++]=o>>12|224,t[e++]=o>>6&63|128,t[e++]=o&63|128)}return t},vp=function(i){const t=[];let e=0,r=0;for(;e<i.length;){const o=i[e++];if(o<128)t[r++]=String.fromCharCode(o);else if(o>191&&o<224){const a=i[e++];t[r++]=String.fromCharCode((o&31)<<6|a&63)}else if(o>239&&o<365){const a=i[e++],h=i[e++],f=i[e++],p=((o&7)<<18|(a&63)<<12|(h&63)<<6|f&63)-65536;t[r++]=String.fromCharCode(55296+(p>>10)),t[r++]=String.fromCharCode(56320+(p&1023))}else{const a=i[e++],h=i[e++];t[r++]=String.fromCharCode((o&15)<<12|(a&63)<<6|h&63)}}return t.join("")},zl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,t){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<i.length;o+=3){const a=i[o],h=o+1<i.length,f=h?i[o+1]:0,p=o+2<i.length,g=p?i[o+2]:0,w=a>>2,T=(a&3)<<4|f>>4;let b=(f&15)<<2|g>>6,V=g&63;p||(V=64,h||(b=64)),r.push(e[w],e[T],e[b],e[V])}return r.join("")},encodeString(i,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(i):this.encodeByteArray(Bl(i),t)},decodeString(i,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(i):vp(this.decodeStringToByteArray(i,t))},decodeStringToByteArray(i,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<i.length;){const a=e[i.charAt(o++)],f=o<i.length?e[i.charAt(o)]:0;++o;const g=o<i.length?e[i.charAt(o)]:64;++o;const T=o<i.length?e[i.charAt(o)]:64;if(++o,a==null||f==null||g==null||T==null)throw new wp;const b=a<<2|f>>4;if(r.push(b),g!==64){const V=f<<4&240|g>>2;if(r.push(V),T!==64){const z=g<<6&192|T;r.push(z)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class wp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Tp=function(i){const t=Bl(i);return zl.encodeByteArray(t,!0)},$o=function(i){return Tp(i).replace(/\./g,"")},ql=function(i){try{return zl.decodeString(i,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ep(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ip=()=>Ep().__FIREBASE_DEFAULTS__,Pp=()=>{if(typeof process>"u"||typeof ih>"u")return;const i=ih.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},Ap=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=i&&ql(i[1]);return t&&JSON.parse(t)},da=()=>{try{return yp()||Ip()||Pp()||Ap()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},Hl=i=>{var t,e;return(e=(t=da())==null?void 0:t.emulatorHosts)==null?void 0:e[i]},bp=i=>{const t=Hl(i);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},jl=()=>{var i;return(i=da())==null?void 0:i.config},Gl=i=>{var t;return(t=da())==null?void 0:t[`_${i}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Or(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Wl(i){return(await fetch(i,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cp(i,t){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",o=i.iat||0,a=i.sub||i.user_id;if(!a)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h={iss:`https://securetoken.google.com/${r}`,aud:r,iat:o,exp:o+3600,auth_time:o,sub:a,user_id:a,firebase:{sign_in_provider:"custom",identities:{}},...i};return[$o(JSON.stringify(e)),$o(JSON.stringify(h)),""].join(".")}const Ps={};function Rp(){const i={prod:[],emulator:[]};for(const t of Object.keys(Ps))Ps[t]?i.emulator.push(t):i.prod.push(t);return i}function Lp(i){let t=document.getElementById(i),e=!1;return t||(t=document.createElement("div"),t.setAttribute("id",i),e=!0),{created:e,element:t}}let rh=!1;function $l(i,t){if(typeof window>"u"||typeof document>"u"||!Or(window.location.host)||Ps[i]===t||Ps[i]||rh)return;Ps[i]=t;function e(b){return`__firebase__banner__${b}`}const r="__firebase__banner",a=Rp().prod.length>0;function h(){const b=document.getElementById(r);b&&b.remove()}function f(b){b.style.display="flex",b.style.background="#7faaf0",b.style.position="fixed",b.style.bottom="5px",b.style.left="5px",b.style.padding=".5em",b.style.borderRadius="5px",b.style.alignItems="center"}function p(b,V){b.setAttribute("width","24"),b.setAttribute("id",V),b.setAttribute("height","24"),b.setAttribute("viewBox","0 0 24 24"),b.setAttribute("fill","none"),b.style.marginLeft="-6px"}function g(){const b=document.createElement("span");return b.style.cursor="pointer",b.style.marginLeft="16px",b.style.fontSize="24px",b.innerHTML=" &times;",b.onclick=()=>{rh=!0,h()},b}function w(b,V){b.setAttribute("id",V),b.innerText="Learn more",b.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",b.setAttribute("target","__blank"),b.style.paddingLeft="5px",b.style.textDecoration="underline"}function T(){const b=Lp(r),V=e("text"),z=document.getElementById(V)||document.createElement("span"),B=e("learnmore"),q=document.getElementById(B)||document.createElement("a"),ht=e("preprendIcon"),ot=document.getElementById(ht)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(b.created){const st=b.element;f(st),w(q,B);const xt=g();p(ot,ht),st.append(ot,z,q,xt),document.body.appendChild(st)}a?(z.innerText="Preview backend disconnected.",ot.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(ot.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,z.innerText="Preview backend running in this workspace."),z.setAttribute("id",V)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",T):T()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function re(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function xp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(re())}function kp(){var t;const i=(t=da())==null?void 0:t.forceEnvironment;if(i==="node")return!0;if(i==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Mp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Np(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function Op(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Dp(){const i=re();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function Vp(){return!kp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Fp(){try{return typeof indexedDB=="object"}catch{return!1}}function Up(){return new Promise((i,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),e||self.indexedDB.deleteDatabase(r),i(!0)},o.onupgradeneeded=()=>{e=!1},o.onerror=()=>{var a;t(((a=o.error)==null?void 0:a.message)||"")}}catch(e){t(e)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bp="FirebaseError";class bn extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=Bp,Object.setPrototypeOf(this,bn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Vs.prototype.create)}}class Vs{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},o=`${this.service}/${t}`,a=this.errors[t],h=a?zp(a,r):"Error",f=`${this.serviceName}: ${h} (${o}).`;return new bn(o,f,r)}}function zp(i,t){return i.replace(qp,(e,r)=>{const o=t[r];return o!=null?String(o):`<${r}?>`})}const qp=/\{\$([^}]+)}/g;function Hp(i){for(const t in i)if(Object.prototype.hasOwnProperty.call(i,t))return!1;return!0}function Tn(i,t){if(i===t)return!0;const e=Object.keys(i),r=Object.keys(t);for(const o of e){if(!r.includes(o))return!1;const a=i[o],h=t[o];if(sh(a)&&sh(h)){if(!Tn(a,h))return!1}else if(a!==h)return!1}for(const o of r)if(!e.includes(o))return!1;return!0}function sh(i){return i!==null&&typeof i=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fs(i){const t=[];for(const[e,r]of Object.entries(i))Array.isArray(r)?r.forEach(o=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(o))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function ys(i){const t={};return i.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[o,a]=r.split("=");t[decodeURIComponent(o)]=decodeURIComponent(a)}}),t}function vs(i){const t=i.indexOf("?");if(!t)return"";const e=i.indexOf("#",t);return i.substring(t,e>0?e:void 0)}function jp(i,t){const e=new Gp(i,t);return e.subscribe.bind(e)}class Gp{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,r){let o;if(t===void 0&&e===void 0&&r===void 0)throw new Error("Missing Observer.");Wp(t,["next","error","complete"])?o=t:o={next:t,error:e,complete:r},o.next===void 0&&(o.next=Qa),o.error===void 0&&(o.error=Qa),o.complete===void 0&&(o.complete=Qa);const a=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),a}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Wp(i,t){if(typeof i!="object"||i===null)return!1;for(const e of t)if(e in i&&typeof i[e]=="function")return!0;return!1}function Qa(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zt(i){return i&&i._delegate?i._delegate:i}class Li{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ai="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $p{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new Sp;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:e});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),r=(t==null?void 0:t.optional)??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(o){if(r)return null;throw o}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Kp(t))try{this.getOrInitializeService({instanceIdentifier:Ai})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(e);try{const a=this.getOrInitializeService({instanceIdentifier:o});r.resolve(a)}catch{}}}}clearInstance(t=Ai){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Ai){return this.instances.has(t)}getOptions(t=Ai){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[a,h]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(a);r===f&&h.resolve(o)}return o}onInit(t,e){const r=this.normalizeInstanceIdentifier(e),o=this.onInitCallbacks.get(r)??new Set;o.add(t),this.onInitCallbacks.set(r,o);const a=this.instances.get(r);return a&&t(a,r),()=>{o.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const o of r)try{o(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Zp(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=Ai){return this.component?this.component.multipleInstances?t:Ai:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Zp(i){return i===Ai?void 0:i}function Kp(i){return i.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new $p(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var lt;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(lt||(lt={}));const Yp={debug:lt.DEBUG,verbose:lt.VERBOSE,info:lt.INFO,warn:lt.WARN,error:lt.ERROR,silent:lt.SILENT},Xp=lt.INFO,Jp={[lt.DEBUG]:"log",[lt.VERBOSE]:"log",[lt.INFO]:"info",[lt.WARN]:"warn",[lt.ERROR]:"error"},t_=(i,t,...e)=>{if(t<i.logLevel)return;const r=new Date().toISOString(),o=Jp[t];if(o)console[o](`[${r}]  ${i.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Uu{constructor(t){this.name=t,this._logLevel=Xp,this._logHandler=t_,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in lt))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Yp[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,lt.DEBUG,...t),this._logHandler(this,lt.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,lt.VERBOSE,...t),this._logHandler(this,lt.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,lt.INFO,...t),this._logHandler(this,lt.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,lt.WARN,...t),this._logHandler(this,lt.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,lt.ERROR,...t),this._logHandler(this,lt.ERROR,...t)}}const e_=(i,t)=>t.some(e=>i instanceof e);let oh,ah;function n_(){return oh||(oh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function i_(){return ah||(ah=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Zl=new WeakMap,cu=new WeakMap,Kl=new WeakMap,Ya=new WeakMap,Bu=new WeakMap;function r_(i){const t=new Promise((e,r)=>{const o=()=>{i.removeEventListener("success",a),i.removeEventListener("error",h)},a=()=>{e(Gn(i.result)),o()},h=()=>{r(i.error),o()};i.addEventListener("success",a),i.addEventListener("error",h)});return t.then(e=>{e instanceof IDBCursor&&Zl.set(e,i)}).catch(()=>{}),Bu.set(t,i),t}function s_(i){if(cu.has(i))return;const t=new Promise((e,r)=>{const o=()=>{i.removeEventListener("complete",a),i.removeEventListener("error",h),i.removeEventListener("abort",h)},a=()=>{e(),o()},h=()=>{r(i.error||new DOMException("AbortError","AbortError")),o()};i.addEventListener("complete",a),i.addEventListener("error",h),i.addEventListener("abort",h)});cu.set(i,t)}let hu={get(i,t,e){if(i instanceof IDBTransaction){if(t==="done")return cu.get(i);if(t==="objectStoreNames")return i.objectStoreNames||Kl.get(i);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return Gn(i[t])},set(i,t,e){return i[t]=e,!0},has(i,t){return i instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in i}};function o_(i){hu=i(hu)}function a_(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const r=i.call(Xa(this),t,...e);return Kl.set(r,t.sort?t.sort():[t]),Gn(r)}:i_().includes(i)?function(...t){return i.apply(Xa(this),t),Gn(Zl.get(this))}:function(...t){return Gn(i.apply(Xa(this),t))}}function u_(i){return typeof i=="function"?a_(i):(i instanceof IDBTransaction&&s_(i),e_(i,n_())?new Proxy(i,hu):i)}function Gn(i){if(i instanceof IDBRequest)return r_(i);if(Ya.has(i))return Ya.get(i);const t=u_(i);return t!==i&&(Ya.set(i,t),Bu.set(t,i)),t}const Xa=i=>Bu.get(i);function c_(i,t,{blocked:e,upgrade:r,blocking:o,terminated:a}={}){const h=indexedDB.open(i,t),f=Gn(h);return r&&h.addEventListener("upgradeneeded",p=>{r(Gn(h.result),p.oldVersion,p.newVersion,Gn(h.transaction),p)}),e&&h.addEventListener("blocked",p=>e(p.oldVersion,p.newVersion,p)),f.then(p=>{a&&p.addEventListener("close",()=>a()),o&&p.addEventListener("versionchange",g=>o(g.oldVersion,g.newVersion,g))}).catch(()=>{}),f}const h_=["get","getKey","getAll","getAllKeys","count"],l_=["put","add","delete","clear"],Ja=new Map;function uh(i,t){if(!(i instanceof IDBDatabase&&!(t in i)&&typeof t=="string"))return;if(Ja.get(t))return Ja.get(t);const e=t.replace(/FromIndex$/,""),r=t!==e,o=l_.includes(e);if(!(e in(r?IDBIndex:IDBObjectStore).prototype)||!(o||h_.includes(e)))return;const a=async function(h,...f){const p=this.transaction(h,o?"readwrite":"readonly");let g=p.store;return r&&(g=g.index(f.shift())),(await Promise.all([g[e](...f),o&&p.done]))[0]};return Ja.set(t,a),a}o_(i=>({...i,get:(t,e,r)=>uh(t,e)||i.get(t,e,r),has:(t,e)=>!!uh(t,e)||i.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d_{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(f_(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function f_(i){const t=i.getComponent();return(t==null?void 0:t.type)==="VERSION"}const lu="@firebase/app",ch="0.14.4";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const En=new Uu("@firebase/app"),m_="@firebase/app-compat",p_="@firebase/analytics-compat",__="@firebase/analytics",g_="@firebase/app-check-compat",y_="@firebase/app-check",v_="@firebase/auth",w_="@firebase/auth-compat",T_="@firebase/database",E_="@firebase/data-connect",I_="@firebase/database-compat",P_="@firebase/functions",A_="@firebase/functions-compat",b_="@firebase/installations",S_="@firebase/installations-compat",C_="@firebase/messaging",R_="@firebase/messaging-compat",L_="@firebase/performance",x_="@firebase/performance-compat",k_="@firebase/remote-config",M_="@firebase/remote-config-compat",N_="@firebase/storage",O_="@firebase/storage-compat",D_="@firebase/firestore",V_="@firebase/ai",F_="@firebase/firestore-compat",U_="firebase",B_="12.4.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const du="[DEFAULT]",z_={[lu]:"fire-core",[m_]:"fire-core-compat",[__]:"fire-analytics",[p_]:"fire-analytics-compat",[y_]:"fire-app-check",[g_]:"fire-app-check-compat",[v_]:"fire-auth",[w_]:"fire-auth-compat",[T_]:"fire-rtdb",[E_]:"fire-data-connect",[I_]:"fire-rtdb-compat",[P_]:"fire-fn",[A_]:"fire-fn-compat",[b_]:"fire-iid",[S_]:"fire-iid-compat",[C_]:"fire-fcm",[R_]:"fire-fcm-compat",[L_]:"fire-perf",[x_]:"fire-perf-compat",[k_]:"fire-rc",[M_]:"fire-rc-compat",[N_]:"fire-gcs",[O_]:"fire-gcs-compat",[D_]:"fire-fst",[F_]:"fire-fst-compat",[V_]:"fire-vertex","fire-js":"fire-js",[U_]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zo=new Map,q_=new Map,fu=new Map;function hh(i,t){try{i.container.addComponent(t)}catch(e){En.debug(`Component ${t.name} failed to register with FirebaseApp ${i.name}`,e)}}function Ar(i){const t=i.name;if(fu.has(t))return En.debug(`There were multiple attempts to register component ${t}.`),!1;fu.set(t,i);for(const e of Zo.values())hh(e,i);for(const e of q_.values())hh(e,i);return!0}function zu(i,t){const e=i.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),i.container.getProvider(t)}function Ce(i){return i==null?!1:i.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H_={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Wn=new Vs("app","Firebase",H_);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j_{constructor(t,e,r){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Li("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Wn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dr=B_;function Ql(i,t={}){let e=i;typeof t!="object"&&(t={name:t});const r={name:du,automaticDataCollectionEnabled:!0,...t},o=r.name;if(typeof o!="string"||!o)throw Wn.create("bad-app-name",{appName:String(o)});if(e||(e=jl()),!e)throw Wn.create("no-options");const a=Zo.get(o);if(a){if(Tn(e,a.options)&&Tn(r,a.config))return a;throw Wn.create("duplicate-app",{appName:o})}const h=new Qp(o);for(const p of fu.values())h.addComponent(p);const f=new j_(e,r,h);return Zo.set(o,f),f}function Yl(i=du){const t=Zo.get(i);if(!t&&i===du&&jl())return Ql();if(!t)throw Wn.create("no-app",{appName:i});return t}function $n(i,t,e){let r=z_[i]??i;e&&(r+=`-${e}`);const o=r.match(/\s|\//),a=t.match(/\s|\//);if(o||a){const h=[`Unable to register library "${r}" with version "${t}":`];o&&h.push(`library name "${r}" contains illegal characters (whitespace or "/")`),o&&a&&h.push("and"),a&&h.push(`version name "${t}" contains illegal characters (whitespace or "/")`),En.warn(h.join(" "));return}Ar(new Li(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G_="firebase-heartbeat-database",W_=1,Rs="firebase-heartbeat-store";let tu=null;function Xl(){return tu||(tu=c_(G_,W_,{upgrade:(i,t)=>{switch(t){case 0:try{i.createObjectStore(Rs)}catch(e){console.warn(e)}}}}).catch(i=>{throw Wn.create("idb-open",{originalErrorMessage:i.message})})),tu}async function $_(i){try{const e=(await Xl()).transaction(Rs),r=await e.objectStore(Rs).get(Jl(i));return await e.done,r}catch(t){if(t instanceof bn)En.warn(t.message);else{const e=Wn.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});En.warn(e.message)}}}async function lh(i,t){try{const r=(await Xl()).transaction(Rs,"readwrite");await r.objectStore(Rs).put(t,Jl(i)),await r.done}catch(e){if(e instanceof bn)En.warn(e.message);else{const r=Wn.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});En.warn(r.message)}}}function Jl(i){return`${i.name}!${i.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z_=1024,K_=30;class Q_{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new X_(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,e;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=dh();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(h=>h.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:o}),this._heartbeatsCache.heartbeats.length>K_){const h=J_(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){En.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=dh(),{heartbeatsToSend:r,unsentEntries:o}=Y_(this._heartbeatsCache.heartbeats),a=$o(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=e,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(e){return En.warn(e),""}}}function dh(){return new Date().toISOString().substring(0,10)}function Y_(i,t=Z_){const e=[];let r=i.slice();for(const o of i){const a=e.find(h=>h.agent===o.agent);if(a){if(a.dates.push(o.date),fh(e)>t){a.dates.pop();break}}else if(e.push({agent:o.agent,dates:[o.date]}),fh(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class X_{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Fp()?Up().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await $_(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return lh(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return lh(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function fh(i){return $o(JSON.stringify({version:2,heartbeats:i})).length}function J_(i){if(i.length===0)return-1;let t=0,e=i[0].date;for(let r=1;r<i.length;r++)i[r].date<e&&(e=i[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tg(i){Ar(new Li("platform-logger",t=>new d_(t),"PRIVATE")),Ar(new Li("heartbeat",t=>new Q_(t),"PRIVATE")),$n(lu,ch,i),$n(lu,ch,"esm2020"),$n("fire-js","")}tg("");var mh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Zn,td;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(C,E){function A(){}A.prototype=E.prototype,C.F=E.prototype,C.prototype=new A,C.prototype.constructor=C,C.D=function(R,S,x){for(var P=Array(arguments.length-2),Ct=2;Ct<arguments.length;Ct++)P[Ct-2]=arguments[Ct];return E.prototype[S].apply(R,P)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(r,e),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(C,E,A){A||(A=0);const R=Array(16);if(typeof E=="string")for(var S=0;S<16;++S)R[S]=E.charCodeAt(A++)|E.charCodeAt(A++)<<8|E.charCodeAt(A++)<<16|E.charCodeAt(A++)<<24;else for(S=0;S<16;++S)R[S]=E[A++]|E[A++]<<8|E[A++]<<16|E[A++]<<24;E=C.g[0],A=C.g[1],S=C.g[2];let x=C.g[3],P;P=E+(x^A&(S^x))+R[0]+3614090360&4294967295,E=A+(P<<7&4294967295|P>>>25),P=x+(S^E&(A^S))+R[1]+3905402710&4294967295,x=E+(P<<12&4294967295|P>>>20),P=S+(A^x&(E^A))+R[2]+606105819&4294967295,S=x+(P<<17&4294967295|P>>>15),P=A+(E^S&(x^E))+R[3]+3250441966&4294967295,A=S+(P<<22&4294967295|P>>>10),P=E+(x^A&(S^x))+R[4]+4118548399&4294967295,E=A+(P<<7&4294967295|P>>>25),P=x+(S^E&(A^S))+R[5]+1200080426&4294967295,x=E+(P<<12&4294967295|P>>>20),P=S+(A^x&(E^A))+R[6]+2821735955&4294967295,S=x+(P<<17&4294967295|P>>>15),P=A+(E^S&(x^E))+R[7]+4249261313&4294967295,A=S+(P<<22&4294967295|P>>>10),P=E+(x^A&(S^x))+R[8]+1770035416&4294967295,E=A+(P<<7&4294967295|P>>>25),P=x+(S^E&(A^S))+R[9]+2336552879&4294967295,x=E+(P<<12&4294967295|P>>>20),P=S+(A^x&(E^A))+R[10]+4294925233&4294967295,S=x+(P<<17&4294967295|P>>>15),P=A+(E^S&(x^E))+R[11]+2304563134&4294967295,A=S+(P<<22&4294967295|P>>>10),P=E+(x^A&(S^x))+R[12]+1804603682&4294967295,E=A+(P<<7&4294967295|P>>>25),P=x+(S^E&(A^S))+R[13]+4254626195&4294967295,x=E+(P<<12&4294967295|P>>>20),P=S+(A^x&(E^A))+R[14]+2792965006&4294967295,S=x+(P<<17&4294967295|P>>>15),P=A+(E^S&(x^E))+R[15]+1236535329&4294967295,A=S+(P<<22&4294967295|P>>>10),P=E+(S^x&(A^S))+R[1]+4129170786&4294967295,E=A+(P<<5&4294967295|P>>>27),P=x+(A^S&(E^A))+R[6]+3225465664&4294967295,x=E+(P<<9&4294967295|P>>>23),P=S+(E^A&(x^E))+R[11]+643717713&4294967295,S=x+(P<<14&4294967295|P>>>18),P=A+(x^E&(S^x))+R[0]+3921069994&4294967295,A=S+(P<<20&4294967295|P>>>12),P=E+(S^x&(A^S))+R[5]+3593408605&4294967295,E=A+(P<<5&4294967295|P>>>27),P=x+(A^S&(E^A))+R[10]+38016083&4294967295,x=E+(P<<9&4294967295|P>>>23),P=S+(E^A&(x^E))+R[15]+3634488961&4294967295,S=x+(P<<14&4294967295|P>>>18),P=A+(x^E&(S^x))+R[4]+3889429448&4294967295,A=S+(P<<20&4294967295|P>>>12),P=E+(S^x&(A^S))+R[9]+568446438&4294967295,E=A+(P<<5&4294967295|P>>>27),P=x+(A^S&(E^A))+R[14]+3275163606&4294967295,x=E+(P<<9&4294967295|P>>>23),P=S+(E^A&(x^E))+R[3]+4107603335&4294967295,S=x+(P<<14&4294967295|P>>>18),P=A+(x^E&(S^x))+R[8]+1163531501&4294967295,A=S+(P<<20&4294967295|P>>>12),P=E+(S^x&(A^S))+R[13]+2850285829&4294967295,E=A+(P<<5&4294967295|P>>>27),P=x+(A^S&(E^A))+R[2]+4243563512&4294967295,x=E+(P<<9&4294967295|P>>>23),P=S+(E^A&(x^E))+R[7]+1735328473&4294967295,S=x+(P<<14&4294967295|P>>>18),P=A+(x^E&(S^x))+R[12]+2368359562&4294967295,A=S+(P<<20&4294967295|P>>>12),P=E+(A^S^x)+R[5]+4294588738&4294967295,E=A+(P<<4&4294967295|P>>>28),P=x+(E^A^S)+R[8]+2272392833&4294967295,x=E+(P<<11&4294967295|P>>>21),P=S+(x^E^A)+R[11]+1839030562&4294967295,S=x+(P<<16&4294967295|P>>>16),P=A+(S^x^E)+R[14]+4259657740&4294967295,A=S+(P<<23&4294967295|P>>>9),P=E+(A^S^x)+R[1]+2763975236&4294967295,E=A+(P<<4&4294967295|P>>>28),P=x+(E^A^S)+R[4]+1272893353&4294967295,x=E+(P<<11&4294967295|P>>>21),P=S+(x^E^A)+R[7]+4139469664&4294967295,S=x+(P<<16&4294967295|P>>>16),P=A+(S^x^E)+R[10]+3200236656&4294967295,A=S+(P<<23&4294967295|P>>>9),P=E+(A^S^x)+R[13]+681279174&4294967295,E=A+(P<<4&4294967295|P>>>28),P=x+(E^A^S)+R[0]+3936430074&4294967295,x=E+(P<<11&4294967295|P>>>21),P=S+(x^E^A)+R[3]+3572445317&4294967295,S=x+(P<<16&4294967295|P>>>16),P=A+(S^x^E)+R[6]+76029189&4294967295,A=S+(P<<23&4294967295|P>>>9),P=E+(A^S^x)+R[9]+3654602809&4294967295,E=A+(P<<4&4294967295|P>>>28),P=x+(E^A^S)+R[12]+3873151461&4294967295,x=E+(P<<11&4294967295|P>>>21),P=S+(x^E^A)+R[15]+530742520&4294967295,S=x+(P<<16&4294967295|P>>>16),P=A+(S^x^E)+R[2]+3299628645&4294967295,A=S+(P<<23&4294967295|P>>>9),P=E+(S^(A|~x))+R[0]+4096336452&4294967295,E=A+(P<<6&4294967295|P>>>26),P=x+(A^(E|~S))+R[7]+1126891415&4294967295,x=E+(P<<10&4294967295|P>>>22),P=S+(E^(x|~A))+R[14]+2878612391&4294967295,S=x+(P<<15&4294967295|P>>>17),P=A+(x^(S|~E))+R[5]+4237533241&4294967295,A=S+(P<<21&4294967295|P>>>11),P=E+(S^(A|~x))+R[12]+1700485571&4294967295,E=A+(P<<6&4294967295|P>>>26),P=x+(A^(E|~S))+R[3]+2399980690&4294967295,x=E+(P<<10&4294967295|P>>>22),P=S+(E^(x|~A))+R[10]+4293915773&4294967295,S=x+(P<<15&4294967295|P>>>17),P=A+(x^(S|~E))+R[1]+2240044497&4294967295,A=S+(P<<21&4294967295|P>>>11),P=E+(S^(A|~x))+R[8]+1873313359&4294967295,E=A+(P<<6&4294967295|P>>>26),P=x+(A^(E|~S))+R[15]+4264355552&4294967295,x=E+(P<<10&4294967295|P>>>22),P=S+(E^(x|~A))+R[6]+2734768916&4294967295,S=x+(P<<15&4294967295|P>>>17),P=A+(x^(S|~E))+R[13]+1309151649&4294967295,A=S+(P<<21&4294967295|P>>>11),P=E+(S^(A|~x))+R[4]+4149444226&4294967295,E=A+(P<<6&4294967295|P>>>26),P=x+(A^(E|~S))+R[11]+3174756917&4294967295,x=E+(P<<10&4294967295|P>>>22),P=S+(E^(x|~A))+R[2]+718787259&4294967295,S=x+(P<<15&4294967295|P>>>17),P=A+(x^(S|~E))+R[9]+3951481745&4294967295,C.g[0]=C.g[0]+E&4294967295,C.g[1]=C.g[1]+(S+(P<<21&4294967295|P>>>11))&4294967295,C.g[2]=C.g[2]+S&4294967295,C.g[3]=C.g[3]+x&4294967295}r.prototype.v=function(C,E){E===void 0&&(E=C.length);const A=E-this.blockSize,R=this.C;let S=this.h,x=0;for(;x<E;){if(S==0)for(;x<=A;)o(this,C,x),x+=this.blockSize;if(typeof C=="string"){for(;x<E;)if(R[S++]=C.charCodeAt(x++),S==this.blockSize){o(this,R),S=0;break}}else for(;x<E;)if(R[S++]=C[x++],S==this.blockSize){o(this,R),S=0;break}}this.h=S,this.o+=E},r.prototype.A=function(){var C=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);C[0]=128;for(var E=1;E<C.length-8;++E)C[E]=0;E=this.o*8;for(var A=C.length-8;A<C.length;++A)C[A]=E&255,E/=256;for(this.v(C),C=Array(16),E=0,A=0;A<4;++A)for(let R=0;R<32;R+=8)C[E++]=this.g[A]>>>R&255;return C};function a(C,E){var A=f;return Object.prototype.hasOwnProperty.call(A,C)?A[C]:A[C]=E(C)}function h(C,E){this.h=E;const A=[];let R=!0;for(let S=C.length-1;S>=0;S--){const x=C[S]|0;R&&x==E||(A[S]=x,R=!1)}this.g=A}var f={};function p(C){return-128<=C&&C<128?a(C,function(E){return new h([E|0],E<0?-1:0)}):new h([C|0],C<0?-1:0)}function g(C){if(isNaN(C)||!isFinite(C))return T;if(C<0)return q(g(-C));const E=[];let A=1;for(let R=0;C>=A;R++)E[R]=C/A|0,A*=4294967296;return new h(E,0)}function w(C,E){if(C.length==0)throw Error("number format error: empty string");if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(C.charAt(0)=="-")return q(w(C.substring(1),E));if(C.indexOf("-")>=0)throw Error('number format error: interior "-" character');const A=g(Math.pow(E,8));let R=T;for(let x=0;x<C.length;x+=8){var S=Math.min(8,C.length-x);const P=parseInt(C.substring(x,x+S),E);S<8?(S=g(Math.pow(E,S)),R=R.j(S).add(g(P))):(R=R.j(A),R=R.add(g(P)))}return R}var T=p(0),b=p(1),V=p(16777216);i=h.prototype,i.m=function(){if(B(this))return-q(this).m();let C=0,E=1;for(let A=0;A<this.g.length;A++){const R=this.i(A);C+=(R>=0?R:4294967296+R)*E,E*=4294967296}return C},i.toString=function(C){if(C=C||10,C<2||36<C)throw Error("radix out of range: "+C);if(z(this))return"0";if(B(this))return"-"+q(this).toString(C);const E=g(Math.pow(C,6));var A=this;let R="";for(;;){const S=xt(A,E).g;A=ht(A,S.j(E));let x=((A.g.length>0?A.g[0]:A.h)>>>0).toString(C);if(A=S,z(A))return x+R;for(;x.length<6;)x="0"+x;R=x+R}},i.i=function(C){return C<0?0:C<this.g.length?this.g[C]:this.h};function z(C){if(C.h!=0)return!1;for(let E=0;E<C.g.length;E++)if(C.g[E]!=0)return!1;return!0}function B(C){return C.h==-1}i.l=function(C){return C=ht(this,C),B(C)?-1:z(C)?0:1};function q(C){const E=C.g.length,A=[];for(let R=0;R<E;R++)A[R]=~C.g[R];return new h(A,~C.h).add(b)}i.abs=function(){return B(this)?q(this):this},i.add=function(C){const E=Math.max(this.g.length,C.g.length),A=[];let R=0;for(let S=0;S<=E;S++){let x=R+(this.i(S)&65535)+(C.i(S)&65535),P=(x>>>16)+(this.i(S)>>>16)+(C.i(S)>>>16);R=P>>>16,x&=65535,P&=65535,A[S]=P<<16|x}return new h(A,A[A.length-1]&-2147483648?-1:0)};function ht(C,E){return C.add(q(E))}i.j=function(C){if(z(this)||z(C))return T;if(B(this))return B(C)?q(this).j(q(C)):q(q(this).j(C));if(B(C))return q(this.j(q(C)));if(this.l(V)<0&&C.l(V)<0)return g(this.m()*C.m());const E=this.g.length+C.g.length,A=[];for(var R=0;R<2*E;R++)A[R]=0;for(R=0;R<this.g.length;R++)for(let S=0;S<C.g.length;S++){const x=this.i(R)>>>16,P=this.i(R)&65535,Ct=C.i(S)>>>16,rn=C.i(S)&65535;A[2*R+2*S]+=P*rn,ot(A,2*R+2*S),A[2*R+2*S+1]+=x*rn,ot(A,2*R+2*S+1),A[2*R+2*S+1]+=P*Ct,ot(A,2*R+2*S+1),A[2*R+2*S+2]+=x*Ct,ot(A,2*R+2*S+2)}for(C=0;C<E;C++)A[C]=A[2*C+1]<<16|A[2*C];for(C=E;C<2*E;C++)A[C]=0;return new h(A,0)};function ot(C,E){for(;(C[E]&65535)!=C[E];)C[E+1]+=C[E]>>>16,C[E]&=65535,E++}function st(C,E){this.g=C,this.h=E}function xt(C,E){if(z(E))throw Error("division by zero");if(z(C))return new st(T,T);if(B(C))return E=xt(q(C),E),new st(q(E.g),q(E.h));if(B(E))return E=xt(C,q(E)),new st(q(E.g),E.h);if(C.g.length>30){if(B(C)||B(E))throw Error("slowDivide_ only works with positive integers.");for(var A=b,R=E;R.l(C)<=0;)A=Ht(A),R=Ht(R);var S=Rt(A,1),x=Rt(R,1);for(R=Rt(R,2),A=Rt(A,2);!z(R);){var P=x.add(R);P.l(C)<=0&&(S=S.add(A),x=P),R=Rt(R,1),A=Rt(A,1)}return E=ht(C,S.j(E)),new st(S,E)}for(S=T;C.l(E)>=0;){for(A=Math.max(1,Math.floor(C.m()/E.m())),R=Math.ceil(Math.log(A)/Math.LN2),R=R<=48?1:Math.pow(2,R-48),x=g(A),P=x.j(E);B(P)||P.l(C)>0;)A-=R,x=g(A),P=x.j(E);z(x)&&(x=b),S=S.add(x),C=ht(C,P)}return new st(S,C)}i.B=function(C){return xt(this,C).h},i.and=function(C){const E=Math.max(this.g.length,C.g.length),A=[];for(let R=0;R<E;R++)A[R]=this.i(R)&C.i(R);return new h(A,this.h&C.h)},i.or=function(C){const E=Math.max(this.g.length,C.g.length),A=[];for(let R=0;R<E;R++)A[R]=this.i(R)|C.i(R);return new h(A,this.h|C.h)},i.xor=function(C){const E=Math.max(this.g.length,C.g.length),A=[];for(let R=0;R<E;R++)A[R]=this.i(R)^C.i(R);return new h(A,this.h^C.h)};function Ht(C){const E=C.g.length+1,A=[];for(let R=0;R<E;R++)A[R]=C.i(R)<<1|C.i(R-1)>>>31;return new h(A,C.h)}function Rt(C,E){const A=E>>5;E%=32;const R=C.g.length-A,S=[];for(let x=0;x<R;x++)S[x]=E>0?C.i(x+A)>>>E|C.i(x+A+1)<<32-E:C.i(x+A);return new h(S,C.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,td=r,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.B,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=g,h.fromString=w,Zn=h}).apply(typeof mh<"u"?mh:typeof self<"u"?self:typeof window<"u"?window:{});var xo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ed,ws,nd,Vo,mu,id,rd,sd;(function(){var i,t=Object.defineProperty;function e(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof xo=="object"&&xo];for(var d=0;d<u.length;++d){var _=u[d];if(_&&_.Math==Math)return _}throw Error("Cannot find global object")}var r=e(this);function o(u,d){if(d)t:{var _=r;u=u.split(".");for(var v=0;v<u.length-1;v++){var k=u[v];if(!(k in _))break t;_=_[k]}u=u[u.length-1],v=_[u],d=d(v),d!=v&&d!=null&&t(_,u,{configurable:!0,writable:!0,value:d})}}o("Symbol.dispose",function(u){return u||Symbol("Symbol.dispose")}),o("Array.prototype.values",function(u){return u||function(){return this[Symbol.iterator]()}}),o("Object.entries",function(u){return u||function(d){var _=[],v;for(v in d)Object.prototype.hasOwnProperty.call(d,v)&&_.push([v,d[v]]);return _}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},h=this||self;function f(u){var d=typeof u;return d=="object"&&u!=null||d=="function"}function p(u,d,_){return u.call.apply(u.bind,arguments)}function g(u,d,_){return g=p,g.apply(null,arguments)}function w(u,d){var _=Array.prototype.slice.call(arguments,1);return function(){var v=_.slice();return v.push.apply(v,arguments),u.apply(this,v)}}function T(u,d){function _(){}_.prototype=d.prototype,u.Z=d.prototype,u.prototype=new _,u.prototype.constructor=u,u.Ob=function(v,k,N){for(var H=Array(arguments.length-2),nt=2;nt<arguments.length;nt++)H[nt-2]=arguments[nt];return d.prototype[k].apply(v,H)}}var b=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?u=>u&&AsyncContext.Snapshot.wrap(u):u=>u;function V(u){const d=u.length;if(d>0){const _=Array(d);for(let v=0;v<d;v++)_[v]=u[v];return _}return[]}function z(u,d){for(let v=1;v<arguments.length;v++){const k=arguments[v];var _=typeof k;if(_=_!="object"?_:k?Array.isArray(k)?"array":_:"null",_=="array"||_=="object"&&typeof k.length=="number"){_=u.length||0;const N=k.length||0;u.length=_+N;for(let H=0;H<N;H++)u[_+H]=k[H]}else u.push(k)}}class B{constructor(d,_){this.i=d,this.j=_,this.h=0,this.g=null}get(){let d;return this.h>0?(this.h--,d=this.g,this.g=d.next,d.next=null):d=this.i(),d}}function q(u){h.setTimeout(()=>{throw u},0)}function ht(){var u=C;let d=null;return u.g&&(d=u.g,u.g=u.g.next,u.g||(u.h=null),d.next=null),d}class ot{constructor(){this.h=this.g=null}add(d,_){const v=st.get();v.set(d,_),this.h?this.h.next=v:this.g=v,this.h=v}}var st=new B(()=>new xt,u=>u.reset());class xt{constructor(){this.next=this.g=this.h=null}set(d,_){this.h=d,this.g=_,this.next=null}reset(){this.next=this.g=this.h=null}}let Ht,Rt=!1,C=new ot,E=()=>{const u=Promise.resolve(void 0);Ht=()=>{u.then(A)}};function A(){for(var u;u=ht();){try{u.h.call(u.g)}catch(_){q(_)}var d=st;d.j(u),d.h<100&&(d.h++,u.next=d.g,d.g=u)}Rt=!1}function R(){this.u=this.u,this.C=this.C}R.prototype.u=!1,R.prototype.dispose=function(){this.u||(this.u=!0,this.N())},R.prototype[Symbol.dispose]=function(){this.dispose()},R.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function S(u,d){this.type=u,this.g=this.target=d,this.defaultPrevented=!1}S.prototype.h=function(){this.defaultPrevented=!0};var x=function(){if(!h.addEventListener||!Object.defineProperty)return!1;var u=!1,d=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const _=()=>{};h.addEventListener("test",_,d),h.removeEventListener("test",_,d)}catch{}return u}();function P(u){return/^[\s\xa0]*$/.test(u)}function Ct(u,d){S.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u&&this.init(u,d)}T(Ct,S),Ct.prototype.init=function(u,d){const _=this.type=u.type,v=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;this.target=u.target||u.srcElement,this.g=d,d=u.relatedTarget,d||(_=="mouseover"?d=u.fromElement:_=="mouseout"&&(d=u.toElement)),this.relatedTarget=d,v?(this.clientX=v.clientX!==void 0?v.clientX:v.pageX,this.clientY=v.clientY!==void 0?v.clientY:v.pageY,this.screenX=v.screenX||0,this.screenY=v.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=u.pointerType,this.state=u.state,this.i=u,u.defaultPrevented&&Ct.Z.h.call(this)},Ct.prototype.h=function(){Ct.Z.h.call(this);const u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var rn="closure_listenable_"+(Math.random()*1e6|0),se=0;function ai(u,d,_,v,k){this.listener=u,this.proxy=null,this.src=d,this.type=_,this.capture=!!v,this.ha=k,this.key=++se,this.da=this.fa=!1}function J(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function ui(u,d,_){for(const v in u)d.call(_,u[v],v,u)}function tt(u,d){for(const _ in u)d.call(void 0,u[_],_,u)}function Pt(u){const d={};for(const _ in u)d[_]=u[_];return d}const Kt="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Qt(u,d){let _,v;for(let k=1;k<arguments.length;k++){v=arguments[k];for(_ in v)u[_]=v[_];for(let N=0;N<Kt.length;N++)_=Kt[N],Object.prototype.hasOwnProperty.call(v,_)&&(u[_]=v[_])}}function bt(u){this.src=u,this.g={},this.h=0}bt.prototype.add=function(u,d,_,v,k){const N=u.toString();u=this.g[N],u||(u=this.g[N]=[],this.h++);const H=at(u,d,v,k);return H>-1?(d=u[H],_||(d.fa=!1)):(d=new ai(d,this.src,N,!!v,k),d.fa=_,u.push(d)),d};function _t(u,d){const _=d.type;if(_ in u.g){var v=u.g[_],k=Array.prototype.indexOf.call(v,d,void 0),N;(N=k>=0)&&Array.prototype.splice.call(v,k,1),N&&(J(d),u.g[_].length==0&&(delete u.g[_],u.h--))}}function at(u,d,_,v){for(let k=0;k<u.length;++k){const N=u[k];if(!N.da&&N.listener==d&&N.capture==!!_&&N.ha==v)return k}return-1}var _e="closure_lm_"+(Math.random()*1e6|0),we={};function Hr(u,d,_,v,k){if(Array.isArray(d)){for(let N=0;N<d.length;N++)Hr(u,d[N],_,v,k);return null}return _=li(_),u&&u[rn]?u.J(d,_,f(v)?!!v.capture:!1,k):jr(u,d,_,!1,v,k)}function jr(u,d,_,v,k,N){if(!d)throw Error("Invalid event type");const H=f(k)?!!k.capture:!!k;let nt=Ui(u);if(nt||(u[_e]=nt=new bt(u)),_=nt.add(d,_,v,H,N),_.proxy)return _;if(v=Gr(),_.proxy=v,v.src=u,v.listener=_,u.addEventListener)x||(k=H),k===void 0&&(k=!1),u.addEventListener(d.toString(),v,k);else if(u.attachEvent)u.attachEvent(Qs(d.toString()),v);else if(u.addListener&&u.removeListener)u.addListener(v);else throw Error("addEventListener and attachEvent are unavailable.");return _}function Gr(){function u(_){return d.call(u.src,u.listener,_)}const d=Ys;return u}function Cn(u,d,_,v,k){if(Array.isArray(d))for(var N=0;N<d.length;N++)Cn(u,d[N],_,v,k);else v=f(v)?!!v.capture:!!v,_=li(_),u&&u[rn]?(u=u.i,N=String(d).toString(),N in u.g&&(d=u.g[N],_=at(d,_,v,k),_>-1&&(J(d[_]),Array.prototype.splice.call(d,_,1),d.length==0&&(delete u.g[N],u.h--)))):u&&(u=Ui(u))&&(d=u.g[d.toString()],u=-1,d&&(u=at(d,_,v,k)),(_=u>-1?d[u]:null)&&ci(_))}function ci(u){if(typeof u!="number"&&u&&!u.da){var d=u.src;if(d&&d[rn])_t(d.i,u);else{var _=u.type,v=u.proxy;d.removeEventListener?d.removeEventListener(_,v,u.capture):d.detachEvent?d.detachEvent(Qs(_),v):d.addListener&&d.removeListener&&d.removeListener(v),(_=Ui(d))?(_t(_,u),_.h==0&&(_.src=null,d[_e]=null)):J(u)}}}function Qs(u){return u in we?we[u]:we[u]="on"+u}function Ys(u,d){if(u.da)u=!0;else{d=new Ct(d,this);const _=u.listener,v=u.ha||u.src;u.fa&&ci(u),u=_.call(v,d)}return u}function Ui(u){return u=u[_e],u instanceof bt?u:null}var hi="__closure_events_fn_"+(Math.random()*1e9>>>0);function li(u){return typeof u=="function"?u:(u[hi]||(u[hi]=function(d){return u.handleEvent(d)}),u[hi])}function jt(){R.call(this),this.i=new bt(this),this.M=this,this.G=null}T(jt,R),jt.prototype[rn]=!0,jt.prototype.removeEventListener=function(u,d,_,v){Cn(this,u,d,_,v)};function Gt(u,d){var _,v=u.G;if(v)for(_=[];v;v=v.G)_.push(v);if(u=u.M,v=d.type||d,typeof d=="string")d=new S(d,u);else if(d instanceof S)d.target=d.target||u;else{var k=d;d=new S(v,u),Qt(d,k)}k=!0;let N,H;if(_)for(H=_.length-1;H>=0;H--)N=d.g=_[H],k=Rn(N,v,!0,d)&&k;if(N=d.g=u,k=Rn(N,v,!0,d)&&k,k=Rn(N,v,!1,d)&&k,_)for(H=0;H<_.length;H++)N=d.g=_[H],k=Rn(N,v,!1,d)&&k}jt.prototype.N=function(){if(jt.Z.N.call(this),this.i){var u=this.i;for(const d in u.g){const _=u.g[d];for(let v=0;v<_.length;v++)J(_[v]);delete u.g[d],u.h--}}this.G=null},jt.prototype.J=function(u,d,_,v){return this.i.add(String(u),d,!1,_,v)},jt.prototype.K=function(u,d,_,v){return this.i.add(String(u),d,!0,_,v)};function Rn(u,d,_,v){if(d=u.i.g[String(d)],!d)return!0;d=d.concat();let k=!0;for(let N=0;N<d.length;++N){const H=d[N];if(H&&!H.da&&H.capture==_){const nt=H.listener,yt=H.ha||H.src;H.fa&&_t(u.i,H),k=nt.call(yt,v)!==!1&&k}}return k&&!v.defaultPrevented}function Xs(u,d){if(typeof u!="function")if(u&&typeof u.handleEvent=="function")u=g(u.handleEvent,u);else throw Error("Invalid listener argument");return Number(d)>2147483647?-1:h.setTimeout(u,d||0)}function Wr(u){u.g=Xs(()=>{u.g=null,u.i&&(u.i=!1,Wr(u))},u.l);const d=u.h;u.h=null,u.m.apply(null,d)}class Va extends R{constructor(d,_){super(),this.m=d,this.l=_,this.h=null,this.i=!1,this.g=null}j(d){this.h=arguments,this.g?this.i=!0:Wr(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function di(u){R.call(this),this.h=u,this.g={}}T(di,R);var Bi=[];function $r(u){ui(u.g,function(d,_){this.g.hasOwnProperty(_)&&ci(d)},u),u.g={}}di.prototype.N=function(){di.Z.N.call(this),$r(this)},di.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var zi=h.JSON.stringify,Fa=h.JSON.parse,Js=class{stringify(u){return h.JSON.stringify(u,void 0)}parse(u){return h.JSON.parse(u,void 0)}};function Zr(){}function to(){}var Ln={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function fi(){S.call(this,"d")}T(fi,S);function qi(){S.call(this,"c")}T(qi,S);var sn={},xn=null;function Hi(){return xn=xn||new jt}sn.Ia="serverreachability";function eo(u){S.call(this,sn.Ia,u)}T(eo,S);function kn(u){const d=Hi();Gt(d,new eo(d))}sn.STAT_EVENT="statevent";function Kr(u,d){S.call(this,sn.STAT_EVENT,u),this.stat=d}T(Kr,S);function Wt(u){const d=Hi();Gt(d,new Kr(d,u))}sn.Ja="timingevent";function no(u,d){S.call(this,sn.Ja,u),this.size=d}T(no,S);function mi(u,d){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){u()},d)}function pi(){this.g=!0}pi.prototype.ua=function(){this.g=!1};function Ua(u,d,_,v,k,N){u.info(function(){if(u.g)if(N){var H="",nt=N.split("&");for(let wt=0;wt<nt.length;wt++){var yt=nt[wt].split("=");if(yt.length>1){const Mt=yt[0];yt=yt[1];const Ae=Mt.split("_");H=Ae.length>=2&&Ae[1]=="type"?H+(Mt+"="+yt+"&"):H+(Mt+"=redacted&")}}}else H=null;else H=N;return"XMLHTTP REQ ("+v+") [attempt "+k+"]: "+d+`
`+_+`
`+H})}function Ba(u,d,_,v,k,N,H){u.info(function(){return"XMLHTTP RESP ("+v+") [ attempt "+k+"]: "+d+`
`+_+`
`+N+" "+H})}function Mn(u,d,_,v){u.info(function(){return"XMLHTTP TEXT ("+d+"): "+za(u,_)+(v?" "+v:"")})}function Qr(u,d){u.info(function(){return"TIMEOUT: "+d})}pi.prototype.info=function(){};function za(u,d){if(!u.g)return d;if(!d)return null;try{const N=JSON.parse(d);if(N){for(u=0;u<N.length;u++)if(Array.isArray(N[u])){var _=N[u];if(!(_.length<2)){var v=_[1];if(Array.isArray(v)&&!(v.length<1)){var k=v[0];if(k!="noop"&&k!="stop"&&k!="close")for(let H=1;H<v.length;H++)v[H]=""}}}}return zi(N)}catch{return d}}var ji={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},io={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},ro;function he(){}T(he,Zr),he.prototype.g=function(){return new XMLHttpRequest},ro=new he;function Z(u){return encodeURIComponent(String(u))}function so(u){var d=1;u=u.split(":");const _=[];for(;d>0&&u.length;)_.push(u.shift()),d--;return u.length&&_.push(u.join(":")),_}function Le(u,d,_,v){this.j=u,this.i=d,this.l=_,this.S=v||1,this.V=new di(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Yr}function Yr(){this.i=null,this.g="",this.h=!1}var Xr={},_i={};function Gi(u,d,_){u.M=1,u.A=At(oe(d)),u.u=_,u.R=!0,on(u,null)}function on(u,d){u.F=Date.now(),Wi(u),u.B=oe(u.A);var _=u.B,v=u.S;Array.isArray(v)||(v=[String(v)]),Yi(_.i,"t",v),u.C=0,_=u.j.L,u.h=new Yr,u.g=ds(u.j,_?d:null,!u.u),u.P>0&&(u.O=new Va(g(u.Y,u,u.g),u.P)),d=u.V,_=u.g,v=u.ba;var k="readystatechange";Array.isArray(k)||(k&&(Bi[0]=k.toString()),k=Bi);for(let N=0;N<k.length;N++){const H=Hr(_,k[N],v||d.handleEvent,!1,d.h||d);if(!H)break;d.g[H.key]=H}d=u.J?Pt(u.J):{},u.u?(u.v||(u.v="POST"),d["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.B,u.v,u.u,d)):(u.v="GET",u.g.ea(u.B,u.v,null,d)),kn(),Ua(u.i,u.v,u.B,u.l,u.S,u.u)}Le.prototype.ba=function(u){u=u.target;const d=this.O;d&&qe(u)==3?d.j():this.Y(u)},Le.prototype.Y=function(u){try{if(u==this.g)t:{const nt=qe(this.g),yt=this.g.ya(),wt=this.g.ca();if(!(nt<3)&&(nt!=3||this.g&&(this.h.h||this.g.la()||ss(this.g)))){this.K||nt!=4||yt==7||(yt==8||wt<=0?kn(3):kn(2)),$i(this);var d=this.g.ca();this.X=d;var _=oo(this);if(this.o=d==200,Ba(this.i,this.v,this.B,this.l,this.S,nt,d),this.o){if(this.U&&!this.L){e:{if(this.g){var v,k=this.g;if((v=k.g?k.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!P(v)){var N=v;break e}}N=null}if(u=N)Mn(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Jr(this,u);else{this.o=!1,this.m=3,Wt(12),Te(this),gi(this);break t}}if(this.R){u=!0;let Mt;for(;!this.K&&this.C<_.length;)if(Mt=qa(this,_),Mt==_i){nt==4&&(this.m=4,Wt(14),u=!1),Mn(this.i,this.l,null,"[Incomplete Response]");break}else if(Mt==Xr){this.m=4,Wt(15),Mn(this.i,this.l,_,"[Invalid Chunk]"),u=!1;break}else Mn(this.i,this.l,Mt,null),Jr(this,Mt);if(ao(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),nt!=4||_.length!=0||this.h.h||(this.m=1,Wt(16),u=!1),this.o=this.o&&u,!u)Mn(this.i,this.l,_,"[Invalid Chunked Response]"),Te(this),gi(this);else if(_.length>0&&!this.W){this.W=!0;var H=this.j;H.g==this&&H.aa&&!H.P&&(H.j.info("Great, no buffering proxy detected. Bytes received: "+_.length),hs(H),H.P=!0,Wt(11))}}else Mn(this.i,this.l,_,null),Jr(this,_);nt==4&&Te(this),this.o&&!this.K&&(nt==4?ye(this.j,this):(this.o=!1,Wi(this)))}else os(this.g),d==400&&_.indexOf("Unknown SID")>0?(this.m=3,Wt(12)):(this.m=0,Wt(13)),Te(this),gi(this)}}}catch{}finally{}};function oo(u){if(!ao(u))return u.g.la();const d=ss(u.g);if(d==="")return"";let _="";const v=d.length,k=qe(u.g)==4;if(!u.h.i){if(typeof TextDecoder>"u")return Te(u),gi(u),"";u.h.i=new h.TextDecoder}for(let N=0;N<v;N++)u.h.h=!0,_+=u.h.i.decode(d[N],{stream:!(k&&N==v-1)});return d.length=0,u.h.g+=_,u.C=0,u.h.g}function ao(u){return u.g?u.v=="GET"&&u.M!=2&&u.j.Aa:!1}function qa(u,d){var _=u.C,v=d.indexOf(`
`,_);return v==-1?_i:(_=Number(d.substring(_,v)),isNaN(_)?Xr:(v+=1,v+_>d.length?_i:(d=d.slice(v,v+_),u.C=v+_,d)))}Le.prototype.cancel=function(){this.K=!0,Te(this)};function Wi(u){u.T=Date.now()+u.H,uo(u,u.H)}function uo(u,d){if(u.D!=null)throw Error("WatchDog timer not null");u.D=mi(g(u.aa,u),d)}function $i(u){u.D&&(h.clearTimeout(u.D),u.D=null)}Le.prototype.aa=function(){this.D=null;const u=Date.now();u-this.T>=0?(Qr(this.i,this.B),this.M!=2&&(kn(),Wt(17)),Te(this),this.m=2,gi(this)):uo(this,this.T-u)};function gi(u){u.j.I==0||u.K||ye(u.j,u)}function Te(u){$i(u);var d=u.O;d&&typeof d.dispose=="function"&&d.dispose(),u.O=null,$r(u.V),u.g&&(d=u.g,u.g=null,d.abort(),d.dispose())}function Jr(u,d){try{var _=u.j;if(_.I!=0&&(_.g==u||yi(_.h,u))){if(!u.L&&yi(_.h,u)&&_.I==3){try{var v=_.Ba.g.parse(d)}catch{v=null}if(Array.isArray(v)&&v.length==3){var k=v;if(k[0]==0){t:if(!_.v){if(_.g)if(_.g.F+3e3<u.F)nr(_),tr(_);else break t;cs(_),Wt(18)}}else _.xa=k[1],0<_.xa-_.K&&k[2]<37500&&_.F&&_.A==0&&!_.C&&(_.C=mi(g(_.Va,_),6e3));lo(_.h)<=1&&_.ta&&(_.ta=void 0)}else je(_,11)}else if((u.L||_.g==u)&&nr(_),!P(d))for(k=_.Ba.g.parse(d),d=0;d<k.length;d++){let wt=k[d];const Mt=wt[0];if(!(Mt<=_.K))if(_.K=Mt,wt=wt[1],_.I==2)if(wt[0]=="c"){_.M=wt[1],_.ba=wt[2];const Ae=wt[3];Ae!=null&&(_.ka=Ae,_.j.info("VER="+_.ka));const Me=wt[4];Me!=null&&(_.za=Me,_.j.info("SVER="+_.za));const be=wt[5];be!=null&&typeof be=="number"&&be>0&&(v=1.5*be,_.O=v,_.j.info("backChannelRequestTimeoutMs_="+v)),v=_;const Ge=u.g;if(Ge){const sr=Ge.g?Ge.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(sr){var N=v.h;N.g||sr.indexOf("spdy")==-1&&sr.indexOf("quic")==-1&&sr.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(an(N,N.h),N.h=null))}if(v.G){const or=Ge.g?Ge.g.getResponseHeader("X-HTTP-Session-Id"):null;or&&(v.wa=or,$(v.J,v.G,or))}}_.I=3,_.l&&_.l.ra(),_.aa&&(_.T=Date.now()-u.F,_.j.info("Handshake RTT: "+_.T+"ms")),v=_;var H=u;if(v.na=ls(v,v.L?v.ba:null,v.W),H.L){ts(v.h,H);var nt=H,yt=v.O;yt&&(nt.H=yt),nt.D&&($i(nt),Wi(nt)),v.g=H}else us(v);_.i.length>0&&He(_)}else wt[0]!="stop"&&wt[0]!="close"||je(_,7);else _.I==3&&(wt[0]=="stop"||wt[0]=="close"?wt[0]=="stop"?je(_,7):ut(_):wt[0]!="noop"&&_.l&&_.l.qa(wt),_.A=0)}}kn(4)}catch{}}var Ha=class{constructor(u,d){this.g=u,this.map=d}};function co(u){this.l=u||10,h.PerformanceNavigationTiming?(u=h.performance.getEntriesByType("navigation"),u=u.length>0&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function ho(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function lo(u){return u.h?1:u.g?u.g.size:0}function yi(u,d){return u.h?u.h==d:u.g?u.g.has(d):!1}function an(u,d){u.g?u.g.add(d):u.h=d}function ts(u,d){u.h&&u.h==d?u.h=null:u.g&&u.g.has(d)&&u.g.delete(d)}co.prototype.cancel=function(){if(this.i=es(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function es(u){if(u.h!=null)return u.i.concat(u.h.G);if(u.g!=null&&u.g.size!==0){let d=u.i;for(const _ of u.g.values())d=d.concat(_.G);return d}return V(u.i)}var Nn=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function mt(u,d){if(u){u=u.split("&");for(let _=0;_<u.length;_++){const v=u[_].indexOf("=");let k,N=null;v>=0?(k=u[_].substring(0,v),N=u[_].substring(v+1)):k=u[_],d(k,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function gt(u){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let d;u instanceof gt?(this.l=u.l,Ee(this,u.j),this.o=u.o,this.g=u.g,Ie(this,u.u),this.h=u.h,vi(this,wi(u.i)),this.m=u.m):u&&(d=String(u).match(Nn))?(this.l=!1,Ee(this,d[1]||"",!0),this.o=un(d[2]||""),this.g=un(d[3]||"",!0),Ie(this,d[4]),this.h=un(d[5]||"",!0),vi(this,d[6]||"",!0),this.m=un(d[7]||"")):(this.l=!1,this.i=new xe(null,this.l))}gt.prototype.toString=function(){const u=[];var d=this.j;d&&u.push(Ue(d,fo,!0),":");var _=this.g;return(_||d=="file")&&(u.push("//"),(d=this.o)&&u.push(Ue(d,fo,!0),"@"),u.push(Z(_).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),_=this.u,_!=null&&u.push(":",String(_))),(_=this.h)&&(this.g&&_.charAt(0)!="/"&&u.push("/"),u.push(Ue(_,_.charAt(0)=="/"?cn:Zi,!0))),(_=this.i.toString())&&u.push("?",_),(_=this.m)&&u.push("#",Ue(_,hn)),u.join("")},gt.prototype.resolve=function(u){const d=oe(this);let _=!!u.j;_?Ee(d,u.j):_=!!u.o,_?d.o=u.o:_=!!u.g,_?d.g=u.g:_=u.u!=null;var v=u.h;if(_)Ie(d,u.u);else if(_=!!u.h){if(v.charAt(0)!="/")if(this.g&&!this.h)v="/"+v;else{var k=d.h.lastIndexOf("/");k!=-1&&(v=d.h.slice(0,k+1)+v)}if(k=v,k==".."||k==".")v="";else if(k.indexOf("./")!=-1||k.indexOf("/.")!=-1){v=k.lastIndexOf("/",0)==0,k=k.split("/");const N=[];for(let H=0;H<k.length;){const nt=k[H++];nt=="."?v&&H==k.length&&N.push(""):nt==".."?((N.length>1||N.length==1&&N[0]!="")&&N.pop(),v&&H==k.length&&N.push("")):(N.push(nt),v=!0)}v=N.join("/")}else v=k}return _?d.h=v:_=u.i.toString()!=="",_?vi(d,wi(u.i)):_=!!u.m,_&&(d.m=u.m),d};function oe(u){return new gt(u)}function Ee(u,d,_){u.j=_?un(d,!0):d,u.j&&(u.j=u.j.replace(/:$/,""))}function Ie(u,d){if(d){if(d=Number(d),isNaN(d)||d<0)throw Error("Bad port number "+d);u.u=d}else u.u=null}function vi(u,d,_){d instanceof xe?(u.i=d,ns(u.i,u.l)):(_||(d=Ue(d,kt)),u.i=new xe(d,u.l))}function $(u,d,_){u.i.set(d,_)}function At(u){return $(u,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),u}function un(u,d){return u?d?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function Ue(u,d,_){return typeof u=="string"?(u=encodeURI(u).replace(d,le),_&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function le(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var fo=/[#\/\?@]/g,Zi=/[#\?:]/g,cn=/[#\?]/g,kt=/[#\?@]/g,hn=/#/g;function xe(u,d){this.h=this.g=null,this.i=u||null,this.j=!!d}function ge(u){u.g||(u.g=new Map,u.h=0,u.i&&mt(u.i,function(d,_){u.add(decodeURIComponent(d.replace(/\+/g," ")),_)}))}i=xe.prototype,i.add=function(u,d){ge(this),this.i=null,u=Be(this,u);let _=this.g.get(u);return _||this.g.set(u,_=[]),_.push(d),this.h+=1,this};function Ki(u,d){ge(u),d=Be(u,d),u.g.has(d)&&(u.i=null,u.h-=u.g.get(d).length,u.g.delete(d))}function On(u,d){return ge(u),d=Be(u,d),u.g.has(d)}i.forEach=function(u,d){ge(this),this.g.forEach(function(_,v){_.forEach(function(k){u.call(d,k,v,this)},this)},this)};function Qi(u,d){ge(u);let _=[];if(typeof d=="string")On(u,d)&&(_=_.concat(u.g.get(Be(u,d))));else for(u=Array.from(u.g.values()),d=0;d<u.length;d++)_=_.concat(u[d]);return _}i.set=function(u,d){return ge(this),this.i=null,u=Be(this,u),On(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[d]),this.h+=1,this},i.get=function(u,d){return u?(u=Qi(this,u),u.length>0?String(u[0]):d):d};function Yi(u,d,_){Ki(u,d),_.length>0&&(u.i=null,u.g.set(Be(u,d),V(_)),u.h+=_.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],d=Array.from(this.g.keys());for(let v=0;v<d.length;v++){var _=d[v];const k=Z(_);_=Qi(this,_);for(let N=0;N<_.length;N++){let H=k;_[N]!==""&&(H+="="+Z(_[N])),u.push(H)}}return this.i=u.join("&")};function wi(u){const d=new xe;return d.i=u.i,u.g&&(d.g=new Map(u.g),d.h=u.h),d}function Be(u,d){return d=String(d),u.j&&(d=d.toLowerCase()),d}function ns(u,d){d&&!u.j&&(ge(u),u.i=null,u.g.forEach(function(_,v){const k=v.toLowerCase();v!=k&&(Ki(this,v),Yi(this,k,_))},u)),u.j=d}function Xi(u,d){const _=new pi;if(h.Image){const v=new Image;v.onload=w(Pe,_,"TestLoadImage: loaded",!0,d,v),v.onerror=w(Pe,_,"TestLoadImage: error",!1,d,v),v.onabort=w(Pe,_,"TestLoadImage: abort",!1,d,v),v.ontimeout=w(Pe,_,"TestLoadImage: timeout",!1,d,v),h.setTimeout(function(){v.ontimeout&&v.ontimeout()},1e4),v.src=u}else d(!1)}function mo(u,d){const _=new pi,v=new AbortController,k=setTimeout(()=>{v.abort(),Pe(_,"TestPingServer: timeout",!1,d)},1e4);fetch(u,{signal:v.signal}).then(N=>{clearTimeout(k),N.ok?Pe(_,"TestPingServer: ok",!0,d):Pe(_,"TestPingServer: server error",!1,d)}).catch(()=>{clearTimeout(k),Pe(_,"TestPingServer: error",!1,d)})}function Pe(u,d,_,v,k){try{k&&(k.onload=null,k.onerror=null,k.onabort=null,k.ontimeout=null),v(_)}catch{}}function ja(){this.g=new Js}function et(u){this.i=u.Sb||null,this.h=u.ab||!1}T(et,Zr),et.prototype.g=function(){return new ae(this.i,this.h)};function ae(u,d){jt.call(this),this.H=u,this.o=d,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}T(ae,jt),i=ae.prototype,i.open=function(u,d){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=u,this.D=d,this.readyState=1,ln(this)},i.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const d={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};u&&(d.body=u),(this.H||h).fetch(new Request(this.D,d)).then(this.Pa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Dn(this)),this.readyState=0},i.Pa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,ln(this)),this.g&&(this.readyState=3,ln(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Et(this)}else u.text().then(this.Oa.bind(this),this.ga.bind(this))};function Et(u){u.j.read().then(u.Ma.bind(u)).catch(u.ga.bind(u))}i.Ma=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var d=u.value?u.value:new Uint8Array(0);(d=this.B.decode(d,{stream:!u.done}))&&(this.response=this.responseText+=d)}u.done?Dn(this):ln(this),this.readyState==3&&Et(this)}},i.Oa=function(u){this.g&&(this.response=this.responseText=u,Dn(this))},i.Na=function(u){this.g&&(this.response=u,Dn(this))},i.ga=function(){this.g&&Dn(this)};function Dn(u){u.readyState=4,u.l=null,u.j=null,u.B=null,ln(u)}i.setRequestHeader=function(u,d){this.A.append(u,d)},i.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],d=this.h.entries();for(var _=d.next();!_.done;)_=_.value,u.push(_[0]+": "+_[1]),_=d.next();return u.join(`\r
`)};function ln(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(ae.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function Ji(u){let d="";return ui(u,function(_,v){d+=v,d+=":",d+=_,d+=`\r
`}),d}function Ti(u,d,_){t:{for(v in _){var v=!1;break t}v=!0}v||(_=Ji(_),typeof u=="string"?_!=null&&Z(_):$(u,d,_))}function vt(u){jt.call(this),this.headers=new Map,this.L=u||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}T(vt,jt);var is=/^https?$/i,Ei=["POST","PUT"];i=vt.prototype,i.Fa=function(u){this.H=u},i.ea=function(u,d,_,v){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);d=d?d.toUpperCase():"GET",this.D=u,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():ro.g(),this.g.onreadystatechange=b(g(this.Ca,this));try{this.B=!0,this.g.open(d,String(u),!0),this.B=!1}catch(N){Dt(this,N);return}if(u=_||"",_=new Map(this.headers),v)if(Object.getPrototypeOf(v)===Object.prototype)for(var k in v)_.set(k,v[k]);else if(typeof v.keys=="function"&&typeof v.get=="function")for(const N of v.keys())_.set(N,v.get(N));else throw Error("Unknown input type for opt_headers: "+String(v));v=Array.from(_.keys()).find(N=>N.toLowerCase()=="content-type"),k=h.FormData&&u instanceof h.FormData,!(Array.prototype.indexOf.call(Ei,d,void 0)>=0)||v||k||_.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[N,H]of _)this.g.setRequestHeader(N,H);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(u),this.v=!1}catch(N){Dt(this,N)}};function Dt(u,d){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=d,u.o=5,ze(u),Ii(u)}function ze(u){u.A||(u.A=!0,Gt(u,"complete"),Gt(u,"error"))}i.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=u||7,Gt(this,"complete"),Gt(this,"abort"),Ii(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ii(this,!0)),vt.Z.N.call(this)},i.Ca=function(){this.u||(this.B||this.v||this.j?rs(this):this.Xa())},i.Xa=function(){rs(this)};function rs(u){if(u.h&&typeof a<"u"){if(u.v&&qe(u)==4)setTimeout(u.Ca.bind(u),0);else if(Gt(u,"readystatechange"),qe(u)==4){u.h=!1;try{const N=u.ca();t:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var d=!0;break t;default:d=!1}var _;if(!(_=d)){var v;if(v=N===0){let H=String(u.D).match(Nn)[1]||null;!H&&h.self&&h.self.location&&(H=h.self.location.protocol.slice(0,-1)),v=!is.test(H?H.toLowerCase():"")}_=v}if(_)Gt(u,"complete"),Gt(u,"success");else{u.o=6;try{var k=qe(u)>2?u.g.statusText:""}catch{k=""}u.l=k+" ["+u.ca()+"]",ze(u)}}finally{Ii(u)}}}}function Ii(u,d){if(u.g){u.m&&(clearTimeout(u.m),u.m=null);const _=u.g;u.g=null,d||Gt(u,"ready");try{_.onreadystatechange=null}catch{}}}i.isActive=function(){return!!this.g};function qe(u){return u.g?u.g.readyState:0}i.ca=function(){try{return qe(this)>2?this.g.status:-1}catch{return-1}},i.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.La=function(u){if(this.g){var d=this.g.responseText;return u&&d.indexOf(u)==0&&(d=d.substring(u.length)),Fa(d)}};function ss(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.F){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function os(u){const d={};u=(u.g&&qe(u)>=2&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let v=0;v<u.length;v++){if(P(u[v]))continue;var _=so(u[v]);const k=_[0];if(_=_[1],typeof _!="string")continue;_=_.trim();const N=d[k]||[];d[k]=N,N.push(_)}tt(d,function(v){return v.join(", ")})}i.ya=function(){return this.o},i.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Pi(u,d,_){return _&&_.internalChannelParams&&_.internalChannelParams[u]||d}function as(u){this.za=0,this.i=[],this.j=new pi,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Pi("failFast",!1,u),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Pi("baseRetryDelayMs",5e3,u),this.Za=Pi("retryDelaySeedMs",1e4,u),this.Ta=Pi("forwardChannelMaxRetries",2,u),this.va=Pi("forwardChannelRequestTimeoutMs",2e4,u),this.ma=u&&u.xmlHttpFactory||void 0,this.Ua=u&&u.Rb||void 0,this.Aa=u&&u.useFetchStreams||!1,this.O=void 0,this.L=u&&u.supportsCrossDomainXhr||!1,this.M="",this.h=new co(u&&u.concurrentRequestLimit),this.Ba=new ja,this.S=u&&u.fastHandshake||!1,this.R=u&&u.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=u&&u.Pb||!1,u&&u.ua&&this.j.ua(),u&&u.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&u&&u.detectBufferingProxy||!1,this.ia=void 0,u&&u.longPollingTimeout&&u.longPollingTimeout>0&&(this.ia=u.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}i=as.prototype,i.ka=8,i.I=1,i.connect=function(u,d,_,v){Wt(0),this.W=u,this.H=d||{},_&&v!==void 0&&(this.H.OSID=_,this.H.OAID=v),this.F=this.X,this.J=ls(this,null,this.W),He(this)};function ut(u){if(de(u),u.I==3){var d=u.V++,_=oe(u.J);if($(_,"SID",u.M),$(_,"RID",d),$(_,"TYPE","terminate"),dn(u,_),d=new Le(u,u.j,d),d.M=2,d.A=At(oe(_)),_=!1,h.navigator&&h.navigator.sendBeacon)try{_=h.navigator.sendBeacon(d.A.toString(),"")}catch{}!_&&h.Image&&(new Image().src=d.A,_=!0),_||(d.g=ds(d.j,null),d.g.ea(d.A)),d.F=Date.now(),Wi(d)}ke(u)}function tr(u){u.g&&(hs(u),u.g.cancel(),u.g=null)}function de(u){tr(u),u.v&&(h.clearTimeout(u.v),u.v=null),nr(u),u.h.cancel(),u.m&&(typeof u.m=="number"&&h.clearTimeout(u.m),u.m=null)}function He(u){if(!ho(u.h)&&!u.m){u.m=!0;var d=u.Ea;Ht||E(),Rt||(Ht(),Rt=!0),C.add(d,u),u.D=0}}function po(u,d){return lo(u.h)>=u.h.j-(u.m?1:0)?!1:u.m?(u.i=d.G.concat(u.i),!0):u.I==1||u.I==2||u.D>=(u.Sa?0:u.Ta)?!1:(u.m=mi(g(u.Ea,u,d),yo(u,u.D)),u.D++,!0)}i.Ea=function(u){if(this.m)if(this.m=null,this.I==1){if(!u){this.V=Math.floor(Math.random()*1e5),u=this.V++;const k=new Le(this,this.j,u);let N=this.o;if(this.U&&(N?(N=Pt(N),Qt(N,this.U)):N=this.U),this.u!==null||this.R||(k.J=N,N=null),this.S)t:{for(var d=0,_=0;_<this.i.length;_++){e:{var v=this.i[_];if("__data__"in v.map&&(v=v.map.__data__,typeof v=="string")){v=v.length;break e}v=void 0}if(v===void 0)break;if(d+=v,d>4096){d=_;break t}if(d===4096||_===this.i.length-1){d=_+1;break t}}d=1e3}else d=1e3;d=go(this,k,d),_=oe(this.J),$(_,"RID",u),$(_,"CVER",22),this.G&&$(_,"X-HTTP-Session-Id",this.G),dn(this,_),N&&(this.R?d="headers="+Z(Ji(N))+"&"+d:this.u&&Ti(_,this.u,N)),an(this.h,k),this.Ra&&$(_,"TYPE","init"),this.S?($(_,"$req",d),$(_,"SID","null"),k.U=!0,Gi(k,_,null)):Gi(k,_,d),this.I=2}}else this.I==3&&(u?_o(this,u):this.i.length==0||ho(this.h)||_o(this))};function _o(u,d){var _;d?_=d.l:_=u.V++;const v=oe(u.J);$(v,"SID",u.M),$(v,"RID",_),$(v,"AID",u.K),dn(u,v),u.u&&u.o&&Ti(v,u.u,u.o),_=new Le(u,u.j,_,u.D+1),u.u===null&&(_.J=u.o),d&&(u.i=d.G.concat(u.i)),d=go(u,_,1e3),_.H=Math.round(u.va*.5)+Math.round(u.va*.5*Math.random()),an(u.h,_),Gi(_,v,d)}function dn(u,d){u.H&&ui(u.H,function(_,v){$(d,v,_)}),u.l&&ui({},function(_,v){$(d,v,_)})}function go(u,d,_){_=Math.min(u.i.length,_);const v=u.l?g(u.l.Ka,u.l,u):null;t:{var k=u.i;let nt=-1;for(;;){const yt=["count="+_];nt==-1?_>0?(nt=k[0].g,yt.push("ofs="+nt)):nt=0:yt.push("ofs="+nt);let wt=!0;for(let Mt=0;Mt<_;Mt++){var N=k[Mt].g;const Ae=k[Mt].map;if(N-=nt,N<0)nt=Math.max(0,k[Mt].g-100),wt=!1;else try{N="req"+N+"_"||"";try{var H=Ae instanceof Map?Ae:Object.entries(Ae);for(const[Me,be]of H){let Ge=be;f(be)&&(Ge=zi(be)),yt.push(N+Me+"="+encodeURIComponent(Ge))}}catch(Me){throw yt.push(N+"type="+encodeURIComponent("_badmap")),Me}}catch{v&&v(Ae)}}if(wt){H=yt.join("&");break t}}H=void 0}return u=u.i.splice(0,_),d.G=u,H}function us(u){if(!u.g&&!u.v){u.Y=1;var d=u.Da;Ht||E(),Rt||(Ht(),Rt=!0),C.add(d,u),u.A=0}}function cs(u){return u.g||u.v||u.A>=3?!1:(u.Y++,u.v=mi(g(u.Da,u),yo(u,u.A)),u.A++,!0)}i.Da=function(){if(this.v=null,er(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var u=4*this.T;this.j.info("BP detection timer enabled: "+u),this.B=mi(g(this.Wa,this),u)}},i.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Wt(10),tr(this),er(this))};function hs(u){u.B!=null&&(h.clearTimeout(u.B),u.B=null)}function er(u){u.g=new Le(u,u.j,"rpc",u.Y),u.u===null&&(u.g.J=u.o),u.g.P=0;var d=oe(u.na);$(d,"RID","rpc"),$(d,"SID",u.M),$(d,"AID",u.K),$(d,"CI",u.F?"0":"1"),!u.F&&u.ia&&$(d,"TO",u.ia),$(d,"TYPE","xmlhttp"),dn(u,d),u.u&&u.o&&Ti(d,u.u,u.o),u.O&&(u.g.H=u.O);var _=u.g;u=u.ba,_.M=1,_.A=At(oe(d)),_.u=null,_.R=!0,on(_,u)}i.Va=function(){this.C!=null&&(this.C=null,tr(this),cs(this),Wt(19))};function nr(u){u.C!=null&&(h.clearTimeout(u.C),u.C=null)}function ye(u,d){var _=null;if(u.g==d){nr(u),hs(u),u.g=null;var v=2}else if(yi(u.h,d))_=d.G,ts(u.h,d),v=1;else return;if(u.I!=0){if(d.o)if(v==1){_=d.u?d.u.length:0,d=Date.now()-d.F;var k=u.D;v=Hi(),Gt(v,new no(v,_)),He(u)}else us(u);else if(k=d.m,k==3||k==0&&d.X>0||!(v==1&&po(u,d)||v==2&&cs(u)))switch(_&&_.length>0&&(d=u.h,d.i=d.i.concat(_)),k){case 1:je(u,5);break;case 4:je(u,10);break;case 3:je(u,6);break;default:je(u,2)}}}function yo(u,d){let _=u.Qa+Math.floor(Math.random()*u.Za);return u.isActive()||(_*=2),_*d}function je(u,d){if(u.j.info("Error code "+d),d==2){var _=g(u.bb,u),v=u.Ua;const k=!v;v=new gt(v||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||Ee(v,"https"),At(v),k?Xi(v.toString(),_):mo(v.toString(),_)}else Wt(2);u.I=0,u.l&&u.l.pa(d),ke(u),de(u)}i.bb=function(u){u?(this.j.info("Successfully pinged google.com"),Wt(2)):(this.j.info("Failed to ping google.com"),Wt(1))};function ke(u){if(u.I=0,u.ja=[],u.l){const d=es(u.h);(d.length!=0||u.i.length!=0)&&(z(u.ja,d),z(u.ja,u.i),u.h.i.length=0,V(u.i),u.i.length=0),u.l.oa()}}function ls(u,d,_){var v=_ instanceof gt?oe(_):new gt(_);if(v.g!="")d&&(v.g=d+"."+v.g),Ie(v,v.u);else{var k=h.location;v=k.protocol,d=d?d+"."+k.hostname:k.hostname,k=+k.port;const N=new gt(null);v&&Ee(N,v),d&&(N.g=d),k&&Ie(N,k),_&&(N.h=_),v=N}return _=u.G,d=u.wa,_&&d&&$(v,_,d),$(v,"VER",u.ka),dn(u,v),v}function ds(u,d,_){if(d&&!u.L)throw Error("Can't create secondary domain capable XhrIo object.");return d=u.Aa&&!u.ma?new vt(new et({ab:_})):new vt(u.ma),d.Fa(u.L),d}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function ir(){}i=ir.prototype,i.ra=function(){},i.qa=function(){},i.pa=function(){},i.oa=function(){},i.isActive=function(){return!0},i.Ka=function(){};function rr(){}rr.prototype.g=function(u,d){return new te(u,d)};function te(u,d){jt.call(this),this.g=new as(d),this.l=u,this.h=d&&d.messageUrlParams||null,u=d&&d.messageHeaders||null,d&&d.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=d&&d.initMessageHeaders||null,d&&d.messageContentType&&(u?u["X-WebChannel-Content-Type"]=d.messageContentType:u={"X-WebChannel-Content-Type":d.messageContentType}),d&&d.sa&&(u?u["X-WebChannel-Client-Profile"]=d.sa:u={"X-WebChannel-Client-Profile":d.sa}),this.g.U=u,(u=d&&d.Qb)&&!P(u)&&(this.g.u=u),this.A=d&&d.supportsCrossDomainXhr||!1,this.v=d&&d.sendRawJson||!1,(d=d&&d.httpSessionIdParam)&&!P(d)&&(this.g.G=d,u=this.h,u!==null&&d in u&&(u=this.h,d in u&&delete u[d])),this.j=new Vn(this)}T(te,jt),te.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},te.prototype.close=function(){ut(this.g)},te.prototype.o=function(u){var d=this.g;if(typeof u=="string"){var _={};_.__data__=u,u=_}else this.v&&(_={},_.__data__=zi(u),u=_);d.i.push(new Ha(d.Ya++,u)),d.I==3&&He(d)},te.prototype.N=function(){this.g.l=null,delete this.j,ut(this.g),delete this.g,te.Z.N.call(this)};function fs(u){fi.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var d=u.__sm__;if(d){t:{for(const _ in d){u=_;break t}u=void 0}(this.i=u)&&(u=this.i,d=d!==null&&u in d?d[u]:void 0),this.data=d}else this.data=u}T(fs,fi);function vo(){qi.call(this),this.status=1}T(vo,qi);function Vn(u){this.g=u}T(Vn,ir),Vn.prototype.ra=function(){Gt(this.g,"a")},Vn.prototype.qa=function(u){Gt(this.g,new fs(u))},Vn.prototype.pa=function(u){Gt(this.g,new vo)},Vn.prototype.oa=function(){Gt(this.g,"b")},rr.prototype.createWebChannel=rr.prototype.g,te.prototype.send=te.prototype.o,te.prototype.open=te.prototype.m,te.prototype.close=te.prototype.close,sd=function(){return new rr},rd=function(){return Hi()},id=sn,mu={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},ji.NO_ERROR=0,ji.TIMEOUT=8,ji.HTTP_ERROR=6,Vo=ji,io.COMPLETE="complete",nd=io,to.EventType=Ln,Ln.OPEN="a",Ln.CLOSE="b",Ln.ERROR="c",Ln.MESSAGE="d",jt.prototype.listen=jt.prototype.J,ws=to,vt.prototype.listenOnce=vt.prototype.K,vt.prototype.getLastError=vt.prototype.Ha,vt.prototype.getLastErrorCode=vt.prototype.ya,vt.prototype.getStatus=vt.prototype.ca,vt.prototype.getResponseJson=vt.prototype.La,vt.prototype.getResponseText=vt.prototype.la,vt.prototype.send=vt.prototype.ea,vt.prototype.setWithCredentials=vt.prototype.Fa,ed=vt}).apply(typeof xo<"u"?xo:typeof self<"u"?self:typeof window<"u"?window:{});const ph="@firebase/firestore",_h="4.9.2";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ne=class{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}};ne.UNAUTHENTICATED=new ne(null),ne.GOOGLE_CREDENTIALS=new ne("google-credentials-uid"),ne.FIRST_PARTY=new ne("first-party-uid"),ne.MOCK_USER=new ne("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vr="12.3.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xi=new Uu("@firebase/firestore");function fr(){return xi.logLevel}function W(i,...t){if(xi.logLevel<=lt.DEBUG){const e=t.map(qu);xi.debug(`Firestore (${Vr}): ${i}`,...e)}}function In(i,...t){if(xi.logLevel<=lt.ERROR){const e=t.map(qu);xi.error(`Firestore (${Vr}): ${i}`,...e)}}function br(i,...t){if(xi.logLevel<=lt.WARN){const e=t.map(qu);xi.warn(`Firestore (${Vr}): ${i}`,...e)}}function qu(i){if(typeof i=="string")return i;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(e){return JSON.stringify(e)}(i)}catch{return i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(i,t,e){let r="Unexpected state";typeof t=="string"?r=t:e=t,od(i,r,e)}function od(i,t,e){let r=`FIRESTORE (${Vr}) INTERNAL ASSERTION FAILED: ${t} (ID: ${i.toString(16)})`;if(e!==void 0)try{r+=" CONTEXT: "+JSON.stringify(e)}catch{r+=" CONTEXT: "+e}throw In(r),new Error(r)}function Tt(i,t,e,r){let o="Unexpected state";typeof e=="string"?o=e:r=e,i||od(t,o,r)}function rt(i,t){return i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class j extends bn{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class eg{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(ne.UNAUTHENTICATED))}shutdown(){}}class ng{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class ig{constructor(t){this.t=t,this.currentUser=ne.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){Tt(this.o===void 0,42304);let r=this.i;const o=p=>this.i!==r?(r=this.i,e(p)):Promise.resolve();let a=new vn;this.o=()=>{this.i++,this.currentUser=this.u(),a.resolve(),a=new vn,t.enqueueRetryable(()=>o(this.currentUser))};const h=()=>{const p=a;t.enqueueRetryable(async()=>{await p.promise,await o(this.currentUser)})},f=p=>{W("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=p,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit(p=>f(p)),setTimeout(()=>{if(!this.auth){const p=this.t.getImmediate({optional:!0});p?f(p):(W("FirebaseAuthCredentialsProvider","Auth not yet detected"),a.resolve(),a=new vn)}},0),h()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(r=>this.i!==t?(W("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Tt(typeof r.accessToken=="string",31837,{l:r}),new ad(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return Tt(t===null||typeof t=="string",2055,{h:t}),new ne(t)}}class rg{constructor(t,e,r){this.P=t,this.T=e,this.I=r,this.type="FirstParty",this.user=ne.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class sg{constructor(t,e,r){this.P=t,this.T=e,this.I=r}getToken(){return Promise.resolve(new rg(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable(()=>e(ne.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class gh{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class og{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ce(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){Tt(this.o===void 0,3512);const r=a=>{a.error!=null&&W("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${a.error.message}`);const h=a.token!==this.m;return this.m=a.token,W("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?e(a.token):Promise.resolve()};this.o=a=>{t.enqueueRetryable(()=>r(a))};const o=a=>{W("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=a,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(a=>o(a)),setTimeout(()=>{if(!this.appCheck){const a=this.V.getImmediate({optional:!0});a?o(a):W("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new gh(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(Tt(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new gh(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ag(i){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(i);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<i;r++)e[r]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hu{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const o=ag(40);for(let a=0;a<o.length;++a)r.length<20&&o[a]<e&&(r+=t.charAt(o[a]%62))}return r}}function dt(i,t){return i<t?-1:i>t?1:0}function pu(i,t){const e=Math.min(i.length,t.length);for(let r=0;r<e;r++){const o=i.charAt(r),a=t.charAt(r);if(o!==a)return eu(o)===eu(a)?dt(o,a):eu(o)?1:-1}return dt(i.length,t.length)}const ug=55296,cg=57343;function eu(i){const t=i.charCodeAt(0);return t>=ug&&t<=cg}function Sr(i,t,e){return i.length===t.length&&i.every((r,o)=>e(r,t[o]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yh="__name__";class $e{constructor(t,e,r){e===void 0?e=0:e>t.length&&X(637,{offset:e,range:t.length}),r===void 0?r=t.length-e:r>t.length-e&&X(1746,{length:r,range:t.length-e}),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return $e.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof $e?t.forEach(r=>{e.push(r)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let o=0;o<r;o++){const a=$e.compareSegments(t.get(o),e.get(o));if(a!==0)return a}return dt(t.length,e.length)}static compareSegments(t,e){const r=$e.isNumericId(t),o=$e.isNumericId(e);return r&&!o?-1:!r&&o?1:r&&o?$e.extractNumericId(t).compare($e.extractNumericId(e)):pu(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Zn.fromString(t.substring(4,t.length-2))}}class It extends $e{construct(t,e,r){return new It(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new j(D.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter(o=>o.length>0))}return new It(e)}static emptyPath(){return new It([])}}const hg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Xt extends $e{construct(t,e,r){return new Xt(t,e,r)}static isValidIdentifier(t){return hg.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Xt.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===yh}static keyField(){return new Xt([yh])}static fromServerFormat(t){const e=[];let r="",o=0;const a=()=>{if(r.length===0)throw new j(D.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let h=!1;for(;o<t.length;){const f=t[o];if(f==="\\"){if(o+1===t.length)throw new j(D.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const p=t[o+1];if(p!=="\\"&&p!=="."&&p!=="`")throw new j(D.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=p,o+=2}else f==="`"?(h=!h,o++):f!=="."||h?(r+=f,o++):(a(),o++)}if(a(),h)throw new j(D.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Xt(e)}static emptyPath(){return new Xt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(t){this.path=t}static fromPath(t){return new K(It.fromString(t))}static fromName(t){return new K(It.fromString(t).popFirst(5))}static empty(){return new K(It.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&It.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return It.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new K(new It(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ud(i,t,e){if(!e)throw new j(D.INVALID_ARGUMENT,`Function ${i}() cannot be called with an empty ${t}.`)}function lg(i,t,e,r){if(t===!0&&r===!0)throw new j(D.INVALID_ARGUMENT,`${i} and ${e} cannot be used together.`)}function vh(i){if(!K.isDocumentKey(i))throw new j(D.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${i} has ${i.length}.`)}function wh(i){if(K.isDocumentKey(i))throw new j(D.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${i} has ${i.length}.`)}function cd(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}function fa(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const t=function(r){return r.constructor?r.constructor.name:null}(i);return t?`a custom ${t} object`:"an object"}}return typeof i=="function"?"a function":X(12329,{type:typeof i})}function en(i,t){if("_delegate"in i&&(i=i._delegate),!(i instanceof t)){if(t.name===i.constructor.name)throw new j(D.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=fa(i);throw new j(D.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return i}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(i,t){const e={typeString:i};return t&&(e.value=t),e}function Us(i,t){if(!cd(i))throw new j(D.INVALID_ARGUMENT,"JSON must be an object");let e;for(const r in t)if(t[r]){const o=t[r].typeString,a="value"in t[r]?{value:t[r].value}:void 0;if(!(r in i)){e=`JSON missing required field: '${r}'`;break}const h=i[r];if(o&&typeof h!==o){e=`JSON field '${r}' must be a ${o}.`;break}if(a!==void 0&&h!==a.value){e=`Expected '${r}' field to equal '${a.value}'`;break}}if(e)throw new j(D.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Th=-62135596800,Eh=1e6;class St{static now(){return St.fromMillis(Date.now())}static fromDate(t){return St.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor((t-1e3*e)*Eh);return new St(e,r)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new j(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new j(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<Th)throw new j(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new j(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Eh}_compareTo(t){return this.seconds===t.seconds?dt(this.nanoseconds,t.nanoseconds):dt(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:St._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(Us(t,St._jsonSchema))return new St(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-Th;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}St._jsonSchemaVersion="firestore/timestamp/1.0",St._jsonSchema={type:Bt("string",St._jsonSchemaVersion),seconds:Bt("number"),nanoseconds:Bt("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{static fromTimestamp(t){return new it(t)}static min(){return new it(new St(0,0))}static max(){return new it(new St(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ls=-1;function dg(i,t){const e=i.toTimestamp().seconds,r=i.toTimestamp().nanoseconds+1,o=it.fromTimestamp(r===1e9?new St(e+1,0):new St(e,r));return new Qn(o,K.empty(),t)}function fg(i){return new Qn(i.readTime,i.key,Ls)}class Qn{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new Qn(it.min(),K.empty(),Ls)}static max(){return new Qn(it.max(),K.empty(),Ls)}}function mg(i,t){let e=i.readTime.compareTo(t.readTime);return e!==0?e:(e=K.comparator(i.documentKey,t.documentKey),e!==0?e:dt(i.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pg="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class _g{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fr(i){if(i.code!==D.FAILED_PRECONDITION||i.message!==pg)throw i;W("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&X(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new F((r,o)=>{this.nextCallback=a=>{this.wrapSuccess(t,a).next(r,o)},this.catchCallback=a=>{this.wrapFailure(e,a).next(r,o)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof F?e:F.resolve(e)}catch(e){return F.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):F.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):F.reject(e)}static resolve(t){return new F((e,r)=>{e(t)})}static reject(t){return new F((e,r)=>{r(t)})}static waitFor(t){return new F((e,r)=>{let o=0,a=0,h=!1;t.forEach(f=>{++o,f.next(()=>{++a,h&&a===o&&e()},p=>r(p))}),h=!0,a===o&&e()})}static or(t){let e=F.resolve(!1);for(const r of t)e=e.next(o=>o?F.resolve(o):r());return e}static forEach(t,e){const r=[];return t.forEach((o,a)=>{r.push(e.call(this,o,a))}),this.waitFor(r)}static mapArray(t,e){return new F((r,o)=>{const a=t.length,h=new Array(a);let f=0;for(let p=0;p<a;p++){const g=p;e(t[g]).next(w=>{h[g]=w,++f,f===a&&r(h)},w=>o(w))}})}static doWhile(t,e){return new F((r,o)=>{const a=()=>{t()===!0?e().next(()=>{a()},o):r()};a()})}}function gg(i){const t=i.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Ur(i){return i.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>e.writeSequenceNumber(r))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}ma.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ju=-1;function pa(i){return i==null}function Ko(i){return i===0&&1/i==-1/0}function yg(i){return typeof i=="number"&&Number.isInteger(i)&&!Ko(i)&&i<=Number.MAX_SAFE_INTEGER&&i>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hd="";function vg(i){let t="";for(let e=0;e<i.length;e++)t.length>0&&(t=Ih(t)),t=wg(i.get(e),t);return Ih(t)}function wg(i,t){let e=t;const r=i.length;for(let o=0;o<r;o++){const a=i.charAt(o);switch(a){case"\0":e+="";break;case hd:e+="";break;default:e+=a}}return e}function Ih(i){return i+hd+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ph(i){let t=0;for(const e in i)Object.prototype.hasOwnProperty.call(i,e)&&t++;return t}function ni(i,t){for(const e in i)Object.prototype.hasOwnProperty.call(i,e)&&t(e,i[e])}function ld(i){for(const t in i)if(Object.prototype.hasOwnProperty.call(i,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(t,e){this.comparator=t,this.root=e||Yt.EMPTY}insert(t,e){return new Lt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,Yt.BLACK,null,null))}remove(t){return new Lt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Yt.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const o=this.comparator(t,r.key);if(o===0)return e+r.left.size;o<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,r)=>(t(e,r),!1))}toString(){const t=[];return this.inorderTraversal((e,r)=>(t.push(`${e}:${r}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new ko(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new ko(this.root,t,this.comparator,!1)}getReverseIterator(){return new ko(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new ko(this.root,t,this.comparator,!0)}}class ko{constructor(t,e,r,o){this.isReverse=o,this.nodeStack=[];let a=1;for(;!t.isEmpty();)if(a=e?r(t.key,e):1,e&&o&&(a*=-1),a<0)t=this.isReverse?t.left:t.right;else{if(a===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Yt{constructor(t,e,r,o,a){this.key=t,this.value=e,this.color=r??Yt.RED,this.left=o??Yt.EMPTY,this.right=a??Yt.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,o,a){return new Yt(t??this.key,e??this.value,r??this.color,o??this.left,a??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let o=this;const a=r(t,o.key);return o=a<0?o.copy(null,null,null,o.left.insert(t,e,r),null):a===0?o.copy(null,e,null,null,null):o.copy(null,null,null,null,o.right.insert(t,e,r)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Yt.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,o=this;if(e(t,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(t,e),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),e(t,o.key)===0){if(o.right.isEmpty())return Yt.EMPTY;r=o.right.min(),o=o.copy(r.key,r.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(t,e))}return o.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Yt.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Yt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw X(43730,{key:this.key,value:this.value});if(this.right.isRed())throw X(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw X(27949);return t+(this.isRed()?0:1)}}Yt.EMPTY=null,Yt.RED=!0,Yt.BLACK=!1;Yt.EMPTY=new class{constructor(){this.size=0}get key(){throw X(57766)}get value(){throw X(16141)}get color(){throw X(16727)}get left(){throw X(29726)}get right(){throw X(36894)}copy(t,e,r,o,a){return this}insert(t,e,r){return new Yt(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(t){this.comparator=t,this.data=new Lt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,r)=>(t(e),!1))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const o=r.getNext();if(this.comparator(o.key,t[1])>=0)return;e(o.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Ah(this.data.getIterator())}getIteratorFrom(t){return new Ah(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(r=>{e=e.add(r)}),e}isEqual(t){if(!(t instanceof qt)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const o=e.getNext().key,a=r.getNext().key;if(this.comparator(o,a)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new qt(this.comparator);return e.data=t,e}}class Ah{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{constructor(t){this.fields=t,t.sort(Xt.comparator)}static empty(){return new ve([])}unionWith(t){let e=new qt(Xt.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new ve(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Sr(this.fields,t.fields,(e,r)=>e.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(o){try{return atob(o)}catch(a){throw typeof DOMException<"u"&&a instanceof DOMException?new dd("Invalid base64 string: "+a):a}}(t);return new Jt(e)}static fromUint8Array(t){const e=function(o){let a="";for(let h=0;h<o.length;++h)a+=String.fromCharCode(o[h]);return a}(t);return new Jt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const r=new Uint8Array(e.length);for(let o=0;o<e.length;o++)r[o]=e.charCodeAt(o);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return dt(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Jt.EMPTY_BYTE_STRING=new Jt("");const Tg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Yn(i){if(Tt(!!i,39018),typeof i=="string"){let t=0;const e=Tg.exec(i);if(Tt(!!e,46558,{timestamp:i}),e[1]){let o=e[1];o=(o+"000000000").substr(0,9),t=Number(o)}const r=new Date(i);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:Nt(i.seconds),nanos:Nt(i.nanos)}}function Nt(i){return typeof i=="number"?i:typeof i=="string"?Number(i):0}function Xn(i){return typeof i=="string"?Jt.fromBase64String(i):Jt.fromUint8Array(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fd="server_timestamp",md="__type__",pd="__previous_value__",_d="__local_write_time__";function _a(i){var e,r;return((r=(((e=i==null?void 0:i.mapValue)==null?void 0:e.fields)||{})[md])==null?void 0:r.stringValue)===fd}function ga(i){const t=i.mapValue.fields[pd];return _a(t)?ga(t):t}function xs(i){const t=Yn(i.mapValue.fields[_d].timestampValue);return new St(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eg{constructor(t,e,r,o,a,h,f,p,g,w){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=o,this.ssl=a,this.forceLongPolling=h,this.autoDetectLongPolling=f,this.longPollingOptions=p,this.useFetchStreams=g,this.isUsingEmulator=w}}const Qo="(default)";class ks{constructor(t,e){this.projectId=t,this.database=e||Qo}static empty(){return new ks("","")}get isDefaultDatabase(){return this.database===Qo}isEqual(t){return t instanceof ks&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gd="__type__",Ig="__max__",Mo={mapValue:{}},yd="__vector__",Yo="value";function Jn(i){return"nullValue"in i?0:"booleanValue"in i?1:"integerValue"in i||"doubleValue"in i?2:"timestampValue"in i?3:"stringValue"in i?5:"bytesValue"in i?6:"referenceValue"in i?7:"geoPointValue"in i?8:"arrayValue"in i?9:"mapValue"in i?_a(i)?4:Ag(i)?9007199254740991:Pg(i)?10:11:X(28295,{value:i})}function nn(i,t){if(i===t)return!0;const e=Jn(i);if(e!==Jn(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return i.booleanValue===t.booleanValue;case 4:return xs(i).isEqual(xs(t));case 3:return function(o,a){if(typeof o.timestampValue=="string"&&typeof a.timestampValue=="string"&&o.timestampValue.length===a.timestampValue.length)return o.timestampValue===a.timestampValue;const h=Yn(o.timestampValue),f=Yn(a.timestampValue);return h.seconds===f.seconds&&h.nanos===f.nanos}(i,t);case 5:return i.stringValue===t.stringValue;case 6:return function(o,a){return Xn(o.bytesValue).isEqual(Xn(a.bytesValue))}(i,t);case 7:return i.referenceValue===t.referenceValue;case 8:return function(o,a){return Nt(o.geoPointValue.latitude)===Nt(a.geoPointValue.latitude)&&Nt(o.geoPointValue.longitude)===Nt(a.geoPointValue.longitude)}(i,t);case 2:return function(o,a){if("integerValue"in o&&"integerValue"in a)return Nt(o.integerValue)===Nt(a.integerValue);if("doubleValue"in o&&"doubleValue"in a){const h=Nt(o.doubleValue),f=Nt(a.doubleValue);return h===f?Ko(h)===Ko(f):isNaN(h)&&isNaN(f)}return!1}(i,t);case 9:return Sr(i.arrayValue.values||[],t.arrayValue.values||[],nn);case 10:case 11:return function(o,a){const h=o.mapValue.fields||{},f=a.mapValue.fields||{};if(Ph(h)!==Ph(f))return!1;for(const p in h)if(h.hasOwnProperty(p)&&(f[p]===void 0||!nn(h[p],f[p])))return!1;return!0}(i,t);default:return X(52216,{left:i})}}function Ms(i,t){return(i.values||[]).find(e=>nn(e,t))!==void 0}function Cr(i,t){if(i===t)return 0;const e=Jn(i),r=Jn(t);if(e!==r)return dt(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return dt(i.booleanValue,t.booleanValue);case 2:return function(a,h){const f=Nt(a.integerValue||a.doubleValue),p=Nt(h.integerValue||h.doubleValue);return f<p?-1:f>p?1:f===p?0:isNaN(f)?isNaN(p)?0:-1:1}(i,t);case 3:return bh(i.timestampValue,t.timestampValue);case 4:return bh(xs(i),xs(t));case 5:return pu(i.stringValue,t.stringValue);case 6:return function(a,h){const f=Xn(a),p=Xn(h);return f.compareTo(p)}(i.bytesValue,t.bytesValue);case 7:return function(a,h){const f=a.split("/"),p=h.split("/");for(let g=0;g<f.length&&g<p.length;g++){const w=dt(f[g],p[g]);if(w!==0)return w}return dt(f.length,p.length)}(i.referenceValue,t.referenceValue);case 8:return function(a,h){const f=dt(Nt(a.latitude),Nt(h.latitude));return f!==0?f:dt(Nt(a.longitude),Nt(h.longitude))}(i.geoPointValue,t.geoPointValue);case 9:return Sh(i.arrayValue,t.arrayValue);case 10:return function(a,h){var b,V,z,B;const f=a.fields||{},p=h.fields||{},g=(b=f[Yo])==null?void 0:b.arrayValue,w=(V=p[Yo])==null?void 0:V.arrayValue,T=dt(((z=g==null?void 0:g.values)==null?void 0:z.length)||0,((B=w==null?void 0:w.values)==null?void 0:B.length)||0);return T!==0?T:Sh(g,w)}(i.mapValue,t.mapValue);case 11:return function(a,h){if(a===Mo.mapValue&&h===Mo.mapValue)return 0;if(a===Mo.mapValue)return 1;if(h===Mo.mapValue)return-1;const f=a.fields||{},p=Object.keys(f),g=h.fields||{},w=Object.keys(g);p.sort(),w.sort();for(let T=0;T<p.length&&T<w.length;++T){const b=pu(p[T],w[T]);if(b!==0)return b;const V=Cr(f[p[T]],g[w[T]]);if(V!==0)return V}return dt(p.length,w.length)}(i.mapValue,t.mapValue);default:throw X(23264,{he:e})}}function bh(i,t){if(typeof i=="string"&&typeof t=="string"&&i.length===t.length)return dt(i,t);const e=Yn(i),r=Yn(t),o=dt(e.seconds,r.seconds);return o!==0?o:dt(e.nanos,r.nanos)}function Sh(i,t){const e=i.values||[],r=t.values||[];for(let o=0;o<e.length&&o<r.length;++o){const a=Cr(e[o],r[o]);if(a)return a}return dt(e.length,r.length)}function Rr(i){return _u(i)}function _u(i){return"nullValue"in i?"null":"booleanValue"in i?""+i.booleanValue:"integerValue"in i?""+i.integerValue:"doubleValue"in i?""+i.doubleValue:"timestampValue"in i?function(e){const r=Yn(e);return`time(${r.seconds},${r.nanos})`}(i.timestampValue):"stringValue"in i?i.stringValue:"bytesValue"in i?function(e){return Xn(e).toBase64()}(i.bytesValue):"referenceValue"in i?function(e){return K.fromName(e).toString()}(i.referenceValue):"geoPointValue"in i?function(e){return`geo(${e.latitude},${e.longitude})`}(i.geoPointValue):"arrayValue"in i?function(e){let r="[",o=!0;for(const a of e.values||[])o?o=!1:r+=",",r+=_u(a);return r+"]"}(i.arrayValue):"mapValue"in i?function(e){const r=Object.keys(e.fields||{}).sort();let o="{",a=!0;for(const h of r)a?a=!1:o+=",",o+=`${h}:${_u(e.fields[h])}`;return o+"}"}(i.mapValue):X(61005,{value:i})}function Fo(i){switch(Jn(i)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=ga(i);return t?16+Fo(t):16;case 5:return 2*i.stringValue.length;case 6:return Xn(i.bytesValue).approximateByteSize();case 7:return i.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((o,a)=>o+Fo(a),0)}(i.arrayValue);case 10:case 11:return function(r){let o=0;return ni(r.fields,(a,h)=>{o+=a.length+Fo(h)}),o}(i.mapValue);default:throw X(13486,{value:i})}}function Xo(i,t){return{referenceValue:`projects/${i.projectId}/databases/${i.database}/documents/${t.path.canonicalString()}`}}function gu(i){return!!i&&"integerValue"in i}function Gu(i){return!!i&&"arrayValue"in i}function Ch(i){return!!i&&"nullValue"in i}function Rh(i){return!!i&&"doubleValue"in i&&isNaN(Number(i.doubleValue))}function Uo(i){return!!i&&"mapValue"in i}function Pg(i){var e,r;return((r=(((e=i==null?void 0:i.mapValue)==null?void 0:e.fields)||{})[gd])==null?void 0:r.stringValue)===yd}function As(i){if(i.geoPointValue)return{geoPointValue:{...i.geoPointValue}};if(i.timestampValue&&typeof i.timestampValue=="object")return{timestampValue:{...i.timestampValue}};if(i.mapValue){const t={mapValue:{fields:{}}};return ni(i.mapValue.fields,(e,r)=>t.mapValue.fields[e]=As(r)),t}if(i.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(i.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=As(i.arrayValue.values[e]);return t}return{...i}}function Ag(i){return(((i.mapValue||{}).fields||{}).__type__||{}).stringValue===Ig}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(t){this.value=t}static empty(){return new pe({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!Uo(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=As(e)}setAll(t){let e=Xt.emptyPath(),r={},o=[];t.forEach((h,f)=>{if(!e.isImmediateParentOf(f)){const p=this.getFieldsMap(e);this.applyChanges(p,r,o),r={},o=[],e=f.popLast()}h?r[f.lastSegment()]=As(h):o.push(f.lastSegment())});const a=this.getFieldsMap(e);this.applyChanges(a,r,o)}delete(t){const e=this.field(t.popLast());Uo(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return nn(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let o=e.mapValue.fields[t.get(r)];Uo(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=o),e=o}return e.mapValue.fields}applyChanges(t,e,r){ni(e,(o,a)=>t[o]=a);for(const o of r)delete t[o]}clone(){return new pe(As(this.value))}}function vd(i){const t=[];return ni(i.fields,(e,r)=>{const o=new Xt([e]);if(Uo(r)){const a=vd(r.mapValue).fields;if(a.length===0)t.push(o);else for(const h of a)t.push(o.child(h))}else t.push(o)}),new ve(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(t,e,r,o,a,h,f){this.key=t,this.documentType=e,this.version=r,this.readTime=o,this.createTime=a,this.data=h,this.documentState=f}static newInvalidDocument(t){return new ie(t,0,it.min(),it.min(),it.min(),pe.empty(),0)}static newFoundDocument(t,e,r,o){return new ie(t,1,e,it.min(),r,o,0)}static newNoDocument(t,e){return new ie(t,2,e,it.min(),it.min(),pe.empty(),0)}static newUnknownDocument(t,e){return new ie(t,3,e,it.min(),it.min(),pe.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(it.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=pe.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=pe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=it.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof ie&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new ie(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(t,e){this.position=t,this.inclusive=e}}function Lh(i,t,e){let r=0;for(let o=0;o<i.position.length;o++){const a=t[o],h=i.position[o];if(a.field.isKeyField()?r=K.comparator(K.fromName(h.referenceValue),e.key):r=Cr(h,e.data.field(a.field)),a.dir==="desc"&&(r*=-1),r!==0)break}return r}function xh(i,t){if(i===null)return t===null;if(t===null||i.inclusive!==t.inclusive||i.position.length!==t.position.length)return!1;for(let e=0;e<i.position.length;e++)if(!nn(i.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(t,e="asc"){this.field=t,this.dir=e}}function bg(i,t){return i.dir===t.dir&&i.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{}class Ut extends wd{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new Cg(t,e,r):e==="array-contains"?new xg(t,r):e==="in"?new kg(t,r):e==="not-in"?new Mg(t,r):e==="array-contains-any"?new Ng(t,r):new Ut(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new Rg(t,r):new Lg(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(Cr(e,this.value)):e!==null&&Jn(this.value)===Jn(e)&&this.matchesComparison(Cr(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return X(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ve extends wd{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new Ve(t,e)}matches(t){return Td(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Td(i){return i.op==="and"}function Ed(i){return Sg(i)&&Td(i)}function Sg(i){for(const t of i.filters)if(t instanceof Ve)return!1;return!0}function yu(i){if(i instanceof Ut)return i.field.canonicalString()+i.op.toString()+Rr(i.value);if(Ed(i))return i.filters.map(t=>yu(t)).join(",");{const t=i.filters.map(e=>yu(e)).join(",");return`${i.op}(${t})`}}function Id(i,t){return i instanceof Ut?function(r,o){return o instanceof Ut&&r.op===o.op&&r.field.isEqual(o.field)&&nn(r.value,o.value)}(i,t):i instanceof Ve?function(r,o){return o instanceof Ve&&r.op===o.op&&r.filters.length===o.filters.length?r.filters.reduce((a,h,f)=>a&&Id(h,o.filters[f]),!0):!1}(i,t):void X(19439)}function Pd(i){return i instanceof Ut?function(e){return`${e.field.canonicalString()} ${e.op} ${Rr(e.value)}`}(i):i instanceof Ve?function(e){return e.op.toString()+" {"+e.getFilters().map(Pd).join(" ,")+"}"}(i):"Filter"}class Cg extends Ut{constructor(t,e,r){super(t,e,r),this.key=K.fromName(r.referenceValue)}matches(t){const e=K.comparator(t.key,this.key);return this.matchesComparison(e)}}class Rg extends Ut{constructor(t,e){super(t,"in",e),this.keys=Ad("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class Lg extends Ut{constructor(t,e){super(t,"not-in",e),this.keys=Ad("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function Ad(i,t){var e;return(((e=t.arrayValue)==null?void 0:e.values)||[]).map(r=>K.fromName(r.referenceValue))}class xg extends Ut{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return Gu(e)&&Ms(e.arrayValue,this.value)}}class kg extends Ut{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Ms(this.value.arrayValue,e)}}class Mg extends Ut{constructor(t,e){super(t,"not-in",e)}matches(t){if(Ms(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!Ms(this.value.arrayValue,e)}}class Ng extends Ut{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!Gu(e)||!e.arrayValue.values)&&e.arrayValue.values.some(r=>Ms(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Og{constructor(t,e=null,r=[],o=[],a=null,h=null,f=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=o,this.limit=a,this.startAt=h,this.endAt=f,this.Te=null}}function kh(i,t=null,e=[],r=[],o=null,a=null,h=null){return new Og(i,t,e,r,o,a,h)}function Wu(i){const t=rt(i);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(r=>yu(r)).join(","),e+="|ob:",e+=t.orderBy.map(r=>function(a){return a.field.canonicalString()+a.dir}(r)).join(","),pa(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(r=>Rr(r)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(r=>Rr(r)).join(",")),t.Te=e}return t.Te}function $u(i,t){if(i.limit!==t.limit||i.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<i.orderBy.length;e++)if(!bg(i.orderBy[e],t.orderBy[e]))return!1;if(i.filters.length!==t.filters.length)return!1;for(let e=0;e<i.filters.length;e++)if(!Id(i.filters[e],t.filters[e]))return!1;return i.collectionGroup===t.collectionGroup&&!!i.path.isEqual(t.path)&&!!xh(i.startAt,t.startAt)&&xh(i.endAt,t.endAt)}function vu(i){return K.isDocumentKey(i.path)&&i.collectionGroup===null&&i.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ii{constructor(t,e=null,r=[],o=[],a=null,h="F",f=null,p=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=o,this.limit=a,this.limitType=h,this.startAt=f,this.endAt=p,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Dg(i,t,e,r,o,a,h,f){return new ii(i,t,e,r,o,a,h,f)}function Zu(i){return new ii(i)}function Mh(i){return i.filters.length===0&&i.limit===null&&i.startAt==null&&i.endAt==null&&(i.explicitOrderBy.length===0||i.explicitOrderBy.length===1&&i.explicitOrderBy[0].field.isKeyField())}function Ku(i){return i.collectionGroup!==null}function vr(i){const t=rt(i);if(t.Ie===null){t.Ie=[];const e=new Set;for(const a of t.explicitOrderBy)t.Ie.push(a),e.add(a.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(h){let f=new qt(Xt.comparator);return h.filters.forEach(p=>{p.getFlattenedFilters().forEach(g=>{g.isInequality()&&(f=f.add(g.field))})}),f})(t).forEach(a=>{e.has(a.canonicalString())||a.isKeyField()||t.Ie.push(new Ns(a,r))}),e.has(Xt.keyField().canonicalString())||t.Ie.push(new Ns(Xt.keyField(),r))}return t.Ie}function Ke(i){const t=rt(i);return t.Ee||(t.Ee=Vg(t,vr(i))),t.Ee}function Vg(i,t){if(i.limitType==="F")return kh(i.path,i.collectionGroup,t,i.filters,i.limit,i.startAt,i.endAt);{t=t.map(o=>{const a=o.dir==="desc"?"asc":"desc";return new Ns(o.field,a)});const e=i.endAt?new Lr(i.endAt.position,i.endAt.inclusive):null,r=i.startAt?new Lr(i.startAt.position,i.startAt.inclusive):null;return kh(i.path,i.collectionGroup,t,i.filters,i.limit,e,r)}}function wu(i,t){const e=i.filters.concat([t]);return new ii(i.path,i.collectionGroup,i.explicitOrderBy.slice(),e,i.limit,i.limitType,i.startAt,i.endAt)}function Tu(i,t,e){return new ii(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),t,e,i.startAt,i.endAt)}function ya(i,t){return $u(Ke(i),Ke(t))&&i.limitType===t.limitType}function bd(i){return`${Wu(Ke(i))}|lt:${i.limitType}`}function mr(i){return`Query(target=${function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map(o=>Pd(o)).join(", ")}]`),pa(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map(o=>function(h){return`${h.field.canonicalString()} (${h.dir})`}(o)).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map(o=>Rr(o)).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map(o=>Rr(o)).join(",")),`Target(${r})`}(Ke(i))}; limitType=${i.limitType})`}function va(i,t){return t.isFoundDocument()&&function(r,o){const a=o.key.path;return r.collectionGroup!==null?o.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(a):K.isDocumentKey(r.path)?r.path.isEqual(a):r.path.isImmediateParentOf(a)}(i,t)&&function(r,o){for(const a of vr(r))if(!a.field.isKeyField()&&o.data.field(a.field)===null)return!1;return!0}(i,t)&&function(r,o){for(const a of r.filters)if(!a.matches(o))return!1;return!0}(i,t)&&function(r,o){return!(r.startAt&&!function(h,f,p){const g=Lh(h,f,p);return h.inclusive?g<=0:g<0}(r.startAt,vr(r),o)||r.endAt&&!function(h,f,p){const g=Lh(h,f,p);return h.inclusive?g>=0:g>0}(r.endAt,vr(r),o))}(i,t)}function Fg(i){return i.collectionGroup||(i.path.length%2==1?i.path.lastSegment():i.path.get(i.path.length-2))}function Sd(i){return(t,e)=>{let r=!1;for(const o of vr(i)){const a=Ug(o,t,e);if(a!==0)return a;r=r||o.field.isKeyField()}return 0}}function Ug(i,t,e){const r=i.field.isKeyField()?K.comparator(t.key,e.key):function(a,h,f){const p=h.data.field(a),g=f.data.field(a);return p!==null&&g!==null?Cr(p,g):X(42886)}(i.field,t,e);switch(i.dir){case"asc":return r;case"desc":return-1*r;default:return X(19790,{direction:i.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[o,a]of r)if(this.equalsFn(o,t))return a}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),o=this.inner[r];if(o===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let a=0;a<o.length;a++)if(this.equalsFn(o[a][0],t))return void(o[a]=[t,e]);o.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let o=0;o<r.length;o++)if(this.equalsFn(r[o][0],t))return r.length===1?delete this.inner[e]:r.splice(o,1),this.innerSize--,!0;return!1}forEach(t){ni(this.inner,(e,r)=>{for(const[o,a]of r)t(o,a)})}isEmpty(){return ld(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bg=new Lt(K.comparator);function Pn(){return Bg}const Cd=new Lt(K.comparator);function Ts(...i){let t=Cd;for(const e of i)t=t.insert(e.key,e);return t}function Rd(i){let t=Cd;return i.forEach((e,r)=>t=t.insert(e,r.overlayedDocument)),t}function Si(){return bs()}function Ld(){return bs()}function bs(){return new Oi(i=>i.toString(),(i,t)=>i.isEqual(t))}const zg=new Lt(K.comparator),qg=new qt(K.comparator);function ft(...i){let t=qg;for(const e of i)t=t.add(e);return t}const Hg=new qt(dt);function jg(){return Hg}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qu(i,t){if(i.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ko(t)?"-0":t}}function xd(i){return{integerValue:""+i}}function Gg(i,t){return yg(t)?xd(t):Qu(i,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa{constructor(){this._=void 0}}function Wg(i,t,e){return i instanceof Jo?function(o,a){const h={fields:{[md]:{stringValue:fd},[_d]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return a&&_a(a)&&(a=ga(a)),a&&(h.fields[pd]=a),{mapValue:h}}(e,t):i instanceof xr?Md(i,t):i instanceof kr?Nd(i,t):function(o,a){const h=kd(o,a),f=Nh(h)+Nh(o.Ae);return gu(h)&&gu(o.Ae)?xd(f):Qu(o.serializer,f)}(i,t)}function $g(i,t,e){return i instanceof xr?Md(i,t):i instanceof kr?Nd(i,t):e}function kd(i,t){return i instanceof ta?function(r){return gu(r)||function(a){return!!a&&"doubleValue"in a}(r)}(t)?t:{integerValue:0}:null}class Jo extends wa{}class xr extends wa{constructor(t){super(),this.elements=t}}function Md(i,t){const e=Od(t);for(const r of i.elements)e.some(o=>nn(o,r))||e.push(r);return{arrayValue:{values:e}}}class kr extends wa{constructor(t){super(),this.elements=t}}function Nd(i,t){let e=Od(t);for(const r of i.elements)e=e.filter(o=>!nn(o,r));return{arrayValue:{values:e}}}class ta extends wa{constructor(t,e){super(),this.serializer=t,this.Ae=e}}function Nh(i){return Nt(i.integerValue||i.doubleValue)}function Od(i){return Gu(i)&&i.arrayValue.values?i.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd{constructor(t,e){this.field=t,this.transform=e}}function Zg(i,t){return i.field.isEqual(t.field)&&function(r,o){return r instanceof xr&&o instanceof xr||r instanceof kr&&o instanceof kr?Sr(r.elements,o.elements,nn):r instanceof ta&&o instanceof ta?nn(r.Ae,o.Ae):r instanceof Jo&&o instanceof Jo}(i.transform,t.transform)}class Kg{constructor(t,e){this.version=t,this.transformResults=e}}class De{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new De}static exists(t){return new De(void 0,t)}static updateTime(t){return new De(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Bo(i,t){return i.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(i.updateTime):i.exists===void 0||i.exists===t.isFoundDocument()}class Ta{}function Vd(i,t){if(!i.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return i.isNoDocument()?new Ud(i.key,De.none()):new Bs(i.key,i.data,De.none());{const e=i.data,r=pe.empty();let o=new qt(Xt.comparator);for(let a of t.fields)if(!o.has(a)){let h=e.field(a);h===null&&a.length>1&&(a=a.popLast(),h=e.field(a)),h===null?r.delete(a):r.set(a,h),o=o.add(a)}return new ri(i.key,r,new ve(o.toArray()),De.none())}}function Qg(i,t,e){i instanceof Bs?function(o,a,h){const f=o.value.clone(),p=Dh(o.fieldTransforms,a,h.transformResults);f.setAll(p),a.convertToFoundDocument(h.version,f).setHasCommittedMutations()}(i,t,e):i instanceof ri?function(o,a,h){if(!Bo(o.precondition,a))return void a.convertToUnknownDocument(h.version);const f=Dh(o.fieldTransforms,a,h.transformResults),p=a.data;p.setAll(Fd(o)),p.setAll(f),a.convertToFoundDocument(h.version,p).setHasCommittedMutations()}(i,t,e):function(o,a,h){a.convertToNoDocument(h.version).setHasCommittedMutations()}(0,t,e)}function Ss(i,t,e,r){return i instanceof Bs?function(a,h,f,p){if(!Bo(a.precondition,h))return f;const g=a.value.clone(),w=Vh(a.fieldTransforms,p,h);return g.setAll(w),h.convertToFoundDocument(h.version,g).setHasLocalMutations(),null}(i,t,e,r):i instanceof ri?function(a,h,f,p){if(!Bo(a.precondition,h))return f;const g=Vh(a.fieldTransforms,p,h),w=h.data;return w.setAll(Fd(a)),w.setAll(g),h.convertToFoundDocument(h.version,w).setHasLocalMutations(),f===null?null:f.unionWith(a.fieldMask.fields).unionWith(a.fieldTransforms.map(T=>T.field))}(i,t,e,r):function(a,h,f){return Bo(a.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):f}(i,t,e)}function Yg(i,t){let e=null;for(const r of i.fieldTransforms){const o=t.data.field(r.field),a=kd(r.transform,o||null);a!=null&&(e===null&&(e=pe.empty()),e.set(r.field,a))}return e||null}function Oh(i,t){return i.type===t.type&&!!i.key.isEqual(t.key)&&!!i.precondition.isEqual(t.precondition)&&!!function(r,o){return r===void 0&&o===void 0||!(!r||!o)&&Sr(r,o,(a,h)=>Zg(a,h))}(i.fieldTransforms,t.fieldTransforms)&&(i.type===0?i.value.isEqual(t.value):i.type!==1||i.data.isEqual(t.data)&&i.fieldMask.isEqual(t.fieldMask))}class Bs extends Ta{constructor(t,e,r,o=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class ri extends Ta{constructor(t,e,r,o,a=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=o,this.fieldTransforms=a,this.type=1}getFieldMask(){return this.fieldMask}}function Fd(i){const t=new Map;return i.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const r=i.data.field(e);t.set(e,r)}}),t}function Dh(i,t,e){const r=new Map;Tt(i.length===e.length,32656,{Re:e.length,Ve:i.length});for(let o=0;o<e.length;o++){const a=i[o],h=a.transform,f=t.data.field(a.field);r.set(a.field,$g(h,f,e[o]))}return r}function Vh(i,t,e){const r=new Map;for(const o of i){const a=o.transform,h=e.data.field(o.field);r.set(o.field,Wg(a,h,t))}return r}class Ud extends Ta{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Xg extends Ta{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jg{constructor(t,e,r,o){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=o}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let o=0;o<this.mutations.length;o++){const a=this.mutations[o];a.key.isEqual(t.key)&&Qg(a,t,r[o])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=Ss(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=Ss(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=Ld();return this.mutations.forEach(o=>{const a=t.get(o.key),h=a.overlayedDocument;let f=this.applyToLocalView(h,a.mutatedFields);f=e.has(o.key)?null:f;const p=Vd(h,f);p!==null&&r.set(o.key,p),h.isValidDocument()||h.convertToNoDocument(it.min())}),r}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),ft())}isEqual(t){return this.batchId===t.batchId&&Sr(this.mutations,t.mutations,(e,r)=>Oh(e,r))&&Sr(this.baseMutations,t.baseMutations,(e,r)=>Oh(e,r))}}class Yu{constructor(t,e,r,o){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=o}static from(t,e,r){Tt(t.mutations.length===r.length,58842,{me:t.mutations.length,fe:r.length});let o=function(){return zg}();const a=t.mutations;for(let h=0;h<a.length;h++)o=o.insert(a[h].key,r[h].version);return new Yu(t,e,r,o)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ty{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ey{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ft,pt;function ny(i){switch(i){case D.OK:return X(64938);case D.CANCELLED:case D.UNKNOWN:case D.DEADLINE_EXCEEDED:case D.RESOURCE_EXHAUSTED:case D.INTERNAL:case D.UNAVAILABLE:case D.UNAUTHENTICATED:return!1;case D.INVALID_ARGUMENT:case D.NOT_FOUND:case D.ALREADY_EXISTS:case D.PERMISSION_DENIED:case D.FAILED_PRECONDITION:case D.ABORTED:case D.OUT_OF_RANGE:case D.UNIMPLEMENTED:case D.DATA_LOSS:return!0;default:return X(15467,{code:i})}}function Bd(i){if(i===void 0)return In("GRPC error has no .code"),D.UNKNOWN;switch(i){case Ft.OK:return D.OK;case Ft.CANCELLED:return D.CANCELLED;case Ft.UNKNOWN:return D.UNKNOWN;case Ft.DEADLINE_EXCEEDED:return D.DEADLINE_EXCEEDED;case Ft.RESOURCE_EXHAUSTED:return D.RESOURCE_EXHAUSTED;case Ft.INTERNAL:return D.INTERNAL;case Ft.UNAVAILABLE:return D.UNAVAILABLE;case Ft.UNAUTHENTICATED:return D.UNAUTHENTICATED;case Ft.INVALID_ARGUMENT:return D.INVALID_ARGUMENT;case Ft.NOT_FOUND:return D.NOT_FOUND;case Ft.ALREADY_EXISTS:return D.ALREADY_EXISTS;case Ft.PERMISSION_DENIED:return D.PERMISSION_DENIED;case Ft.FAILED_PRECONDITION:return D.FAILED_PRECONDITION;case Ft.ABORTED:return D.ABORTED;case Ft.OUT_OF_RANGE:return D.OUT_OF_RANGE;case Ft.UNIMPLEMENTED:return D.UNIMPLEMENTED;case Ft.DATA_LOSS:return D.DATA_LOSS;default:return X(39323,{code:i})}}(pt=Ft||(Ft={}))[pt.OK=0]="OK",pt[pt.CANCELLED=1]="CANCELLED",pt[pt.UNKNOWN=2]="UNKNOWN",pt[pt.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",pt[pt.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",pt[pt.NOT_FOUND=5]="NOT_FOUND",pt[pt.ALREADY_EXISTS=6]="ALREADY_EXISTS",pt[pt.PERMISSION_DENIED=7]="PERMISSION_DENIED",pt[pt.UNAUTHENTICATED=16]="UNAUTHENTICATED",pt[pt.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",pt[pt.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",pt[pt.ABORTED=10]="ABORTED",pt[pt.OUT_OF_RANGE=11]="OUT_OF_RANGE",pt[pt.UNIMPLEMENTED=12]="UNIMPLEMENTED",pt[pt.INTERNAL=13]="INTERNAL",pt[pt.UNAVAILABLE=14]="UNAVAILABLE",pt[pt.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iy(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ry=new Zn([4294967295,4294967295],0);function Fh(i){const t=iy().encode(i),e=new td;return e.update(t),new Uint8Array(e.digest())}function Uh(i){const t=new DataView(i.buffer),e=t.getUint32(0,!0),r=t.getUint32(4,!0),o=t.getUint32(8,!0),a=t.getUint32(12,!0);return[new Zn([e,r],0),new Zn([o,a],0)]}class Xu{constructor(t,e,r){if(this.bitmap=t,this.padding=e,this.hashCount=r,e<0||e>=8)throw new Es(`Invalid padding: ${e}`);if(r<0)throw new Es(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new Es(`Invalid hash count: ${r}`);if(t.length===0&&e!==0)throw new Es(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.pe=Zn.fromNumber(this.ge)}ye(t,e,r){let o=t.add(e.multiply(Zn.fromNumber(r)));return o.compare(ry)===1&&(o=new Zn([o.getBits(0),o.getBits(1)],0)),o.modulo(this.pe).toNumber()}we(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=Fh(t),[r,o]=Uh(e);for(let a=0;a<this.hashCount;a++){const h=this.ye(r,o,a);if(!this.we(h))return!1}return!0}static create(t,e,r){const o=t%8==0?0:8-t%8,a=new Uint8Array(Math.ceil(t/8)),h=new Xu(a,o,e);return r.forEach(f=>h.insert(f)),h}insert(t){if(this.ge===0)return;const e=Fh(t),[r,o]=Uh(e);for(let a=0;a<this.hashCount;a++){const h=this.ye(r,o,a);this.Se(h)}}Se(t){const e=Math.floor(t/8),r=t%8;this.bitmap[e]|=1<<r}}class Es extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ea{constructor(t,e,r,o,a){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=r,this.documentUpdates=o,this.resolvedLimboDocuments=a}static createSynthesizedRemoteEventForCurrentChange(t,e,r){const o=new Map;return o.set(t,zs.createSynthesizedTargetChangeForCurrentChange(t,e,r)),new Ea(it.min(),o,new Lt(dt),Pn(),ft())}}class zs{constructor(t,e,r,o,a){this.resumeToken=t,this.current=e,this.addedDocuments=r,this.modifiedDocuments=o,this.removedDocuments=a}static createSynthesizedTargetChangeForCurrentChange(t,e,r){return new zs(r,e,ft(),ft(),ft())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(t,e,r,o){this.be=t,this.removedTargetIds=e,this.key=r,this.De=o}}class zd{constructor(t,e){this.targetId=t,this.Ce=e}}class qd{constructor(t,e,r=Jt.EMPTY_BYTE_STRING,o=null){this.state=t,this.targetIds=e,this.resumeToken=r,this.cause=o}}class Bh{constructor(){this.ve=0,this.Fe=zh(),this.Me=Jt.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(t){t.approximateByteSize()>0&&(this.Oe=!0,this.Me=t)}ke(){let t=ft(),e=ft(),r=ft();return this.Fe.forEach((o,a)=>{switch(a){case 0:t=t.add(o);break;case 2:e=e.add(o);break;case 1:r=r.add(o);break;default:X(38017,{changeType:a})}}),new zs(this.Me,this.xe,t,e,r)}qe(){this.Oe=!1,this.Fe=zh()}Qe(t,e){this.Oe=!0,this.Fe=this.Fe.insert(t,e)}$e(t){this.Oe=!0,this.Fe=this.Fe.remove(t)}Ue(){this.ve+=1}Ke(){this.ve-=1,Tt(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class sy{constructor(t){this.Ge=t,this.ze=new Map,this.je=Pn(),this.Je=No(),this.He=No(),this.Ye=new Lt(dt)}Ze(t){for(const e of t.be)t.De&&t.De.isFoundDocument()?this.Xe(e,t.De):this.et(e,t.key,t.De);for(const e of t.removedTargetIds)this.et(e,t.key,t.De)}tt(t){this.forEachTarget(t,e=>{const r=this.nt(e);switch(t.state){case 0:this.rt(e)&&r.Le(t.resumeToken);break;case 1:r.Ke(),r.Ne||r.qe(),r.Le(t.resumeToken);break;case 2:r.Ke(),r.Ne||this.removeTarget(e);break;case 3:this.rt(e)&&(r.We(),r.Le(t.resumeToken));break;case 4:this.rt(e)&&(this.it(e),r.Le(t.resumeToken));break;default:X(56790,{state:t.state})}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.ze.forEach((r,o)=>{this.rt(o)&&e(o)})}st(t){const e=t.targetId,r=t.Ce.count,o=this.ot(e);if(o){const a=o.target;if(vu(a))if(r===0){const h=new K(a.path);this.et(e,h,ie.newNoDocument(h,it.min()))}else Tt(r===1,20013,{expectedCount:r});else{const h=this._t(e);if(h!==r){const f=this.ut(t),p=f?this.ct(f,t,h):1;if(p!==0){this.it(e);const g=p===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(e,g)}}}}}ut(t){const e=t.Ce.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:r="",padding:o=0},hashCount:a=0}=e;let h,f;try{h=Xn(r).toUint8Array()}catch(p){if(p instanceof dd)return br("Decoding the base64 bloom filter in existence filter failed ("+p.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw p}try{f=new Xu(h,o,a)}catch(p){return br(p instanceof Es?"BloomFilter error: ":"Applying bloom filter failed: ",p),null}return f.ge===0?null:f}ct(t,e,r){return e.Ce.count===r-this.Pt(t,e.targetId)?0:2}Pt(t,e){const r=this.Ge.getRemoteKeysForTarget(e);let o=0;return r.forEach(a=>{const h=this.Ge.ht(),f=`projects/${h.projectId}/databases/${h.database}/documents/${a.path.canonicalString()}`;t.mightContain(f)||(this.et(e,a,null),o++)}),o}Tt(t){const e=new Map;this.ze.forEach((a,h)=>{const f=this.ot(h);if(f){if(a.current&&vu(f.target)){const p=new K(f.target.path);this.It(p).has(h)||this.Et(h,p)||this.et(h,p,ie.newNoDocument(p,t))}a.Be&&(e.set(h,a.ke()),a.qe())}});let r=ft();this.He.forEach((a,h)=>{let f=!0;h.forEachWhile(p=>{const g=this.ot(p);return!g||g.purpose==="TargetPurposeLimboResolution"||(f=!1,!1)}),f&&(r=r.add(a))}),this.je.forEach((a,h)=>h.setReadTime(t));const o=new Ea(t,e,this.Ye,this.je,r);return this.je=Pn(),this.Je=No(),this.He=No(),this.Ye=new Lt(dt),o}Xe(t,e){if(!this.rt(t))return;const r=this.Et(t,e.key)?2:0;this.nt(t).Qe(e.key,r),this.je=this.je.insert(e.key,e),this.Je=this.Je.insert(e.key,this.It(e.key).add(t)),this.He=this.He.insert(e.key,this.dt(e.key).add(t))}et(t,e,r){if(!this.rt(t))return;const o=this.nt(t);this.Et(t,e)?o.Qe(e,1):o.$e(e),this.He=this.He.insert(e,this.dt(e).delete(t)),this.He=this.He.insert(e,this.dt(e).add(t)),r&&(this.je=this.je.insert(e,r))}removeTarget(t){this.ze.delete(t)}_t(t){const e=this.nt(t).ke();return this.Ge.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}Ue(t){this.nt(t).Ue()}nt(t){let e=this.ze.get(t);return e||(e=new Bh,this.ze.set(t,e)),e}dt(t){let e=this.He.get(t);return e||(e=new qt(dt),this.He=this.He.insert(t,e)),e}It(t){let e=this.Je.get(t);return e||(e=new qt(dt),this.Je=this.Je.insert(t,e)),e}rt(t){const e=this.ot(t)!==null;return e||W("WatchChangeAggregator","Detected inactive target",t),e}ot(t){const e=this.ze.get(t);return e&&e.Ne?null:this.Ge.At(t)}it(t){this.ze.set(t,new Bh),this.Ge.getRemoteKeysForTarget(t).forEach(e=>{this.et(t,e,null)})}Et(t,e){return this.Ge.getRemoteKeysForTarget(t).has(e)}}function No(){return new Lt(K.comparator)}function zh(){return new Lt(K.comparator)}const oy={asc:"ASCENDING",desc:"DESCENDING"},ay={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},uy={and:"AND",or:"OR"};class cy{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Eu(i,t){return i.useProto3Json||pa(t)?t:{value:t}}function ea(i,t){return i.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Hd(i,t){return i.useProto3Json?t.toBase64():t.toUint8Array()}function hy(i,t){return ea(i,t.toTimestamp())}function Qe(i){return Tt(!!i,49232),it.fromTimestamp(function(e){const r=Yn(e);return new St(r.seconds,r.nanos)}(i))}function Ju(i,t){return Iu(i,t).canonicalString()}function Iu(i,t){const e=function(o){return new It(["projects",o.projectId,"databases",o.database])}(i).child("documents");return t===void 0?e:e.child(t)}function jd(i){const t=It.fromString(i);return Tt(Kd(t),10190,{key:t.toString()}),t}function Pu(i,t){return Ju(i.databaseId,t.path)}function nu(i,t){const e=jd(t);if(e.get(1)!==i.databaseId.projectId)throw new j(D.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+i.databaseId.projectId);if(e.get(3)!==i.databaseId.database)throw new j(D.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+i.databaseId.database);return new K(Wd(e))}function Gd(i,t){return Ju(i.databaseId,t)}function ly(i){const t=jd(i);return t.length===4?It.emptyPath():Wd(t)}function Au(i){return new It(["projects",i.databaseId.projectId,"databases",i.databaseId.database]).canonicalString()}function Wd(i){return Tt(i.length>4&&i.get(4)==="documents",29091,{key:i.toString()}),i.popFirst(5)}function qh(i,t,e){return{name:Pu(i,t),fields:e.value.mapValue.fields}}function dy(i,t){let e;if("targetChange"in t){t.targetChange;const r=function(g){return g==="NO_CHANGE"?0:g==="ADD"?1:g==="REMOVE"?2:g==="CURRENT"?3:g==="RESET"?4:X(39313,{state:g})}(t.targetChange.targetChangeType||"NO_CHANGE"),o=t.targetChange.targetIds||[],a=function(g,w){return g.useProto3Json?(Tt(w===void 0||typeof w=="string",58123),Jt.fromBase64String(w||"")):(Tt(w===void 0||w instanceof Buffer||w instanceof Uint8Array,16193),Jt.fromUint8Array(w||new Uint8Array))}(i,t.targetChange.resumeToken),h=t.targetChange.cause,f=h&&function(g){const w=g.code===void 0?D.UNKNOWN:Bd(g.code);return new j(w,g.message||"")}(h);e=new qd(r,o,a,f||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const o=nu(i,r.document.name),a=Qe(r.document.updateTime),h=r.document.createTime?Qe(r.document.createTime):it.min(),f=new pe({mapValue:{fields:r.document.fields}}),p=ie.newFoundDocument(o,a,h,f),g=r.targetIds||[],w=r.removedTargetIds||[];e=new zo(g,w,p.key,p)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const o=nu(i,r.document),a=r.readTime?Qe(r.readTime):it.min(),h=ie.newNoDocument(o,a),f=r.removedTargetIds||[];e=new zo([],f,h.key,h)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const o=nu(i,r.document),a=r.removedTargetIds||[];e=new zo([],a,o,null)}else{if(!("filter"in t))return X(11601,{Rt:t});{t.filter;const r=t.filter;r.targetId;const{count:o=0,unchangedNames:a}=r,h=new ey(o,a),f=r.targetId;e=new zd(f,h)}}return e}function fy(i,t){let e;if(t instanceof Bs)e={update:qh(i,t.key,t.value)};else if(t instanceof Ud)e={delete:Pu(i,t.key)};else if(t instanceof ri)e={update:qh(i,t.key,t.data),updateMask:Ey(t.fieldMask)};else{if(!(t instanceof Xg))return X(16599,{Vt:t.type});e={verify:Pu(i,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(r=>function(a,h){const f=h.transform;if(f instanceof Jo)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(f instanceof xr)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:f.elements}};if(f instanceof kr)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:f.elements}};if(f instanceof ta)return{fieldPath:h.field.canonicalString(),increment:f.Ae};throw X(20930,{transform:h.transform})}(0,r))),t.precondition.isNone||(e.currentDocument=function(o,a){return a.updateTime!==void 0?{updateTime:hy(o,a.updateTime)}:a.exists!==void 0?{exists:a.exists}:X(27497)}(i,t.precondition)),e}function my(i,t){return i&&i.length>0?(Tt(t!==void 0,14353),i.map(e=>function(o,a){let h=o.updateTime?Qe(o.updateTime):Qe(a);return h.isEqual(it.min())&&(h=Qe(a)),new Kg(h,o.transformResults||[])}(e,t))):[]}function py(i,t){return{documents:[Gd(i,t.path)]}}function _y(i,t){const e={structuredQuery:{}},r=t.path;let o;t.collectionGroup!==null?(o=r,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(o=r.popLast(),e.structuredQuery.from=[{collectionId:r.lastSegment()}]),e.parent=Gd(i,o);const a=function(g){if(g.length!==0)return Zd(Ve.create(g,"and"))}(t.filters);a&&(e.structuredQuery.where=a);const h=function(g){if(g.length!==0)return g.map(w=>function(b){return{field:pr(b.field),direction:vy(b.dir)}}(w))}(t.orderBy);h&&(e.structuredQuery.orderBy=h);const f=Eu(i,t.limit);return f!==null&&(e.structuredQuery.limit=f),t.startAt&&(e.structuredQuery.startAt=function(g){return{before:g.inclusive,values:g.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(g){return{before:!g.inclusive,values:g.position}}(t.endAt)),{ft:e,parent:o}}function gy(i){let t=ly(i.parent);const e=i.structuredQuery,r=e.from?e.from.length:0;let o=null;if(r>0){Tt(r===1,65062);const w=e.from[0];w.allDescendants?o=w.collectionId:t=t.child(w.collectionId)}let a=[];e.where&&(a=function(T){const b=$d(T);return b instanceof Ve&&Ed(b)?b.getFilters():[b]}(e.where));let h=[];e.orderBy&&(h=function(T){return T.map(b=>function(z){return new Ns(_r(z.field),function(q){switch(q){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(z.direction))}(b))}(e.orderBy));let f=null;e.limit&&(f=function(T){let b;return b=typeof T=="object"?T.value:T,pa(b)?null:b}(e.limit));let p=null;e.startAt&&(p=function(T){const b=!!T.before,V=T.values||[];return new Lr(V,b)}(e.startAt));let g=null;return e.endAt&&(g=function(T){const b=!T.before,V=T.values||[];return new Lr(V,b)}(e.endAt)),Dg(t,o,h,a,f,"F",p,g)}function yy(i,t){const e=function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return X(28987,{purpose:o})}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function $d(i){return i.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=_r(e.unaryFilter.field);return Ut.create(r,"==",{doubleValue:NaN});case"IS_NULL":const o=_r(e.unaryFilter.field);return Ut.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const a=_r(e.unaryFilter.field);return Ut.create(a,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=_r(e.unaryFilter.field);return Ut.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return X(61313);default:return X(60726)}}(i):i.fieldFilter!==void 0?function(e){return Ut.create(_r(e.fieldFilter.field),function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return X(58110);default:return X(50506)}}(e.fieldFilter.op),e.fieldFilter.value)}(i):i.compositeFilter!==void 0?function(e){return Ve.create(e.compositeFilter.filters.map(r=>$d(r)),function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return X(1026)}}(e.compositeFilter.op))}(i):X(30097,{filter:i})}function vy(i){return oy[i]}function wy(i){return ay[i]}function Ty(i){return uy[i]}function pr(i){return{fieldPath:i.canonicalString()}}function _r(i){return Xt.fromServerFormat(i.fieldPath)}function Zd(i){return i instanceof Ut?function(e){if(e.op==="=="){if(Rh(e.value))return{unaryFilter:{field:pr(e.field),op:"IS_NAN"}};if(Ch(e.value))return{unaryFilter:{field:pr(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(Rh(e.value))return{unaryFilter:{field:pr(e.field),op:"IS_NOT_NAN"}};if(Ch(e.value))return{unaryFilter:{field:pr(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:pr(e.field),op:wy(e.op),value:e.value}}}(i):i instanceof Ve?function(e){const r=e.getFilters().map(o=>Zd(o));return r.length===1?r[0]:{compositeFilter:{op:Ty(e.op),filters:r}}}(i):X(54877,{filter:i})}function Ey(i){const t=[];return i.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Kd(i){return i.length>=4&&i.get(0)==="projects"&&i.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(t,e,r,o,a=it.min(),h=it.min(),f=Jt.EMPTY_BYTE_STRING,p=null){this.target=t,this.targetId=e,this.purpose=r,this.sequenceNumber=o,this.snapshotVersion=a,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=f,this.expectedCount=p}withSequenceNumber(t){return new jn(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new jn(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new jn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new jn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iy{constructor(t){this.yt=t}}function Py(i){const t=gy({parent:i.parent,structuredQuery:i.structuredQuery});return i.limitType==="LAST"?Tu(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ay{constructor(){this.Cn=new by}addToCollectionParentIndex(t,e){return this.Cn.add(e),F.resolve()}getCollectionParents(t,e){return F.resolve(this.Cn.getEntries(e))}addFieldIndex(t,e){return F.resolve()}deleteFieldIndex(t,e){return F.resolve()}deleteAllFieldIndexes(t){return F.resolve()}createTargetIndexes(t,e){return F.resolve()}getDocumentsMatchingTarget(t,e){return F.resolve(null)}getIndexType(t,e){return F.resolve(0)}getFieldIndexes(t,e){return F.resolve([])}getNextCollectionGroupToUpdate(t){return F.resolve(null)}getMinOffset(t,e){return F.resolve(Qn.min())}getMinOffsetFromCollectionGroup(t,e){return F.resolve(Qn.min())}updateCollectionGroup(t,e,r){return F.resolve()}updateIndexEntries(t,e){return F.resolve()}}class by{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),o=this.index[e]||new qt(It.comparator),a=!o.has(r);return this.index[e]=o.add(r),a}has(t){const e=t.lastSegment(),r=t.popLast(),o=this.index[e];return o&&o.has(r)}getEntries(t){return(this.index[t]||new qt(It.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hh={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Qd=41943040;class me{static withCacheSize(t){return new me(t,me.DEFAULT_COLLECTION_PERCENTILE,me.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,r){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */me.DEFAULT_COLLECTION_PERCENTILE=10,me.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,me.DEFAULT=new me(Qd,me.DEFAULT_COLLECTION_PERCENTILE,me.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),me.DISABLED=new me(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr{constructor(t){this.ar=t}next(){return this.ar+=2,this.ar}static ur(){return new Mr(0)}static cr(){return new Mr(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jh="LruGarbageCollector",Sy=1048576;function Gh([i,t],[e,r]){const o=dt(i,e);return o===0?dt(t,r):o}class Cy{constructor(t){this.Ir=t,this.buffer=new qt(Gh),this.Er=0}dr(){return++this.Er}Ar(t){const e=[t,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(e);else{const r=this.buffer.last();Gh(e,r)<0&&(this.buffer=this.buffer.delete(r).add(e))}}get maxValue(){return this.buffer.last()[0]}}class Ry{constructor(t,e,r){this.garbageCollector=t,this.asyncQueue=e,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(t){W(jh,`Garbage collection scheduled in ${t}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Ur(e)?W(jh,"Ignoring IndexedDB error during garbage collection: ",e):await Fr(e)}await this.Vr(3e5)})}}class Ly{constructor(t,e){this.mr=t,this.params=e}calculateTargetCount(t,e){return this.mr.gr(t).next(r=>Math.floor(e/100*r))}nthSequenceNumber(t,e){if(e===0)return F.resolve(ma.ce);const r=new Cy(e);return this.mr.forEachTarget(t,o=>r.Ar(o.sequenceNumber)).next(()=>this.mr.pr(t,o=>r.Ar(o))).next(()=>r.maxValue)}removeTargets(t,e,r){return this.mr.removeTargets(t,e,r)}removeOrphanedDocuments(t,e){return this.mr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(W("LruGarbageCollector","Garbage collection skipped; disabled"),F.resolve(Hh)):this.getCacheSize(t).next(r=>r<this.params.cacheSizeCollectionThreshold?(W("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Hh):this.yr(t,e))}getCacheSize(t){return this.mr.getCacheSize(t)}yr(t,e){let r,o,a,h,f,p,g;const w=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(T=>(T>this.params.maximumSequenceNumbersToCollect?(W("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${T}`),o=this.params.maximumSequenceNumbersToCollect):o=T,h=Date.now(),this.nthSequenceNumber(t,o))).next(T=>(r=T,f=Date.now(),this.removeTargets(t,r,e))).next(T=>(a=T,p=Date.now(),this.removeOrphanedDocuments(t,r))).next(T=>(g=Date.now(),fr()<=lt.DEBUG&&W("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-w}ms
	Determined least recently used ${o} in `+(f-h)+`ms
	Removed ${a} targets in `+(p-f)+`ms
	Removed ${T} documents in `+(g-p)+`ms
Total Duration: ${g-w}ms`),F.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:a,documentsRemoved:T})))}}function xy(i,t){return new Ly(i,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ky{constructor(){this.changes=new Oi(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,ie.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?F.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class My{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ny{constructor(t,e,r,o){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=o}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next(o=>(r=o,this.remoteDocumentCache.getEntry(t,e))).next(o=>(r!==null&&Ss(r.mutation,o,ve.empty(),St.now()),o))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.getLocalViewOfDocuments(t,r,ft()).next(()=>r))}getLocalViewOfDocuments(t,e,r=ft()){const o=Si();return this.populateOverlays(t,o,e).next(()=>this.computeViews(t,e,o,r).next(a=>{let h=Ts();return a.forEach((f,p)=>{h=h.insert(f,p.overlayedDocument)}),h}))}getOverlayedDocuments(t,e){const r=Si();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,ft()))}populateOverlays(t,e,r){const o=[];return r.forEach(a=>{e.has(a)||o.push(a)}),this.documentOverlayCache.getOverlays(t,o).next(a=>{a.forEach((h,f)=>{e.set(h,f)})})}computeViews(t,e,r,o){let a=Pn();const h=bs(),f=function(){return bs()}();return e.forEach((p,g)=>{const w=r.get(g.key);o.has(g.key)&&(w===void 0||w.mutation instanceof ri)?a=a.insert(g.key,g):w!==void 0?(h.set(g.key,w.mutation.getFieldMask()),Ss(w.mutation,g,w.mutation.getFieldMask(),St.now())):h.set(g.key,ve.empty())}),this.recalculateAndSaveOverlays(t,a).next(p=>(p.forEach((g,w)=>h.set(g,w)),e.forEach((g,w)=>f.set(g,new My(w,h.get(g)??null))),f))}recalculateAndSaveOverlays(t,e){const r=bs();let o=new Lt((h,f)=>h-f),a=ft();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(h=>{for(const f of h)f.keys().forEach(p=>{const g=e.get(p);if(g===null)return;let w=r.get(p)||ve.empty();w=f.applyToLocalView(g,w),r.set(p,w);const T=(o.get(f.batchId)||ft()).add(p);o=o.insert(f.batchId,T)})}).next(()=>{const h=[],f=o.getReverseIterator();for(;f.hasNext();){const p=f.getNext(),g=p.key,w=p.value,T=Ld();w.forEach(b=>{if(!a.has(b)){const V=Vd(e.get(b),r.get(b));V!==null&&T.set(b,V),a=a.add(b)}}),h.push(this.documentOverlayCache.saveOverlays(t,g,T))}return F.waitFor(h)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(r=>this.recalculateAndSaveOverlays(t,r))}getDocumentsMatchingQuery(t,e,r,o){return function(h){return K.isDocumentKey(h.path)&&h.collectionGroup===null&&h.filters.length===0}(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Ku(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,o):this.getDocumentsMatchingCollectionQuery(t,e,r,o)}getNextDocuments(t,e,r,o){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,o).next(a=>{const h=o-a.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,o-a.size):F.resolve(Si());let f=Ls,p=a;return h.next(g=>F.forEach(g,(w,T)=>(f<T.largestBatchId&&(f=T.largestBatchId),a.get(w)?F.resolve():this.remoteDocumentCache.getEntry(t,w).next(b=>{p=p.insert(w,b)}))).next(()=>this.populateOverlays(t,g,a)).next(()=>this.computeViews(t,p,g,ft())).next(w=>({batchId:f,changes:Rd(w)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new K(e)).next(r=>{let o=Ts();return r.isFoundDocument()&&(o=o.insert(r.key,r)),o})}getDocumentsMatchingCollectionGroupQuery(t,e,r,o){const a=e.collectionGroup;let h=Ts();return this.indexManager.getCollectionParents(t,a).next(f=>F.forEach(f,p=>{const g=function(T,b){return new ii(b,null,T.explicitOrderBy.slice(),T.filters.slice(),T.limit,T.limitType,T.startAt,T.endAt)}(e,p.child(a));return this.getDocumentsMatchingCollectionQuery(t,g,r,o).next(w=>{w.forEach((T,b)=>{h=h.insert(T,b)})})}).next(()=>h))}getDocumentsMatchingCollectionQuery(t,e,r,o){let a;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next(h=>(a=h,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,a,o))).next(h=>{a.forEach((p,g)=>{const w=g.getKey();h.get(w)===null&&(h=h.insert(w,ie.newInvalidDocument(w)))});let f=Ts();return h.forEach((p,g)=>{const w=a.get(p);w!==void 0&&Ss(w.mutation,g,ve.empty(),St.now()),va(e,g)&&(f=f.insert(p,g))}),f})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oy{constructor(t){this.serializer=t,this.Lr=new Map,this.kr=new Map}getBundleMetadata(t,e){return F.resolve(this.Lr.get(e))}saveBundleMetadata(t,e){return this.Lr.set(e.id,function(o){return{id:o.id,version:o.version,createTime:Qe(o.createTime)}}(e)),F.resolve()}getNamedQuery(t,e){return F.resolve(this.kr.get(e))}saveNamedQuery(t,e){return this.kr.set(e.name,function(o){return{name:o.name,query:Py(o.bundledQuery),readTime:Qe(o.readTime)}}(e)),F.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{constructor(){this.overlays=new Lt(K.comparator),this.qr=new Map}getOverlay(t,e){return F.resolve(this.overlays.get(e))}getOverlays(t,e){const r=Si();return F.forEach(e,o=>this.getOverlay(t,o).next(a=>{a!==null&&r.set(o,a)})).next(()=>r)}saveOverlays(t,e,r){return r.forEach((o,a)=>{this.St(t,e,a)}),F.resolve()}removeOverlaysForBatchId(t,e,r){const o=this.qr.get(r);return o!==void 0&&(o.forEach(a=>this.overlays=this.overlays.remove(a)),this.qr.delete(r)),F.resolve()}getOverlaysForCollection(t,e,r){const o=Si(),a=e.length+1,h=new K(e.child("")),f=this.overlays.getIteratorFrom(h);for(;f.hasNext();){const p=f.getNext().value,g=p.getKey();if(!e.isPrefixOf(g.path))break;g.path.length===a&&p.largestBatchId>r&&o.set(p.getKey(),p)}return F.resolve(o)}getOverlaysForCollectionGroup(t,e,r,o){let a=new Lt((g,w)=>g-w);const h=this.overlays.getIterator();for(;h.hasNext();){const g=h.getNext().value;if(g.getKey().getCollectionGroup()===e&&g.largestBatchId>r){let w=a.get(g.largestBatchId);w===null&&(w=Si(),a=a.insert(g.largestBatchId,w)),w.set(g.getKey(),g)}}const f=Si(),p=a.getIterator();for(;p.hasNext()&&(p.getNext().value.forEach((g,w)=>f.set(g,w)),!(f.size()>=o)););return F.resolve(f)}St(t,e,r){const o=this.overlays.get(r.key);if(o!==null){const h=this.qr.get(o.largestBatchId).delete(r.key);this.qr.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(r.key,new ty(e,r));let a=this.qr.get(e);a===void 0&&(a=ft(),this.qr.set(e,a)),this.qr.set(e,a.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(){this.sessionToken=Jt.EMPTY_BYTE_STRING}getSessionToken(t){return F.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,F.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{constructor(){this.Qr=new qt(Zt.$r),this.Ur=new qt(Zt.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(t,e){const r=new Zt(t,e);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(t,e){t.forEach(r=>this.addReference(r,e))}removeReference(t,e){this.Gr(new Zt(t,e))}zr(t,e){t.forEach(r=>this.removeReference(r,e))}jr(t){const e=new K(new It([])),r=new Zt(e,t),o=new Zt(e,t+1),a=[];return this.Ur.forEachInRange([r,o],h=>{this.Gr(h),a.push(h.key)}),a}Jr(){this.Qr.forEach(t=>this.Gr(t))}Gr(t){this.Qr=this.Qr.delete(t),this.Ur=this.Ur.delete(t)}Hr(t){const e=new K(new It([])),r=new Zt(e,t),o=new Zt(e,t+1);let a=ft();return this.Ur.forEachInRange([r,o],h=>{a=a.add(h.key)}),a}containsKey(t){const e=new Zt(t,0),r=this.Qr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class Zt{constructor(t,e){this.key=t,this.Yr=e}static $r(t,e){return K.comparator(t.key,e.key)||dt(t.Yr,e.Yr)}static Kr(t,e){return dt(t.Yr,e.Yr)||K.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.tr=1,this.Zr=new qt(Zt.$r)}checkEmpty(t){return F.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,o){const a=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new Jg(a,e,r,o);this.mutationQueue.push(h);for(const f of o)this.Zr=this.Zr.add(new Zt(f.key,a)),this.indexManager.addToCollectionParentIndex(t,f.key.path.popLast());return F.resolve(h)}lookupMutationBatch(t,e){return F.resolve(this.Xr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,o=this.ei(r),a=o<0?0:o;return F.resolve(this.mutationQueue.length>a?this.mutationQueue[a]:null)}getHighestUnacknowledgedBatchId(){return F.resolve(this.mutationQueue.length===0?ju:this.tr-1)}getAllMutationBatches(t){return F.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new Zt(e,0),o=new Zt(e,Number.POSITIVE_INFINITY),a=[];return this.Zr.forEachInRange([r,o],h=>{const f=this.Xr(h.Yr);a.push(f)}),F.resolve(a)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new qt(dt);return e.forEach(o=>{const a=new Zt(o,0),h=new Zt(o,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([a,h],f=>{r=r.add(f.Yr)})}),F.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,o=r.length+1;let a=r;K.isDocumentKey(a)||(a=a.child(""));const h=new Zt(new K(a),0);let f=new qt(dt);return this.Zr.forEachWhile(p=>{const g=p.key.path;return!!r.isPrefixOf(g)&&(g.length===o&&(f=f.add(p.Yr)),!0)},h),F.resolve(this.ti(f))}ti(t){const e=[];return t.forEach(r=>{const o=this.Xr(r);o!==null&&e.push(o)}),e}removeMutationBatch(t,e){Tt(this.ni(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return F.forEach(e.mutations,o=>{const a=new Zt(o.key,e.batchId);return r=r.delete(a),this.referenceDelegate.markPotentiallyOrphaned(t,o.key)}).next(()=>{this.Zr=r})}ir(t){}containsKey(t,e){const r=new Zt(e,0),o=this.Zr.firstAfterOrEqual(r);return F.resolve(e.isEqual(o&&o.key))}performConsistencyCheck(t){return this.mutationQueue.length,F.resolve()}ni(t,e){return this.ei(t)}ei(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Xr(t){const e=this.ei(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uy{constructor(t){this.ri=t,this.docs=function(){return new Lt(K.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,o=this.docs.get(r),a=o?o.size:0,h=this.ri(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:h}),this.size+=h-a,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return F.resolve(r?r.document.mutableCopy():ie.newInvalidDocument(e))}getEntries(t,e){let r=Pn();return e.forEach(o=>{const a=this.docs.get(o);r=r.insert(o,a?a.document.mutableCopy():ie.newInvalidDocument(o))}),F.resolve(r)}getDocumentsMatchingQuery(t,e,r,o){let a=Pn();const h=e.path,f=new K(h.child("__id-9223372036854775808__")),p=this.docs.getIteratorFrom(f);for(;p.hasNext();){const{key:g,value:{document:w}}=p.getNext();if(!h.isPrefixOf(g.path))break;g.path.length>h.length+1||mg(fg(w),r)<=0||(o.has(w.key)||va(e,w))&&(a=a.insert(w.key,w.mutableCopy()))}return F.resolve(a)}getAllFromCollectionGroup(t,e,r,o){X(9500)}ii(t,e){return F.forEach(this.docs,r=>e(r))}newChangeBuffer(t){return new By(this)}getSize(t){return F.resolve(this.size)}}class By extends ky{constructor(t){super(),this.Nr=t}applyChanges(t){const e=[];return this.changes.forEach((r,o)=>{o.isValidDocument()?e.push(this.Nr.addEntry(t,o)):this.Nr.removeEntry(r)}),F.waitFor(e)}getFromCache(t,e){return this.Nr.getEntry(t,e)}getAllFromCache(t,e){return this.Nr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zy{constructor(t){this.persistence=t,this.si=new Oi(e=>Wu(e),$u),this.lastRemoteSnapshotVersion=it.min(),this.highestTargetId=0,this.oi=0,this._i=new tc,this.targetCount=0,this.ai=Mr.ur()}forEachTarget(t,e){return this.si.forEach((r,o)=>e(o)),F.resolve()}getLastRemoteSnapshotVersion(t){return F.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return F.resolve(this.oi)}allocateTargetId(t){return this.highestTargetId=this.ai.next(),F.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.oi&&(this.oi=e),F.resolve()}Pr(t){this.si.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.ai=new Mr(e),this.highestTargetId=e),t.sequenceNumber>this.oi&&(this.oi=t.sequenceNumber)}addTargetData(t,e){return this.Pr(e),this.targetCount+=1,F.resolve()}updateTargetData(t,e){return this.Pr(e),F.resolve()}removeTargetData(t,e){return this.si.delete(e.target),this._i.jr(e.targetId),this.targetCount-=1,F.resolve()}removeTargets(t,e,r){let o=0;const a=[];return this.si.forEach((h,f)=>{f.sequenceNumber<=e&&r.get(f.targetId)===null&&(this.si.delete(h),a.push(this.removeMatchingKeysForTargetId(t,f.targetId)),o++)}),F.waitFor(a).next(()=>o)}getTargetCount(t){return F.resolve(this.targetCount)}getTargetData(t,e){const r=this.si.get(e)||null;return F.resolve(r)}addMatchingKeys(t,e,r){return this._i.Wr(e,r),F.resolve()}removeMatchingKeys(t,e,r){this._i.zr(e,r);const o=this.persistence.referenceDelegate,a=[];return o&&e.forEach(h=>{a.push(o.markPotentiallyOrphaned(t,h))}),F.waitFor(a)}removeMatchingKeysForTargetId(t,e){return this._i.jr(e),F.resolve()}getMatchingKeysForTargetId(t,e){const r=this._i.Hr(e);return F.resolve(r)}containsKey(t,e){return F.resolve(this._i.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yd{constructor(t,e){this.ui={},this.overlays={},this.ci=new ma(0),this.li=!1,this.li=!0,this.hi=new Vy,this.referenceDelegate=t(this),this.Pi=new zy(this),this.indexManager=new Ay,this.remoteDocumentCache=function(o){return new Uy(o)}(r=>this.referenceDelegate.Ti(r)),this.serializer=new Iy(e),this.Ii=new Oy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Dy,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.ui[t.toKey()];return r||(r=new Fy(e,this.referenceDelegate),this.ui[t.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(t,e,r){W("MemoryPersistence","Starting transaction:",t);const o=new qy(this.ci.next());return this.referenceDelegate.Ei(),r(o).next(a=>this.referenceDelegate.di(o).next(()=>a)).toPromise().then(a=>(o.raiseOnCommittedEvent(),a))}Ai(t,e){return F.or(Object.values(this.ui).map(r=>()=>r.containsKey(t,e)))}}class qy extends _g{constructor(t){super(),this.currentSequenceNumber=t}}class ec{constructor(t){this.persistence=t,this.Ri=new tc,this.Vi=null}static mi(t){return new ec(t)}get fi(){if(this.Vi)return this.Vi;throw X(60996)}addReference(t,e,r){return this.Ri.addReference(r,e),this.fi.delete(r.toString()),F.resolve()}removeReference(t,e,r){return this.Ri.removeReference(r,e),this.fi.add(r.toString()),F.resolve()}markPotentiallyOrphaned(t,e){return this.fi.add(e.toString()),F.resolve()}removeTarget(t,e){this.Ri.jr(e.targetId).forEach(o=>this.fi.add(o.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next(o=>{o.forEach(a=>this.fi.add(a.toString()))}).next(()=>r.removeTargetData(t,e))}Ei(){this.Vi=new Set}di(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return F.forEach(this.fi,r=>{const o=K.fromPath(r);return this.gi(t,o).next(a=>{a||e.removeEntry(o,it.min())})}).next(()=>(this.Vi=null,e.apply(t)))}updateLimboDocument(t,e){return this.gi(t,e).next(r=>{r?this.fi.delete(e.toString()):this.fi.add(e.toString())})}Ti(t){return 0}gi(t,e){return F.or([()=>F.resolve(this.Ri.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ai(t,e)])}}class na{constructor(t,e){this.persistence=t,this.pi=new Oi(r=>vg(r.path),(r,o)=>r.isEqual(o)),this.garbageCollector=xy(this,e)}static mi(t,e){return new na(t,e)}Ei(){}di(t){return F.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}gr(t){const e=this.wr(t);return this.persistence.getTargetCache().getTargetCount(t).next(r=>e.next(o=>r+o))}wr(t){let e=0;return this.pr(t,r=>{e++}).next(()=>e)}pr(t,e){return F.forEach(this.pi,(r,o)=>this.br(t,r,o).next(a=>a?F.resolve():e(o)))}removeTargets(t,e,r){return this.persistence.getTargetCache().removeTargets(t,e,r)}removeOrphanedDocuments(t,e){let r=0;const o=this.persistence.getRemoteDocumentCache(),a=o.newChangeBuffer();return o.ii(t,h=>this.br(t,h,e).next(f=>{f||(r++,a.removeEntry(h,it.min()))})).next(()=>a.apply(t)).next(()=>r)}markPotentiallyOrphaned(t,e){return this.pi.set(e,t.currentSequenceNumber),F.resolve()}removeTarget(t,e){const r=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,r)}addReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),F.resolve()}removeReference(t,e,r){return this.pi.set(r,t.currentSequenceNumber),F.resolve()}updateLimboDocument(t,e){return this.pi.set(e,t.currentSequenceNumber),F.resolve()}Ti(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=Fo(t.data.value)),e}br(t,e,r){return F.or([()=>this.persistence.Ai(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const o=this.pi.get(e);return F.resolve(o!==void 0&&o>r)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nc{constructor(t,e,r,o){this.targetId=t,this.fromCache=e,this.Es=r,this.ds=o}static As(t,e){let r=ft(),o=ft();for(const a of e.docChanges)switch(a.type){case 0:r=r.add(a.doc.key);break;case 1:o=o.add(a.doc.key)}return new nc(t,e.fromCache,r,o)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return Vp()?8:gg(re())>0?6:4}()}initialize(t,e){this.ps=t,this.indexManager=e,this.Rs=!0}getDocumentsMatchingQuery(t,e,r,o){const a={result:null};return this.ys(t,e).next(h=>{a.result=h}).next(()=>{if(!a.result)return this.ws(t,e,o,r).next(h=>{a.result=h})}).next(()=>{if(a.result)return;const h=new Hy;return this.Ss(t,e,h).next(f=>{if(a.result=f,this.Vs)return this.bs(t,e,h,f.size)})}).next(()=>a.result)}bs(t,e,r,o){return r.documentReadCount<this.fs?(fr()<=lt.DEBUG&&W("QueryEngine","SDK will not create cache indexes for query:",mr(e),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),F.resolve()):(fr()<=lt.DEBUG&&W("QueryEngine","Query:",mr(e),"scans",r.documentReadCount,"local documents and returns",o,"documents as results."),r.documentReadCount>this.gs*o?(fr()<=lt.DEBUG&&W("QueryEngine","The SDK decides to create cache indexes for query:",mr(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Ke(e))):F.resolve())}ys(t,e){if(Mh(e))return F.resolve(null);let r=Ke(e);return this.indexManager.getIndexType(t,r).next(o=>o===0?null:(e.limit!==null&&o===1&&(e=Tu(e,null,"F"),r=Ke(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next(a=>{const h=ft(...a);return this.ps.getDocuments(t,h).next(f=>this.indexManager.getMinOffset(t,r).next(p=>{const g=this.Ds(e,f);return this.Cs(e,g,h,p.readTime)?this.ys(t,Tu(e,null,"F")):this.vs(t,g,e,p)}))})))}ws(t,e,r,o){return Mh(e)||o.isEqual(it.min())?F.resolve(null):this.ps.getDocuments(t,r).next(a=>{const h=this.Ds(e,a);return this.Cs(e,h,r,o)?F.resolve(null):(fr()<=lt.DEBUG&&W("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),mr(e)),this.vs(t,h,e,dg(o,Ls)).next(f=>f))})}Ds(t,e){let r=new qt(Sd(t));return e.forEach((o,a)=>{va(t,a)&&(r=r.add(a))}),r}Cs(t,e,r,o){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const a=t.limitType==="F"?e.last():e.first();return!!a&&(a.hasPendingWrites||a.version.compareTo(o)>0)}Ss(t,e,r){return fr()<=lt.DEBUG&&W("QueryEngine","Using full collection scan to execute query:",mr(e)),this.ps.getDocumentsMatchingQuery(t,e,Qn.min(),r)}vs(t,e,r,o){return this.ps.getDocumentsMatchingQuery(t,r,o).next(a=>(e.forEach(h=>{a=a.insert(h.key,h)}),a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ic="LocalStore",Gy=3e8;class Wy{constructor(t,e,r,o){this.persistence=t,this.Fs=e,this.serializer=o,this.Ms=new Lt(dt),this.xs=new Oi(a=>Wu(a),$u),this.Os=new Map,this.Ns=t.getRemoteDocumentCache(),this.Pi=t.getTargetCache(),this.Ii=t.getBundleCache(),this.Bs(r)}Bs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Ny(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.Ms))}}function $y(i,t,e,r){return new Wy(i,t,e,r)}async function Xd(i,t){const e=rt(i);return await e.persistence.runTransaction("Handle user change","readonly",r=>{let o;return e.mutationQueue.getAllMutationBatches(r).next(a=>(o=a,e.Bs(t),e.mutationQueue.getAllMutationBatches(r))).next(a=>{const h=[],f=[];let p=ft();for(const g of o){h.push(g.batchId);for(const w of g.mutations)p=p.add(w.key)}for(const g of a){f.push(g.batchId);for(const w of g.mutations)p=p.add(w.key)}return e.localDocuments.getDocuments(r,p).next(g=>({Ls:g,removedBatchIds:h,addedBatchIds:f}))})})}function Zy(i,t){const e=rt(i);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const o=t.batch.keys(),a=e.Ns.newChangeBuffer({trackRemovals:!0});return function(f,p,g,w){const T=g.batch,b=T.keys();let V=F.resolve();return b.forEach(z=>{V=V.next(()=>w.getEntry(p,z)).next(B=>{const q=g.docVersions.get(z);Tt(q!==null,48541),B.version.compareTo(q)<0&&(T.applyToRemoteDocument(B,g),B.isValidDocument()&&(B.setReadTime(g.commitVersion),w.addEntry(B)))})}),V.next(()=>f.mutationQueue.removeMutationBatch(p,T))}(e,r,t,a).next(()=>a.apply(r)).next(()=>e.mutationQueue.performConsistencyCheck(r)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(r,o,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(f){let p=ft();for(let g=0;g<f.mutationResults.length;++g)f.mutationResults[g].transformResults.length>0&&(p=p.add(f.batch.mutations[g].key));return p}(t))).next(()=>e.localDocuments.getDocuments(r,o))})}function Jd(i){const t=rt(i);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Pi.getLastRemoteSnapshotVersion(e))}function Ky(i,t){const e=rt(i),r=t.snapshotVersion;let o=e.Ms;return e.persistence.runTransaction("Apply remote event","readwrite-primary",a=>{const h=e.Ns.newChangeBuffer({trackRemovals:!0});o=e.Ms;const f=[];t.targetChanges.forEach((w,T)=>{const b=o.get(T);if(!b)return;f.push(e.Pi.removeMatchingKeys(a,w.removedDocuments,T).next(()=>e.Pi.addMatchingKeys(a,w.addedDocuments,T)));let V=b.withSequenceNumber(a.currentSequenceNumber);t.targetMismatches.get(T)!==null?V=V.withResumeToken(Jt.EMPTY_BYTE_STRING,it.min()).withLastLimboFreeSnapshotVersion(it.min()):w.resumeToken.approximateByteSize()>0&&(V=V.withResumeToken(w.resumeToken,r)),o=o.insert(T,V),function(B,q,ht){return B.resumeToken.approximateByteSize()===0||q.snapshotVersion.toMicroseconds()-B.snapshotVersion.toMicroseconds()>=Gy?!0:ht.addedDocuments.size+ht.modifiedDocuments.size+ht.removedDocuments.size>0}(b,V,w)&&f.push(e.Pi.updateTargetData(a,V))});let p=Pn(),g=ft();if(t.documentUpdates.forEach(w=>{t.resolvedLimboDocuments.has(w)&&f.push(e.persistence.referenceDelegate.updateLimboDocument(a,w))}),f.push(Qy(a,h,t.documentUpdates).next(w=>{p=w.ks,g=w.qs})),!r.isEqual(it.min())){const w=e.Pi.getLastRemoteSnapshotVersion(a).next(T=>e.Pi.setTargetsMetadata(a,a.currentSequenceNumber,r));f.push(w)}return F.waitFor(f).next(()=>h.apply(a)).next(()=>e.localDocuments.getLocalViewOfDocuments(a,p,g)).next(()=>p)}).then(a=>(e.Ms=o,a))}function Qy(i,t,e){let r=ft(),o=ft();return e.forEach(a=>r=r.add(a)),t.getEntries(i,r).next(a=>{let h=Pn();return e.forEach((f,p)=>{const g=a.get(f);p.isFoundDocument()!==g.isFoundDocument()&&(o=o.add(f)),p.isNoDocument()&&p.version.isEqual(it.min())?(t.removeEntry(f,p.readTime),h=h.insert(f,p)):!g.isValidDocument()||p.version.compareTo(g.version)>0||p.version.compareTo(g.version)===0&&g.hasPendingWrites?(t.addEntry(p),h=h.insert(f,p)):W(ic,"Ignoring outdated watch update for ",f,". Current version:",g.version," Watch version:",p.version)}),{ks:h,qs:o}})}function Yy(i,t){const e=rt(i);return e.persistence.runTransaction("Get next mutation batch","readonly",r=>(t===void 0&&(t=ju),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t)))}function Xy(i,t){const e=rt(i);return e.persistence.runTransaction("Allocate target","readwrite",r=>{let o;return e.Pi.getTargetData(r,t).next(a=>a?(o=a,F.resolve(o)):e.Pi.allocateTargetId(r).next(h=>(o=new jn(t,h,"TargetPurposeListen",r.currentSequenceNumber),e.Pi.addTargetData(r,o).next(()=>o))))}).then(r=>{const o=e.Ms.get(r.targetId);return(o===null||r.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(e.Ms=e.Ms.insert(r.targetId,r),e.xs.set(t,r.targetId)),r})}async function bu(i,t,e){const r=rt(i),o=r.Ms.get(t),a=e?"readwrite":"readwrite-primary";try{e||await r.persistence.runTransaction("Release target",a,h=>r.persistence.referenceDelegate.removeTarget(h,o))}catch(h){if(!Ur(h))throw h;W(ic,`Failed to update sequence numbers for target ${t}: ${h}`)}r.Ms=r.Ms.remove(t),r.xs.delete(o.target)}function Wh(i,t,e){const r=rt(i);let o=it.min(),a=ft();return r.persistence.runTransaction("Execute query","readwrite",h=>function(p,g,w){const T=rt(p),b=T.xs.get(w);return b!==void 0?F.resolve(T.Ms.get(b)):T.Pi.getTargetData(g,w)}(r,h,Ke(t)).next(f=>{if(f)return o=f.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(h,f.targetId).next(p=>{a=p})}).next(()=>r.Fs.getDocumentsMatchingQuery(h,t,e?o:it.min(),e?a:ft())).next(f=>(Jy(r,Fg(t),f),{documents:f,Qs:a})))}function Jy(i,t,e){let r=i.Os.get(t)||it.min();e.forEach((o,a)=>{a.readTime.compareTo(r)>0&&(r=a.readTime)}),i.Os.set(t,r)}class $h{constructor(){this.activeTargetIds=jg()}zs(t){this.activeTargetIds=this.activeTargetIds.add(t)}js(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Gs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class tv{constructor(){this.Mo=new $h,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.Mo.zs(t),this.xo[t]||"not-current"}updateQueryState(t,e,r){this.xo[t]=e}removeLocalQueryTarget(t){this.Mo.js(t)}isLocalQueryTarget(t){return this.Mo.activeTargetIds.has(t)}clearQueryState(t){delete this.xo[t]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(t){return this.Mo.activeTargetIds.has(t)}start(){return this.Mo=new $h,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ev{Oo(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zh="ConnectivityMonitor";class Kh{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(t){this.qo.push(t)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){W(Zh,"Network connectivity changed: AVAILABLE");for(const t of this.qo)t(0)}ko(){W(Zh,"Network connectivity changed: UNAVAILABLE");for(const t of this.qo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Oo=null;function Su(){return Oo===null?Oo=function(){return 268435456+Math.round(2147483648*Math.random())}():Oo++,"0x"+Oo.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iu="RestConnection",nv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class iv{get $o(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.Uo=e+"://"+t.host,this.Ko=`projects/${r}/databases/${o}`,this.Wo=this.databaseId.database===Qo?`project_id=${r}`:`project_id=${r}&database_id=${o}`}Go(t,e,r,o,a){const h=Su(),f=this.zo(t,e.toUriEncodedString());W(iu,`Sending RPC '${t}' ${h}:`,f,r);const p={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(p,o,a);const{host:g}=new URL(f),w=Or(g);return this.Jo(t,f,p,r,w).then(T=>(W(iu,`Received RPC '${t}' ${h}: `,T),T),T=>{throw br(iu,`RPC '${t}' ${h} failed with error: `,T,"url: ",f,"request:",r),T})}Ho(t,e,r,o,a,h){return this.Go(t,e,r,o,a)}jo(t,e,r){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Vr}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach((o,a)=>t[a]=o),r&&r.headers.forEach((o,a)=>t[a]=o)}zo(t,e){const r=nv[t];return`${this.Uo}/v1/${e}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rv{constructor(t){this.Yo=t.Yo,this.Zo=t.Zo}Xo(t){this.e_=t}t_(t){this.n_=t}r_(t){this.i_=t}onMessage(t){this.s_=t}close(){this.Zo()}send(t){this.Yo(t)}o_(){this.e_()}__(){this.n_()}a_(t){this.i_(t)}u_(t){this.s_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ee="WebChannelConnection";class sv extends iv{constructor(t){super(t),this.c_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Jo(t,e,r,o,a){const h=Su();return new Promise((f,p)=>{const g=new ed;g.setWithCredentials(!0),g.listenOnce(nd.COMPLETE,()=>{try{switch(g.getLastErrorCode()){case Vo.NO_ERROR:const T=g.getResponseJson();W(ee,`XHR for RPC '${t}' ${h} received:`,JSON.stringify(T)),f(T);break;case Vo.TIMEOUT:W(ee,`RPC '${t}' ${h} timed out`),p(new j(D.DEADLINE_EXCEEDED,"Request time out"));break;case Vo.HTTP_ERROR:const b=g.getStatus();if(W(ee,`RPC '${t}' ${h} failed with status:`,b,"response text:",g.getResponseText()),b>0){let V=g.getResponseJson();Array.isArray(V)&&(V=V[0]);const z=V==null?void 0:V.error;if(z&&z.status&&z.message){const B=function(ht){const ot=ht.toLowerCase().replace(/_/g,"-");return Object.values(D).indexOf(ot)>=0?ot:D.UNKNOWN}(z.status);p(new j(B,z.message))}else p(new j(D.UNKNOWN,"Server responded with status "+g.getStatus()))}else p(new j(D.UNAVAILABLE,"Connection failed."));break;default:X(9055,{l_:t,streamId:h,h_:g.getLastErrorCode(),P_:g.getLastError()})}}finally{W(ee,`RPC '${t}' ${h} completed.`)}});const w=JSON.stringify(o);W(ee,`RPC '${t}' ${h} sending request:`,o),g.send(e,"POST",w,r,15)})}T_(t,e,r){const o=Su(),a=[this.Uo,"/","google.firestore.v1.Firestore","/",t,"/channel"],h=sd(),f=rd(),p={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},g=this.longPollingOptions.timeoutSeconds;g!==void 0&&(p.longPollingTimeout=Math.round(1e3*g)),this.useFetchStreams&&(p.useFetchStreams=!0),this.jo(p.initMessageHeaders,e,r),p.encodeInitMessageHeaders=!0;const w=a.join("");W(ee,`Creating RPC '${t}' stream ${o}: ${w}`,p);const T=h.createWebChannel(w,p);this.I_(T);let b=!1,V=!1;const z=new rv({Yo:q=>{V?W(ee,`Not sending because RPC '${t}' stream ${o} is closed:`,q):(b||(W(ee,`Opening RPC '${t}' stream ${o} transport.`),T.open(),b=!0),W(ee,`RPC '${t}' stream ${o} sending:`,q),T.send(q))},Zo:()=>T.close()}),B=(q,ht,ot)=>{q.listen(ht,st=>{try{ot(st)}catch(xt){setTimeout(()=>{throw xt},0)}})};return B(T,ws.EventType.OPEN,()=>{V||(W(ee,`RPC '${t}' stream ${o} transport opened.`),z.o_())}),B(T,ws.EventType.CLOSE,()=>{V||(V=!0,W(ee,`RPC '${t}' stream ${o} transport closed`),z.a_(),this.E_(T))}),B(T,ws.EventType.ERROR,q=>{V||(V=!0,br(ee,`RPC '${t}' stream ${o} transport errored. Name:`,q.name,"Message:",q.message),z.a_(new j(D.UNAVAILABLE,"The operation could not be completed")))}),B(T,ws.EventType.MESSAGE,q=>{var ht;if(!V){const ot=q.data[0];Tt(!!ot,16349);const st=ot,xt=(st==null?void 0:st.error)||((ht=st[0])==null?void 0:ht.error);if(xt){W(ee,`RPC '${t}' stream ${o} received error:`,xt);const Ht=xt.status;let Rt=function(A){const R=Ft[A];if(R!==void 0)return Bd(R)}(Ht),C=xt.message;Rt===void 0&&(Rt=D.INTERNAL,C="Unknown error status: "+Ht+" with message "+xt.message),V=!0,z.a_(new j(Rt,C)),T.close()}else W(ee,`RPC '${t}' stream ${o} received:`,ot),z.u_(ot)}}),B(f,id.STAT_EVENT,q=>{q.stat===mu.PROXY?W(ee,`RPC '${t}' stream ${o} detected buffering proxy`):q.stat===mu.NOPROXY&&W(ee,`RPC '${t}' stream ${o} detected no buffering proxy`)}),setTimeout(()=>{z.__()},0),z}terminate(){this.c_.forEach(t=>t.close()),this.c_=[]}I_(t){this.c_.push(t)}E_(t){this.c_=this.c_.filter(e=>e===t)}}function ru(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ia(i){return new cy(i,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(t,e,r=1e3,o=1.5,a=6e4){this.Mi=t,this.timerId=e,this.d_=r,this.A_=o,this.R_=a,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(t){this.cancel();const e=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),o=Math.max(0,e-r);o>0&&W("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,o,()=>(this.f_=Date.now(),t())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qh="PersistentStream";class ef{constructor(t,e,r,o,a,h,f,p){this.Mi=t,this.S_=r,this.b_=o,this.connection=a,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=f,this.listener=p,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new tf(t,e)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(t){this.Q_(),this.stream.send(t)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(t,e){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,t!==4?this.M_.reset():e&&e.code===D.RESOURCE_EXHAUSTED?(In(e.toString()),In("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):e&&e.code===D.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.r_(e)}K_(){}auth(){this.state=1;const t=this.W_(this.D_),e=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,o])=>{this.D_===e&&this.G_(r,o)},r=>{t(()=>{const o=new j(D.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(o)})})}G_(t,e){const r=this.W_(this.D_);this.stream=this.j_(t,e),this.stream.Xo(()=>{r(()=>this.listener.Xo())}),this.stream.t_(()=>{r(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(o=>{r(()=>this.z_(o))}),this.stream.onMessage(o=>{r(()=>++this.F_==1?this.J_(o):this.onNext(o))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(t){return W(Qh,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Mi.enqueueAndForget(()=>this.D_===t?e():(W(Qh,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class ov extends ef{constructor(t,e,r,o,a,h){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,r,o,h),this.serializer=a}j_(t,e){return this.connection.T_("Listen",t,e)}J_(t){return this.onNext(t)}onNext(t){this.M_.reset();const e=dy(this.serializer,t),r=function(a){if(!("targetChange"in a))return it.min();const h=a.targetChange;return h.targetIds&&h.targetIds.length?it.min():h.readTime?Qe(h.readTime):it.min()}(t);return this.listener.H_(e,r)}Y_(t){const e={};e.database=Au(this.serializer),e.addTarget=function(a,h){let f;const p=h.target;if(f=vu(p)?{documents:py(a,p)}:{query:_y(a,p).ft},f.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){f.resumeToken=Hd(a,h.resumeToken);const g=Eu(a,h.expectedCount);g!==null&&(f.expectedCount=g)}else if(h.snapshotVersion.compareTo(it.min())>0){f.readTime=ea(a,h.snapshotVersion.toTimestamp());const g=Eu(a,h.expectedCount);g!==null&&(f.expectedCount=g)}return f}(this.serializer,t);const r=yy(this.serializer,t);r&&(e.labels=r),this.q_(e)}Z_(t){const e={};e.database=Au(this.serializer),e.removeTarget=t,this.q_(e)}}class av extends ef{constructor(t,e,r,o,a,h){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,o,h),this.serializer=a}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(t,e){return this.connection.T_("Write",t,e)}J_(t){return Tt(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,Tt(!t.writeResults||t.writeResults.length===0,55816),this.listener.ta()}onNext(t){Tt(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.M_.reset();const e=my(t.writeResults,t.commitTime),r=Qe(t.commitTime);return this.listener.na(r,e)}ra(){const t={};t.database=Au(this.serializer),this.q_(t)}ea(t){const e={streamToken:this.lastStreamToken,writes:t.map(r=>fy(this.serializer,r))};this.q_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uv{}class cv extends uv{constructor(t,e,r,o){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=o,this.ia=!1}sa(){if(this.ia)throw new j(D.FAILED_PRECONDITION,"The client has already been terminated.")}Go(t,e,r,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,h])=>this.connection.Go(t,Iu(e,r),o,a,h)).catch(a=>{throw a.name==="FirebaseError"?(a.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new j(D.UNKNOWN,a.toString())})}Ho(t,e,r,o,a){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([h,f])=>this.connection.Ho(t,Iu(e,r),o,h,f,a)).catch(h=>{throw h.name==="FirebaseError"?(h.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new j(D.UNKNOWN,h.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class hv{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(t){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ca("Offline")))}set(t){this.Pa(),this.oa=0,t==="Online"&&(this.aa=!1),this.ca(t)}ca(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}la(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(In(e),this.aa=!1):W("OnlineStateTracker",e)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ki="RemoteStore";class lv{constructor(t,e,r,o,a){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=a,this.Aa.Oo(h=>{r.enqueueAndForget(async()=>{Di(this)&&(W(ki,"Restarting streams for network reachability change."),await async function(p){const g=rt(p);g.Ea.add(4),await qs(g),g.Ra.set("Unknown"),g.Ea.delete(4),await Pa(g)}(this))})}),this.Ra=new hv(r,o)}}async function Pa(i){if(Di(i))for(const t of i.da)await t(!0)}async function qs(i){for(const t of i.da)await t(!1)}function nf(i,t){const e=rt(i);e.Ia.has(t.targetId)||(e.Ia.set(t.targetId,t),ac(e)?oc(e):Br(e).O_()&&sc(e,t))}function rc(i,t){const e=rt(i),r=Br(e);e.Ia.delete(t),r.O_()&&rf(e,t),e.Ia.size===0&&(r.O_()?r.L_():Di(e)&&e.Ra.set("Unknown"))}function sc(i,t){if(i.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(it.min())>0){const e=i.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Br(i).Y_(t)}function rf(i,t){i.Va.Ue(t),Br(i).Z_(t)}function oc(i){i.Va=new sy({getRemoteKeysForTarget:t=>i.remoteSyncer.getRemoteKeysForTarget(t),At:t=>i.Ia.get(t)||null,ht:()=>i.datastore.serializer.databaseId}),Br(i).start(),i.Ra.ua()}function ac(i){return Di(i)&&!Br(i).x_()&&i.Ia.size>0}function Di(i){return rt(i).Ea.size===0}function sf(i){i.Va=void 0}async function dv(i){i.Ra.set("Online")}async function fv(i){i.Ia.forEach((t,e)=>{sc(i,t)})}async function mv(i,t){sf(i),ac(i)?(i.Ra.ha(t),oc(i)):i.Ra.set("Unknown")}async function pv(i,t,e){if(i.Ra.set("Online"),t instanceof qd&&t.state===2&&t.cause)try{await async function(o,a){const h=a.cause;for(const f of a.targetIds)o.Ia.has(f)&&(await o.remoteSyncer.rejectListen(f,h),o.Ia.delete(f),o.Va.removeTarget(f))}(i,t)}catch(r){W(ki,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await ia(i,r)}else if(t instanceof zo?i.Va.Ze(t):t instanceof zd?i.Va.st(t):i.Va.tt(t),!e.isEqual(it.min()))try{const r=await Jd(i.localStore);e.compareTo(r)>=0&&await function(a,h){const f=a.Va.Tt(h);return f.targetChanges.forEach((p,g)=>{if(p.resumeToken.approximateByteSize()>0){const w=a.Ia.get(g);w&&a.Ia.set(g,w.withResumeToken(p.resumeToken,h))}}),f.targetMismatches.forEach((p,g)=>{const w=a.Ia.get(p);if(!w)return;a.Ia.set(p,w.withResumeToken(Jt.EMPTY_BYTE_STRING,w.snapshotVersion)),rf(a,p);const T=new jn(w.target,p,g,w.sequenceNumber);sc(a,T)}),a.remoteSyncer.applyRemoteEvent(f)}(i,e)}catch(r){W(ki,"Failed to raise snapshot:",r),await ia(i,r)}}async function ia(i,t,e){if(!Ur(t))throw t;i.Ea.add(1),await qs(i),i.Ra.set("Offline"),e||(e=()=>Jd(i.localStore)),i.asyncQueue.enqueueRetryable(async()=>{W(ki,"Retrying IndexedDB access"),await e(),i.Ea.delete(1),await Pa(i)})}function of(i,t){return t().catch(e=>ia(i,e,t))}async function Aa(i){const t=rt(i),e=ti(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:ju;for(;_v(t);)try{const o=await Yy(t.localStore,r);if(o===null){t.Ta.length===0&&e.L_();break}r=o.batchId,gv(t,o)}catch(o){await ia(t,o)}af(t)&&uf(t)}function _v(i){return Di(i)&&i.Ta.length<10}function gv(i,t){i.Ta.push(t);const e=ti(i);e.O_()&&e.X_&&e.ea(t.mutations)}function af(i){return Di(i)&&!ti(i).x_()&&i.Ta.length>0}function uf(i){ti(i).start()}async function yv(i){ti(i).ra()}async function vv(i){const t=ti(i);for(const e of i.Ta)t.ea(e.mutations)}async function wv(i,t,e){const r=i.Ta.shift(),o=Yu.from(r,t,e);await of(i,()=>i.remoteSyncer.applySuccessfulWrite(o)),await Aa(i)}async function Tv(i,t){t&&ti(i).X_&&await async function(r,o){if(function(h){return ny(h)&&h!==D.ABORTED}(o.code)){const a=r.Ta.shift();ti(r).B_(),await of(r,()=>r.remoteSyncer.rejectFailedWrite(a.batchId,o)),await Aa(r)}}(i,t),af(i)&&uf(i)}async function Yh(i,t){const e=rt(i);e.asyncQueue.verifyOperationInProgress(),W(ki,"RemoteStore received new credentials");const r=Di(e);e.Ea.add(3),await qs(e),r&&e.Ra.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ea.delete(3),await Pa(e)}async function Ev(i,t){const e=rt(i);t?(e.Ea.delete(2),await Pa(e)):t||(e.Ea.add(2),await qs(e),e.Ra.set("Unknown"))}function Br(i){return i.ma||(i.ma=function(e,r,o){const a=rt(e);return a.sa(),new ov(r,a.connection,a.authCredentials,a.appCheckCredentials,a.serializer,o)}(i.datastore,i.asyncQueue,{Xo:dv.bind(null,i),t_:fv.bind(null,i),r_:mv.bind(null,i),H_:pv.bind(null,i)}),i.da.push(async t=>{t?(i.ma.B_(),ac(i)?oc(i):i.Ra.set("Unknown")):(await i.ma.stop(),sf(i))})),i.ma}function ti(i){return i.fa||(i.fa=function(e,r,o){const a=rt(e);return a.sa(),new av(r,a.connection,a.authCredentials,a.appCheckCredentials,a.serializer,o)}(i.datastore,i.asyncQueue,{Xo:()=>Promise.resolve(),t_:yv.bind(null,i),r_:Tv.bind(null,i),ta:vv.bind(null,i),na:wv.bind(null,i)}),i.da.push(async t=>{t?(i.fa.B_(),await Aa(i)):(await i.fa.stop(),i.Ta.length>0&&(W(ki,`Stopping write stream with ${i.Ta.length} pending writes`),i.Ta=[]))})),i.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(t,e,r,o,a){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=o,this.removalCallback=a,this.deferred=new vn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(h=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,o,a){const h=Date.now()+r,f=new uc(t,e,h,o,a);return f.start(r),f}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new j(D.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function cc(i,t){if(In("AsyncQueue",`${t}: ${i}`),Ur(i))return new j(D.UNAVAILABLE,`${t}: ${i}`);throw i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wr{static emptySet(t){return new wr(t.comparator)}constructor(t){this.comparator=t?(e,r)=>t(e,r)||K.comparator(e.key,r.key):(e,r)=>K.comparator(e.key,r.key),this.keyedMap=Ts(),this.sortedSet=new Lt(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,r)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof wr)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;e.hasNext();){const o=e.getNext().key,a=r.getNext().key;if(!o.isEqual(a))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const r=new wr;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=e,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xh{constructor(){this.ga=new Lt(K.comparator)}track(t){const e=t.doc.key,r=this.ga.get(e);r?t.type!==0&&r.type===3?this.ga=this.ga.insert(e,t):t.type===3&&r.type!==1?this.ga=this.ga.insert(e,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.ga=this.ga.insert(e,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.ga=this.ga.remove(e):t.type===1&&r.type===2?this.ga=this.ga.insert(e,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):X(63341,{Rt:t,pa:r}):this.ga=this.ga.insert(e,t)}ya(){const t=[];return this.ga.inorderTraversal((e,r)=>{t.push(r)}),t}}class Nr{constructor(t,e,r,o,a,h,f,p,g){this.query=t,this.docs=e,this.oldDocs=r,this.docChanges=o,this.mutatedKeys=a,this.fromCache=h,this.syncStateChanged=f,this.excludesMetadataChanges=p,this.hasCachedResults=g}static fromInitialDocuments(t,e,r,o,a){const h=[];return e.forEach(f=>{h.push({type:0,doc:f})}),new Nr(t,e,wr.emptySet(e),h,r,o,!0,!1,a)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&ya(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,r=t.docChanges;if(e.length!==r.length)return!1;for(let o=0;o<e.length;o++)if(e[o].type!==r[o].type||!e[o].doc.isEqual(r[o].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iv{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(t=>t.Da())}}class Pv{constructor(){this.queries=Jh(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(e,r){const o=rt(e),a=o.queries;o.queries=Jh(),a.forEach((h,f)=>{for(const p of f.Sa)p.onError(r)})})(this,new j(D.ABORTED,"Firestore shutting down"))}}function Jh(){return new Oi(i=>bd(i),ya)}async function cf(i,t){const e=rt(i);let r=3;const o=t.query;let a=e.queries.get(o);a?!a.ba()&&t.Da()&&(r=2):(a=new Iv,r=t.Da()?0:1);try{switch(r){case 0:a.wa=await e.onListen(o,!0);break;case 1:a.wa=await e.onListen(o,!1);break;case 2:await e.onFirstRemoteStoreListen(o)}}catch(h){const f=cc(h,`Initialization of query '${mr(t.query)}' failed`);return void t.onError(f)}e.queries.set(o,a),a.Sa.push(t),t.va(e.onlineState),a.wa&&t.Fa(a.wa)&&hc(e)}async function hf(i,t){const e=rt(i),r=t.query;let o=3;const a=e.queries.get(r);if(a){const h=a.Sa.indexOf(t);h>=0&&(a.Sa.splice(h,1),a.Sa.length===0?o=t.Da()?0:1:!a.ba()&&t.Da()&&(o=2))}switch(o){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function Av(i,t){const e=rt(i);let r=!1;for(const o of t){const a=o.query,h=e.queries.get(a);if(h){for(const f of h.Sa)f.Fa(o)&&(r=!0);h.wa=o}}r&&hc(e)}function bv(i,t,e){const r=rt(i),o=r.queries.get(t);if(o)for(const a of o.Sa)a.onError(e);r.queries.delete(t)}function hc(i){i.Ca.forEach(t=>{t.next()})}var Cu,tl;(tl=Cu||(Cu={})).Ma="default",tl.Cache="cache";class lf{constructor(t,e,r){this.query=t,this.xa=e,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(t){if(!this.options.includeMetadataChanges){const r=[];for(const o of t.docChanges)o.type!==3&&r.push(o);t=new Nr(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.Oa?this.Ba(t)&&(this.xa.next(t),e=!0):this.La(t,this.onlineState)&&(this.ka(t),e=!0),this.Na=t,e}onError(t){this.xa.error(t)}va(t){this.onlineState=t;let e=!1;return this.Na&&!this.Oa&&this.La(this.Na,t)&&(this.ka(this.Na),e=!0),e}La(t,e){if(!t.fromCache||!this.Da())return!0;const r=e!=="Offline";return(!this.options.qa||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}Ba(t){if(t.docChanges.length>0)return!0;const e=this.Na&&this.Na.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}ka(t){t=Nr.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Oa=!0,this.xa.next(t)}Da(){return this.options.source!==Cu.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class df{constructor(t){this.key=t}}class ff{constructor(t){this.key=t}}class Sv{constructor(t,e){this.query=t,this.Ya=e,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=ft(),this.mutatedKeys=ft(),this.eu=Sd(t),this.tu=new wr(this.eu)}get nu(){return this.Ya}ru(t,e){const r=e?e.iu:new Xh,o=e?e.tu:this.tu;let a=e?e.mutatedKeys:this.mutatedKeys,h=o,f=!1;const p=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,g=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(t.inorderTraversal((w,T)=>{const b=o.get(w),V=va(this.query,T)?T:null,z=!!b&&this.mutatedKeys.has(b.key),B=!!V&&(V.hasLocalMutations||this.mutatedKeys.has(V.key)&&V.hasCommittedMutations);let q=!1;b&&V?b.data.isEqual(V.data)?z!==B&&(r.track({type:3,doc:V}),q=!0):this.su(b,V)||(r.track({type:2,doc:V}),q=!0,(p&&this.eu(V,p)>0||g&&this.eu(V,g)<0)&&(f=!0)):!b&&V?(r.track({type:0,doc:V}),q=!0):b&&!V&&(r.track({type:1,doc:b}),q=!0,(p||g)&&(f=!0)),q&&(V?(h=h.add(V),a=B?a.add(w):a.delete(w)):(h=h.delete(w),a=a.delete(w)))}),this.query.limit!==null)for(;h.size>this.query.limit;){const w=this.query.limitType==="F"?h.last():h.first();h=h.delete(w.key),a=a.delete(w.key),r.track({type:1,doc:w})}return{tu:h,iu:r,Cs:f,mutatedKeys:a}}su(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,r,o){const a=this.tu;this.tu=t.tu,this.mutatedKeys=t.mutatedKeys;const h=t.iu.ya();h.sort((w,T)=>function(V,z){const B=q=>{switch(q){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return X(20277,{Rt:q})}};return B(V)-B(z)}(w.type,T.type)||this.eu(w.doc,T.doc)),this.ou(r),o=o??!1;const f=e&&!o?this._u():[],p=this.Xa.size===0&&this.current&&!o?1:0,g=p!==this.Za;return this.Za=p,h.length!==0||g?{snapshot:new Nr(this.query,t.tu,a,h,t.mutatedKeys,p===0,g,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:f}:{au:f}}va(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Xh,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(t){return!this.Ya.has(t)&&!!this.tu.has(t)&&!this.tu.get(t).hasLocalMutations}ou(t){t&&(t.addedDocuments.forEach(e=>this.Ya=this.Ya.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.Ya=this.Ya.delete(e)),this.current=t.current)}_u(){if(!this.current)return[];const t=this.Xa;this.Xa=ft(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Xa=this.Xa.add(r.key))});const e=[];return t.forEach(r=>{this.Xa.has(r)||e.push(new ff(r))}),this.Xa.forEach(r=>{t.has(r)||e.push(new df(r))}),e}cu(t){this.Ya=t.Qs,this.Xa=ft();const e=this.ru(t.documents);return this.applyChanges(e,!0)}lu(){return Nr.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const lc="SyncEngine";class Cv{constructor(t,e,r){this.query=t,this.targetId=e,this.view=r}}class Rv{constructor(t){this.key=t,this.hu=!1}}class Lv{constructor(t,e,r,o,a,h){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=o,this.currentUser=a,this.maxConcurrentLimboResolutions=h,this.Pu={},this.Tu=new Oi(f=>bd(f),ya),this.Iu=new Map,this.Eu=new Set,this.du=new Lt(K.comparator),this.Au=new Map,this.Ru=new tc,this.Vu={},this.mu=new Map,this.fu=Mr.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function xv(i,t,e=!0){const r=vf(i);let o;const a=r.Tu.get(t);return a?(r.sharedClientState.addLocalQueryTarget(a.targetId),o=a.view.lu()):o=await mf(r,t,e,!0),o}async function kv(i,t){const e=vf(i);await mf(e,t,!0,!1)}async function mf(i,t,e,r){const o=await Xy(i.localStore,Ke(t)),a=o.targetId,h=i.sharedClientState.addLocalQueryTarget(a,e);let f;return r&&(f=await Mv(i,t,a,h==="current",o.resumeToken)),i.isPrimaryClient&&e&&nf(i.remoteStore,o),f}async function Mv(i,t,e,r,o){i.pu=(T,b,V)=>async function(B,q,ht,ot){let st=q.view.ru(ht);st.Cs&&(st=await Wh(B.localStore,q.query,!1).then(({documents:C})=>q.view.ru(C,st)));const xt=ot&&ot.targetChanges.get(q.targetId),Ht=ot&&ot.targetMismatches.get(q.targetId)!=null,Rt=q.view.applyChanges(st,B.isPrimaryClient,xt,Ht);return nl(B,q.targetId,Rt.au),Rt.snapshot}(i,T,b,V);const a=await Wh(i.localStore,t,!0),h=new Sv(t,a.Qs),f=h.ru(a.documents),p=zs.createSynthesizedTargetChangeForCurrentChange(e,r&&i.onlineState!=="Offline",o),g=h.applyChanges(f,i.isPrimaryClient,p);nl(i,e,g.au);const w=new Cv(t,e,h);return i.Tu.set(t,w),i.Iu.has(e)?i.Iu.get(e).push(t):i.Iu.set(e,[t]),g.snapshot}async function Nv(i,t,e){const r=rt(i),o=r.Tu.get(t),a=r.Iu.get(o.targetId);if(a.length>1)return r.Iu.set(o.targetId,a.filter(h=>!ya(h,t))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(o.targetId),r.sharedClientState.isActiveQueryTarget(o.targetId)||await bu(r.localStore,o.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(o.targetId),e&&rc(r.remoteStore,o.targetId),Ru(r,o.targetId)}).catch(Fr)):(Ru(r,o.targetId),await bu(r.localStore,o.targetId,!0))}async function Ov(i,t){const e=rt(i),r=e.Tu.get(t),o=e.Iu.get(r.targetId);e.isPrimaryClient&&o.length===1&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),rc(e.remoteStore,r.targetId))}async function Dv(i,t,e){const r=Hv(i);try{const o=await function(h,f){const p=rt(h),g=St.now(),w=f.reduce((V,z)=>V.add(z.key),ft());let T,b;return p.persistence.runTransaction("Locally write mutations","readwrite",V=>{let z=Pn(),B=ft();return p.Ns.getEntries(V,w).next(q=>{z=q,z.forEach((ht,ot)=>{ot.isValidDocument()||(B=B.add(ht))})}).next(()=>p.localDocuments.getOverlayedDocuments(V,z)).next(q=>{T=q;const ht=[];for(const ot of f){const st=Yg(ot,T.get(ot.key).overlayedDocument);st!=null&&ht.push(new ri(ot.key,st,vd(st.value.mapValue),De.exists(!0)))}return p.mutationQueue.addMutationBatch(V,g,ht,f)}).next(q=>{b=q;const ht=q.applyToLocalDocumentSet(T,B);return p.documentOverlayCache.saveOverlays(V,q.batchId,ht)})}).then(()=>({batchId:b.batchId,changes:Rd(T)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(o.batchId),function(h,f,p){let g=h.Vu[h.currentUser.toKey()];g||(g=new Lt(dt)),g=g.insert(f,p),h.Vu[h.currentUser.toKey()]=g}(r,o.batchId,e),await Hs(r,o.changes),await Aa(r.remoteStore)}catch(o){const a=cc(o,"Failed to persist write");e.reject(a)}}async function pf(i,t){const e=rt(i);try{const r=await Ky(e.localStore,t);t.targetChanges.forEach((o,a)=>{const h=e.Au.get(a);h&&(Tt(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.hu=!0:o.modifiedDocuments.size>0?Tt(h.hu,14607):o.removedDocuments.size>0&&(Tt(h.hu,42227),h.hu=!1))}),await Hs(e,r,t)}catch(r){await Fr(r)}}function el(i,t,e){const r=rt(i);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const o=[];r.Tu.forEach((a,h)=>{const f=h.view.va(t);f.snapshot&&o.push(f.snapshot)}),function(h,f){const p=rt(h);p.onlineState=f;let g=!1;p.queries.forEach((w,T)=>{for(const b of T.Sa)b.va(f)&&(g=!0)}),g&&hc(p)}(r.eventManager,t),o.length&&r.Pu.H_(o),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function Vv(i,t,e){const r=rt(i);r.sharedClientState.updateQueryState(t,"rejected",e);const o=r.Au.get(t),a=o&&o.key;if(a){let h=new Lt(K.comparator);h=h.insert(a,ie.newNoDocument(a,it.min()));const f=ft().add(a),p=new Ea(it.min(),new Map,new Lt(dt),h,f);await pf(r,p),r.du=r.du.remove(a),r.Au.delete(t),dc(r)}else await bu(r.localStore,t,!1).then(()=>Ru(r,t,e)).catch(Fr)}async function Fv(i,t){const e=rt(i),r=t.batch.batchId;try{const o=await Zy(e.localStore,t);gf(e,r,null),_f(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await Hs(e,o)}catch(o){await Fr(o)}}async function Uv(i,t,e){const r=rt(i);try{const o=await function(h,f){const p=rt(h);return p.persistence.runTransaction("Reject batch","readwrite-primary",g=>{let w;return p.mutationQueue.lookupMutationBatch(g,f).next(T=>(Tt(T!==null,37113),w=T.keys(),p.mutationQueue.removeMutationBatch(g,T))).next(()=>p.mutationQueue.performConsistencyCheck(g)).next(()=>p.documentOverlayCache.removeOverlaysForBatchId(g,w,f)).next(()=>p.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(g,w)).next(()=>p.localDocuments.getDocuments(g,w))})}(r.localStore,t);gf(r,t,e),_f(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await Hs(r,o)}catch(o){await Fr(o)}}function _f(i,t){(i.mu.get(t)||[]).forEach(e=>{e.resolve()}),i.mu.delete(t)}function gf(i,t,e){const r=rt(i);let o=r.Vu[r.currentUser.toKey()];if(o){const a=o.get(t);a&&(e?a.reject(e):a.resolve(),o=o.remove(t)),r.Vu[r.currentUser.toKey()]=o}}function Ru(i,t,e=null){i.sharedClientState.removeLocalQueryTarget(t);for(const r of i.Iu.get(t))i.Tu.delete(r),e&&i.Pu.yu(r,e);i.Iu.delete(t),i.isPrimaryClient&&i.Ru.jr(t).forEach(r=>{i.Ru.containsKey(r)||yf(i,r)})}function yf(i,t){i.Eu.delete(t.path.canonicalString());const e=i.du.get(t);e!==null&&(rc(i.remoteStore,e),i.du=i.du.remove(t),i.Au.delete(e),dc(i))}function nl(i,t,e){for(const r of e)r instanceof df?(i.Ru.addReference(r.key,t),Bv(i,r)):r instanceof ff?(W(lc,"Document no longer in limbo: "+r.key),i.Ru.removeReference(r.key,t),i.Ru.containsKey(r.key)||yf(i,r.key)):X(19791,{wu:r})}function Bv(i,t){const e=t.key,r=e.path.canonicalString();i.du.get(e)||i.Eu.has(r)||(W(lc,"New document in limbo: "+e),i.Eu.add(r),dc(i))}function dc(i){for(;i.Eu.size>0&&i.du.size<i.maxConcurrentLimboResolutions;){const t=i.Eu.values().next().value;i.Eu.delete(t);const e=new K(It.fromString(t)),r=i.fu.next();i.Au.set(r,new Rv(e)),i.du=i.du.insert(e,r),nf(i.remoteStore,new jn(Ke(Zu(e.path)),r,"TargetPurposeLimboResolution",ma.ce))}}async function Hs(i,t,e){const r=rt(i),o=[],a=[],h=[];r.Tu.isEmpty()||(r.Tu.forEach((f,p)=>{h.push(r.pu(p,t,e).then(g=>{var w;if((g||e)&&r.isPrimaryClient){const T=g?!g.fromCache:(w=e==null?void 0:e.targetChanges.get(p.targetId))==null?void 0:w.current;r.sharedClientState.updateQueryState(p.targetId,T?"current":"not-current")}if(g){o.push(g);const T=nc.As(p.targetId,g);a.push(T)}}))}),await Promise.all(h),r.Pu.H_(o),await async function(p,g){const w=rt(p);try{await w.persistence.runTransaction("notifyLocalViewChanges","readwrite",T=>F.forEach(g,b=>F.forEach(b.Es,V=>w.persistence.referenceDelegate.addReference(T,b.targetId,V)).next(()=>F.forEach(b.ds,V=>w.persistence.referenceDelegate.removeReference(T,b.targetId,V)))))}catch(T){if(!Ur(T))throw T;W(ic,"Failed to update sequence numbers: "+T)}for(const T of g){const b=T.targetId;if(!T.fromCache){const V=w.Ms.get(b),z=V.snapshotVersion,B=V.withLastLimboFreeSnapshotVersion(z);w.Ms=w.Ms.insert(b,B)}}}(r.localStore,a))}async function zv(i,t){const e=rt(i);if(!e.currentUser.isEqual(t)){W(lc,"User change. New user:",t.toKey());const r=await Xd(e.localStore,t);e.currentUser=t,function(a,h){a.mu.forEach(f=>{f.forEach(p=>{p.reject(new j(D.CANCELLED,h))})}),a.mu.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await Hs(e,r.Ls)}}function qv(i,t){const e=rt(i),r=e.Au.get(t);if(r&&r.hu)return ft().add(r.key);{let o=ft();const a=e.Iu.get(t);if(!a)return o;for(const h of a){const f=e.Tu.get(h);o=o.unionWith(f.view.nu)}return o}}function vf(i){const t=rt(i);return t.remoteStore.remoteSyncer.applyRemoteEvent=pf.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=qv.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=Vv.bind(null,t),t.Pu.H_=Av.bind(null,t.eventManager),t.Pu.yu=bv.bind(null,t.eventManager),t}function Hv(i){const t=rt(i);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Fv.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=Uv.bind(null,t),t}class ra{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=Ia(t.databaseInfo.databaseId),this.sharedClientState=this.Du(t),this.persistence=this.Cu(t),await this.persistence.start(),this.localStore=this.vu(t),this.gcScheduler=this.Fu(t,this.localStore),this.indexBackfillerScheduler=this.Mu(t,this.localStore)}Fu(t,e){return null}Mu(t,e){return null}vu(t){return $y(this.persistence,new jy,t.initialUser,this.serializer)}Cu(t){return new Yd(ec.mi,this.serializer)}Du(t){return new tv}async terminate(){var t,e;(t=this.gcScheduler)==null||t.stop(),(e=this.indexBackfillerScheduler)==null||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ra.provider={build:()=>new ra};class jv extends ra{constructor(t){super(),this.cacheSizeBytes=t}Fu(t,e){Tt(this.persistence.referenceDelegate instanceof na,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new Ry(r,t.asyncQueue,e)}Cu(t){const e=this.cacheSizeBytes!==void 0?me.withCacheSize(this.cacheSizeBytes):me.DEFAULT;return new Yd(r=>na.mi(r,e),this.serializer)}}class Lu{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>el(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=zv.bind(null,this.syncEngine),await Ev(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new Pv}()}createDatastore(t){const e=Ia(t.databaseInfo.databaseId),r=function(a){return new sv(a)}(t.databaseInfo);return function(a,h,f,p){return new cv(a,h,f,p)}(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return function(r,o,a,h,f){return new lv(r,o,a,h,f)}(this.localStore,this.datastore,t.asyncQueue,e=>el(this.syncEngine,e,0),function(){return Kh.v()?new Kh:new ev}())}createSyncEngine(t,e){return function(o,a,h,f,p,g,w){const T=new Lv(o,a,h,f,p,g);return w&&(T.gu=!0),T}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(o){const a=rt(o);W(ki,"RemoteStore shutting down."),a.Ea.add(5),await qs(a),a.Aa.shutdown(),a.Ra.set("Unknown")}(this.remoteStore),(t=this.datastore)==null||t.terminate(),(e=this.eventManager)==null||e.terminate()}}Lu.provider={build:()=>new Lu};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wf{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ou(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ou(this.observer.error,t):In("Uncaught Error in snapshot listener:",t.toString()))}Nu(){this.muted=!0}Ou(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ei="FirestoreClient";class Gv{constructor(t,e,r,o,a){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this.databaseInfo=o,this.user=ne.UNAUTHENTICATED,this.clientId=Hu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=a,this.authCredentials.start(r,async h=>{W(ei,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h}),this.appCheckCredentials.start(r,h=>(W(ei,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new vn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=cc(e,"Failed to shutdown persistence");t.reject(r)}}),t.promise}}async function su(i,t){i.asyncQueue.verifyOperationInProgress(),W(ei,"Initializing OfflineComponentProvider");const e=i.configuration;await t.initialize(e);let r=e.initialUser;i.setCredentialChangeListener(async o=>{r.isEqual(o)||(await Xd(t.localStore,o),r=o)}),t.persistence.setDatabaseDeletedListener(()=>i.terminate()),i._offlineComponents=t}async function il(i,t){i.asyncQueue.verifyOperationInProgress();const e=await Wv(i);W(ei,"Initializing OnlineComponentProvider"),await t.initialize(e,i.configuration),i.setCredentialChangeListener(r=>Yh(t.remoteStore,r)),i.setAppCheckTokenChangeListener((r,o)=>Yh(t.remoteStore,o)),i._onlineComponents=t}async function Wv(i){if(!i._offlineComponents)if(i._uninitializedComponentsProvider){W(ei,"Using user provided OfflineComponentProvider");try{await su(i,i._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(o){return o.name==="FirebaseError"?o.code===D.FAILED_PRECONDITION||o.code===D.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11}(e))throw e;br("Error using user provided cache. Falling back to memory cache: "+e),await su(i,new ra)}}else W(ei,"Using default OfflineComponentProvider"),await su(i,new jv(void 0));return i._offlineComponents}async function Tf(i){return i._onlineComponents||(i._uninitializedComponentsProvider?(W(ei,"Using user provided OnlineComponentProvider"),await il(i,i._uninitializedComponentsProvider._online)):(W(ei,"Using default OnlineComponentProvider"),await il(i,new Lu))),i._onlineComponents}function $v(i){return Tf(i).then(t=>t.syncEngine)}async function Ef(i){const t=await Tf(i),e=t.eventManager;return e.onListen=xv.bind(null,t.syncEngine),e.onUnlisten=Nv.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=kv.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=Ov.bind(null,t.syncEngine),e}function Zv(i,t,e={}){const r=new vn;return i.asyncQueue.enqueueAndForget(async()=>function(a,h,f,p,g){const w=new wf({next:b=>{w.Nu(),h.enqueueAndForget(()=>hf(a,T));const V=b.docs.has(f);!V&&b.fromCache?g.reject(new j(D.UNAVAILABLE,"Failed to get document because the client is offline.")):V&&b.fromCache&&p&&p.source==="server"?g.reject(new j(D.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):g.resolve(b)},error:b=>g.reject(b)}),T=new lf(Zu(f.path),w,{includeMetadataChanges:!0,qa:!0});return cf(a,T)}(await Ef(i),i.asyncQueue,t,e,r)),r.promise}function Kv(i,t,e={}){const r=new vn;return i.asyncQueue.enqueueAndForget(async()=>function(a,h,f,p,g){const w=new wf({next:b=>{w.Nu(),h.enqueueAndForget(()=>hf(a,T)),b.fromCache&&p.source==="server"?g.reject(new j(D.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):g.resolve(b)},error:b=>g.reject(b)}),T=new lf(f,w,{includeMetadataChanges:!0,qa:!0});return cf(a,T)}(await Ef(i),i.asyncQueue,t,e,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function If(i){const t={};return i.timeoutSeconds!==void 0&&(t.timeoutSeconds=i.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rl=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pf="firestore.googleapis.com",sl=!0;class ol{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new j(D.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Pf,this.ssl=sl}else this.host=t.host,this.ssl=t.ssl??sl;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=Qd;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<Sy)throw new j(D.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}lg("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=If(t.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new j(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new j(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new j(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(r,o){return r.timeoutSeconds===o.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class ba{constructor(t,e,r,o){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ol({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new j(D.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new j(D.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ol(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new eg;switch(r.type){case"firstParty":return new sg(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new j(D.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const r=rl.get(e);r&&(W("ComponentProvider","Removing Datastore"),rl.delete(e),r.terminate())}(this),Promise.resolve()}}function Qv(i,t,e,r={}){var g;i=en(i,ba);const o=Or(t),a=i._getSettings(),h={...a,emulatorOptions:i._getEmulatorOptions()},f=`${t}:${e}`;o&&(Wl(`https://${f}`),$l("Firestore",!0)),a.host!==Pf&&a.host!==f&&br("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const p={...a,host:f,ssl:o,emulatorOptions:r};if(!Tn(p,h)&&(i._setSettings(p),r.mockUserToken)){let w,T;if(typeof r.mockUserToken=="string")w=r.mockUserToken,T=ne.MOCK_USER;else{w=Cp(r.mockUserToken,(g=i._app)==null?void 0:g.options.projectId);const b=r.mockUserToken.sub||r.mockUserToken.user_id;if(!b)throw new j(D.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");T=new ne(b)}i._authCredentials=new ng(new ad(w,T))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new Sn(this.firestore,t,this._query)}}class Ot{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Kn(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Ot(this.firestore,t,this._key)}toJSON(){return{type:Ot._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,r){if(Us(e,Ot._jsonSchema))return new Ot(t,r||null,new K(It.fromString(e.referencePath)))}}Ot._jsonSchemaVersion="firestore/documentReference/1.0",Ot._jsonSchema={type:Bt("string",Ot._jsonSchemaVersion),referencePath:Bt("string")};class Kn extends Sn{constructor(t,e,r){super(t,e,Zu(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Ot(this.firestore,null,new K(t))}withConverter(t){return new Kn(this.firestore,t,this._path)}}function Af(i,t,...e){if(i=zt(i),ud("collection","path",t),i instanceof ba){const r=It.fromString(t,...e);return wh(r),new Kn(i,null,r)}{if(!(i instanceof Ot||i instanceof Kn))throw new j(D.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=i._path.child(It.fromString(t,...e));return wh(r),new Kn(i.firestore,null,r)}}function gr(i,t,...e){if(i=zt(i),arguments.length===1&&(t=Hu.newId()),ud("doc","path",t),i instanceof ba){const r=It.fromString(t,...e);return vh(r),new Ot(i,null,new K(r))}{if(!(i instanceof Ot||i instanceof Kn))throw new j(D.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=i._path.child(It.fromString(t,...e));return vh(r),new Ot(i.firestore,i instanceof Kn?i.converter:null,new K(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const al="AsyncQueue";class ul{constructor(t=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new tf(this,"async_queue_retry"),this._c=()=>{const r=ru();r&&W(al,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=t;const e=ru();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.uc(),this.cc(t)}enterRestrictedMode(t){if(!this.ec){this.ec=!0,this.sc=t||!1;const e=ru();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this._c)}}enqueue(t){if(this.uc(),this.ec)return new Promise(()=>{});const e=new vn;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Xu.push(t),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(t){if(!Ur(t))throw t;W(al,"Operation failed with retryable error: "+t)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(t){const e=this.ac.then(()=>(this.rc=!0,t().catch(r=>{throw this.nc=r,this.rc=!1,In("INTERNAL UNHANDLED ERROR: ",cl(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=e,e}enqueueAfterDelay(t,e,r){this.uc(),this.oc.indexOf(t)>-1&&(e=0);const o=uc.createAndSchedule(this,t,e,r,a=>this.hc(a));return this.tc.push(o),o}uc(){this.nc&&X(47125,{Pc:cl(this.nc)})}verifyOperationInProgress(){}async Tc(){let t;do t=this.ac,await t;while(t!==this.ac)}Ic(t){for(const e of this.tc)if(e.timerId===t)return!0;return!1}Ec(t){return this.Tc().then(()=>{this.tc.sort((e,r)=>e.targetTimeMs-r.targetTimeMs);for(const e of this.tc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Tc()})}dc(t){this.oc.push(t)}hc(t){const e=this.tc.indexOf(t);this.tc.splice(e,1)}}function cl(i){let t=i.message||"";return i.stack&&(t=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),t}class zr extends ba{constructor(t,e,r,o){super(t,e,r,o),this.type="firestore",this._queue=new ul,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new ul(t),this._firestoreClient=void 0,await t}}}function Yv(i,t){const e=typeof i=="object"?i:Yl(),r=typeof i=="string"?i:Qo,o=zu(e,"firestore").getImmediate({identifier:r});if(!o._initialized){const a=bp("firestore");a&&Qv(o,...a)}return o}function fc(i){if(i._terminated)throw new j(D.FAILED_PRECONDITION,"The client has already been terminated.");return i._firestoreClient||Xv(i),i._firestoreClient}function Xv(i){var r,o,a;const t=i._freezeSettings(),e=function(f,p,g,w){return new Eg(f,p,g,w.host,w.ssl,w.experimentalForceLongPolling,w.experimentalAutoDetectLongPolling,If(w.experimentalLongPollingOptions),w.useFetchStreams,w.isUsingEmulator)}(i._databaseId,((r=i._app)==null?void 0:r.options.appId)||"",i._persistenceKey,t);i._componentsProvider||(o=t.localCache)!=null&&o._offlineComponentProvider&&((a=t.localCache)!=null&&a._onlineComponentProvider)&&(i._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),i._firestoreClient=new Gv(i._authCredentials,i._appCheckCredentials,i._queue,e,i._componentsProvider&&function(f){const p=f==null?void 0:f._online.build();return{_offline:f==null?void 0:f._offline.build(p),_online:p}}(i._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Re(Jt.fromBase64String(t))}catch(e){throw new j(D.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Re(Jt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Re._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(Us(t,Re._jsonSchema))return Re.fromBase64String(t.bytes)}}Re._jsonSchemaVersion="firestore/bytes/1.0",Re._jsonSchema={type:Bt("string",Re._jsonSchemaVersion),bytes:Bt("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sa{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new j(D.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Xt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class js{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new j(D.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new j(D.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return dt(this._lat,t._lat)||dt(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ye._jsonSchemaVersion}}static fromJSON(t){if(Us(t,Ye._jsonSchema))return new Ye(t.latitude,t.longitude)}}Ye._jsonSchemaVersion="firestore/geoPoint/1.0",Ye._jsonSchema={type:Bt("string",Ye._jsonSchemaVersion),latitude:Bt("number"),longitude:Bt("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(r,o){if(r.length!==o.length)return!1;for(let a=0;a<r.length;++a)if(r[a]!==o[a])return!1;return!0}(this._values,t._values)}toJSON(){return{type:Xe._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(Us(t,Xe._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every(e=>typeof e=="number"))return new Xe(t.vectorValues);throw new j(D.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Xe._jsonSchemaVersion="firestore/vectorValue/1.0",Xe._jsonSchema={type:Bt("string",Xe._jsonSchemaVersion),vectorValues:Bt("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jv=/^__.*__$/;class tw{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new ri(t,this.data,this.fieldMask,e,this.fieldTransforms):new Bs(t,this.data,e,this.fieldTransforms)}}class bf{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return new ri(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Sf(i){switch(i){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw X(40011,{Ac:i})}}class Ca{constructor(t,e,r,o,a,h){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=o,a===void 0&&this.Rc(),this.fieldTransforms=a||[],this.fieldMask=h||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(t){return new Ca({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(t){var o;const e=(o=this.path)==null?void 0:o.child(t),r=this.Vc({path:e,fc:!1});return r.gc(t),r}yc(t){var o;const e=(o=this.path)==null?void 0:o.child(t),r=this.Vc({path:e,fc:!1});return r.Rc(),r}wc(t){return this.Vc({path:void 0,fc:!0})}Sc(t){return sa(t,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}Rc(){if(this.path)for(let t=0;t<this.path.length;t++)this.gc(this.path.get(t))}gc(t){if(t.length===0)throw this.Sc("Document fields must not be empty");if(Sf(this.Ac)&&Jv.test(t))throw this.Sc('Document fields cannot begin and end with "__"')}}class ew{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||Ia(t)}Cc(t,e,r,o=!1){return new Ca({Ac:t,methodName:e,Dc:r,path:Xt.emptyPath(),fc:!1,bc:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Gs(i){const t=i._freezeSettings(),e=Ia(i._databaseId);return new ew(i._databaseId,!!t.ignoreUndefinedProperties,e)}function Cf(i,t,e,r,o,a={}){const h=i.Cc(a.merge||a.mergeFields?2:0,t,e,o);_c("Data must be an object, but it was:",h,r);const f=xf(r,h);let p,g;if(a.merge)p=new ve(h.fieldMask),g=h.fieldTransforms;else if(a.mergeFields){const w=[];for(const T of a.mergeFields){const b=xu(t,T,e);if(!h.contains(b))throw new j(D.INVALID_ARGUMENT,`Field '${b}' is specified in your field mask but missing from your input data.`);Mf(w,b)||w.push(b)}p=new ve(w),g=h.fieldTransforms.filter(T=>p.covers(T.field))}else p=null,g=h.fieldTransforms;return new tw(new pe(f),p,g)}class Ra extends js{_toFieldTransform(t){if(t.Ac!==2)throw t.Ac===1?t.Sc(`${this._methodName}() can only appear at the top level of your update data`):t.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Ra}}function Rf(i,t,e){return new Ca({Ac:3,Dc:t.settings.Dc,methodName:i._methodName,fc:e},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class mc extends js{constructor(t,e){super(t),this.vc=e}_toFieldTransform(t){const e=Rf(this,t,!0),r=this.vc.map(a=>Vi(a,e)),o=new xr(r);return new Dd(t.path,o)}isEqual(t){return t instanceof mc&&Tn(this.vc,t.vc)}}class pc extends js{constructor(t,e){super(t),this.vc=e}_toFieldTransform(t){const e=Rf(this,t,!0),r=this.vc.map(a=>Vi(a,e)),o=new kr(r);return new Dd(t.path,o)}isEqual(t){return t instanceof pc&&Tn(this.vc,t.vc)}}function nw(i,t,e,r){const o=i.Cc(1,t,e);_c("Data must be an object, but it was:",o,r);const a=[],h=pe.empty();ni(r,(p,g)=>{const w=gc(t,p,e);g=zt(g);const T=o.yc(w);if(g instanceof Ra)a.push(w);else{const b=Vi(g,T);b!=null&&(a.push(w),h.set(w,b))}});const f=new ve(a);return new bf(h,f,o.fieldTransforms)}function iw(i,t,e,r,o,a){const h=i.Cc(1,t,e),f=[xu(t,r,e)],p=[o];if(a.length%2!=0)throw new j(D.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let b=0;b<a.length;b+=2)f.push(xu(t,a[b])),p.push(a[b+1]);const g=[],w=pe.empty();for(let b=f.length-1;b>=0;--b)if(!Mf(g,f[b])){const V=f[b];let z=p[b];z=zt(z);const B=h.yc(V);if(z instanceof Ra)g.push(V);else{const q=Vi(z,B);q!=null&&(g.push(V),w.set(V,q))}}const T=new ve(g);return new bf(w,T,h.fieldTransforms)}function Lf(i,t,e,r=!1){return Vi(e,i.Cc(r?4:3,t))}function Vi(i,t){if(kf(i=zt(i)))return _c("Unsupported field value:",t,i),xf(i,t);if(i instanceof js)return function(r,o){if(!Sf(o.Ac))throw o.Sc(`${r._methodName}() can only be used with update() and set()`);if(!o.path)throw o.Sc(`${r._methodName}() is not currently supported inside arrays`);const a=r._toFieldTransform(o);a&&o.fieldTransforms.push(a)}(i,t),null;if(i===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),i instanceof Array){if(t.settings.fc&&t.Ac!==4)throw t.Sc("Nested arrays are not supported");return function(r,o){const a=[];let h=0;for(const f of r){let p=Vi(f,o.wc(h));p==null&&(p={nullValue:"NULL_VALUE"}),a.push(p),h++}return{arrayValue:{values:a}}}(i,t)}return function(r,o){if((r=zt(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return Gg(o.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const a=St.fromDate(r);return{timestampValue:ea(o.serializer,a)}}if(r instanceof St){const a=new St(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:ea(o.serializer,a)}}if(r instanceof Ye)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Re)return{bytesValue:Hd(o.serializer,r._byteString)};if(r instanceof Ot){const a=o.databaseId,h=r.firestore._databaseId;if(!h.isEqual(a))throw o.Sc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${a.projectId}/${a.database}`);return{referenceValue:Ju(r.firestore._databaseId||o.databaseId,r._key.path)}}if(r instanceof Xe)return function(h,f){return{mapValue:{fields:{[gd]:{stringValue:yd},[Yo]:{arrayValue:{values:h.toArray().map(g=>{if(typeof g!="number")throw f.Sc("VectorValues must only contain numeric values.");return Qu(f.serializer,g)})}}}}}}(r,o);throw o.Sc(`Unsupported field value: ${fa(r)}`)}(i,t)}function xf(i,t){const e={};return ld(i)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):ni(i,(r,o)=>{const a=Vi(o,t.mc(r));a!=null&&(e[r]=a)}),{mapValue:{fields:e}}}function kf(i){return!(typeof i!="object"||i===null||i instanceof Array||i instanceof Date||i instanceof St||i instanceof Ye||i instanceof Re||i instanceof Ot||i instanceof js||i instanceof Xe)}function _c(i,t,e){if(!kf(e)||!cd(e)){const r=fa(e);throw r==="an object"?t.Sc(i+" a custom object"):t.Sc(i+" "+r)}}function xu(i,t,e){if((t=zt(t))instanceof Sa)return t._internalPath;if(typeof t=="string")return gc(i,t);throw sa("Field path arguments must be of type string or ",i,!1,void 0,e)}const rw=new RegExp("[~\\*/\\[\\]]");function gc(i,t,e){if(t.search(rw)>=0)throw sa(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,i,!1,void 0,e);try{return new Sa(...t.split("."))._internalPath}catch{throw sa(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i,!1,void 0,e)}}function sa(i,t,e,r,o){const a=r&&!r.isEmpty(),h=o!==void 0;let f=`Function ${t}() called with invalid data`;e&&(f+=" (via `toFirestore()`)"),f+=". ";let p="";return(a||h)&&(p+=" (found",a&&(p+=` in field ${r}`),h&&(p+=` in document ${o}`),p+=")"),new j(D.INVALID_ARGUMENT,f+i+p)}function Mf(i,t){return i.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yc{constructor(t,e,r,o,a){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=o,this._converter=a}get id(){return this._key.path.lastSegment()}get ref(){return new Ot(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new sw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(La("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class sw extends yc{data(){return super.data()}}function La(i,t){return typeof t=="string"?gc(i,t):t instanceof Sa?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ow(i){if(i.limitType==="L"&&i.explicitOrderBy.length===0)throw new j(D.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class vc{}class xa extends vc{}function ku(i,t,...e){let r=[];t instanceof vc&&r.push(t),r=r.concat(e),function(a){const h=a.filter(p=>p instanceof wc).length,f=a.filter(p=>p instanceof ka).length;if(h>1||h>0&&f>0)throw new j(D.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const o of r)i=o._apply(i);return i}class ka extends xa{constructor(t,e,r){super(),this._field=t,this._op=e,this._value=r,this.type="where"}static _create(t,e,r){return new ka(t,e,r)}_apply(t){const e=this._parse(t);return Df(t._query,e),new Sn(t.firestore,t.converter,wu(t._query,e))}_parse(t){const e=Gs(t.firestore);return function(a,h,f,p,g,w,T){let b;if(g.isKeyField()){if(w==="array-contains"||w==="array-contains-any")throw new j(D.INVALID_ARGUMENT,`Invalid Query. You can't perform '${w}' queries on documentId().`);if(w==="in"||w==="not-in"){ll(T,w);const z=[];for(const B of T)z.push(hl(p,a,B));b={arrayValue:{values:z}}}else b=hl(p,a,T)}else w!=="in"&&w!=="not-in"&&w!=="array-contains-any"||ll(T,w),b=Lf(f,h,T,w==="in"||w==="not-in");return Ut.create(g,w,b)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function Nf(i,t,e){const r=t,o=La("where",i);return ka._create(o,r,e)}class wc extends vc{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new wc(t,e)}_parse(t){const e=this._queryConstraints.map(r=>r._parse(t)).filter(r=>r.getFilters().length>0);return e.length===1?e[0]:Ve.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(o,a){let h=o;const f=a.getFlattenedFilters();for(const p of f)Df(h,p),h=wu(h,p)}(t._query,e),new Sn(t.firestore,t.converter,wu(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Tc extends xa{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new Tc(t,e)}_apply(t){const e=function(o,a,h){if(o.startAt!==null)throw new j(D.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(o.endAt!==null)throw new j(D.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ns(a,h)}(t._query,this._field,this._direction);return new Sn(t.firestore,t.converter,function(o,a){const h=o.explicitOrderBy.concat([a]);return new ii(o.path,o.collectionGroup,h,o.filters.slice(),o.limit,o.limitType,o.startAt,o.endAt)}(t._query,e))}}function Mu(i,t="asc"){const e=t,r=La("orderBy",i);return Tc._create(r,e)}class Ec extends xa{constructor(t,e,r){super(),this.type=t,this._docOrFields=e,this._inclusive=r}static _create(t,e,r){return new Ec(t,e,r)}_apply(t){const e=Of(t,this.type,this._docOrFields,this._inclusive);return new Sn(t.firestore,t.converter,function(o,a){return new ii(o.path,o.collectionGroup,o.explicitOrderBy.slice(),o.filters.slice(),o.limit,o.limitType,a,o.endAt)}(t._query,e))}}function aw(...i){return Ec._create("startAt",i,!0)}class Ic extends xa{constructor(t,e,r){super(),this.type=t,this._docOrFields=e,this._inclusive=r}static _create(t,e,r){return new Ic(t,e,r)}_apply(t){const e=Of(t,this.type,this._docOrFields,this._inclusive);return new Sn(t.firestore,t.converter,function(o,a){return new ii(o.path,o.collectionGroup,o.explicitOrderBy.slice(),o.filters.slice(),o.limit,o.limitType,o.startAt,a)}(t._query,e))}}function uw(...i){return Ic._create("endAt",i,!0)}function Of(i,t,e,r){if(e[0]=zt(e[0]),e[0]instanceof yc)return function(a,h,f,p,g){if(!p)throw new j(D.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${f}().`);const w=[];for(const T of vr(a))if(T.field.isKeyField())w.push(Xo(h,p.key));else{const b=p.data.field(T.field);if(_a(b))throw new j(D.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+T.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(b===null){const V=T.field.canonicalString();throw new j(D.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${V}' (used as the orderBy) does not exist.`)}w.push(b)}return new Lr(w,g)}(i._query,i.firestore._databaseId,t,e[0]._document,r);{const o=Gs(i.firestore);return function(h,f,p,g,w,T){const b=h.explicitOrderBy;if(w.length>b.length)throw new j(D.INVALID_ARGUMENT,`Too many arguments provided to ${g}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const V=[];for(let z=0;z<w.length;z++){const B=w[z];if(b[z].field.isKeyField()){if(typeof B!="string")throw new j(D.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${g}(), but got a ${typeof B}`);if(!Ku(h)&&B.indexOf("/")!==-1)throw new j(D.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${g}() must be a plain document ID, but '${B}' contains a slash.`);const q=h.path.child(It.fromString(B));if(!K.isDocumentKey(q))throw new j(D.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${g}() must result in a valid document path, but '${q}' is not because it contains an odd number of segments.`);const ht=new K(q);V.push(Xo(f,ht))}else{const q=Lf(p,g,B);V.push(q)}}return new Lr(V,T)}(i._query,i.firestore._databaseId,o,t,e,r)}}function hl(i,t,e){if(typeof(e=zt(e))=="string"){if(e==="")throw new j(D.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ku(t)&&e.indexOf("/")!==-1)throw new j(D.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const r=t.path.child(It.fromString(e));if(!K.isDocumentKey(r))throw new j(D.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Xo(i,new K(r))}if(e instanceof Ot)return Xo(i,e._key);throw new j(D.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${fa(e)}.`)}function ll(i,t){if(!Array.isArray(i)||i.length===0)throw new j(D.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Df(i,t){const e=function(o,a){for(const h of o)for(const f of h.getFlattenedFilters())if(a.indexOf(f.op)>=0)return f.op;return null}(i.filters,function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new j(D.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new j(D.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class cw{convertValue(t,e="none"){switch(Jn(t)){case 0:return null;case 1:return t.booleanValue;case 2:return Nt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(Xn(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw X(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const r={};return ni(t,(o,a)=>{r[o]=this.convertValue(a,e)}),r}convertVectorValue(t){var r,o,a;const e=(a=(o=(r=t.fields)==null?void 0:r[Yo].arrayValue)==null?void 0:o.values)==null?void 0:a.map(h=>Nt(h.doubleValue));return new Xe(e)}convertGeoPoint(t){return new Ye(Nt(t.latitude),Nt(t.longitude))}convertArray(t,e){return(t.values||[]).map(r=>this.convertValue(r,e))}convertServerTimestamp(t,e){switch(e){case"previous":const r=ga(t);return r==null?null:this.convertValue(r,e);case"estimate":return this.convertTimestamp(xs(t));default:return null}}convertTimestamp(t){const e=Yn(t);return new St(e.seconds,e.nanos)}convertDocumentKey(t,e){const r=It.fromString(t);Tt(Kd(r),9688,{name:t});const o=new ks(r.get(1),r.get(3)),a=new K(r.popFirst(5));return o.isEqual(e)||In(`Document ${a} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vf(i,t,e){let r;return r=i?i.toFirestore(t):t,r}class Is{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Ri extends yc{constructor(t,e,r,o,a,h){super(t,e,r,o,h),this._firestore=t,this._firestoreImpl=t,this.metadata=a}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new qo(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(La("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new j(D.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=Ri._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}Ri._jsonSchemaVersion="firestore/documentSnapshot/1.0",Ri._jsonSchema={type:Bt("string",Ri._jsonSchemaVersion),bundleSource:Bt("string","DocumentSnapshot"),bundleName:Bt("string"),bundle:Bt("string")};class qo extends Ri{data(t={}){return super.data(t)}}class Tr{constructor(t,e,r,o){this._firestore=t,this._userDataWriter=e,this._snapshot=o,this.metadata=new Is(o.hasPendingWrites,o.fromCache),this.query=r}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(r=>{t.call(e,new qo(this._firestore,this._userDataWriter,r.key,r,new Is(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new j(D.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(o,a){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map(f=>{const p=new qo(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Is(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);return f.doc,{type:"added",doc:p,oldIndex:-1,newIndex:h++}})}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter(f=>a||f.type!==3).map(f=>{const p=new qo(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Is(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);let g=-1,w=-1;return f.type!==0&&(g=h.indexOf(f.doc.key),h=h.delete(f.doc.key)),f.type!==1&&(h=h.add(f.doc),w=h.indexOf(f.doc.key)),{type:hw(f.type),doc:p,oldIndex:g,newIndex:w}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new j(D.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=Tr._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Hu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],r=[],o=[];return this.docs.forEach(a=>{a._document!==null&&(e.push(a._document),r.push(this._userDataWriter.convertObjectMap(a._document.data.value.mapValue.fields,"previous")),o.push(a.ref.path))}),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function hw(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return X(61501,{type:i})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dl(i){i=en(i,Ot);const t=en(i.firestore,zr);return Zv(fc(t),i._key).then(e=>fw(t,i,e))}Tr._jsonSchemaVersion="firestore/querySnapshot/1.0",Tr._jsonSchema={type:Bt("string",Tr._jsonSchemaVersion),bundleSource:Bt("string","QuerySnapshot"),bundleName:Bt("string"),bundle:Bt("string")};class Ff extends cw{constructor(t){super(),this.firestore=t}convertBytes(t){return new Re(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new Ot(this.firestore,null,e)}}function Nu(i){i=en(i,Sn);const t=en(i.firestore,zr),e=fc(t),r=new Ff(t);return ow(i._query),Kv(e,i._query).then(o=>new Tr(t,r,i,o))}function lw(i,t,e){i=en(i,Ot);const r=en(i.firestore,zr),o=Vf(i.converter,t);return Pc(r,[Cf(Gs(r),"setDoc",i._key,o,i.converter!==null,e).toMutation(i._key,De.none())])}function fl(i,t,e,...r){i=en(i,Ot);const o=en(i.firestore,zr),a=Gs(o);let h;return h=typeof(t=zt(t))=="string"||t instanceof Sa?iw(a,"updateDoc",i._key,t,e,r):nw(a,"updateDoc",i._key,t),Pc(o,[h.toMutation(i._key,De.exists(!0))])}function dw(i,t){const e=en(i.firestore,zr),r=gr(i),o=Vf(i.converter,t);return Pc(e,[Cf(Gs(i.firestore),"addDoc",r._key,o,i.converter!==null,{}).toMutation(r._key,De.exists(!1))]).then(()=>r)}function Pc(i,t){return function(r,o){const a=new vn;return r.asyncQueue.enqueueAndForget(async()=>Dv(await $v(r),o,a)),a.promise}(fc(i),t)}function fw(i,t,e){const r=e.docs.get(t._key),o=new Ff(i);return new Ri(i,o,t._key,r,new Is(e.hasPendingWrites,e.fromCache),t.converter)}function mw(...i){return new mc("arrayUnion",i)}function pw(...i){return new pc("arrayRemove",i)}(function(t,e=!0){(function(o){Vr=o})(Dr),Ar(new Li("firestore",(r,{instanceIdentifier:o,options:a})=>{const h=r.getProvider("app").getImmediate(),f=new zr(new ig(r.getProvider("auth-internal")),new og(h,r.getProvider("app-check-internal")),function(g,w){if(!Object.prototype.hasOwnProperty.apply(g.options,["projectId"]))throw new j(D.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ks(g.options.projectId,w)}(h,o),h);return a={useFetchStreams:e,...a},f._setSettings(a),f},"PUBLIC").setMultipleInstances(!0)),$n(ph,_h,t),$n(ph,_h,"esm2020")})();var _w="firebase",gw="12.4.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */$n(_w,gw,"app");function Uf(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const yw=Uf,Bf=new Vs("auth","Firebase",Uf());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oa=new Uu("@firebase/auth");function vw(i,...t){oa.logLevel<=lt.WARN&&oa.warn(`Auth (${Dr}): ${i}`,...t)}function Ho(i,...t){oa.logLevel<=lt.ERROR&&oa.error(`Auth (${Dr}): ${i}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(i,...t){throw Ac(i,...t)}function Je(i,...t){return Ac(i,...t)}function zf(i,t,e){const r={...yw(),[t]:e};return new Vs("auth","Firebase",r).create(t,{appName:i.name})}function wn(i){return zf(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ac(i,...t){if(typeof i!="string"){const e=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=i.name),i._errorFactory.create(e,...r)}return Bf.create(i,...t)}function Y(i,t,...e){if(!i)throw Ac(t,...e)}function gn(i){const t="INTERNAL ASSERTION FAILED: "+i;throw Ho(t),new Error(t)}function An(i,t){i||gn(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ou(){var i;return typeof self<"u"&&((i=self.location)==null?void 0:i.href)||""}function ww(){return ml()==="http:"||ml()==="https:"}function ml(){var i;return typeof self<"u"&&((i=self.location)==null?void 0:i.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tw(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ww()||Np()||"connection"in navigator)?navigator.onLine:!0}function Ew(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(t,e){this.shortDelay=t,this.longDelay=e,An(e>t,"Short delay should be less than long delay!"),this.isMobile=xp()||Op()}get(){return Tw()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bc(i,t){An(i.emulator,"Emulator should always be set here");const{url:e}=i.emulator;return t?`${e}${t.startsWith("/")?t.slice(1):t}`:e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qf{static initialize(t,e,r){this.fetchImpl=t,e&&(this.headersImpl=e),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;gn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;gn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;gn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iw={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pw=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Aw=new Ws(3e4,6e4);function si(i,t){return i.tenantId&&!t.tenantId?{...t,tenantId:i.tenantId}:t}async function oi(i,t,e,r,o={}){return Hf(i,o,async()=>{let a={},h={};r&&(t==="GET"?h=r:a={body:JSON.stringify(r)});const f=Fs({key:i.config.apiKey,...h}).slice(1),p=await i._getAdditionalHeaders();p["Content-Type"]="application/json",i.languageCode&&(p["X-Firebase-Locale"]=i.languageCode);const g={method:t,headers:p,...a};return Mp()||(g.referrerPolicy="no-referrer"),i.emulatorConfig&&Or(i.emulatorConfig.host)&&(g.credentials="include"),qf.fetch()(await jf(i,i.config.apiHost,e,f),g)})}async function Hf(i,t,e){i._canInitEmulator=!1;const r={...Iw,...t};try{const o=new Sw(i),a=await Promise.race([e(),o.promise]);o.clearNetworkTimeout();const h=await a.json();if("needConfirmation"in h)throw Do(i,"account-exists-with-different-credential",h);if(a.ok&&!("errorMessage"in h))return h;{const f=a.ok?h.errorMessage:h.error.message,[p,g]=f.split(" : ");if(p==="FEDERATED_USER_ID_ALREADY_LINKED")throw Do(i,"credential-already-in-use",h);if(p==="EMAIL_EXISTS")throw Do(i,"email-already-in-use",h);if(p==="USER_DISABLED")throw Do(i,"user-disabled",h);const w=r[p]||p.toLowerCase().replace(/[_\s]+/g,"-");if(g)throw zf(i,w,g);Fe(i,w)}}catch(o){if(o instanceof bn)throw o;Fe(i,"network-request-failed",{message:String(o)})}}async function $s(i,t,e,r,o={}){const a=await oi(i,t,e,r,o);return"mfaPendingCredential"in a&&Fe(i,"multi-factor-auth-required",{_serverResponse:a}),a}async function jf(i,t,e,r){const o=`${t}${e}?${r}`,a=i,h=a.config.emulator?bc(i.config,o):`${i.config.apiScheme}://${o}`;return Pw.includes(e)&&(await a._persistenceManagerAvailable,a._getPersistenceType()==="COOKIE")?a._getPersistence()._getFinalTarget(h).toString():h}function bw(i){switch(i){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Sw{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((e,r)=>{this.timer=setTimeout(()=>r(Je(this.auth,"network-request-failed")),Aw.get())})}}function Do(i,t,e){const r={appName:i.name};e.email&&(r.email=e.email),e.phoneNumber&&(r.phoneNumber=e.phoneNumber);const o=Je(i,t,r);return o.customData._tokenResponse=e,o}function pl(i){return i!==void 0&&i.enterprise!==void 0}class Cw{constructor(t){if(this.siteKey="",this.recaptchaEnforcementState=[],t.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=t.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=t.recaptchaEnforcementState}getProviderEnforcementState(t){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const e of this.recaptchaEnforcementState)if(e.provider&&e.provider===t)return bw(e.enforcementState);return null}isProviderEnabled(t){return this.getProviderEnforcementState(t)==="ENFORCE"||this.getProviderEnforcementState(t)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Rw(i,t){return oi(i,"GET","/v2/recaptchaConfig",si(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lw(i,t){return oi(i,"POST","/v1/accounts:delete",t)}async function aa(i,t){return oi(i,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cs(i){if(i)try{const t=new Date(Number(i));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function xw(i,t=!1){const e=zt(i),r=await e.getIdToken(t),o=Sc(r);Y(o&&o.exp&&o.auth_time&&o.iat,e.auth,"internal-error");const a=typeof o.firebase=="object"?o.firebase:void 0,h=a==null?void 0:a.sign_in_provider;return{claims:o,token:r,authTime:Cs(ou(o.auth_time)),issuedAtTime:Cs(ou(o.iat)),expirationTime:Cs(ou(o.exp)),signInProvider:h||null,signInSecondFactor:(a==null?void 0:a.sign_in_second_factor)||null}}function ou(i){return Number(i)*1e3}function Sc(i){const[t,e,r]=i.split(".");if(t===void 0||e===void 0||r===void 0)return Ho("JWT malformed, contained fewer than 3 sections"),null;try{const o=ql(e);return o?JSON.parse(o):(Ho("Failed to decode base64 JWT payload"),null)}catch(o){return Ho("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function _l(i){const t=Sc(i);return Y(t,"internal-error"),Y(typeof t.exp<"u","internal-error"),Y(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Os(i,t,e=!1){if(e)return t;try{return await t}catch(r){throw r instanceof bn&&kw(r)&&i.auth.currentUser===i&&await i.auth.signOut(),r}}function kw({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mw{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){if(t){const e=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),e}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(t=!1){if(!this.isRunning)return;const e=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},e)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){(t==null?void 0:t.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Du{constructor(t,e){this.createdAt=t,this.lastLoginAt=e,this._initializeTime()}_initializeTime(){this.lastSignInTime=Cs(this.lastLoginAt),this.creationTime=Cs(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ua(i){var T;const t=i.auth,e=await i.getIdToken(),r=await Os(i,aa(t,{idToken:e}));Y(r==null?void 0:r.users.length,t,"internal-error");const o=r.users[0];i._notifyReloadListener(o);const a=(T=o.providerUserInfo)!=null&&T.length?Gf(o.providerUserInfo):[],h=Ow(i.providerData,a),f=i.isAnonymous,p=!(i.email&&o.passwordHash)&&!(h!=null&&h.length),g=f?p:!1,w={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new Du(o.createdAt,o.lastLoginAt),isAnonymous:g};Object.assign(i,w)}async function Nw(i){const t=zt(i);await ua(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function Ow(i,t){return[...i.filter(r=>!t.some(o=>o.providerId===r.providerId)),...t]}function Gf(i){return i.map(({providerId:t,...e})=>({providerId:t,uid:e.rawId||"",displayName:e.displayName||null,email:e.email||null,phoneNumber:e.phoneNumber||null,photoURL:e.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dw(i,t){const e=await Hf(i,{},async()=>{const r=Fs({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:o,apiKey:a}=i.config,h=await jf(i,o,"/v1/token",`key=${a}`),f=await i._getAdditionalHeaders();f["Content-Type"]="application/x-www-form-urlencoded";const p={method:"POST",headers:f,body:r};return i.emulatorConfig&&Or(i.emulatorConfig.host)&&(p.credentials="include"),qf.fetch()(h,p)});return{accessToken:e.access_token,expiresIn:e.expires_in,refreshToken:e.refresh_token}}async function Vw(i,t){return oi(i,"POST","/v2/accounts:revokeToken",si(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Er{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){Y(t.idToken,"internal-error"),Y(typeof t.idToken<"u","internal-error"),Y(typeof t.refreshToken<"u","internal-error");const e="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):_l(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,e)}updateFromIdToken(t){Y(t.length!==0,"internal-error");const e=_l(t);this.updateTokensAndExpiration(t,null,e)}async getToken(t,e=!1){return!e&&this.accessToken&&!this.isExpired?this.accessToken:(Y(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,e){const{accessToken:r,refreshToken:o,expiresIn:a}=await Dw(t,e);this.updateTokensAndExpiration(r,o,Number(a))}updateTokensAndExpiration(t,e,r){this.refreshToken=e||null,this.accessToken=t||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(t,e){const{refreshToken:r,accessToken:o,expirationTime:a}=e,h=new Er;return r&&(Y(typeof r=="string","internal-error",{appName:t}),h.refreshToken=r),o&&(Y(typeof o=="string","internal-error",{appName:t}),h.accessToken=o),a&&(Y(typeof a=="number","internal-error",{appName:t}),h.expirationTime=a),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new Er,this.toJSON())}_performRefresh(){return gn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Un(i,t){Y(typeof i=="string"||typeof i>"u","internal-error",{appName:t})}class Oe{constructor({uid:t,auth:e,stsTokenManager:r,...o}){this.providerId="firebase",this.proactiveRefresh=new Mw(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=e,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new Du(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(t){const e=await Os(this,this.stsTokenManager.getToken(this.auth,t));return Y(e,this.auth,"internal-error"),this.accessToken!==e&&(this.accessToken=e,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),e}getIdTokenResult(t){return xw(this,t)}reload(){return Nw(this)}_assign(t){this!==t&&(Y(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(e=>({...e})),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const e=new Oe({...this,auth:t,stsTokenManager:this.stsTokenManager._clone()});return e.metadata._copy(this.metadata),e}_onReload(t){Y(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,e=!1){let r=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),r=!0),e&&await ua(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ce(this.auth.app))return Promise.reject(wn(this.auth));const t=await this.getIdToken();return await Os(this,Lw(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>({...t})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,e){const r=e.displayName??void 0,o=e.email??void 0,a=e.phoneNumber??void 0,h=e.photoURL??void 0,f=e.tenantId??void 0,p=e._redirectEventId??void 0,g=e.createdAt??void 0,w=e.lastLoginAt??void 0,{uid:T,emailVerified:b,isAnonymous:V,providerData:z,stsTokenManager:B}=e;Y(T&&B,t,"internal-error");const q=Er.fromJSON(this.name,B);Y(typeof T=="string",t,"internal-error"),Un(r,t.name),Un(o,t.name),Y(typeof b=="boolean",t,"internal-error"),Y(typeof V=="boolean",t,"internal-error"),Un(a,t.name),Un(h,t.name),Un(f,t.name),Un(p,t.name),Un(g,t.name),Un(w,t.name);const ht=new Oe({uid:T,auth:t,email:o,emailVerified:b,displayName:r,isAnonymous:V,photoURL:h,phoneNumber:a,tenantId:f,stsTokenManager:q,createdAt:g,lastLoginAt:w});return z&&Array.isArray(z)&&(ht.providerData=z.map(ot=>({...ot}))),p&&(ht._redirectEventId=p),ht}static async _fromIdTokenResponse(t,e,r=!1){const o=new Er;o.updateFromServerResponse(e);const a=new Oe({uid:e.localId,auth:t,stsTokenManager:o,isAnonymous:r});return await ua(a),a}static async _fromGetAccountInfoResponse(t,e,r){const o=e.users[0];Y(o.localId!==void 0,"internal-error");const a=o.providerUserInfo!==void 0?Gf(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(a!=null&&a.length),f=new Er;f.updateFromIdToken(r);const p=new Oe({uid:o.localId,auth:t,stsTokenManager:f,isAnonymous:h}),g={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:a,metadata:new Du(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(a!=null&&a.length)};return Object.assign(p,g),p}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gl=new Map;function yn(i){An(i instanceof Function,"Expected a class definition");let t=gl.get(i);return t?(An(t instanceof i,"Instance stored in cache mismatched with class"),t):(t=new i,gl.set(i,t),t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wf{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,e){this.storage[t]=e}async _get(t){const e=this.storage[t];return e===void 0?null:e}async _remove(t){delete this.storage[t]}_addListener(t,e){}_removeListener(t,e){}}Wf.type="NONE";const yl=Wf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jo(i,t,e){return`firebase:${i}:${t}:${e}`}class Ir{constructor(t,e,r){this.persistence=t,this.auth=e,this.userKey=r;const{config:o,name:a}=this.auth;this.fullUserKey=jo(this.userKey,o.apiKey,a),this.fullPersistenceKey=jo("persistence",o.apiKey,a),this.boundEventHandler=e._onStorageEvent.bind(e),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const e=await aa(this.auth,{idToken:t}).catch(()=>{});return e?Oe._fromGetAccountInfoResponse(this.auth,e,t):null}return Oe._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const e=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,e)return this.setCurrentUser(e)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,e,r="authUser"){if(!e.length)return new Ir(yn(yl),t,r);const o=(await Promise.all(e.map(async g=>{if(await g._isAvailable())return g}))).filter(g=>g);let a=o[0]||yn(yl);const h=jo(r,t.config.apiKey,t.name);let f=null;for(const g of e)try{const w=await g._get(h);if(w){let T;if(typeof w=="string"){const b=await aa(t,{idToken:w}).catch(()=>{});if(!b)break;T=await Oe._fromGetAccountInfoResponse(t,b,w)}else T=Oe._fromJSON(t,w);g!==a&&(f=T),a=g;break}}catch{}const p=o.filter(g=>g._shouldAllowMigration);return!a._shouldAllowMigration||!p.length?new Ir(a,t,r):(a=p[0],f&&await a._set(h,f.toJSON()),await Promise.all(e.map(async g=>{if(g!==a)try{await g._remove(h)}catch{}})),new Ir(a,t,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vl(i){const t=i.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Qf(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if($f(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Xf(t))return"Blackberry";if(Jf(t))return"Webos";if(Zf(t))return"Safari";if((t.includes("chrome/")||Kf(t))&&!t.includes("edge/"))return"Chrome";if(Yf(t))return"Android";{const e=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=i.match(e);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function $f(i=re()){return/firefox\//i.test(i)}function Zf(i=re()){const t=i.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Kf(i=re()){return/crios\//i.test(i)}function Qf(i=re()){return/iemobile/i.test(i)}function Yf(i=re()){return/android/i.test(i)}function Xf(i=re()){return/blackberry/i.test(i)}function Jf(i=re()){return/webos/i.test(i)}function Cc(i=re()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function Fw(i=re()){var t;return Cc(i)&&!!((t=window.navigator)!=null&&t.standalone)}function Uw(){return Dp()&&document.documentMode===10}function tm(i=re()){return Cc(i)||Yf(i)||Jf(i)||Xf(i)||/windows phone/i.test(i)||Qf(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function em(i,t=[]){let e;switch(i){case"Browser":e=vl(re());break;case"Worker":e=`${vl(re())}-${i}`;break;default:e=i}const r=t.length?t.join(","):"FirebaseCore-web";return`${e}/JsCore/${Dr}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bw{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,e){const r=a=>new Promise((h,f)=>{try{const p=t(a);h(p)}catch(p){f(p)}});r.onAbort=e,this.queue.push(r);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const e=[];try{for(const r of this.queue)await r(t),r.onAbort&&e.push(r.onAbort)}catch(r){e.reverse();for(const o of e)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zw(i,t={}){return oi(i,"GET","/v2/passwordPolicy",si(i,t))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qw=6;class Hw{constructor(t){var r;const e=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=e.minPasswordLength??qw,e.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=e.maxPasswordLength),e.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=e.containsLowercaseCharacter),e.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=e.containsUppercaseCharacter),e.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=e.containsNumericCharacter),e.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=e.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=t.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=t.forceUpgradeOnSignin??!1,this.schemaVersion=t.schemaVersion}validatePassword(t){const e={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,e),this.validatePasswordCharacterOptions(t,e),e.isValid&&(e.isValid=e.meetsMinPasswordLength??!0),e.isValid&&(e.isValid=e.meetsMaxPasswordLength??!0),e.isValid&&(e.isValid=e.containsLowercaseLetter??!0),e.isValid&&(e.isValid=e.containsUppercaseLetter??!0),e.isValid&&(e.isValid=e.containsNumericCharacter??!0),e.isValid&&(e.isValid=e.containsNonAlphanumericCharacter??!0),e}validatePasswordLengthOptions(t,e){const r=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;r&&(e.meetsMinPasswordLength=t.length>=r),o&&(e.meetsMaxPasswordLength=t.length<=o)}validatePasswordCharacterOptions(t,e){this.updatePasswordCharacterOptionsStatuses(e,!1,!1,!1,!1);let r;for(let o=0;o<t.length;o++)r=t.charAt(o),this.updatePasswordCharacterOptionsStatuses(e,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(t,e,r,o,a){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=e)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jw{constructor(t,e,r,o){this.app=t,this.heartbeatServiceProvider=e,this.appCheckServiceProvider=r,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new wl(this),this.idTokenSubscription=new wl(this),this.beforeStateQueue=new Bw(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Bf,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(a=>this._resolvePersistenceManagerAvailable=a)}_initializeWithPersistence(t,e){return e&&(this._popupRedirectResolver=yn(e)),this._initializationPromise=this.queue(async()=>{var r,o,a;if(!this._deleted&&(this.persistenceManager=await Ir.create(this,t),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((o=this._popupRedirectResolver)!=null&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(e),this.lastNotifiedUid=((a=this.currentUser)==null?void 0:a.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const e=await aa(this,{idToken:t}),r=await Oe._fromGetAccountInfoResponse(this,e,t);await this.directlySetCurrentUser(r)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){var a;if(Ce(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(f,f))}):this.directlySetCurrentUser(null)}const e=await this.assertedPersistence.getCurrentUser();let r=e,o=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(a=this.redirectUser)==null?void 0:a._redirectEventId,f=r==null?void 0:r._redirectEventId,p=await this.tryRedirectSignIn(t);(!h||h===f)&&(p!=null&&p.user)&&(r=p.user,o=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(r)}catch(h){r=e,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return Y(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(t){let e=null;try{e=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return e}async reloadAndSetCurrentUserOrClear(t){try{await ua(t)}catch(e){if((e==null?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=Ew()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(Ce(this.app))return Promise.reject(wn(this));const e=t?zt(t):null;return e&&Y(e.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(e&&e._clone(this))}async _updateCurrentUser(t,e=!1){if(!this._deleted)return t&&Y(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),e||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return Ce(this.app)?Promise.reject(wn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return Ce(this.app)?Promise.reject(wn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(yn(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const e=this._getPasswordPolicyInternal();return e.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):e.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await zw(this),e=new Hw(t);this.tenantId===null?this._projectPasswordPolicy=e:this._tenantPasswordPolicies[this.tenantId]=e}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new Vs("auth","Firebase",t())}onAuthStateChanged(t,e,r){return this.registerStateListener(this.authStateSubscription,t,e,r)}beforeAuthStateChanged(t,e){return this.beforeStateQueue.pushCallback(t,e)}onIdTokenChanged(t,e,r){return this.registerStateListener(this.idTokenSubscription,t,e,r)}authStateReady(){return new Promise((t,e)=>{if(this.currentUser)t();else{const r=this.onAuthStateChanged(()=>{r(),t()},e)}})}async revokeAccessToken(t){if(this.currentUser){const e=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:e};this.tenantId!=null&&(r.tenantId=this.tenantId),await Vw(this,r)}}toJSON(){var t;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(t=this._currentUser)==null?void 0:t.toJSON()}}async _setRedirectUser(t,e){const r=await this.getOrInitRedirectPersistenceManager(e);return t===null?r.removeCurrentUser():r.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const e=t&&yn(t)||this._popupRedirectResolver;Y(e,this,"argument-error"),this.redirectPersistenceManager=await Ir.create(this,[yn(e._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){var e,r;return this._isInitialized&&await this.queue(async()=>{}),((e=this._currentUser)==null?void 0:e._redirectEventId)===t?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const t=((e=this.currentUser)==null?void 0:e.uid)??null;this.lastNotifiedUid!==t&&(this.lastNotifiedUid=t,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,e,r,o){if(this._deleted)return()=>{};const a=typeof e=="function"?e:e.next.bind(e);let h=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(Y(f,this,"internal-error"),f.then(()=>{h||a(this.currentUser)}),typeof e=="function"){const p=t.addObserver(e,r,o);return()=>{h=!0,p()}}else{const p=t.addObserver(e);return()=>{h=!0,p()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return Y(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=em(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var o;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const e=await((o=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:o.getHeartbeatsHeader());e&&(t["X-Firebase-Client"]=e);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(Ce(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:e.getToken());return t!=null&&t.error&&vw(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Fi(i){return zt(i)}class wl{constructor(t){this.auth=t,this.observer=null,this.addObserver=jp(e=>this.observer=e)}get next(){return Y(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ma={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Gw(i){Ma=i}function nm(i){return Ma.loadJS(i)}function Ww(){return Ma.recaptchaEnterpriseScript}function $w(){return Ma.gapiScript}function Zw(i){return`__${i}${Math.floor(Math.random()*1e6)}`}class Kw{constructor(){this.enterprise=new Qw}ready(t){t()}execute(t,e){return Promise.resolve("token")}render(t,e){return""}}class Qw{ready(t){t()}execute(t,e){return Promise.resolve("token")}render(t,e){return""}}const Yw="recaptcha-enterprise",im="NO_RECAPTCHA";class Xw{constructor(t){this.type=Yw,this.auth=Fi(t)}async verify(t="verify",e=!1){async function r(a){if(!e){if(a.tenantId==null&&a._agentRecaptchaConfig!=null)return a._agentRecaptchaConfig.siteKey;if(a.tenantId!=null&&a._tenantRecaptchaConfigs[a.tenantId]!==void 0)return a._tenantRecaptchaConfigs[a.tenantId].siteKey}return new Promise(async(h,f)=>{Rw(a,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(p=>{if(p.recaptchaKey===void 0)f(new Error("recaptcha Enterprise site key undefined"));else{const g=new Cw(p);return a.tenantId==null?a._agentRecaptchaConfig=g:a._tenantRecaptchaConfigs[a.tenantId]=g,h(g.siteKey)}}).catch(p=>{f(p)})})}function o(a,h,f){const p=window.grecaptcha;pl(p)?p.enterprise.ready(()=>{p.enterprise.execute(a,{action:t}).then(g=>{h(g)}).catch(()=>{h(im)})}):f(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Kw().execute("siteKey",{action:"verify"}):new Promise((a,h)=>{r(this.auth).then(f=>{if(!e&&pl(window.grecaptcha))o(f,a,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let p=Ww();p.length!==0&&(p+=f),nm(p).then(()=>{o(f,a,h)}).catch(g=>{h(g)})}}).catch(f=>{h(f)})})}}async function Tl(i,t,e,r=!1,o=!1){const a=new Xw(i);let h;if(o)h=im;else try{h=await a.verify(e)}catch{h=await a.verify(e,!0)}const f={...t};if(e==="mfaSmsEnrollment"||e==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in f){const p=f.phoneEnrollmentInfo.phoneNumber,g=f.phoneEnrollmentInfo.recaptchaToken;Object.assign(f,{phoneEnrollmentInfo:{phoneNumber:p,recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in f){const p=f.phoneSignInInfo.recaptchaToken;Object.assign(f,{phoneSignInInfo:{recaptchaToken:p,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return f}return r?Object.assign(f,{captchaResp:h}):Object.assign(f,{captchaResponse:h}),Object.assign(f,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(f,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),f}async function Vu(i,t,e,r,o){var a;if((a=i._getRecaptchaConfig())!=null&&a.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await Tl(i,t,e,e==="getOobCode");return r(i,h)}else return r(i,t).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${e} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const f=await Tl(i,t,e,e==="getOobCode");return r(i,f)}else return Promise.reject(h)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jw(i,t){const e=zu(i,"auth");if(e.isInitialized()){const o=e.getImmediate(),a=e.getOptions();if(Tn(a,t??{}))return o;Fe(o,"already-initialized")}return e.initialize({options:t})}function tT(i,t){const e=(t==null?void 0:t.persistence)||[],r=(Array.isArray(e)?e:[e]).map(yn);t!=null&&t.errorMap&&i._updateErrorMap(t.errorMap),i._initializeWithPersistence(r,t==null?void 0:t.popupRedirectResolver)}function eT(i,t,e){const r=Fi(i);Y(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const o=!1,a=rm(t),{host:h,port:f}=nT(t),p=f===null?"":`:${f}`,g={url:`${a}//${h}${p}/`},w=Object.freeze({host:h,port:f,protocol:a.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!r._canInitEmulator){Y(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),Y(Tn(g,r.config.emulator)&&Tn(w,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=g,r.emulatorConfig=w,r.settings.appVerificationDisabledForTesting=!0,Or(h)?(Wl(`${a}//${h}${p}`),$l("Auth",!0)):iT()}function rm(i){const t=i.indexOf(":");return t<0?"":i.substr(0,t+1)}function nT(i){const t=rm(i),e=/(\/\/)?([^?#/]+)/.exec(i.substr(t.length));if(!e)return{host:"",port:null};const r=e[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(r);if(o){const a=o[1];return{host:a,port:El(r.substr(a.length+1))}}else{const[a,h]=r.split(":");return{host:a,port:El(h)}}}function El(i){if(!i)return null;const t=Number(i);return isNaN(t)?null:t}function iT(){function i(){const t=document.createElement("p"),e=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",e.position="fixed",e.width="100%",e.backgroundColor="#ffffff",e.border=".1em solid #000000",e.color="#b50000",e.bottom="0px",e.left="0px",e.margin="0px",e.zIndex="10000",e.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rc{constructor(t,e){this.providerId=t,this.signInMethod=e}toJSON(){return gn("not implemented")}_getIdTokenResponse(t){return gn("not implemented")}_linkToIdToken(t,e){return gn("not implemented")}_getReauthenticationResolver(t){return gn("not implemented")}}async function rT(i,t){return oi(i,"POST","/v1/accounts:signUp",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sT(i,t){return $s(i,"POST","/v1/accounts:signInWithPassword",si(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oT(i,t){return $s(i,"POST","/v1/accounts:signInWithEmailLink",si(i,t))}async function aT(i,t){return $s(i,"POST","/v1/accounts:signInWithEmailLink",si(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds extends Rc{constructor(t,e,r,o=null){super("password",r),this._email=t,this._password=e,this._tenantId=o}static _fromEmailAndPassword(t,e){return new Ds(t,e,"password")}static _fromEmailAndCode(t,e,r=null){return new Ds(t,e,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t;if(e!=null&&e.email&&(e!=null&&e.password)){if(e.signInMethod==="password")return this._fromEmailAndPassword(e.email,e.password);if(e.signInMethod==="emailLink")return this._fromEmailAndCode(e.email,e.password,e.tenantId)}return null}async _getIdTokenResponse(t){switch(this.signInMethod){case"password":const e={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Vu(t,e,"signInWithPassword",sT);case"emailLink":return oT(t,{email:this._email,oobCode:this._password});default:Fe(t,"internal-error")}}async _linkToIdToken(t,e){switch(this.signInMethod){case"password":const r={idToken:e,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Vu(t,r,"signUpPassword",rT);case"emailLink":return aT(t,{idToken:e,email:this._email,oobCode:this._password});default:Fe(t,"internal-error")}}_getReauthenticationResolver(t){return this._getIdTokenResponse(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pr(i,t){return $s(i,"POST","/v1/accounts:signInWithIdp",si(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uT="http://localhost";class Mi extends Rc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const e=new Mi(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(e.idToken=t.idToken),t.accessToken&&(e.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(e.nonce=t.nonce),t.pendingToken&&(e.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(e.accessToken=t.oauthToken,e.secret=t.oauthTokenSecret):Fe("argument-error"),e}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const e=typeof t=="string"?JSON.parse(t):t,{providerId:r,signInMethod:o,...a}=e;if(!r||!o)return null;const h=new Mi(r,o);return h.idToken=a.idToken||void 0,h.accessToken=a.accessToken||void 0,h.secret=a.secret,h.nonce=a.nonce,h.pendingToken=a.pendingToken||null,h}_getIdTokenResponse(t){const e=this.buildRequest();return Pr(t,e)}_linkToIdToken(t,e){const r=this.buildRequest();return r.idToken=e,Pr(t,r)}_getReauthenticationResolver(t){const e=this.buildRequest();return e.autoCreate=!1,Pr(t,e)}buildRequest(){const t={requestUri:uT,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const e={};this.idToken&&(e.id_token=this.idToken),this.accessToken&&(e.access_token=this.accessToken),this.secret&&(e.oauth_token_secret=this.secret),e.providerId=this.providerId,this.nonce&&!this.pendingToken&&(e.nonce=this.nonce),t.postBody=Fs(e)}return t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cT(i){switch(i){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function hT(i){const t=ys(vs(i)).link,e=t?ys(vs(t)).deep_link_id:null,r=ys(vs(i)).deep_link_id;return(r?ys(vs(r)).link:null)||r||e||t||i}class Lc{constructor(t){const e=ys(vs(t)),r=e.apiKey??null,o=e.oobCode??null,a=cT(e.mode??null);Y(r&&o&&a,"argument-error"),this.apiKey=r,this.operation=a,this.code=o,this.continueUrl=e.continueUrl??null,this.languageCode=e.lang??null,this.tenantId=e.tenantId??null}static parseLink(t){const e=hT(t);try{return new Lc(e)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(){this.providerId=qr.PROVIDER_ID}static credential(t,e){return Ds._fromEmailAndPassword(t,e)}static credentialWithLink(t,e){const r=Lc.parseLink(e);return Y(r,"argument-error"),Ds._fromEmailAndCode(t,r.code,r.tenantId)}}qr.PROVIDER_ID="password";qr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";qr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sm{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zs extends sm{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn extends Zs{constructor(){super("facebook.com")}static credential(t){return Mi._fromParams({providerId:Bn.PROVIDER_ID,signInMethod:Bn.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return Bn.credentialFromTaggedObject(t)}static credentialFromError(t){return Bn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return Bn.credential(t.oauthAccessToken)}catch{return null}}}Bn.FACEBOOK_SIGN_IN_METHOD="facebook.com";Bn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn extends Zs{constructor(){super("google.com"),this.addScope("profile")}static credential(t,e){return Mi._fromParams({providerId:zn.PROVIDER_ID,signInMethod:zn.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:e})}static credentialFromResult(t){return zn.credentialFromTaggedObject(t)}static credentialFromError(t){return zn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:e,oauthAccessToken:r}=t;if(!e&&!r)return null;try{return zn.credential(e,r)}catch{return null}}}zn.GOOGLE_SIGN_IN_METHOD="google.com";zn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn extends Zs{constructor(){super("github.com")}static credential(t){return Mi._fromParams({providerId:qn.PROVIDER_ID,signInMethod:qn.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return qn.credentialFromTaggedObject(t)}static credentialFromError(t){return qn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return qn.credential(t.oauthAccessToken)}catch{return null}}}qn.GITHUB_SIGN_IN_METHOD="github.com";qn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hn extends Zs{constructor(){super("twitter.com")}static credential(t,e){return Mi._fromParams({providerId:Hn.PROVIDER_ID,signInMethod:Hn.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:e})}static credentialFromResult(t){return Hn.credentialFromTaggedObject(t)}static credentialFromError(t){return Hn.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:e,oauthTokenSecret:r}=t;if(!e||!r)return null;try{return Hn.credential(e,r)}catch{return null}}}Hn.TWITTER_SIGN_IN_METHOD="twitter.com";Hn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lT(i,t){return $s(i,"POST","/v1/accounts:signUp",si(i,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ni{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,e,r,o=!1){const a=await Oe._fromIdTokenResponse(t,r,o),h=Il(r);return new Ni({user:a,providerId:h,_tokenResponse:r,operationType:e})}static async _forOperation(t,e,r){await t._updateTokensIfNecessary(r,!0);const o=Il(r);return new Ni({user:t,providerId:o,_tokenResponse:r,operationType:e})}}function Il(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ca extends bn{constructor(t,e,r,o){super(e.code,e.message),this.operationType=r,this.user=o,Object.setPrototypeOf(this,ca.prototype),this.customData={appName:t.name,tenantId:t.tenantId??void 0,_serverResponse:e.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(t,e,r,o){return new ca(t,e,r,o)}}function om(i,t,e,r){return(t==="reauthenticate"?e._getReauthenticationResolver(i):e._getIdTokenResponse(i)).catch(a=>{throw a.code==="auth/multi-factor-auth-required"?ca._fromErrorAndOperation(i,a,t,r):a})}async function dT(i,t,e=!1){const r=await Os(i,t._linkToIdToken(i.auth,await i.getIdToken()),e);return Ni._forOperation(i,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fT(i,t,e=!1){const{auth:r}=i;if(Ce(r.app))return Promise.reject(wn(r));const o="reauthenticate";try{const a=await Os(i,om(r,o,t,i),e);Y(a.idToken,r,"internal-error");const h=Sc(a.idToken);Y(h,r,"internal-error");const{sub:f}=h;return Y(i.uid===f,r,"user-mismatch"),Ni._forOperation(i,o,a)}catch(a){throw(a==null?void 0:a.code)==="auth/user-not-found"&&Fe(r,"user-mismatch"),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function am(i,t,e=!1){if(Ce(i.app))return Promise.reject(wn(i));const r="signIn",o=await om(i,r,t),a=await Ni._fromIdTokenResponse(i,r,o);return e||await i._updateCurrentUser(a.user),a}async function mT(i,t){return am(Fi(i),t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function um(i){const t=Fi(i);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function pT(i,t,e){if(Ce(i.app))return Promise.reject(wn(i));const r=Fi(i),h=await Vu(r,{returnSecureToken:!0,email:t,password:e,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",lT).catch(p=>{throw p.code==="auth/password-does-not-meet-requirements"&&um(i),p}),f=await Ni._fromIdTokenResponse(r,"signIn",h);return await r._updateCurrentUser(f.user),f}function _T(i,t,e){return Ce(i.app)?Promise.reject(wn(i)):mT(zt(i),qr.credential(t,e)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&um(i),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gT(i,t){return zt(i).setPersistence(t)}function yT(i,t,e,r){return zt(i).onIdTokenChanged(t,e,r)}function vT(i,t,e){return zt(i).beforeAuthStateChanged(t,e)}function cm(i,t,e,r){return zt(i).onAuthStateChanged(t,e,r)}function wT(i){return zt(i).signOut()}const ha="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hm{constructor(t,e){this.storageRetriever=t,this.type=e}_isAvailable(){try{return this.storage?(this.storage.setItem(ha,"1"),this.storage.removeItem(ha),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,e){return this.storage.setItem(t,JSON.stringify(e)),Promise.resolve()}_get(t){const e=this.storage.getItem(t);return Promise.resolve(e?JSON.parse(e):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TT=1e3,ET=10;class lm extends hm{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,e)=>this.onStorageEvent(t,e),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=tm(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const e of Object.keys(this.listeners)){const r=this.storage.getItem(e),o=this.localCache[e];r!==o&&t(e,o,r)}}onStorageEvent(t,e=!1){if(!t.key){this.forAllChangedKeys((h,f,p)=>{this.notifyListeners(h,p)});return}const r=t.key;e?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(r);!e&&this.localCache[r]===h||this.notifyListeners(r,h)},a=this.storage.getItem(r);Uw()&&a!==t.newValue&&t.newValue!==t.oldValue?setTimeout(o,ET):o()}notifyListeners(t,e){this.localCache[t]=e;const r=this.listeners[t];if(r)for(const o of Array.from(r))o(e&&JSON.parse(e))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,e,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:e,newValue:r}),!0)})},TT)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,e){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,e){await super._set(t,e),this.localCache[t]=JSON.stringify(e)}async _get(t){const e=await super._get(t);return this.localCache[t]=JSON.stringify(e),e}async _remove(t){await super._remove(t),delete this.localCache[t]}}lm.type="LOCAL";const dm=lm;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fm extends hm{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,e){}_removeListener(t,e){}}fm.type="SESSION";const mm=fm;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IT(i){return Promise.all(i.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(e){return{fulfilled:!1,reason:e}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const e=this.receivers.find(o=>o.isListeningto(t));if(e)return e;const r=new Na(t);return this.receivers.push(r),r}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const e=t,{eventId:r,eventType:o,data:a}=e.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;e.ports[0].postMessage({status:"ack",eventId:r,eventType:o});const f=Array.from(h).map(async g=>g(e.origin,a)),p=await IT(f);e.ports[0].postMessage({status:"done",eventId:r,eventType:o,response:p})}_subscribe(t,e){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(e)}_unsubscribe(t,e){this.handlersMap[t]&&e&&this.handlersMap[t].delete(e),(!e||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Na.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xc(i="",t=10){let e="";for(let r=0;r<t;r++)e+=Math.floor(Math.random()*10);return i+e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PT{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,e,r=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let a,h;return new Promise((f,p)=>{const g=xc("",20);o.port1.start();const w=setTimeout(()=>{p(new Error("unsupported_event"))},r);h={messageChannel:o,onMessage(T){const b=T;if(b.data.eventId===g)switch(b.data.status){case"ack":clearTimeout(w),a=setTimeout(()=>{p(new Error("timeout"))},3e3);break;case"done":clearTimeout(a),f(b.data.response);break;default:clearTimeout(w),clearTimeout(a),p(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:t,eventId:g,data:e},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tn(){return window}function AT(i){tn().location.href=i}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pm(){return typeof tn().WorkerGlobalScope<"u"&&typeof tn().importScripts=="function"}async function bT(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ST(){var i;return((i=navigator==null?void 0:navigator.serviceWorker)==null?void 0:i.controller)||null}function CT(){return pm()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _m="firebaseLocalStorageDb",RT=1,la="firebaseLocalStorage",gm="fbase_key";class Ks{constructor(t){this.request=t}toPromise(){return new Promise((t,e)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{e(this.request.error)})})}}function Oa(i,t){return i.transaction([la],t?"readwrite":"readonly").objectStore(la)}function LT(){const i=indexedDB.deleteDatabase(_m);return new Ks(i).toPromise()}function Fu(){const i=indexedDB.open(_m,RT);return new Promise((t,e)=>{i.addEventListener("error",()=>{e(i.error)}),i.addEventListener("upgradeneeded",()=>{const r=i.result;try{r.createObjectStore(la,{keyPath:gm})}catch(o){e(o)}}),i.addEventListener("success",async()=>{const r=i.result;r.objectStoreNames.contains(la)?t(r):(r.close(),await LT(),t(await Fu()))})})}async function Pl(i,t,e){const r=Oa(i,!0).put({[gm]:t,value:e});return new Ks(r).toPromise()}async function xT(i,t){const e=Oa(i,!1).get(t),r=await new Ks(e).toPromise();return r===void 0?null:r.value}function Al(i,t){const e=Oa(i,!0).delete(t);return new Ks(e).toPromise()}const kT=800,MT=3;class ym{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Fu(),this.db)}async _withRetries(t){let e=0;for(;;)try{const r=await this._openDb();return await t(r)}catch(r){if(e++>MT)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return pm()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Na._getInstance(CT()),this.receiver._subscribe("keyChanged",async(t,e)=>({keyProcessed:(await this._poll()).includes(e.key)})),this.receiver._subscribe("ping",async(t,e)=>["keyChanged"])}async initializeSender(){var e,r;if(this.activeServiceWorker=await bT(),!this.activeServiceWorker)return;this.sender=new PT(this.activeServiceWorker);const t=await this.sender._send("ping",{},800);t&&(e=t[0])!=null&&e.fulfilled&&(r=t[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||ST()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await Fu();return await Pl(t,ha,"1"),await Al(t,ha),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,e){return this._withPendingWrite(async()=>(await this._withRetries(r=>Pl(r,t,e)),this.localCache[t]=e,this.notifyServiceWorker(t)))}async _get(t){const e=await this._withRetries(r=>xT(r,t));return this.localCache[t]=e,e}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(e=>Al(e,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(o=>{const a=Oa(o,!1).getAll();return new Ks(a).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const e=[],r=new Set;if(t.length!==0)for(const{fbase_key:o,value:a}of t)r.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(a)&&(this.notifyListeners(o,a),e.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!r.has(o)&&(this.notifyListeners(o,null),e.push(o));return e}notifyListeners(t,e){this.localCache[t]=e;const r=this.listeners[t];if(r)for(const o of Array.from(r))o(e)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),kT)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,e){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(e)}_removeListener(t,e){this.listeners[t]&&(this.listeners[t].delete(e),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ym.type="LOCAL";const NT=ym;new Ws(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OT(i,t){return t?yn(t):(Y(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kc extends Rc{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return Pr(t,this._buildIdpRequest())}_linkToIdToken(t,e){return Pr(t,this._buildIdpRequest(e))}_getReauthenticationResolver(t){return Pr(t,this._buildIdpRequest())}_buildIdpRequest(t){const e={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(e.idToken=t),e}}function DT(i){return am(i.auth,new kc(i),i.bypassAuthState)}function VT(i){const{auth:t,user:e}=i;return Y(e,t,"internal-error"),fT(e,new kc(i),i.bypassAuthState)}async function FT(i){const{auth:t,user:e}=i;return Y(e,t,"internal-error"),dT(e,new kc(i),i.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vm{constructor(t,e,r,o,a=!1){this.auth=t,this.resolver=r,this.user=o,this.bypassAuthState=a,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(e)?e:[e]}execute(){return new Promise(async(t,e)=>{this.pendingPromise={resolve:t,reject:e};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(t){const{urlResponse:e,sessionId:r,postBody:o,tenantId:a,error:h,type:f}=t;if(h){this.reject(h);return}const p={auth:this.auth,requestUri:e,sessionId:r,tenantId:a||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(p))}catch(g){this.reject(g)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return DT;case"linkViaPopup":case"linkViaRedirect":return FT;case"reauthViaPopup":case"reauthViaRedirect":return VT;default:Fe(this.auth,"internal-error")}}resolve(t){An(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){An(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UT=new Ws(2e3,1e4);class yr extends vm{constructor(t,e,r,o,a){super(t,e,o,a),this.provider=r,this.authWindow=null,this.pollId=null,yr.currentPopupAction&&yr.currentPopupAction.cancel(),yr.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return Y(t,this.auth,"internal-error"),t}async onExecution(){An(this.filter.length===1,"Popup operations only handle one event");const t=xc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(Je(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var t;return((t=this.authWindow)==null?void 0:t.associatedEvent)||null}cancel(){this.reject(Je(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,yr.currentPopupAction=null}pollUserCancellation(){const t=()=>{var e,r;if((r=(e=this.authWindow)==null?void 0:e.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Je(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,UT.get())};t()}}yr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const BT="pendingRedirect",Go=new Map;class zT extends vm{constructor(t,e,r=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],e,void 0,r),this.eventId=null}async execute(){let t=Go.get(this.auth._key());if(!t){try{const r=await qT(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(r)}catch(e){t=()=>Promise.reject(e)}Go.set(this.auth._key(),t)}return this.bypassAuthState||Go.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const e=await this.auth._redirectUserForId(t.eventId);if(e)return this.user=e,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function qT(i,t){const e=GT(t),r=jT(i);if(!await r._isAvailable())return!1;const o=await r._get(e)==="true";return await r._remove(e),o}function HT(i,t){Go.set(i._key(),t)}function jT(i){return yn(i._redirectPersistence)}function GT(i){return jo(BT,i.config.apiKey,i.name)}async function WT(i,t,e=!1){if(Ce(i.app))return Promise.reject(wn(i));const r=Fi(i),o=OT(r,t),h=await new zT(r,o,e).execute();return h&&!e&&(delete h.user._redirectEventId,await r._persistUserIfCurrent(h.user),await r._setRedirectUser(null,t)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $T=10*60*1e3;class ZT{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let e=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(t,r)&&(e=!0,this.sendToConsumer(t,r),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!KT(t)||(this.hasHandledPotentialRedirect=!0,e||(this.queuedRedirectEvent=t,e=!0)),e}sendToConsumer(t,e){var r;if(t.error&&!wm(t)){const o=((r=t.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";e.onError(Je(this.auth,o))}else e.onAuthEvent(t)}isEventForConsumer(t,e){const r=e.eventId===null||!!t.eventId&&t.eventId===e.eventId;return e.filter.includes(t.type)&&r}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=$T&&this.cachedEventUids.clear(),this.cachedEventUids.has(bl(t))}saveEventToCache(t){this.cachedEventUids.add(bl(t)),this.lastProcessedEventTime=Date.now()}}function bl(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(t=>t).join("-")}function wm({type:i,error:t}){return i==="unknown"&&(t==null?void 0:t.code)==="auth/no-auth-event"}function KT(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return wm(i);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function QT(i,t={}){return oi(i,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YT=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,XT=/^https?/;async function JT(i){if(i.config.emulator)return;const{authorizedDomains:t}=await QT(i);for(const e of t)try{if(tE(e))return}catch{}Fe(i,"unauthorized-domain")}function tE(i){const t=Ou(),{protocol:e,hostname:r}=new URL(t);if(i.startsWith("chrome-extension://")){const h=new URL(i);return h.hostname===""&&r===""?e==="chrome-extension:"&&i.replace("chrome-extension://","")===t.replace("chrome-extension://",""):e==="chrome-extension:"&&h.hostname===r}if(!XT.test(e))return!1;if(YT.test(i))return r===i;const o=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eE=new Ws(3e4,6e4);function Sl(){const i=tn().___jsl;if(i!=null&&i.H){for(const t of Object.keys(i.H))if(i.H[t].r=i.H[t].r||[],i.H[t].L=i.H[t].L||[],i.H[t].r=[...i.H[t].L],i.CP)for(let e=0;e<i.CP.length;e++)i.CP[e]=null}}function nE(i){return new Promise((t,e)=>{var o,a,h;function r(){Sl(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Sl(),e(Je(i,"network-request-failed"))},timeout:eE.get()})}if((a=(o=tn().gapi)==null?void 0:o.iframes)!=null&&a.Iframe)t(gapi.iframes.getContext());else if((h=tn().gapi)!=null&&h.load)r();else{const f=Zw("iframefcb");return tn()[f]=()=>{gapi.load?r():e(Je(i,"network-request-failed"))},nm(`${$w()}?onload=${f}`).catch(p=>e(p))}}).catch(t=>{throw Wo=null,t})}let Wo=null;function iE(i){return Wo=Wo||nE(i),Wo}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rE=new Ws(5e3,15e3),sE="__/auth/iframe",oE="emulator/auth/iframe",aE={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},uE=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function cE(i){const t=i.config;Y(t.authDomain,i,"auth-domain-config-required");const e=t.emulator?bc(t,oE):`https://${i.config.authDomain}/${sE}`,r={apiKey:t.apiKey,appName:i.name,v:Dr},o=uE.get(i.config.apiHost);o&&(r.eid=o);const a=i._getFrameworks();return a.length&&(r.fw=a.join(",")),`${e}?${Fs(r).slice(1)}`}async function hE(i){const t=await iE(i),e=tn().gapi;return Y(e,i,"internal-error"),t.open({where:document.body,url:cE(i),messageHandlersFilter:e.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:aE,dontclear:!0},r=>new Promise(async(o,a)=>{await r.restyle({setHideOnLeave:!1});const h=Je(i,"network-request-failed"),f=tn().setTimeout(()=>{a(h)},rE.get());function p(){tn().clearTimeout(f),o(r)}r.ping(p).then(p,()=>{a(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lE={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},dE=500,fE=600,mE="_blank",pE="http://localhost";class Cl{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function _E(i,t,e,r=dE,o=fE){const a=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-r)/2,0).toString();let f="";const p={...lE,width:r.toString(),height:o.toString(),top:a,left:h},g=re().toLowerCase();e&&(f=Kf(g)?mE:e),$f(g)&&(t=t||pE,p.scrollbars="yes");const w=Object.entries(p).reduce((b,[V,z])=>`${b}${V}=${z},`,"");if(Fw(g)&&f!=="_self")return gE(t||"",f),new Cl(null);const T=window.open(t||"",f,w);Y(T,i,"popup-blocked");try{T.focus()}catch{}return new Cl(T)}function gE(i,t){const e=document.createElement("a");e.href=i,e.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),e.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yE="__/auth/handler",vE="emulator/auth/handler",wE=encodeURIComponent("fac");async function Rl(i,t,e,r,o,a){Y(i.config.authDomain,i,"auth-domain-config-required"),Y(i.config.apiKey,i,"invalid-api-key");const h={apiKey:i.config.apiKey,appName:i.name,authType:e,redirectUrl:r,v:Dr,eventId:o};if(t instanceof sm){t.setDefaultLanguage(i.languageCode),h.providerId=t.providerId||"",Hp(t.getCustomParameters())||(h.customParameters=JSON.stringify(t.getCustomParameters()));for(const[w,T]of Object.entries({}))h[w]=T}if(t instanceof Zs){const w=t.getScopes().filter(T=>T!=="");w.length>0&&(h.scopes=w.join(","))}i.tenantId&&(h.tid=i.tenantId);const f=h;for(const w of Object.keys(f))f[w]===void 0&&delete f[w];const p=await i._getAppCheckToken(),g=p?`#${wE}=${encodeURIComponent(p)}`:"";return`${TE(i)}?${Fs(f).slice(1)}${g}`}function TE({config:i}){return i.emulator?bc(i,vE):`https://${i.authDomain}/${yE}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const au="webStorageSupport";class EE{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=mm,this._completeRedirectFn=WT,this._overrideRedirectResult=HT}async _openPopup(t,e,r,o){var h;An((h=this.eventManagers[t._key()])==null?void 0:h.manager,"_initialize() not called before _openPopup()");const a=await Rl(t,e,r,Ou(),o);return _E(t,a,xc())}async _openRedirect(t,e,r,o){await this._originValidation(t);const a=await Rl(t,e,r,Ou(),o);return AT(a),new Promise(()=>{})}_initialize(t){const e=t._key();if(this.eventManagers[e]){const{manager:o,promise:a}=this.eventManagers[e];return o?Promise.resolve(o):(An(a,"If manager is not set, promise should be"),a)}const r=this.initAndGetManager(t);return this.eventManagers[e]={promise:r},r.catch(()=>{delete this.eventManagers[e]}),r}async initAndGetManager(t){const e=await hE(t),r=new ZT(t);return e.register("authEvent",o=>(Y(o==null?void 0:o.authEvent,t,"invalid-auth-event"),{status:r.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:r},this.iframes[t._key()]=e,r}_isIframeWebStorageSupported(t,e){this.iframes[t._key()].send(au,{type:au},o=>{var h;const a=(h=o==null?void 0:o[0])==null?void 0:h[au];a!==void 0&&e(!!a),Fe(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const e=t._key();return this.originValidationPromises[e]||(this.originValidationPromises[e]=JT(t)),this.originValidationPromises[e]}get _shouldInitProactively(){return tm()||Zf()||Cc()}}const IE=EE;var Ll="@firebase/auth",xl="1.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PE{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){var t;return this.assertAuthConfigured(),((t=this.auth.currentUser)==null?void 0:t.uid)||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const e=this.auth.onIdTokenChanged(r=>{t((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(t,e),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const e=this.internalListeners.get(t);e&&(this.internalListeners.delete(t),e(),this.updateProactiveRefresh())}assertAuthConfigured(){Y(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AE(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function bE(i){Ar(new Li("auth",(t,{options:e})=>{const r=t.getProvider("app").getImmediate(),o=t.getProvider("heartbeat"),a=t.getProvider("app-check-internal"),{apiKey:h,authDomain:f}=r.options;Y(h&&!h.includes(":"),"invalid-api-key",{appName:r.name});const p={apiKey:h,authDomain:f,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:em(i)},g=new jw(r,o,a,p);return tT(g,e),g},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,r)=>{t.getProvider("auth-internal").initialize()})),Ar(new Li("auth-internal",t=>{const e=Fi(t.getProvider("auth").getImmediate());return(r=>new PE(r))(e)},"PRIVATE").setInstantiationMode("EXPLICIT")),$n(Ll,xl,AE(i)),$n(Ll,xl,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SE=5*60,CE=Gl("authIdTokenMaxAge")||SE;let kl=null;const RE=i=>async t=>{const e=t&&await t.getIdTokenResult(),r=e&&(new Date().getTime()-Date.parse(e.issuedAtTime))/1e3;if(r&&r>CE)return;const o=e==null?void 0:e.token;kl!==o&&(kl=o,await fetch(i,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function LE(i=Yl()){const t=zu(i,"auth");if(t.isInitialized())return t.getImmediate();const e=Jw(i,{popupRedirectResolver:IE,persistence:[NT,dm,mm]}),r=Gl("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const a=new URL(r,location.origin);if(location.origin===a.origin){const h=RE(a.toString());vT(e,h,()=>h(e.currentUser)),yT(e,f=>h(f))}}const o=Hl("auth");return o&&eT(e,`http://${o}`),e}function xE(){var i;return((i=document.getElementsByTagName("head"))==null?void 0:i[0])??document}Gw({loadJS(i){return new Promise((t,e)=>{const r=document.createElement("script");r.setAttribute("src",i),r.onload=t,r.onerror=o=>{const a=Je("internal-error");a.customData=o,e(a)},r.type="text/javascript",r.charset="UTF-8",xE().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});bE("Browser");const kE={apiKey:"AIzaSyBcHvgdkcJ0SS9_-t74ycPFJG5VTcSz7j8",authDomain:"guesstheplace-5ba28.firebaseapp.com",databaseURL:"https://guesstheplace-5ba28.firebaseio.com",projectId:"guesstheplace-5ba28",storageBucket:"guesstheplace-5ba28.firebasestorage.app",messagingSenderId:"583921403533",appId:"583921403533"},Tm=Ql(kE),Ci=LE(Tm),bi=Yv(Tm);gT(Ci,dm);class Em{constructor(t,e,r=[],o=0,a=new Date){this.id=t,this.userId=e,this.rounds=r,this.totalScore=o,this.date=a}getId(){return this.id}getUserId(){return this.userId}getRounds(){return this.rounds}getTotalScore(){return this.totalScore}getDate(){return this.date}addRound(t){this.rounds.push(t),this.totalScore+=t.getScore()}}class Im{static async saveGame(t){try{return(await dw(this.collectionref,{userId:t.getUserId(),totalScore:t.getTotalScore(),date:t.getDate().toISOString()})).id}catch(e){throw console.error("Error saving game: ",e),e}}static async getGamesByUserId(t){try{const e=ku(this.collectionref,Nf("userId","==",t),Mu("date","desc"));return(await Nu(e)).docs.map(o=>{const a=o.data();return new Em(o.id,a.userId,[],a.totalScore,new Date(a.date))})}catch(e){throw console.error("Error fetching games: ",e),e}}}eh(Im,"collectionref",Af(bi,"games"));class ME{static async execute(t,e){if(!t)throw new Error("User ID is required to save a game.");const r=new Em(null,t,[],e,new Date);try{return await Im.saveGame(r)}catch(o){throw console.error("Failed to save game:",o),o}}}class NE{constructor({gameController:t,gameMapController:e,uiView:r}){this.gameController=t,this.gameMapController=e,this.uiView=r,this.tempGuess=null}setTempGuess(t){this.gameController.isGameOver()||(this.tempGuess={lat:t.lat,lng:t.lng},this.uiView.setConfirmEnabled(!0))}async startNewGame(){this._resetAllUI(),this.uiView.setStatus("Recupero foto... potrebbe volerci qualche istante.");try{await this.gameController.startNewGame(),this._updatePhotoUI(),this.uiView.setStatus("Foto caricate. Inizio partita.")}catch(t){console.error("Errore startNewGame:",t),this.uiView.setStatus("Errore nel recupero delle foto. Riprova.")}finally{setTimeout(()=>this.uiView.clearStatus(),2e3)}}handleMapClick(t){this.gameController.isGameOver()||(this.tempGuess={lat:t.lat,lng:t.lng},this.uiView.setConfirmEnabled(!0))}confirmGuess(){if(!this.tempGuess||this.gameController.isGameOver())return;const t=this.gameController.confirmGuess(this.tempGuess),e=this.gameController.getCurrentPhoto();this.gameMapController.showSolution(e),this.gameMapController.showLineBetween(),this.uiView.addRoundScore(this.gameController.getCurrentRound(),t.score,t.distance),this.uiView.setConfirmEnabled(!1),this.uiView.showNextButton(!0),this.gameMapController&&typeof this.gameMapController.disableInteraction=="function"&&this.gameMapController.disableInteraction(),this.tempGuess=null}async nextRound(){if(!this.gameController.nextRound())return await this._endGame();this._resetRoundUI(),this._updatePhotoUI()}async _endGame(){const t=this.gameController.getTotalScore(),e=ce.user;if(e)try{await ME.execute(e.id,t)}catch(r){console.log("Errore salvataggio partita:",r)}this.uiView.showGameOver(t);try{this.uiView.showNextButton(!1),this.uiView.setConfirmEnabled(!1)}catch{}this.gameMapController&&typeof this.gameMapController.disableInteraction=="function"&&this.gameMapController.disableInteraction()}_updatePhotoUI(){const t=this.gameController.getCurrentPhoto();t&&this.uiView.setPhoto(t.url)}_resetRoundUI(){this.tempGuess=null,this.gameMapController.reset(),this.gameMapController&&typeof this.gameMapController.enableInteraction=="function"&&this.gameMapController.enableInteraction(),this.uiView.setConfirmEnabled(!1),this.uiView.showNextButton(!1)}_resetAllUI(){this.tempGuess=null,this.gameMapController.reset(),this.gameMapController&&typeof this.gameMapController.enableInteraction=="function"&&this.gameMapController.enableInteraction(),this.uiView.reset(),this.uiView.setConfirmEnabled(!1),this.uiView.showNextButton(!1)}}class Ze{constructor(t,e=null,r=null,o=[]){this.id=t,this.email=e,this.username=r,this.following=new Set(o)}static fromFirebaseUser(t,e={}){return t?(console.log(t),new Ze(t.uid,t.email,t.displayName,e.following||[])):null}static fromFirebaseDb(t){if(!t.exists())return null;const e=t.data();return new Ze(e.id,e.email,e.username,e.following||[])}getId(){return this.id}getEmail(){return this.email}getUsername(){return this.username}getFollowing(){return this.following}follow(t){this.following.add(t)}unfollow(t){this.following.delete(t)}isFollowing(t){return this.following.has(t)}toJSON(){return{id:this.id,email:this.email,username:this.username,following:Array.from(this.following)}}}const Ml=Af(bi,"users"),Da={async register({email:i,password:t,username:e}){const o=(await pT(Ci,i,t)).user,a=gr(bi,"users",o.uid);return await lw(a,{email:i,username:e.toLowerCase(),following:[],createdAt:new Date}),Ze.fromFirebaseUser(o)},async login({email:i,password:t}){const e=await _T(Ci,i,t);return Ze.fromFirebaseUser(e.user)},async logout(){await wT(Ci)},async getUserById(i){const t=gr(bi,"users",i),e=await dl(t);if(!e.exists())return null;const r=e.data();return new Ze(i,r.email||null,r.username||null,r.following||[])},async getUserFromUsername(i){if(!i)return null;try{const t=ku(Ml,Nf("username","==",i),Mu("username")),e=await Nu(t);return e.empty?null:e.docs.map(r=>Ze.fromFirebaseUser(r))}catch(t){throw console.error("Error fetching user by username: ",t),t}},async findByUsernamePrefix(i,t=10){if(!i)return[];try{const e=i.toLowerCase(),r=e,o=e+"",a=ku(Ml,Mu("username"),aw(r),uw(o));return(await Nu(a)).docs.slice(0,t).map(p=>Ze.fromFirebaseDb(p))}catch(e){throw console.error("Error searching users by prefix: ",e),e}},async followUser(i,t){const e=gr(bi,"users",i);await fl(e,{following:mw(t)})},async unfollowUser(i,t){const e=gr(bi,"users",i);await fl(e,{following:pw(t)})},onAuthStateChanged(i){cm(Ci,async t=>{if(!t)return i(null);const e=await dl(gr(bi,"users",t.uid));if(e.exists()){const r=e.data();i(new Ze(r.id,r.email,r.username,r.following||[]))}else i(null)})}};async function OE(){await Ci.authStateReady(),cm(Ci,async i=>{if(i){const e=await Da.getUserById(i.uid)??Ze.fromFirebaseUser(i);ce.setUser(e)}else ce.clearUser();ce.authReady||ce.setAuthReady()})}async function DE({email:i,password:t}){if(!i||!t)throw new Error("Email and password required");const e=await Da.login({email:i,password:t});return ce.setUser(e),e}async function VE(){await Da.logout(),ce.clearUser()}function Nl(i){const t=document.createElement("div");t.innerHTML=`
    <h2>Login</h2>
    <form id="login-form">
        <input type="email" id="email" name="email" placeholder="Email" required />
        <input type="password" id="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
    </form>
    <div id="loginMessage"></div>
    <div id="sessionInfo"></div>
    `;const e=t.querySelector("#login-form"),r=t.querySelector("#loginMessage");return e.addEventListener("submit",async o=>{o.preventDefault(),r.textContent="";const a=new FormData(e);try{const h=await DE({email:a.get("email"),password:a.get("password")});r.textContent="Login successful!"}catch(h){console.error("Login error:",h),r.textContent=`Error: ${h.message}`}}),i.appendChild(t),t}async function FE({email:i,password:t,username:e}){if(!i||!t)throw new Error("Email and password required");if(t.length<6)throw new Error("Password must be >= 6 chars");const r=await Da.register({email:i,password:t,username:e});return ce.setUser(r),r}function UE(i){const t=document.createElement("div");t.innerHTML=`
    <h2>Register</h2>
    <form id="register-form">
        <input type="text" id="username" name="username" placeholder="Username" required />
        <input type="email" id="email" name="email" placeholder="Email" required />
        <input type="password" id="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
    </form>
    <div id="registerMessage"></div>
    `;const e=t.querySelector("#register-form"),r=t.querySelector("#registerMessage");return e.addEventListener("submit",async o=>{o.preventDefault(),r.textContent="";const a=new FormData(e);try{const h=await FE({email:a.get("email"),password:a.get("password"),username:a.get("username")});r.textContent="Registration successful!"}catch(h){console.error("Registration error:",h),r.textContent=`Error: ${h.message}`}}),i.appendChild(t),t}function BE(i){i.innerHTML=`
    <div>
        <button id="btnShowLogin">Login</button>
        <button id="btnShowRegister">Register</button>
    </div>
    <div id="main"></div>
    `;const t=i.querySelector("#main");i.querySelector("#btnShowLogin").addEventListener("click",()=>{t.innerHTML="",Nl(t)}),i.querySelector("#btnShowRegister").addEventListener("click",()=>{t.innerHTML="",UE(t)}),t.innerHTML="",Nl(t)}const zE="modulepreload",qE=function(i){return"/"+i},Ol={},Dl=function(t,e,r){let o=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const h=document.querySelector("meta[property=csp-nonce]"),f=(h==null?void 0:h.nonce)||(h==null?void 0:h.getAttribute("nonce"));o=Promise.allSettled(e.map(p=>{if(p=qE(p),p in Ol)return;Ol[p]=!0;const g=p.endsWith(".css"),w=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${w}`))return;const T=document.createElement("link");if(T.rel=g?"stylesheet":zE,g||(T.as="script"),T.crossOrigin="",T.href=p,f&&T.setAttribute("nonce",f),document.head.appendChild(T),g)return new Promise((b,V)=>{T.addEventListener("load",b),T.addEventListener("error",()=>V(new Error(`Unable to preload CSS for ${p}`)))})}))}function a(h){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=h,window.dispatchEvent(f),!f.defaultPrevented)throw h}return o.then(h=>{for(const f of h||[])f.status==="rejected"&&a(f.reason);return t().catch(a)})};function HE(i){const t=document.createElement("div");t.id="sessionComponent";const e=()=>{if(t.innerHTML="",ce.isAuthenticated&&ce.user){const r=ce.user,o=r.username,a=document.createElement("p");a.textContent=`Logged in as: ${o||r.email||"User"}`,t.appendChild(a);const h=document.createElement("button");h.textContent="Logout",h.addEventListener("click",async()=>{try{await VE(),alert("You have been logged out.")}catch(f){console.error("Logout error:",f),alert(`Error during logout: ${f.message}`)}}),t.appendChild(h)}else{const r=document.createElement("p");r.textContent="Not logged in.",t.appendChild(r)}};return ce.subscribe(e),e(),i.appendChild(t),t}var jE=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Vl={exports:{}};/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */(function(i,t){(function(e,r){r(t)})(jE,function(e){var r="1.9.4";function o(n){var s,c,l,m;for(c=1,l=arguments.length;c<l;c++){m=arguments[c];for(s in m)n[s]=m[s]}return n}var a=Object.create||function(){function n(){}return function(s){return n.prototype=s,new n}}();function h(n,s){var c=Array.prototype.slice;if(n.bind)return n.bind.apply(n,c.call(arguments,1));var l=c.call(arguments,2);return function(){return n.apply(s,l.length?l.concat(c.call(arguments)):arguments)}}var f=0;function p(n){return"_leaflet_id"in n||(n._leaflet_id=++f),n._leaflet_id}function g(n,s,c){var l,m,y,I;return I=function(){l=!1,m&&(y.apply(c,m),m=!1)},y=function(){l?m=arguments:(n.apply(c,arguments),setTimeout(I,s),l=!0)},y}function w(n,s,c){var l=s[1],m=s[0],y=l-m;return n===l&&c?n:((n-m)%y+y)%y+m}function T(){return!1}function b(n,s){if(s===!1)return n;var c=Math.pow(10,s===void 0?6:s);return Math.round(n*c)/c}function V(n){return n.trim?n.trim():n.replace(/^\s+|\s+$/g,"")}function z(n){return V(n).split(/\s+/)}function B(n,s){Object.prototype.hasOwnProperty.call(n,"options")||(n.options=n.options?a(n.options):{});for(var c in s)n.options[c]=s[c];return n.options}function q(n,s,c){var l=[];for(var m in n)l.push(encodeURIComponent(c?m.toUpperCase():m)+"="+encodeURIComponent(n[m]));return(!s||s.indexOf("?")===-1?"?":"&")+l.join("&")}var ht=/\{ *([\w_ -]+) *\}/g;function ot(n,s){return n.replace(ht,function(c,l){var m=s[l];if(m===void 0)throw new Error("No value provided for variable "+c);return typeof m=="function"&&(m=m(s)),m})}var st=Array.isArray||function(n){return Object.prototype.toString.call(n)==="[object Array]"};function xt(n,s){for(var c=0;c<n.length;c++)if(n[c]===s)return c;return-1}var Ht="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";function Rt(n){return window["webkit"+n]||window["moz"+n]||window["ms"+n]}var C=0;function E(n){var s=+new Date,c=Math.max(0,16-(s-C));return C=s+c,window.setTimeout(n,c)}var A=window.requestAnimationFrame||Rt("RequestAnimationFrame")||E,R=window.cancelAnimationFrame||Rt("CancelAnimationFrame")||Rt("CancelRequestAnimationFrame")||function(n){window.clearTimeout(n)};function S(n,s,c){if(c&&A===E)n.call(s);else return A.call(window,h(n,s))}function x(n){n&&R.call(window,n)}var P={__proto__:null,extend:o,create:a,bind:h,get lastId(){return f},stamp:p,throttle:g,wrapNum:w,falseFn:T,formatNum:b,trim:V,splitWords:z,setOptions:B,getParamString:q,template:ot,isArray:st,indexOf:xt,emptyImageUrl:Ht,requestFn:A,cancelFn:R,requestAnimFrame:S,cancelAnimFrame:x};function Ct(){}Ct.extend=function(n){var s=function(){B(this),this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()},c=s.__super__=this.prototype,l=a(c);l.constructor=s,s.prototype=l;for(var m in this)Object.prototype.hasOwnProperty.call(this,m)&&m!=="prototype"&&m!=="__super__"&&(s[m]=this[m]);return n.statics&&o(s,n.statics),n.includes&&(rn(n.includes),o.apply(null,[l].concat(n.includes))),o(l,n),delete l.statics,delete l.includes,l.options&&(l.options=c.options?a(c.options):{},o(l.options,n.options)),l._initHooks=[],l.callInitHooks=function(){if(!this._initHooksCalled){c.callInitHooks&&c.callInitHooks.call(this),this._initHooksCalled=!0;for(var y=0,I=l._initHooks.length;y<I;y++)l._initHooks[y].call(this)}},s},Ct.include=function(n){var s=this.prototype.options;return o(this.prototype,n),n.options&&(this.prototype.options=s,this.mergeOptions(n.options)),this},Ct.mergeOptions=function(n){return o(this.prototype.options,n),this},Ct.addInitHook=function(n){var s=Array.prototype.slice.call(arguments,1),c=typeof n=="function"?n:function(){this[n].apply(this,s)};return this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(c),this};function rn(n){if(!(typeof L>"u"||!L||!L.Mixin)){n=st(n)?n:[n];for(var s=0;s<n.length;s++)n[s]===L.Mixin.Events&&console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.",new Error().stack)}}var se={on:function(n,s,c){if(typeof n=="object")for(var l in n)this._on(l,n[l],s);else{n=z(n);for(var m=0,y=n.length;m<y;m++)this._on(n[m],s,c)}return this},off:function(n,s,c){if(!arguments.length)delete this._events;else if(typeof n=="object")for(var l in n)this._off(l,n[l],s);else{n=z(n);for(var m=arguments.length===1,y=0,I=n.length;y<I;y++)m?this._off(n[y]):this._off(n[y],s,c)}return this},_on:function(n,s,c,l){if(typeof s!="function"){console.warn("wrong listener type: "+typeof s);return}if(this._listens(n,s,c)===!1){c===this&&(c=void 0);var m={fn:s,ctx:c};l&&(m.once=!0),this._events=this._events||{},this._events[n]=this._events[n]||[],this._events[n].push(m)}},_off:function(n,s,c){var l,m,y;if(this._events&&(l=this._events[n],!!l)){if(arguments.length===1){if(this._firingCount)for(m=0,y=l.length;m<y;m++)l[m].fn=T;delete this._events[n];return}if(typeof s!="function"){console.warn("wrong listener type: "+typeof s);return}var I=this._listens(n,s,c);if(I!==!1){var M=l[I];this._firingCount&&(M.fn=T,this._events[n]=l=l.slice()),l.splice(I,1)}}},fire:function(n,s,c){if(!this.listens(n,c))return this;var l=o({},s,{type:n,target:this,sourceTarget:s&&s.sourceTarget||this});if(this._events){var m=this._events[n];if(m){this._firingCount=this._firingCount+1||1;for(var y=0,I=m.length;y<I;y++){var M=m[y],O=M.fn;M.once&&this.off(n,O,M.ctx),O.call(M.ctx||this,l)}this._firingCount--}}return c&&this._propagateEvent(l),this},listens:function(n,s,c,l){typeof n!="string"&&console.warn('"string" type argument expected');var m=s;typeof s!="function"&&(l=!!s,m=void 0,c=void 0);var y=this._events&&this._events[n];if(y&&y.length&&this._listens(n,m,c)!==!1)return!0;if(l){for(var I in this._eventParents)if(this._eventParents[I].listens(n,s,c,l))return!0}return!1},_listens:function(n,s,c){if(!this._events)return!1;var l=this._events[n]||[];if(!s)return!!l.length;c===this&&(c=void 0);for(var m=0,y=l.length;m<y;m++)if(l[m].fn===s&&l[m].ctx===c)return m;return!1},once:function(n,s,c){if(typeof n=="object")for(var l in n)this._on(l,n[l],s,!0);else{n=z(n);for(var m=0,y=n.length;m<y;m++)this._on(n[m],s,c,!0)}return this},addEventParent:function(n){return this._eventParents=this._eventParents||{},this._eventParents[p(n)]=n,this},removeEventParent:function(n){return this._eventParents&&delete this._eventParents[p(n)],this},_propagateEvent:function(n){for(var s in this._eventParents)this._eventParents[s].fire(n.type,o({layer:n.target,propagatedFrom:n.target},n),!0)}};se.addEventListener=se.on,se.removeEventListener=se.clearAllEventListeners=se.off,se.addOneTimeEventListener=se.once,se.fireEvent=se.fire,se.hasEventListeners=se.listens;var ai=Ct.extend(se);function J(n,s,c){this.x=c?Math.round(n):n,this.y=c?Math.round(s):s}var ui=Math.trunc||function(n){return n>0?Math.floor(n):Math.ceil(n)};J.prototype={clone:function(){return new J(this.x,this.y)},add:function(n){return this.clone()._add(tt(n))},_add:function(n){return this.x+=n.x,this.y+=n.y,this},subtract:function(n){return this.clone()._subtract(tt(n))},_subtract:function(n){return this.x-=n.x,this.y-=n.y,this},divideBy:function(n){return this.clone()._divideBy(n)},_divideBy:function(n){return this.x/=n,this.y/=n,this},multiplyBy:function(n){return this.clone()._multiplyBy(n)},_multiplyBy:function(n){return this.x*=n,this.y*=n,this},scaleBy:function(n){return new J(this.x*n.x,this.y*n.y)},unscaleBy:function(n){return new J(this.x/n.x,this.y/n.y)},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},ceil:function(){return this.clone()._ceil()},_ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this},trunc:function(){return this.clone()._trunc()},_trunc:function(){return this.x=ui(this.x),this.y=ui(this.y),this},distanceTo:function(n){n=tt(n);var s=n.x-this.x,c=n.y-this.y;return Math.sqrt(s*s+c*c)},equals:function(n){return n=tt(n),n.x===this.x&&n.y===this.y},contains:function(n){return n=tt(n),Math.abs(n.x)<=Math.abs(this.x)&&Math.abs(n.y)<=Math.abs(this.y)},toString:function(){return"Point("+b(this.x)+", "+b(this.y)+")"}};function tt(n,s,c){return n instanceof J?n:st(n)?new J(n[0],n[1]):n==null?n:typeof n=="object"&&"x"in n&&"y"in n?new J(n.x,n.y):new J(n,s,c)}function Pt(n,s){if(n)for(var c=s?[n,s]:n,l=0,m=c.length;l<m;l++)this.extend(c[l])}Pt.prototype={extend:function(n){var s,c;if(!n)return this;if(n instanceof J||typeof n[0]=="number"||"x"in n)s=c=tt(n);else if(n=Kt(n),s=n.min,c=n.max,!s||!c)return this;return!this.min&&!this.max?(this.min=s.clone(),this.max=c.clone()):(this.min.x=Math.min(s.x,this.min.x),this.max.x=Math.max(c.x,this.max.x),this.min.y=Math.min(s.y,this.min.y),this.max.y=Math.max(c.y,this.max.y)),this},getCenter:function(n){return tt((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,n)},getBottomLeft:function(){return tt(this.min.x,this.max.y)},getTopRight:function(){return tt(this.max.x,this.min.y)},getTopLeft:function(){return this.min},getBottomRight:function(){return this.max},getSize:function(){return this.max.subtract(this.min)},contains:function(n){var s,c;return typeof n[0]=="number"||n instanceof J?n=tt(n):n=Kt(n),n instanceof Pt?(s=n.min,c=n.max):s=c=n,s.x>=this.min.x&&c.x<=this.max.x&&s.y>=this.min.y&&c.y<=this.max.y},intersects:function(n){n=Kt(n);var s=this.min,c=this.max,l=n.min,m=n.max,y=m.x>=s.x&&l.x<=c.x,I=m.y>=s.y&&l.y<=c.y;return y&&I},overlaps:function(n){n=Kt(n);var s=this.min,c=this.max,l=n.min,m=n.max,y=m.x>s.x&&l.x<c.x,I=m.y>s.y&&l.y<c.y;return y&&I},isValid:function(){return!!(this.min&&this.max)},pad:function(n){var s=this.min,c=this.max,l=Math.abs(s.x-c.x)*n,m=Math.abs(s.y-c.y)*n;return Kt(tt(s.x-l,s.y-m),tt(c.x+l,c.y+m))},equals:function(n){return n?(n=Kt(n),this.min.equals(n.getTopLeft())&&this.max.equals(n.getBottomRight())):!1}};function Kt(n,s){return!n||n instanceof Pt?n:new Pt(n,s)}function Qt(n,s){if(n)for(var c=s?[n,s]:n,l=0,m=c.length;l<m;l++)this.extend(c[l])}Qt.prototype={extend:function(n){var s=this._southWest,c=this._northEast,l,m;if(n instanceof _t)l=n,m=n;else if(n instanceof Qt){if(l=n._southWest,m=n._northEast,!l||!m)return this}else return n?this.extend(at(n)||bt(n)):this;return!s&&!c?(this._southWest=new _t(l.lat,l.lng),this._northEast=new _t(m.lat,m.lng)):(s.lat=Math.min(l.lat,s.lat),s.lng=Math.min(l.lng,s.lng),c.lat=Math.max(m.lat,c.lat),c.lng=Math.max(m.lng,c.lng)),this},pad:function(n){var s=this._southWest,c=this._northEast,l=Math.abs(s.lat-c.lat)*n,m=Math.abs(s.lng-c.lng)*n;return new Qt(new _t(s.lat-l,s.lng-m),new _t(c.lat+l,c.lng+m))},getCenter:function(){return new _t((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new _t(this.getNorth(),this.getWest())},getSouthEast:function(){return new _t(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(n){typeof n[0]=="number"||n instanceof _t||"lat"in n?n=at(n):n=bt(n);var s=this._southWest,c=this._northEast,l,m;return n instanceof Qt?(l=n.getSouthWest(),m=n.getNorthEast()):l=m=n,l.lat>=s.lat&&m.lat<=c.lat&&l.lng>=s.lng&&m.lng<=c.lng},intersects:function(n){n=bt(n);var s=this._southWest,c=this._northEast,l=n.getSouthWest(),m=n.getNorthEast(),y=m.lat>=s.lat&&l.lat<=c.lat,I=m.lng>=s.lng&&l.lng<=c.lng;return y&&I},overlaps:function(n){n=bt(n);var s=this._southWest,c=this._northEast,l=n.getSouthWest(),m=n.getNorthEast(),y=m.lat>s.lat&&l.lat<c.lat,I=m.lng>s.lng&&l.lng<c.lng;return y&&I},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(n,s){return n?(n=bt(n),this._southWest.equals(n.getSouthWest(),s)&&this._northEast.equals(n.getNorthEast(),s)):!1},isValid:function(){return!!(this._southWest&&this._northEast)}};function bt(n,s){return n instanceof Qt?n:new Qt(n,s)}function _t(n,s,c){if(isNaN(n)||isNaN(s))throw new Error("Invalid LatLng object: ("+n+", "+s+")");this.lat=+n,this.lng=+s,c!==void 0&&(this.alt=+c)}_t.prototype={equals:function(n,s){if(!n)return!1;n=at(n);var c=Math.max(Math.abs(this.lat-n.lat),Math.abs(this.lng-n.lng));return c<=(s===void 0?1e-9:s)},toString:function(n){return"LatLng("+b(this.lat,n)+", "+b(this.lng,n)+")"},distanceTo:function(n){return we.distance(this,at(n))},wrap:function(){return we.wrapLatLng(this)},toBounds:function(n){var s=180*n/40075017,c=s/Math.cos(Math.PI/180*this.lat);return bt([this.lat-s,this.lng-c],[this.lat+s,this.lng+c])},clone:function(){return new _t(this.lat,this.lng,this.alt)}};function at(n,s,c){return n instanceof _t?n:st(n)&&typeof n[0]!="object"?n.length===3?new _t(n[0],n[1],n[2]):n.length===2?new _t(n[0],n[1]):null:n==null?n:typeof n=="object"&&"lat"in n?new _t(n.lat,"lng"in n?n.lng:n.lon,n.alt):s===void 0?null:new _t(n,s,c)}var _e={latLngToPoint:function(n,s){var c=this.projection.project(n),l=this.scale(s);return this.transformation._transform(c,l)},pointToLatLng:function(n,s){var c=this.scale(s),l=this.transformation.untransform(n,c);return this.projection.unproject(l)},project:function(n){return this.projection.project(n)},unproject:function(n){return this.projection.unproject(n)},scale:function(n){return 256*Math.pow(2,n)},zoom:function(n){return Math.log(n/256)/Math.LN2},getProjectedBounds:function(n){if(this.infinite)return null;var s=this.projection.bounds,c=this.scale(n),l=this.transformation.transform(s.min,c),m=this.transformation.transform(s.max,c);return new Pt(l,m)},infinite:!1,wrapLatLng:function(n){var s=this.wrapLng?w(n.lng,this.wrapLng,!0):n.lng,c=this.wrapLat?w(n.lat,this.wrapLat,!0):n.lat,l=n.alt;return new _t(c,s,l)},wrapLatLngBounds:function(n){var s=n.getCenter(),c=this.wrapLatLng(s),l=s.lat-c.lat,m=s.lng-c.lng;if(l===0&&m===0)return n;var y=n.getSouthWest(),I=n.getNorthEast(),M=new _t(y.lat-l,y.lng-m),O=new _t(I.lat-l,I.lng-m);return new Qt(M,O)}},we=o({},_e,{wrapLng:[-180,180],R:6371e3,distance:function(n,s){var c=Math.PI/180,l=n.lat*c,m=s.lat*c,y=Math.sin((s.lat-n.lat)*c/2),I=Math.sin((s.lng-n.lng)*c/2),M=y*y+Math.cos(l)*Math.cos(m)*I*I,O=2*Math.atan2(Math.sqrt(M),Math.sqrt(1-M));return this.R*O}}),Hr=6378137,jr={R:Hr,MAX_LATITUDE:85.0511287798,project:function(n){var s=Math.PI/180,c=this.MAX_LATITUDE,l=Math.max(Math.min(c,n.lat),-c),m=Math.sin(l*s);return new J(this.R*n.lng*s,this.R*Math.log((1+m)/(1-m))/2)},unproject:function(n){var s=180/Math.PI;return new _t((2*Math.atan(Math.exp(n.y/this.R))-Math.PI/2)*s,n.x*s/this.R)},bounds:function(){var n=Hr*Math.PI;return new Pt([-n,-n],[n,n])}()};function Gr(n,s,c,l){if(st(n)){this._a=n[0],this._b=n[1],this._c=n[2],this._d=n[3];return}this._a=n,this._b=s,this._c=c,this._d=l}Gr.prototype={transform:function(n,s){return this._transform(n.clone(),s)},_transform:function(n,s){return s=s||1,n.x=s*(this._a*n.x+this._b),n.y=s*(this._c*n.y+this._d),n},untransform:function(n,s){return s=s||1,new J((n.x/s-this._b)/this._a,(n.y/s-this._d)/this._c)}};function Cn(n,s,c,l){return new Gr(n,s,c,l)}var ci=o({},we,{code:"EPSG:3857",projection:jr,transformation:function(){var n=.5/(Math.PI*jr.R);return Cn(n,.5,-n,.5)}()}),Qs=o({},ci,{code:"EPSG:900913"});function Ys(n){return document.createElementNS("http://www.w3.org/2000/svg",n)}function Ui(n,s){var c="",l,m,y,I,M,O;for(l=0,y=n.length;l<y;l++){for(M=n[l],m=0,I=M.length;m<I;m++)O=M[m],c+=(m?"L":"M")+O.x+" "+O.y;c+=s?Z.svg?"z":"x":""}return c||"M0 0"}var hi=document.documentElement.style,li="ActiveXObject"in window,jt=li&&!document.addEventListener,Gt="msLaunchUri"in navigator&&!("documentMode"in document),Rn=he("webkit"),Xs=he("android"),Wr=he("android 2")||he("android 3"),Va=parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1],10),di=Xs&&he("Google")&&Va<537&&!("AudioNode"in window),Bi=!!window.opera,$r=!Gt&&he("chrome"),zi=he("gecko")&&!Rn&&!Bi&&!li,Fa=!$r&&he("safari"),Js=he("phantom"),Zr="OTransition"in hi,to=navigator.platform.indexOf("Win")===0,Ln=li&&"transition"in hi,fi="WebKitCSSMatrix"in window&&"m11"in new window.WebKitCSSMatrix&&!Wr,qi="MozPerspective"in hi,sn=!window.L_DISABLE_3D&&(Ln||fi||qi)&&!Zr&&!Js,xn=typeof orientation<"u"||he("mobile"),Hi=xn&&Rn,eo=xn&&fi,kn=!window.PointerEvent&&window.MSPointerEvent,Kr=!!(window.PointerEvent||kn),Wt="ontouchstart"in window||!!window.TouchEvent,no=!window.L_NO_TOUCH&&(Wt||Kr),mi=xn&&Bi,pi=xn&&zi,Ua=(window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI)>1,Ba=function(){var n=!1;try{var s=Object.defineProperty({},"passive",{get:function(){n=!0}});window.addEventListener("testPassiveEventSupport",T,s),window.removeEventListener("testPassiveEventSupport",T,s)}catch{}return n}(),Mn=function(){return!!document.createElement("canvas").getContext}(),Qr=!!(document.createElementNS&&Ys("svg").createSVGRect),za=!!Qr&&function(){var n=document.createElement("div");return n.innerHTML="<svg/>",(n.firstChild&&n.firstChild.namespaceURI)==="http://www.w3.org/2000/svg"}(),ji=!Qr&&function(){try{var n=document.createElement("div");n.innerHTML='<v:shape adj="1"/>';var s=n.firstChild;return s.style.behavior="url(#default#VML)",s&&typeof s.adj=="object"}catch{return!1}}(),io=navigator.platform.indexOf("Mac")===0,ro=navigator.platform.indexOf("Linux")===0;function he(n){return navigator.userAgent.toLowerCase().indexOf(n)>=0}var Z={ie:li,ielt9:jt,edge:Gt,webkit:Rn,android:Xs,android23:Wr,androidStock:di,opera:Bi,chrome:$r,gecko:zi,safari:Fa,phantom:Js,opera12:Zr,win:to,ie3d:Ln,webkit3d:fi,gecko3d:qi,any3d:sn,mobile:xn,mobileWebkit:Hi,mobileWebkit3d:eo,msPointer:kn,pointer:Kr,touch:no,touchNative:Wt,mobileOpera:mi,mobileGecko:pi,retina:Ua,passiveEvents:Ba,canvas:Mn,svg:Qr,vml:ji,inlineSvg:za,mac:io,linux:ro},so=Z.msPointer?"MSPointerDown":"pointerdown",Le=Z.msPointer?"MSPointerMove":"pointermove",Yr=Z.msPointer?"MSPointerUp":"pointerup",Xr=Z.msPointer?"MSPointerCancel":"pointercancel",_i={touchstart:so,touchmove:Le,touchend:Yr,touchcancel:Xr},Gi={touchstart:Jr,touchmove:Te,touchend:Te,touchcancel:Te},on={},oo=!1;function ao(n,s,c){return s==="touchstart"&&gi(),Gi[s]?(c=Gi[s].bind(this,c),n.addEventListener(_i[s],c,!1),c):(console.warn("wrong event specified:",s),T)}function qa(n,s,c){if(!_i[s]){console.warn("wrong event specified:",s);return}n.removeEventListener(_i[s],c,!1)}function Wi(n){on[n.pointerId]=n}function uo(n){on[n.pointerId]&&(on[n.pointerId]=n)}function $i(n){delete on[n.pointerId]}function gi(){oo||(document.addEventListener(so,Wi,!0),document.addEventListener(Le,uo,!0),document.addEventListener(Yr,$i,!0),document.addEventListener(Xr,$i,!0),oo=!0)}function Te(n,s){if(s.pointerType!==(s.MSPOINTER_TYPE_MOUSE||"mouse")){s.touches=[];for(var c in on)s.touches.push(on[c]);s.changedTouches=[s],n(s)}}function Jr(n,s){s.MSPOINTER_TYPE_TOUCH&&s.pointerType===s.MSPOINTER_TYPE_TOUCH&&Dt(s),Te(n,s)}function Ha(n){var s={},c,l;for(l in n)c=n[l],s[l]=c&&c.bind?c.bind(n):c;return n=s,s.type="dblclick",s.detail=2,s.isTrusted=!1,s._simulated=!0,s}var co=200;function ho(n,s){n.addEventListener("dblclick",s);var c=0,l;function m(y){if(y.detail!==1){l=y.detail;return}if(!(y.pointerType==="mouse"||y.sourceCapabilities&&!y.sourceCapabilities.firesTouchEvents)){var I=rs(y);if(!(I.some(function(O){return O instanceof HTMLLabelElement&&O.attributes.for})&&!I.some(function(O){return O instanceof HTMLInputElement||O instanceof HTMLSelectElement}))){var M=Date.now();M-c<=co?(l++,l===2&&s(Ha(y))):l=1,c=M}}}return n.addEventListener("click",m),{dblclick:s,simDblclick:m}}function lo(n,s){n.removeEventListener("dblclick",s.dblclick),n.removeEventListener("click",s.simDblclick)}var yi=Zi(["transform","webkitTransform","OTransform","MozTransform","msTransform"]),an=Zi(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),ts=an==="webkitTransition"||an==="OTransition"?an+"End":"transitionend";function es(n){return typeof n=="string"?document.getElementById(n):n}function Nn(n,s){var c=n.style[s]||n.currentStyle&&n.currentStyle[s];if((!c||c==="auto")&&document.defaultView){var l=document.defaultView.getComputedStyle(n,null);c=l?l[s]:null}return c==="auto"?null:c}function mt(n,s,c){var l=document.createElement(n);return l.className=s||"",c&&c.appendChild(l),l}function gt(n){var s=n.parentNode;s&&s.removeChild(n)}function oe(n){for(;n.firstChild;)n.removeChild(n.firstChild)}function Ee(n){var s=n.parentNode;s&&s.lastChild!==n&&s.appendChild(n)}function Ie(n){var s=n.parentNode;s&&s.firstChild!==n&&s.insertBefore(n,s.firstChild)}function vi(n,s){if(n.classList!==void 0)return n.classList.contains(s);var c=Ue(n);return c.length>0&&new RegExp("(^|\\s)"+s+"(\\s|$)").test(c)}function $(n,s){if(n.classList!==void 0)for(var c=z(s),l=0,m=c.length;l<m;l++)n.classList.add(c[l]);else if(!vi(n,s)){var y=Ue(n);un(n,(y?y+" ":"")+s)}}function At(n,s){n.classList!==void 0?n.classList.remove(s):un(n,V((" "+Ue(n)+" ").replace(" "+s+" "," ")))}function un(n,s){n.className.baseVal===void 0?n.className=s:n.className.baseVal=s}function Ue(n){return n.correspondingElement&&(n=n.correspondingElement),n.className.baseVal===void 0?n.className:n.className.baseVal}function le(n,s){"opacity"in n.style?n.style.opacity=s:"filter"in n.style&&fo(n,s)}function fo(n,s){var c=!1,l="DXImageTransform.Microsoft.Alpha";try{c=n.filters.item(l)}catch{if(s===1)return}s=Math.round(s*100),c?(c.Enabled=s!==100,c.Opacity=s):n.style.filter+=" progid:"+l+"(opacity="+s+")"}function Zi(n){for(var s=document.documentElement.style,c=0;c<n.length;c++)if(n[c]in s)return n[c];return!1}function cn(n,s,c){var l=s||new J(0,0);n.style[yi]=(Z.ie3d?"translate("+l.x+"px,"+l.y+"px)":"translate3d("+l.x+"px,"+l.y+"px,0)")+(c?" scale("+c+")":"")}function kt(n,s){n._leaflet_pos=s,Z.any3d?cn(n,s):(n.style.left=s.x+"px",n.style.top=s.y+"px")}function hn(n){return n._leaflet_pos||new J(0,0)}var xe,ge,Ki;if("onselectstart"in document)xe=function(){et(window,"selectstart",Dt)},ge=function(){Et(window,"selectstart",Dt)};else{var On=Zi(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);xe=function(){if(On){var n=document.documentElement.style;Ki=n[On],n[On]="none"}},ge=function(){On&&(document.documentElement.style[On]=Ki,Ki=void 0)}}function Qi(){et(window,"dragstart",Dt)}function Yi(){Et(window,"dragstart",Dt)}var wi,Be;function ns(n){for(;n.tabIndex===-1;)n=n.parentNode;n.style&&(Xi(),wi=n,Be=n.style.outlineStyle,n.style.outlineStyle="none",et(window,"keydown",Xi))}function Xi(){wi&&(wi.style.outlineStyle=Be,wi=void 0,Be=void 0,Et(window,"keydown",Xi))}function mo(n){do n=n.parentNode;while((!n.offsetWidth||!n.offsetHeight)&&n!==document.body);return n}function Pe(n){var s=n.getBoundingClientRect();return{x:s.width/n.offsetWidth||1,y:s.height/n.offsetHeight||1,boundingClientRect:s}}var ja={__proto__:null,TRANSFORM:yi,TRANSITION:an,TRANSITION_END:ts,get:es,getStyle:Nn,create:mt,remove:gt,empty:oe,toFront:Ee,toBack:Ie,hasClass:vi,addClass:$,removeClass:At,setClass:un,getClass:Ue,setOpacity:le,testProp:Zi,setTransform:cn,setPosition:kt,getPosition:hn,get disableTextSelection(){return xe},get enableTextSelection(){return ge},disableImageDrag:Qi,enableImageDrag:Yi,preventOutline:ns,restoreOutline:Xi,getSizedParentNode:mo,getScale:Pe};function et(n,s,c,l){if(s&&typeof s=="object")for(var m in s)Ji(n,m,s[m],c);else{s=z(s);for(var y=0,I=s.length;y<I;y++)Ji(n,s[y],c,l)}return this}var ae="_leaflet_events";function Et(n,s,c,l){if(arguments.length===1)Dn(n),delete n[ae];else if(s&&typeof s=="object")for(var m in s)Ti(n,m,s[m],c);else if(s=z(s),arguments.length===2)Dn(n,function(M){return xt(s,M)!==-1});else for(var y=0,I=s.length;y<I;y++)Ti(n,s[y],c,l);return this}function Dn(n,s){for(var c in n[ae]){var l=c.split(/\d/)[0];(!s||s(l))&&Ti(n,l,null,null,c)}}var ln={mouseenter:"mouseover",mouseleave:"mouseout",wheel:!("onwheel"in window)&&"mousewheel"};function Ji(n,s,c,l){var m=s+p(c)+(l?"_"+p(l):"");if(n[ae]&&n[ae][m])return this;var y=function(M){return c.call(l||n,M||window.event)},I=y;!Z.touchNative&&Z.pointer&&s.indexOf("touch")===0?y=ao(n,s,y):Z.touch&&s==="dblclick"?y=ho(n,y):"addEventListener"in n?s==="touchstart"||s==="touchmove"||s==="wheel"||s==="mousewheel"?n.addEventListener(ln[s]||s,y,Z.passiveEvents?{passive:!1}:!1):s==="mouseenter"||s==="mouseleave"?(y=function(M){M=M||window.event,os(n,M)&&I(M)},n.addEventListener(ln[s],y,!1)):n.addEventListener(s,I,!1):n.attachEvent("on"+s,y),n[ae]=n[ae]||{},n[ae][m]=y}function Ti(n,s,c,l,m){m=m||s+p(c)+(l?"_"+p(l):"");var y=n[ae]&&n[ae][m];if(!y)return this;!Z.touchNative&&Z.pointer&&s.indexOf("touch")===0?qa(n,s,y):Z.touch&&s==="dblclick"?lo(n,y):"removeEventListener"in n?n.removeEventListener(ln[s]||s,y,!1):n.detachEvent("on"+s,y),n[ae][m]=null}function vt(n){return n.stopPropagation?n.stopPropagation():n.originalEvent?n.originalEvent._stopped=!0:n.cancelBubble=!0,this}function is(n){return Ji(n,"wheel",vt),this}function Ei(n){return et(n,"mousedown touchstart dblclick contextmenu",vt),n._leaflet_disable_click=!0,this}function Dt(n){return n.preventDefault?n.preventDefault():n.returnValue=!1,this}function ze(n){return Dt(n),vt(n),this}function rs(n){if(n.composedPath)return n.composedPath();for(var s=[],c=n.target;c;)s.push(c),c=c.parentNode;return s}function Ii(n,s){if(!s)return new J(n.clientX,n.clientY);var c=Pe(s),l=c.boundingClientRect;return new J((n.clientX-l.left)/c.x-s.clientLeft,(n.clientY-l.top)/c.y-s.clientTop)}var qe=Z.linux&&Z.chrome?window.devicePixelRatio:Z.mac?window.devicePixelRatio*3:window.devicePixelRatio>0?2*window.devicePixelRatio:1;function ss(n){return Z.edge?n.wheelDeltaY/2:n.deltaY&&n.deltaMode===0?-n.deltaY/qe:n.deltaY&&n.deltaMode===1?-n.deltaY*20:n.deltaY&&n.deltaMode===2?-n.deltaY*60:n.deltaX||n.deltaZ?0:n.wheelDelta?(n.wheelDeltaY||n.wheelDelta)/2:n.detail&&Math.abs(n.detail)<32765?-n.detail*20:n.detail?n.detail/-32765*60:0}function os(n,s){var c=s.relatedTarget;if(!c)return!0;try{for(;c&&c!==n;)c=c.parentNode}catch{return!1}return c!==n}var Pi={__proto__:null,on:et,off:Et,stopPropagation:vt,disableScrollPropagation:is,disableClickPropagation:Ei,preventDefault:Dt,stop:ze,getPropagationPath:rs,getMousePosition:Ii,getWheelDelta:ss,isExternalTarget:os,addListener:et,removeListener:Et},as=ai.extend({run:function(n,s,c,l){this.stop(),this._el=n,this._inProgress=!0,this._duration=c||.25,this._easeOutPower=1/Math.max(l||.5,.2),this._startPos=hn(n),this._offset=s.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(!0),this._complete())},_animate:function(){this._animId=S(this._animate,this),this._step()},_step:function(n){var s=+new Date-this._startTime,c=this._duration*1e3;s<c?this._runFrame(this._easeOut(s/c),n):(this._runFrame(1),this._complete())},_runFrame:function(n,s){var c=this._startPos.add(this._offset.multiplyBy(n));s&&c._round(),kt(this._el,c),this.fire("step")},_complete:function(){x(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(n){return 1-Math.pow(1-n,this._easeOutPower)}}),ut=ai.extend({options:{crs:ci,center:void 0,zoom:void 0,minZoom:void 0,maxZoom:void 0,layers:[],maxBounds:void 0,renderer:void 0,zoomAnimation:!0,zoomAnimationThreshold:4,fadeAnimation:!0,markerZoomAnimation:!0,transform3DLimit:8388608,zoomSnap:1,zoomDelta:1,trackResize:!0},initialize:function(n,s){s=B(this,s),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._sizeChanged=!0,this._initContainer(n),this._initLayout(),this._onResize=h(this._onResize,this),this._initEvents(),s.maxBounds&&this.setMaxBounds(s.maxBounds),s.zoom!==void 0&&(this._zoom=this._limitZoom(s.zoom)),s.center&&s.zoom!==void 0&&this.setView(at(s.center),s.zoom,{reset:!0}),this.callInitHooks(),this._zoomAnimated=an&&Z.any3d&&!Z.mobileOpera&&this.options.zoomAnimation,this._zoomAnimated&&(this._createAnimProxy(),et(this._proxy,ts,this._catchTransitionEnd,this)),this._addLayers(this.options.layers)},setView:function(n,s,c){if(s=s===void 0?this._zoom:this._limitZoom(s),n=this._limitCenter(at(n),s,this.options.maxBounds),c=c||{},this._stop(),this._loaded&&!c.reset&&c!==!0){c.animate!==void 0&&(c.zoom=o({animate:c.animate},c.zoom),c.pan=o({animate:c.animate,duration:c.duration},c.pan));var l=this._zoom!==s?this._tryAnimatedZoom&&this._tryAnimatedZoom(n,s,c.zoom):this._tryAnimatedPan(n,c.pan);if(l)return clearTimeout(this._sizeTimer),this}return this._resetView(n,s,c.pan&&c.pan.noMoveStart),this},setZoom:function(n,s){return this._loaded?this.setView(this.getCenter(),n,{zoom:s}):(this._zoom=n,this)},zoomIn:function(n,s){return n=n||(Z.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom+n,s)},zoomOut:function(n,s){return n=n||(Z.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom-n,s)},setZoomAround:function(n,s,c){var l=this.getZoomScale(s),m=this.getSize().divideBy(2),y=n instanceof J?n:this.latLngToContainerPoint(n),I=y.subtract(m).multiplyBy(1-1/l),M=this.containerPointToLatLng(m.add(I));return this.setView(M,s,{zoom:c})},_getBoundsCenterZoom:function(n,s){s=s||{},n=n.getBounds?n.getBounds():bt(n);var c=tt(s.paddingTopLeft||s.padding||[0,0]),l=tt(s.paddingBottomRight||s.padding||[0,0]),m=this.getBoundsZoom(n,!1,c.add(l));if(m=typeof s.maxZoom=="number"?Math.min(s.maxZoom,m):m,m===1/0)return{center:n.getCenter(),zoom:m};var y=l.subtract(c).divideBy(2),I=this.project(n.getSouthWest(),m),M=this.project(n.getNorthEast(),m),O=this.unproject(I.add(M).divideBy(2).add(y),m);return{center:O,zoom:m}},fitBounds:function(n,s){if(n=bt(n),!n.isValid())throw new Error("Bounds are not valid.");var c=this._getBoundsCenterZoom(n,s);return this.setView(c.center,c.zoom,s)},fitWorld:function(n){return this.fitBounds([[-90,-180],[90,180]],n)},panTo:function(n,s){return this.setView(n,this._zoom,{pan:s})},panBy:function(n,s){if(n=tt(n).round(),s=s||{},!n.x&&!n.y)return this.fire("moveend");if(s.animate!==!0&&!this.getSize().contains(n))return this._resetView(this.unproject(this.project(this.getCenter()).add(n)),this.getZoom()),this;if(this._panAnim||(this._panAnim=new as,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),s.noMoveStart||this.fire("movestart"),s.animate!==!1){$(this._mapPane,"leaflet-pan-anim");var c=this._getMapPanePos().subtract(n).round();this._panAnim.run(this._mapPane,c,s.duration||.25,s.easeLinearity)}else this._rawPanBy(n),this.fire("move").fire("moveend");return this},flyTo:function(n,s,c){if(c=c||{},c.animate===!1||!Z.any3d)return this.setView(n,s,c);this._stop();var l=this.project(this.getCenter()),m=this.project(n),y=this.getSize(),I=this._zoom;n=at(n),s=s===void 0?I:s;var M=Math.max(y.x,y.y),O=M*this.getZoomScale(I,s),U=m.distanceTo(l)||1,G=1.42,Q=G*G;function ct(Vt){var Lo=Vt?-1:1,Qm=Vt?O:M,Ym=O*O-M*M+Lo*Q*Q*U*U,Xm=2*Qm*Q*U,Ka=Ym/Xm,th=Math.sqrt(Ka*Ka+1)-Ka,Jm=th<1e-9?-18:Math.log(th);return Jm}function ue(Vt){return(Math.exp(Vt)-Math.exp(-Vt))/2}function $t(Vt){return(Math.exp(Vt)+Math.exp(-Vt))/2}function Se(Vt){return ue(Vt)/$t(Vt)}var fe=ct(0);function dr(Vt){return M*($t(fe)/$t(fe+G*Vt))}function Wm(Vt){return M*($t(fe)*Se(fe+G*Vt)-ue(fe))/Q}function $m(Vt){return 1-Math.pow(1-Vt,1.5)}var Zm=Date.now(),Xc=(ct(1)-fe)/G,Km=c.duration?1e3*c.duration:1e3*Xc*.8;function Jc(){var Vt=(Date.now()-Zm)/Km,Lo=$m(Vt)*Xc;Vt<=1?(this._flyToFrame=S(Jc,this),this._move(this.unproject(l.add(m.subtract(l).multiplyBy(Wm(Lo)/U)),I),this.getScaleZoom(M/dr(Lo),I),{flyTo:!0})):this._move(n,s)._moveEnd(!0)}return this._moveStart(!0,c.noMoveStart),Jc.call(this),this},flyToBounds:function(n,s){var c=this._getBoundsCenterZoom(n,s);return this.flyTo(c.center,c.zoom,s)},setMaxBounds:function(n){return n=bt(n),this.listens("moveend",this._panInsideMaxBounds)&&this.off("moveend",this._panInsideMaxBounds),n.isValid()?(this.options.maxBounds=n,this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds)):(this.options.maxBounds=null,this)},setMinZoom:function(n){var s=this.options.minZoom;return this.options.minZoom=n,this._loaded&&s!==n&&(this.fire("zoomlevelschange"),this.getZoom()<this.options.minZoom)?this.setZoom(n):this},setMaxZoom:function(n){var s=this.options.maxZoom;return this.options.maxZoom=n,this._loaded&&s!==n&&(this.fire("zoomlevelschange"),this.getZoom()>this.options.maxZoom)?this.setZoom(n):this},panInsideBounds:function(n,s){this._enforcingBounds=!0;var c=this.getCenter(),l=this._limitCenter(c,this._zoom,bt(n));return c.equals(l)||this.panTo(l,s),this._enforcingBounds=!1,this},panInside:function(n,s){s=s||{};var c=tt(s.paddingTopLeft||s.padding||[0,0]),l=tt(s.paddingBottomRight||s.padding||[0,0]),m=this.project(this.getCenter()),y=this.project(n),I=this.getPixelBounds(),M=Kt([I.min.add(c),I.max.subtract(l)]),O=M.getSize();if(!M.contains(y)){this._enforcingBounds=!0;var U=y.subtract(M.getCenter()),G=M.extend(y).getSize().subtract(O);m.x+=U.x<0?-G.x:G.x,m.y+=U.y<0?-G.y:G.y,this.panTo(this.unproject(m),s),this._enforcingBounds=!1}return this},invalidateSize:function(n){if(!this._loaded)return this;n=o({animate:!1,pan:!0},n===!0?{animate:!0}:n);var s=this.getSize();this._sizeChanged=!0,this._lastCenter=null;var c=this.getSize(),l=s.divideBy(2).round(),m=c.divideBy(2).round(),y=l.subtract(m);return!y.x&&!y.y?this:(n.animate&&n.pan?this.panBy(y):(n.pan&&this._rawPanBy(y),this.fire("move"),n.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(h(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:s,newSize:c}))},stop:function(){return this.setZoom(this._limitZoom(this._zoom)),this.options.zoomSnap||this.fire("viewreset"),this._stop()},locate:function(n){if(n=this._locateOptions=o({timeout:1e4,watch:!1},n),!("geolocation"in navigator))return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var s=h(this._handleGeolocationResponse,this),c=h(this._handleGeolocationError,this);return n.watch?this._locationWatchId=navigator.geolocation.watchPosition(s,c,n):navigator.geolocation.getCurrentPosition(s,c,n),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(n){if(this._container._leaflet_id){var s=n.code,c=n.message||(s===1?"permission denied":s===2?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:s,message:"Geolocation error: "+c+"."})}},_handleGeolocationResponse:function(n){if(this._container._leaflet_id){var s=n.coords.latitude,c=n.coords.longitude,l=new _t(s,c),m=l.toBounds(n.coords.accuracy*2),y=this._locateOptions;if(y.setView){var I=this.getBoundsZoom(m);this.setView(l,y.maxZoom?Math.min(I,y.maxZoom):I)}var M={latlng:l,bounds:m,timestamp:n.timestamp};for(var O in n.coords)typeof n.coords[O]=="number"&&(M[O]=n.coords[O]);this.fire("locationfound",M)}},addHandler:function(n,s){if(!s)return this;var c=this[n]=new s(this);return this._handlers.push(c),this.options[n]&&c.enable(),this},remove:function(){if(this._initEvents(!0),this.options.maxBounds&&this.off("moveend",this._panInsideMaxBounds),this._containerId!==this._container._leaflet_id)throw new Error("Map container is being reused by another instance");try{delete this._container._leaflet_id,delete this._containerId}catch{this._container._leaflet_id=void 0,this._containerId=void 0}this._locationWatchId!==void 0&&this.stopLocate(),this._stop(),gt(this._mapPane),this._clearControlPos&&this._clearControlPos(),this._resizeRequest&&(x(this._resizeRequest),this._resizeRequest=null),this._clearHandlers(),this._loaded&&this.fire("unload");var n;for(n in this._layers)this._layers[n].remove();for(n in this._panes)gt(this._panes[n]);return this._layers=[],this._panes=[],delete this._mapPane,delete this._renderer,this},createPane:function(n,s){var c="leaflet-pane"+(n?" leaflet-"+n.replace("Pane","")+"-pane":""),l=mt("div",c,s||this._mapPane);return n&&(this._panes[n]=l),l},getCenter:function(){return this._checkIfLoaded(),this._lastCenter&&!this._moved()?this._lastCenter.clone():this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var n=this.getPixelBounds(),s=this.unproject(n.getBottomLeft()),c=this.unproject(n.getTopRight());return new Qt(s,c)},getMinZoom:function(){return this.options.minZoom===void 0?this._layersMinZoom||0:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===void 0?this._layersMaxZoom===void 0?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(n,s,c){n=bt(n),c=tt(c||[0,0]);var l=this.getZoom()||0,m=this.getMinZoom(),y=this.getMaxZoom(),I=n.getNorthWest(),M=n.getSouthEast(),O=this.getSize().subtract(c),U=Kt(this.project(M,l),this.project(I,l)).getSize(),G=Z.any3d?this.options.zoomSnap:1,Q=O.x/U.x,ct=O.y/U.y,ue=s?Math.max(Q,ct):Math.min(Q,ct);return l=this.getScaleZoom(ue,l),G&&(l=Math.round(l/(G/100))*(G/100),l=s?Math.ceil(l/G)*G:Math.floor(l/G)*G),Math.max(m,Math.min(y,l))},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new J(this._container.clientWidth||0,this._container.clientHeight||0),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(n,s){var c=this._getTopLeftPoint(n,s);return new Pt(c,c.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._pixelOrigin},getPixelWorldBounds:function(n){return this.options.crs.getProjectedBounds(n===void 0?this.getZoom():n)},getPane:function(n){return typeof n=="string"?this._panes[n]:n},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(n,s){var c=this.options.crs;return s=s===void 0?this._zoom:s,c.scale(n)/c.scale(s)},getScaleZoom:function(n,s){var c=this.options.crs;s=s===void 0?this._zoom:s;var l=c.zoom(n*c.scale(s));return isNaN(l)?1/0:l},project:function(n,s){return s=s===void 0?this._zoom:s,this.options.crs.latLngToPoint(at(n),s)},unproject:function(n,s){return s=s===void 0?this._zoom:s,this.options.crs.pointToLatLng(tt(n),s)},layerPointToLatLng:function(n){var s=tt(n).add(this.getPixelOrigin());return this.unproject(s)},latLngToLayerPoint:function(n){var s=this.project(at(n))._round();return s._subtract(this.getPixelOrigin())},wrapLatLng:function(n){return this.options.crs.wrapLatLng(at(n))},wrapLatLngBounds:function(n){return this.options.crs.wrapLatLngBounds(bt(n))},distance:function(n,s){return this.options.crs.distance(at(n),at(s))},containerPointToLayerPoint:function(n){return tt(n).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(n){return tt(n).add(this._getMapPanePos())},containerPointToLatLng:function(n){var s=this.containerPointToLayerPoint(tt(n));return this.layerPointToLatLng(s)},latLngToContainerPoint:function(n){return this.layerPointToContainerPoint(this.latLngToLayerPoint(at(n)))},mouseEventToContainerPoint:function(n){return Ii(n,this._container)},mouseEventToLayerPoint:function(n){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(n))},mouseEventToLatLng:function(n){return this.layerPointToLatLng(this.mouseEventToLayerPoint(n))},_initContainer:function(n){var s=this._container=es(n);if(s){if(s._leaflet_id)throw new Error("Map container is already initialized.")}else throw new Error("Map container not found.");et(s,"scroll",this._onScroll,this),this._containerId=p(s)},_initLayout:function(){var n=this._container;this._fadeAnimated=this.options.fadeAnimation&&Z.any3d,$(n,"leaflet-container"+(Z.touch?" leaflet-touch":"")+(Z.retina?" leaflet-retina":"")+(Z.ielt9?" leaflet-oldie":"")+(Z.safari?" leaflet-safari":"")+(this._fadeAnimated?" leaflet-fade-anim":""));var s=Nn(n,"position");s!=="absolute"&&s!=="relative"&&s!=="fixed"&&s!=="sticky"&&(n.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var n=this._panes={};this._paneRenderers={},this._mapPane=this.createPane("mapPane",this._container),kt(this._mapPane,new J(0,0)),this.createPane("tilePane"),this.createPane("overlayPane"),this.createPane("shadowPane"),this.createPane("markerPane"),this.createPane("tooltipPane"),this.createPane("popupPane"),this.options.markerZoomAnimation||($(n.markerPane,"leaflet-zoom-hide"),$(n.shadowPane,"leaflet-zoom-hide"))},_resetView:function(n,s,c){kt(this._mapPane,new J(0,0));var l=!this._loaded;this._loaded=!0,s=this._limitZoom(s),this.fire("viewprereset");var m=this._zoom!==s;this._moveStart(m,c)._move(n,s)._moveEnd(m),this.fire("viewreset"),l&&this.fire("load")},_moveStart:function(n,s){return n&&this.fire("zoomstart"),s||this.fire("movestart"),this},_move:function(n,s,c,l){s===void 0&&(s=this._zoom);var m=this._zoom!==s;return this._zoom=s,this._lastCenter=n,this._pixelOrigin=this._getNewPixelOrigin(n),l?c&&c.pinch&&this.fire("zoom",c):((m||c&&c.pinch)&&this.fire("zoom",c),this.fire("move",c)),this},_moveEnd:function(n){return n&&this.fire("zoomend"),this.fire("moveend")},_stop:function(){return x(this._flyToFrame),this._panAnim&&this._panAnim.stop(),this},_rawPanBy:function(n){kt(this._mapPane,this._getMapPanePos().subtract(n))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_panInsideMaxBounds:function(){this._enforcingBounds||this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(n){this._targets={},this._targets[p(this._container)]=this;var s=n?Et:et;s(this._container,"click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup",this._handleDOMEvent,this),this.options.trackResize&&s(window,"resize",this._onResize,this),Z.any3d&&this.options.transform3DLimit&&(n?this.off:this.on).call(this,"moveend",this._onMoveEnd)},_onResize:function(){x(this._resizeRequest),this._resizeRequest=S(function(){this.invalidateSize({debounceMoveend:!0})},this)},_onScroll:function(){this._container.scrollTop=0,this._container.scrollLeft=0},_onMoveEnd:function(){var n=this._getMapPanePos();Math.max(Math.abs(n.x),Math.abs(n.y))>=this.options.transform3DLimit&&this._resetView(this.getCenter(),this.getZoom())},_findEventTargets:function(n,s){for(var c=[],l,m=s==="mouseout"||s==="mouseover",y=n.target||n.srcElement,I=!1;y;){if(l=this._targets[p(y)],l&&(s==="click"||s==="preclick")&&this._draggableMoved(l)){I=!0;break}if(l&&l.listens(s,!0)&&(m&&!os(y,n)||(c.push(l),m))||y===this._container)break;y=y.parentNode}return!c.length&&!I&&!m&&this.listens(s,!0)&&(c=[this]),c},_isClickDisabled:function(n){for(;n&&n!==this._container;){if(n._leaflet_disable_click)return!0;n=n.parentNode}},_handleDOMEvent:function(n){var s=n.target||n.srcElement;if(!(!this._loaded||s._leaflet_disable_events||n.type==="click"&&this._isClickDisabled(s))){var c=n.type;c==="mousedown"&&ns(s),this._fireDOMEvent(n,c)}},_mouseEvents:["click","dblclick","mouseover","mouseout","contextmenu"],_fireDOMEvent:function(n,s,c){if(n.type==="click"){var l=o({},n);l.type="preclick",this._fireDOMEvent(l,l.type,c)}var m=this._findEventTargets(n,s);if(c){for(var y=[],I=0;I<c.length;I++)c[I].listens(s,!0)&&y.push(c[I]);m=y.concat(m)}if(m.length){s==="contextmenu"&&Dt(n);var M=m[0],O={originalEvent:n};if(n.type!=="keypress"&&n.type!=="keydown"&&n.type!=="keyup"){var U=M.getLatLng&&(!M._radius||M._radius<=10);O.containerPoint=U?this.latLngToContainerPoint(M.getLatLng()):this.mouseEventToContainerPoint(n),O.layerPoint=this.containerPointToLayerPoint(O.containerPoint),O.latlng=U?M.getLatLng():this.layerPointToLatLng(O.layerPoint)}for(I=0;I<m.length;I++)if(m[I].fire(s,O,!0),O.originalEvent._stopped||m[I].options.bubblingMouseEvents===!1&&xt(this._mouseEvents,s)!==-1)return}},_draggableMoved:function(n){return n=n.dragging&&n.dragging.enabled()?n:this,n.dragging&&n.dragging.moved()||this.boxZoom&&this.boxZoom.moved()},_clearHandlers:function(){for(var n=0,s=this._handlers.length;n<s;n++)this._handlers[n].disable()},whenReady:function(n,s){return this._loaded?n.call(s||this,{target:this}):this.on("load",n,s),this},_getMapPanePos:function(){return hn(this._mapPane)||new J(0,0)},_moved:function(){var n=this._getMapPanePos();return n&&!n.equals([0,0])},_getTopLeftPoint:function(n,s){var c=n&&s!==void 0?this._getNewPixelOrigin(n,s):this.getPixelOrigin();return c.subtract(this._getMapPanePos())},_getNewPixelOrigin:function(n,s){var c=this.getSize()._divideBy(2);return this.project(n,s)._subtract(c)._add(this._getMapPanePos())._round()},_latLngToNewLayerPoint:function(n,s,c){var l=this._getNewPixelOrigin(c,s);return this.project(n,s)._subtract(l)},_latLngBoundsToNewLayerBounds:function(n,s,c){var l=this._getNewPixelOrigin(c,s);return Kt([this.project(n.getSouthWest(),s)._subtract(l),this.project(n.getNorthWest(),s)._subtract(l),this.project(n.getSouthEast(),s)._subtract(l),this.project(n.getNorthEast(),s)._subtract(l)])},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(n){return this.latLngToLayerPoint(n).subtract(this._getCenterLayerPoint())},_limitCenter:function(n,s,c){if(!c)return n;var l=this.project(n,s),m=this.getSize().divideBy(2),y=new Pt(l.subtract(m),l.add(m)),I=this._getBoundsOffset(y,c,s);return Math.abs(I.x)<=1&&Math.abs(I.y)<=1?n:this.unproject(l.add(I),s)},_limitOffset:function(n,s){if(!s)return n;var c=this.getPixelBounds(),l=new Pt(c.min.add(n),c.max.add(n));return n.add(this._getBoundsOffset(l,s))},_getBoundsOffset:function(n,s,c){var l=Kt(this.project(s.getNorthEast(),c),this.project(s.getSouthWest(),c)),m=l.min.subtract(n.min),y=l.max.subtract(n.max),I=this._rebound(m.x,-y.x),M=this._rebound(m.y,-y.y);return new J(I,M)},_rebound:function(n,s){return n+s>0?Math.round(n-s)/2:Math.max(0,Math.ceil(n))-Math.max(0,Math.floor(s))},_limitZoom:function(n){var s=this.getMinZoom(),c=this.getMaxZoom(),l=Z.any3d?this.options.zoomSnap:1;return l&&(n=Math.round(n/l)*l),Math.max(s,Math.min(c,n))},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){At(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(n,s){var c=this._getCenterOffset(n)._trunc();return(s&&s.animate)!==!0&&!this.getSize().contains(c)?!1:(this.panBy(c,s),!0)},_createAnimProxy:function(){var n=this._proxy=mt("div","leaflet-proxy leaflet-zoom-animated");this._panes.mapPane.appendChild(n),this.on("zoomanim",function(s){var c=yi,l=this._proxy.style[c];cn(this._proxy,this.project(s.center,s.zoom),this.getZoomScale(s.zoom,1)),l===this._proxy.style[c]&&this._animatingZoom&&this._onZoomTransitionEnd()},this),this.on("load moveend",this._animMoveEnd,this),this._on("unload",this._destroyAnimProxy,this)},_destroyAnimProxy:function(){gt(this._proxy),this.off("load moveend",this._animMoveEnd,this),delete this._proxy},_animMoveEnd:function(){var n=this.getCenter(),s=this.getZoom();cn(this._proxy,this.project(n,s),this.getZoomScale(s,1))},_catchTransitionEnd:function(n){this._animatingZoom&&n.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(n,s,c){if(this._animatingZoom)return!0;if(c=c||{},!this._zoomAnimated||c.animate===!1||this._nothingToAnimate()||Math.abs(s-this._zoom)>this.options.zoomAnimationThreshold)return!1;var l=this.getZoomScale(s),m=this._getCenterOffset(n)._divideBy(1-1/l);return c.animate!==!0&&!this.getSize().contains(m)?!1:(S(function(){this._moveStart(!0,c.noMoveStart||!1)._animateZoom(n,s,!0)},this),!0)},_animateZoom:function(n,s,c,l){this._mapPane&&(c&&(this._animatingZoom=!0,this._animateToCenter=n,this._animateToZoom=s,$(this._mapPane,"leaflet-zoom-anim")),this.fire("zoomanim",{center:n,zoom:s,noUpdate:l}),this._tempFireZoomEvent||(this._tempFireZoomEvent=this._zoom!==this._animateToZoom),this._move(this._animateToCenter,this._animateToZoom,void 0,!0),setTimeout(h(this._onZoomTransitionEnd,this),250))},_onZoomTransitionEnd:function(){this._animatingZoom&&(this._mapPane&&At(this._mapPane,"leaflet-zoom-anim"),this._animatingZoom=!1,this._move(this._animateToCenter,this._animateToZoom,void 0,!0),this._tempFireZoomEvent&&this.fire("zoom"),delete this._tempFireZoomEvent,this.fire("move"),this._moveEnd(!0))}});function tr(n,s){return new ut(n,s)}var de=Ct.extend({options:{position:"topright"},initialize:function(n){B(this,n)},getPosition:function(){return this.options.position},setPosition:function(n){var s=this._map;return s&&s.removeControl(this),this.options.position=n,s&&s.addControl(this),this},getContainer:function(){return this._container},addTo:function(n){this.remove(),this._map=n;var s=this._container=this.onAdd(n),c=this.getPosition(),l=n._controlCorners[c];return $(s,"leaflet-control"),c.indexOf("bottom")!==-1?l.insertBefore(s,l.firstChild):l.appendChild(s),this._map.on("unload",this.remove,this),this},remove:function(){return this._map?(gt(this._container),this.onRemove&&this.onRemove(this._map),this._map.off("unload",this.remove,this),this._map=null,this):this},_refocusOnMap:function(n){this._map&&n&&n.screenX>0&&n.screenY>0&&this._map.getContainer().focus()}}),He=function(n){return new de(n)};ut.include({addControl:function(n){return n.addTo(this),this},removeControl:function(n){return n.remove(),this},_initControlPos:function(){var n=this._controlCorners={},s="leaflet-",c=this._controlContainer=mt("div",s+"control-container",this._container);function l(m,y){var I=s+m+" "+s+y;n[m+y]=mt("div",I,c)}l("top","left"),l("top","right"),l("bottom","left"),l("bottom","right")},_clearControlPos:function(){for(var n in this._controlCorners)gt(this._controlCorners[n]);gt(this._controlContainer),delete this._controlCorners,delete this._controlContainer}});var po=de.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0,hideSingleBase:!1,sortLayers:!1,sortFunction:function(n,s,c,l){return c<l?-1:l<c?1:0}},initialize:function(n,s,c){B(this,c),this._layerControlInputs=[],this._layers=[],this._lastZIndex=0,this._handlingClick=!1,this._preventClick=!1;for(var l in n)this._addLayer(n[l],l);for(l in s)this._addLayer(s[l],l,!0)},onAdd:function(n){this._initLayout(),this._update(),this._map=n,n.on("zoomend",this._checkDisabledLayers,this);for(var s=0;s<this._layers.length;s++)this._layers[s].layer.on("add remove",this._onLayerChange,this);return this._container},addTo:function(n){return de.prototype.addTo.call(this,n),this._expandIfNotCollapsed()},onRemove:function(){this._map.off("zoomend",this._checkDisabledLayers,this);for(var n=0;n<this._layers.length;n++)this._layers[n].layer.off("add remove",this._onLayerChange,this)},addBaseLayer:function(n,s){return this._addLayer(n,s),this._map?this._update():this},addOverlay:function(n,s){return this._addLayer(n,s,!0),this._map?this._update():this},removeLayer:function(n){n.off("add remove",this._onLayerChange,this);var s=this._getLayer(p(n));return s&&this._layers.splice(this._layers.indexOf(s),1),this._map?this._update():this},expand:function(){$(this._container,"leaflet-control-layers-expanded"),this._section.style.height=null;var n=this._map.getSize().y-(this._container.offsetTop+50);return n<this._section.clientHeight?($(this._section,"leaflet-control-layers-scrollbar"),this._section.style.height=n+"px"):At(this._section,"leaflet-control-layers-scrollbar"),this._checkDisabledLayers(),this},collapse:function(){return At(this._container,"leaflet-control-layers-expanded"),this},_initLayout:function(){var n="leaflet-control-layers",s=this._container=mt("div",n),c=this.options.collapsed;s.setAttribute("aria-haspopup",!0),Ei(s),is(s);var l=this._section=mt("section",n+"-list");c&&(this._map.on("click",this.collapse,this),et(s,{mouseenter:this._expandSafely,mouseleave:this.collapse},this));var m=this._layersLink=mt("a",n+"-toggle",s);m.href="#",m.title="Layers",m.setAttribute("role","button"),et(m,{keydown:function(y){y.keyCode===13&&this._expandSafely()},click:function(y){Dt(y),this._expandSafely()}},this),c||this.expand(),this._baseLayersList=mt("div",n+"-base",l),this._separator=mt("div",n+"-separator",l),this._overlaysList=mt("div",n+"-overlays",l),s.appendChild(l)},_getLayer:function(n){for(var s=0;s<this._layers.length;s++)if(this._layers[s]&&p(this._layers[s].layer)===n)return this._layers[s]},_addLayer:function(n,s,c){this._map&&n.on("add remove",this._onLayerChange,this),this._layers.push({layer:n,name:s,overlay:c}),this.options.sortLayers&&this._layers.sort(h(function(l,m){return this.options.sortFunction(l.layer,m.layer,l.name,m.name)},this)),this.options.autoZIndex&&n.setZIndex&&(this._lastZIndex++,n.setZIndex(this._lastZIndex)),this._expandIfNotCollapsed()},_update:function(){if(!this._container)return this;oe(this._baseLayersList),oe(this._overlaysList),this._layerControlInputs=[];var n,s,c,l,m=0;for(c=0;c<this._layers.length;c++)l=this._layers[c],this._addItem(l),s=s||l.overlay,n=n||!l.overlay,m+=l.overlay?0:1;return this.options.hideSingleBase&&(n=n&&m>1,this._baseLayersList.style.display=n?"":"none"),this._separator.style.display=s&&n?"":"none",this},_onLayerChange:function(n){this._handlingClick||this._update();var s=this._getLayer(p(n.target)),c=s.overlay?n.type==="add"?"overlayadd":"overlayremove":n.type==="add"?"baselayerchange":null;c&&this._map.fire(c,s)},_createRadioElement:function(n,s){var c='<input type="radio" class="leaflet-control-layers-selector" name="'+n+'"'+(s?' checked="checked"':"")+"/>",l=document.createElement("div");return l.innerHTML=c,l.firstChild},_addItem:function(n){var s=document.createElement("label"),c=this._map.hasLayer(n.layer),l;n.overlay?(l=document.createElement("input"),l.type="checkbox",l.className="leaflet-control-layers-selector",l.defaultChecked=c):l=this._createRadioElement("leaflet-base-layers_"+p(this),c),this._layerControlInputs.push(l),l.layerId=p(n.layer),et(l,"click",this._onInputClick,this);var m=document.createElement("span");m.innerHTML=" "+n.name;var y=document.createElement("span");s.appendChild(y),y.appendChild(l),y.appendChild(m);var I=n.overlay?this._overlaysList:this._baseLayersList;return I.appendChild(s),this._checkDisabledLayers(),s},_onInputClick:function(){if(!this._preventClick){var n=this._layerControlInputs,s,c,l=[],m=[];this._handlingClick=!0;for(var y=n.length-1;y>=0;y--)s=n[y],c=this._getLayer(s.layerId).layer,s.checked?l.push(c):s.checked||m.push(c);for(y=0;y<m.length;y++)this._map.hasLayer(m[y])&&this._map.removeLayer(m[y]);for(y=0;y<l.length;y++)this._map.hasLayer(l[y])||this._map.addLayer(l[y]);this._handlingClick=!1,this._refocusOnMap()}},_checkDisabledLayers:function(){for(var n=this._layerControlInputs,s,c,l=this._map.getZoom(),m=n.length-1;m>=0;m--)s=n[m],c=this._getLayer(s.layerId).layer,s.disabled=c.options.minZoom!==void 0&&l<c.options.minZoom||c.options.maxZoom!==void 0&&l>c.options.maxZoom},_expandIfNotCollapsed:function(){return this._map&&!this.options.collapsed&&this.expand(),this},_expandSafely:function(){var n=this._section;this._preventClick=!0,et(n,"click",Dt),this.expand();var s=this;setTimeout(function(){Et(n,"click",Dt),s._preventClick=!1})}}),_o=function(n,s,c){return new po(n,s,c)},dn=de.extend({options:{position:"topleft",zoomInText:'<span aria-hidden="true">+</span>',zoomInTitle:"Zoom in",zoomOutText:'<span aria-hidden="true">&#x2212;</span>',zoomOutTitle:"Zoom out"},onAdd:function(n){var s="leaflet-control-zoom",c=mt("div",s+" leaflet-bar"),l=this.options;return this._zoomInButton=this._createButton(l.zoomInText,l.zoomInTitle,s+"-in",c,this._zoomIn),this._zoomOutButton=this._createButton(l.zoomOutText,l.zoomOutTitle,s+"-out",c,this._zoomOut),this._updateDisabled(),n.on("zoomend zoomlevelschange",this._updateDisabled,this),c},onRemove:function(n){n.off("zoomend zoomlevelschange",this._updateDisabled,this)},disable:function(){return this._disabled=!0,this._updateDisabled(),this},enable:function(){return this._disabled=!1,this._updateDisabled(),this},_zoomIn:function(n){!this._disabled&&this._map._zoom<this._map.getMaxZoom()&&this._map.zoomIn(this._map.options.zoomDelta*(n.shiftKey?3:1))},_zoomOut:function(n){!this._disabled&&this._map._zoom>this._map.getMinZoom()&&this._map.zoomOut(this._map.options.zoomDelta*(n.shiftKey?3:1))},_createButton:function(n,s,c,l,m){var y=mt("a",c,l);return y.innerHTML=n,y.href="#",y.title=s,y.setAttribute("role","button"),y.setAttribute("aria-label",s),Ei(y),et(y,"click",ze),et(y,"click",m,this),et(y,"click",this._refocusOnMap,this),y},_updateDisabled:function(){var n=this._map,s="leaflet-disabled";At(this._zoomInButton,s),At(this._zoomOutButton,s),this._zoomInButton.setAttribute("aria-disabled","false"),this._zoomOutButton.setAttribute("aria-disabled","false"),(this._disabled||n._zoom===n.getMinZoom())&&($(this._zoomOutButton,s),this._zoomOutButton.setAttribute("aria-disabled","true")),(this._disabled||n._zoom===n.getMaxZoom())&&($(this._zoomInButton,s),this._zoomInButton.setAttribute("aria-disabled","true"))}});ut.mergeOptions({zoomControl:!0}),ut.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new dn,this.addControl(this.zoomControl))});var go=function(n){return new dn(n)},us=de.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0},onAdd:function(n){var s="leaflet-control-scale",c=mt("div",s),l=this.options;return this._addScales(l,s+"-line",c),n.on(l.updateWhenIdle?"moveend":"move",this._update,this),n.whenReady(this._update,this),c},onRemove:function(n){n.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(n,s,c){n.metric&&(this._mScale=mt("div",s,c)),n.imperial&&(this._iScale=mt("div",s,c))},_update:function(){var n=this._map,s=n.getSize().y/2,c=n.distance(n.containerPointToLatLng([0,s]),n.containerPointToLatLng([this.options.maxWidth,s]));this._updateScales(c)},_updateScales:function(n){this.options.metric&&n&&this._updateMetric(n),this.options.imperial&&n&&this._updateImperial(n)},_updateMetric:function(n){var s=this._getRoundNum(n),c=s<1e3?s+" m":s/1e3+" km";this._updateScale(this._mScale,c,s/n)},_updateImperial:function(n){var s=n*3.2808399,c,l,m;s>5280?(c=s/5280,l=this._getRoundNum(c),this._updateScale(this._iScale,l+" mi",l/c)):(m=this._getRoundNum(s),this._updateScale(this._iScale,m+" ft",m/s))},_updateScale:function(n,s,c){n.style.width=Math.round(this.options.maxWidth*c)+"px",n.innerHTML=s},_getRoundNum:function(n){var s=Math.pow(10,(Math.floor(n)+"").length-1),c=n/s;return c=c>=10?10:c>=5?5:c>=3?3:c>=2?2:1,s*c}}),cs=function(n){return new us(n)},hs='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>',er=de.extend({options:{position:"bottomright",prefix:'<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">'+(Z.inlineSvg?hs+" ":"")+"Leaflet</a>"},initialize:function(n){B(this,n),this._attributions={}},onAdd:function(n){n.attributionControl=this,this._container=mt("div","leaflet-control-attribution"),Ei(this._container);for(var s in n._layers)n._layers[s].getAttribution&&this.addAttribution(n._layers[s].getAttribution());return this._update(),n.on("layeradd",this._addAttribution,this),this._container},onRemove:function(n){n.off("layeradd",this._addAttribution,this)},_addAttribution:function(n){n.layer.getAttribution&&(this.addAttribution(n.layer.getAttribution()),n.layer.once("remove",function(){this.removeAttribution(n.layer.getAttribution())},this))},setPrefix:function(n){return this.options.prefix=n,this._update(),this},addAttribution:function(n){return n?(this._attributions[n]||(this._attributions[n]=0),this._attributions[n]++,this._update(),this):this},removeAttribution:function(n){return n?(this._attributions[n]&&(this._attributions[n]--,this._update()),this):this},_update:function(){if(this._map){var n=[];for(var s in this._attributions)this._attributions[s]&&n.push(s);var c=[];this.options.prefix&&c.push(this.options.prefix),n.length&&c.push(n.join(", ")),this._container.innerHTML=c.join(' <span aria-hidden="true">|</span> ')}}});ut.mergeOptions({attributionControl:!0}),ut.addInitHook(function(){this.options.attributionControl&&new er().addTo(this)});var nr=function(n){return new er(n)};de.Layers=po,de.Zoom=dn,de.Scale=us,de.Attribution=er,He.layers=_o,He.zoom=go,He.scale=cs,He.attribution=nr;var ye=Ct.extend({initialize:function(n){this._map=n},enable:function(){return this._enabled?this:(this._enabled=!0,this.addHooks(),this)},disable:function(){return this._enabled?(this._enabled=!1,this.removeHooks(),this):this},enabled:function(){return!!this._enabled}});ye.addTo=function(n,s){return n.addHandler(s,this),this};var yo={Events:se},je=Z.touch?"touchstart mousedown":"mousedown",ke=ai.extend({options:{clickTolerance:3},initialize:function(n,s,c,l){B(this,l),this._element=n,this._dragStartTarget=s||n,this._preventOutline=c},enable:function(){this._enabled||(et(this._dragStartTarget,je,this._onDown,this),this._enabled=!0)},disable:function(){this._enabled&&(ke._dragging===this&&this.finishDrag(!0),Et(this._dragStartTarget,je,this._onDown,this),this._enabled=!1,this._moved=!1)},_onDown:function(n){if(this._enabled&&(this._moved=!1,!vi(this._element,"leaflet-zoom-anim"))){if(n.touches&&n.touches.length!==1){ke._dragging===this&&this.finishDrag();return}if(!(ke._dragging||n.shiftKey||n.which!==1&&n.button!==1&&!n.touches)&&(ke._dragging=this,this._preventOutline&&ns(this._element),Qi(),xe(),!this._moving)){this.fire("down");var s=n.touches?n.touches[0]:n,c=mo(this._element);this._startPoint=new J(s.clientX,s.clientY),this._startPos=hn(this._element),this._parentScale=Pe(c);var l=n.type==="mousedown";et(document,l?"mousemove":"touchmove",this._onMove,this),et(document,l?"mouseup":"touchend touchcancel",this._onUp,this)}}},_onMove:function(n){if(this._enabled){if(n.touches&&n.touches.length>1){this._moved=!0;return}var s=n.touches&&n.touches.length===1?n.touches[0]:n,c=new J(s.clientX,s.clientY)._subtract(this._startPoint);!c.x&&!c.y||Math.abs(c.x)+Math.abs(c.y)<this.options.clickTolerance||(c.x/=this._parentScale.x,c.y/=this._parentScale.y,Dt(n),this._moved||(this.fire("dragstart"),this._moved=!0,$(document.body,"leaflet-dragging"),this._lastTarget=n.target||n.srcElement,window.SVGElementInstance&&this._lastTarget instanceof window.SVGElementInstance&&(this._lastTarget=this._lastTarget.correspondingUseElement),$(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(c),this._moving=!0,this._lastEvent=n,this._updatePosition())}},_updatePosition:function(){var n={originalEvent:this._lastEvent};this.fire("predrag",n),kt(this._element,this._newPos),this.fire("drag",n)},_onUp:function(){this._enabled&&this.finishDrag()},finishDrag:function(n){At(document.body,"leaflet-dragging"),this._lastTarget&&(At(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null),Et(document,"mousemove touchmove",this._onMove,this),Et(document,"mouseup touchend touchcancel",this._onUp,this),Yi(),ge();var s=this._moved&&this._moving;this._moving=!1,ke._dragging=!1,s&&this.fire("dragend",{noInertia:n,distance:this._newPos.distanceTo(this._startPos)})}});function ls(n,s,c){var l,m=[1,4,2,8],y,I,M,O,U,G,Q,ct;for(y=0,G=n.length;y<G;y++)n[y]._code=N(n[y],s);for(M=0;M<4;M++){for(Q=m[M],l=[],y=0,G=n.length,I=G-1;y<G;I=y++)O=n[y],U=n[I],O._code&Q?U._code&Q||(ct=k(U,O,Q,s,c),ct._code=N(ct,s),l.push(ct)):(U._code&Q&&(ct=k(U,O,Q,s,c),ct._code=N(ct,s),l.push(ct)),l.push(O));n=l}return n}function ds(n,s){var c,l,m,y,I,M,O,U,G;if(!n||n.length===0)throw new Error("latlngs not passed");yt(n)||(console.warn("latlngs are not flat! Only the first ring will be used"),n=n[0]);var Q=at([0,0]),ct=bt(n),ue=ct.getNorthWest().distanceTo(ct.getSouthWest())*ct.getNorthEast().distanceTo(ct.getNorthWest());ue<1700&&(Q=ir(n));var $t=n.length,Se=[];for(c=0;c<$t;c++){var fe=at(n[c]);Se.push(s.project(at([fe.lat-Q.lat,fe.lng-Q.lng])))}for(M=O=U=0,c=0,l=$t-1;c<$t;l=c++)m=Se[c],y=Se[l],I=m.y*y.x-y.y*m.x,O+=(m.x+y.x)*I,U+=(m.y+y.y)*I,M+=I*3;M===0?G=Se[0]:G=[O/M,U/M];var dr=s.unproject(tt(G));return at([dr.lat+Q.lat,dr.lng+Q.lng])}function ir(n){for(var s=0,c=0,l=0,m=0;m<n.length;m++){var y=at(n[m]);s+=y.lat,c+=y.lng,l++}return at([s/l,c/l])}var rr={__proto__:null,clipPolygon:ls,polygonCenter:ds,centroid:ir};function te(n,s){if(!s||!n.length)return n.slice();var c=s*s;return n=d(n,c),n=Vn(n,c),n}function fs(n,s,c){return Math.sqrt(nt(n,s,c,!0))}function vo(n,s,c){return nt(n,s,c)}function Vn(n,s){var c=n.length,l=typeof Uint8Array<"u"?Uint8Array:Array,m=new l(c);m[0]=m[c-1]=1,u(n,m,s,0,c-1);var y,I=[];for(y=0;y<c;y++)m[y]&&I.push(n[y]);return I}function u(n,s,c,l,m){var y=0,I,M,O;for(M=l+1;M<=m-1;M++)O=nt(n[M],n[l],n[m],!0),O>y&&(I=M,y=O);y>c&&(s[I]=1,u(n,s,c,l,I),u(n,s,c,I,m))}function d(n,s){for(var c=[n[0]],l=1,m=0,y=n.length;l<y;l++)H(n[l],n[m])>s&&(c.push(n[l]),m=l);return m<y-1&&c.push(n[y-1]),c}var _;function v(n,s,c,l,m){var y=l?_:N(n,c),I=N(s,c),M,O,U;for(_=I;;){if(!(y|I))return[n,s];if(y&I)return!1;M=y||I,O=k(n,s,M,c,m),U=N(O,c),M===y?(n=O,y=U):(s=O,I=U)}}function k(n,s,c,l,m){var y=s.x-n.x,I=s.y-n.y,M=l.min,O=l.max,U,G;return c&8?(U=n.x+y*(O.y-n.y)/I,G=O.y):c&4?(U=n.x+y*(M.y-n.y)/I,G=M.y):c&2?(U=O.x,G=n.y+I*(O.x-n.x)/y):c&1&&(U=M.x,G=n.y+I*(M.x-n.x)/y),new J(U,G,m)}function N(n,s){var c=0;return n.x<s.min.x?c|=1:n.x>s.max.x&&(c|=2),n.y<s.min.y?c|=4:n.y>s.max.y&&(c|=8),c}function H(n,s){var c=s.x-n.x,l=s.y-n.y;return c*c+l*l}function nt(n,s,c,l){var m=s.x,y=s.y,I=c.x-m,M=c.y-y,O=I*I+M*M,U;return O>0&&(U=((n.x-m)*I+(n.y-y)*M)/O,U>1?(m=c.x,y=c.y):U>0&&(m+=I*U,y+=M*U)),I=n.x-m,M=n.y-y,l?I*I+M*M:new J(m,y)}function yt(n){return!st(n[0])||typeof n[0][0]!="object"&&typeof n[0][0]<"u"}function wt(n){return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."),yt(n)}function Mt(n,s){var c,l,m,y,I,M,O,U;if(!n||n.length===0)throw new Error("latlngs not passed");yt(n)||(console.warn("latlngs are not flat! Only the first ring will be used"),n=n[0]);var G=at([0,0]),Q=bt(n),ct=Q.getNorthWest().distanceTo(Q.getSouthWest())*Q.getNorthEast().distanceTo(Q.getNorthWest());ct<1700&&(G=ir(n));var ue=n.length,$t=[];for(c=0;c<ue;c++){var Se=at(n[c]);$t.push(s.project(at([Se.lat-G.lat,Se.lng-G.lng])))}for(c=0,l=0;c<ue-1;c++)l+=$t[c].distanceTo($t[c+1])/2;if(l===0)U=$t[0];else for(c=0,y=0;c<ue-1;c++)if(I=$t[c],M=$t[c+1],m=I.distanceTo(M),y+=m,y>l){O=(y-l)/m,U=[M.x-O*(M.x-I.x),M.y-O*(M.y-I.y)];break}var fe=s.unproject(tt(U));return at([fe.lat+G.lat,fe.lng+G.lng])}var Ae={__proto__:null,simplify:te,pointToSegmentDistance:fs,closestPointOnSegment:vo,clipSegment:v,_getEdgeIntersection:k,_getBitCode:N,_sqClosestPointOnSegment:nt,isFlat:yt,_flat:wt,polylineCenter:Mt},Me={project:function(n){return new J(n.lng,n.lat)},unproject:function(n){return new _t(n.y,n.x)},bounds:new Pt([-180,-90],[180,90])},be={R:6378137,R_MINOR:6356752314245179e-9,bounds:new Pt([-2003750834279e-5,-1549657073972e-5],[2003750834279e-5,1876465623138e-5]),project:function(n){var s=Math.PI/180,c=this.R,l=n.lat*s,m=this.R_MINOR/c,y=Math.sqrt(1-m*m),I=y*Math.sin(l),M=Math.tan(Math.PI/4-l/2)/Math.pow((1-I)/(1+I),y/2);return l=-c*Math.log(Math.max(M,1e-10)),new J(n.lng*s*c,l)},unproject:function(n){for(var s=180/Math.PI,c=this.R,l=this.R_MINOR/c,m=Math.sqrt(1-l*l),y=Math.exp(-n.y/c),I=Math.PI/2-2*Math.atan(y),M=0,O=.1,U;M<15&&Math.abs(O)>1e-7;M++)U=m*Math.sin(I),U=Math.pow((1-U)/(1+U),m/2),O=Math.PI/2-2*Math.atan(y*U)-I,I+=O;return new _t(I*s,n.x*s/c)}},Ge={__proto__:null,LonLat:Me,Mercator:be,SphericalMercator:jr},sr=o({},we,{code:"EPSG:3395",projection:be,transformation:function(){var n=.5/(Math.PI*be.R);return Cn(n,.5,-n,.5)}()}),or=o({},we,{code:"EPSG:4326",projection:Me,transformation:Cn(1/180,1,-1/180,.5)}),Pm=o({},_e,{projection:Me,transformation:Cn(1,0,-1,0),scale:function(n){return Math.pow(2,n)},zoom:function(n){return Math.log(n)/Math.LN2},distance:function(n,s){var c=s.lng-n.lng,l=s.lat-n.lat;return Math.sqrt(c*c+l*l)},infinite:!0});_e.Earth=we,_e.EPSG3395=sr,_e.EPSG3857=ci,_e.EPSG900913=Qs,_e.EPSG4326=or,_e.Simple=Pm;var Ne=ai.extend({options:{pane:"overlayPane",attribution:null,bubblingMouseEvents:!0},addTo:function(n){return n.addLayer(this),this},remove:function(){return this.removeFrom(this._map||this._mapToAdd)},removeFrom:function(n){return n&&n.removeLayer(this),this},getPane:function(n){return this._map.getPane(n?this.options[n]||n:this.options.pane)},addInteractiveTarget:function(n){return this._map._targets[p(n)]=this,this},removeInteractiveTarget:function(n){return delete this._map._targets[p(n)],this},getAttribution:function(){return this.options.attribution},_layerAdd:function(n){var s=n.target;if(s.hasLayer(this)){if(this._map=s,this._zoomAnimated=s._zoomAnimated,this.getEvents){var c=this.getEvents();s.on(c,this),this.once("remove",function(){s.off(c,this)},this)}this.onAdd(s),this.fire("add"),s.fire("layeradd",{layer:this})}}});ut.include({addLayer:function(n){if(!n._layerAdd)throw new Error("The provided object is not a Layer.");var s=p(n);return this._layers[s]?this:(this._layers[s]=n,n._mapToAdd=this,n.beforeAdd&&n.beforeAdd(this),this.whenReady(n._layerAdd,n),this)},removeLayer:function(n){var s=p(n);return this._layers[s]?(this._loaded&&n.onRemove(this),delete this._layers[s],this._loaded&&(this.fire("layerremove",{layer:n}),n.fire("remove")),n._map=n._mapToAdd=null,this):this},hasLayer:function(n){return p(n)in this._layers},eachLayer:function(n,s){for(var c in this._layers)n.call(s,this._layers[c]);return this},_addLayers:function(n){n=n?st(n)?n:[n]:[];for(var s=0,c=n.length;s<c;s++)this.addLayer(n[s])},_addZoomLimit:function(n){(!isNaN(n.options.maxZoom)||!isNaN(n.options.minZoom))&&(this._zoomBoundLayers[p(n)]=n,this._updateZoomLevels())},_removeZoomLimit:function(n){var s=p(n);this._zoomBoundLayers[s]&&(delete this._zoomBoundLayers[s],this._updateZoomLevels())},_updateZoomLevels:function(){var n=1/0,s=-1/0,c=this._getZoomSpan();for(var l in this._zoomBoundLayers){var m=this._zoomBoundLayers[l].options;n=m.minZoom===void 0?n:Math.min(n,m.minZoom),s=m.maxZoom===void 0?s:Math.max(s,m.maxZoom)}this._layersMaxZoom=s===-1/0?void 0:s,this._layersMinZoom=n===1/0?void 0:n,c!==this._getZoomSpan()&&this.fire("zoomlevelschange"),this.options.maxZoom===void 0&&this._layersMaxZoom&&this.getZoom()>this._layersMaxZoom&&this.setZoom(this._layersMaxZoom),this.options.minZoom===void 0&&this._layersMinZoom&&this.getZoom()<this._layersMinZoom&&this.setZoom(this._layersMinZoom)}});var ar=Ne.extend({initialize:function(n,s){B(this,s),this._layers={};var c,l;if(n)for(c=0,l=n.length;c<l;c++)this.addLayer(n[c])},addLayer:function(n){var s=this.getLayerId(n);return this._layers[s]=n,this._map&&this._map.addLayer(n),this},removeLayer:function(n){var s=n in this._layers?n:this.getLayerId(n);return this._map&&this._layers[s]&&this._map.removeLayer(this._layers[s]),delete this._layers[s],this},hasLayer:function(n){var s=typeof n=="number"?n:this.getLayerId(n);return s in this._layers},clearLayers:function(){return this.eachLayer(this.removeLayer,this)},invoke:function(n){var s=Array.prototype.slice.call(arguments,1),c,l;for(c in this._layers)l=this._layers[c],l[n]&&l[n].apply(l,s);return this},onAdd:function(n){this.eachLayer(n.addLayer,n)},onRemove:function(n){this.eachLayer(n.removeLayer,n)},eachLayer:function(n,s){for(var c in this._layers)n.call(s,this._layers[c]);return this},getLayer:function(n){return this._layers[n]},getLayers:function(){var n=[];return this.eachLayer(n.push,n),n},setZIndex:function(n){return this.invoke("setZIndex",n)},getLayerId:function(n){return p(n)}}),Am=function(n,s){return new ar(n,s)},fn=ar.extend({addLayer:function(n){return this.hasLayer(n)?this:(n.addEventParent(this),ar.prototype.addLayer.call(this,n),this.fire("layeradd",{layer:n}))},removeLayer:function(n){return this.hasLayer(n)?(n in this._layers&&(n=this._layers[n]),n.removeEventParent(this),ar.prototype.removeLayer.call(this,n),this.fire("layerremove",{layer:n})):this},setStyle:function(n){return this.invoke("setStyle",n)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var n=new Qt;for(var s in this._layers){var c=this._layers[s];n.extend(c.getBounds?c.getBounds():c.getLatLng())}return n}}),bm=function(n,s){return new fn(n,s)},ur=Ct.extend({options:{popupAnchor:[0,0],tooltipAnchor:[0,0],crossOrigin:!1},initialize:function(n){B(this,n)},createIcon:function(n){return this._createIcon("icon",n)},createShadow:function(n){return this._createIcon("shadow",n)},_createIcon:function(n,s){var c=this._getIconUrl(n);if(!c){if(n==="icon")throw new Error("iconUrl not set in Icon options (see the docs).");return null}var l=this._createImg(c,s&&s.tagName==="IMG"?s:null);return this._setIconStyles(l,n),(this.options.crossOrigin||this.options.crossOrigin==="")&&(l.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),l},_setIconStyles:function(n,s){var c=this.options,l=c[s+"Size"];typeof l=="number"&&(l=[l,l]);var m=tt(l),y=tt(s==="shadow"&&c.shadowAnchor||c.iconAnchor||m&&m.divideBy(2,!0));n.className="leaflet-marker-"+s+" "+(c.className||""),y&&(n.style.marginLeft=-y.x+"px",n.style.marginTop=-y.y+"px"),m&&(n.style.width=m.x+"px",n.style.height=m.y+"px")},_createImg:function(n,s){return s=s||document.createElement("img"),s.src=n,s},_getIconUrl:function(n){return Z.retina&&this.options[n+"RetinaUrl"]||this.options[n+"Url"]}});function Sm(n){return new ur(n)}var ms=ur.extend({options:{iconUrl:"marker-icon.png",iconRetinaUrl:"marker-icon-2x.png",shadowUrl:"marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],tooltipAnchor:[16,-28],shadowSize:[41,41]},_getIconUrl:function(n){return typeof ms.imagePath!="string"&&(ms.imagePath=this._detectIconPath()),(this.options.imagePath||ms.imagePath)+ur.prototype._getIconUrl.call(this,n)},_stripUrl:function(n){var s=function(c,l,m){var y=l.exec(c);return y&&y[m]};return n=s(n,/^url\((['"])?(.+)\1\)$/,2),n&&s(n,/^(.*)marker-icon\.png$/,1)},_detectIconPath:function(){var n=mt("div","leaflet-default-icon-path",document.body),s=Nn(n,"background-image")||Nn(n,"backgroundImage");if(document.body.removeChild(n),s=this._stripUrl(s),s)return s;var c=document.querySelector('link[href$="leaflet.css"]');return c?c.href.substring(0,c.href.length-11-1):""}}),Mc=ye.extend({initialize:function(n){this._marker=n},addHooks:function(){var n=this._marker._icon;this._draggable||(this._draggable=new ke(n,n,!0)),this._draggable.on({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).enable(),$(n,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).disable(),this._marker._icon&&At(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_adjustPan:function(n){var s=this._marker,c=s._map,l=this._marker.options.autoPanSpeed,m=this._marker.options.autoPanPadding,y=hn(s._icon),I=c.getPixelBounds(),M=c.getPixelOrigin(),O=Kt(I.min._subtract(M).add(m),I.max._subtract(M).subtract(m));if(!O.contains(y)){var U=tt((Math.max(O.max.x,y.x)-O.max.x)/(I.max.x-O.max.x)-(Math.min(O.min.x,y.x)-O.min.x)/(I.min.x-O.min.x),(Math.max(O.max.y,y.y)-O.max.y)/(I.max.y-O.max.y)-(Math.min(O.min.y,y.y)-O.min.y)/(I.min.y-O.min.y)).multiplyBy(l);c.panBy(U,{animate:!1}),this._draggable._newPos._add(U),this._draggable._startPos._add(U),kt(s._icon,this._draggable._newPos),this._onDrag(n),this._panRequest=S(this._adjustPan.bind(this,n))}},_onDragStart:function(){this._oldLatLng=this._marker.getLatLng(),this._marker.closePopup&&this._marker.closePopup(),this._marker.fire("movestart").fire("dragstart")},_onPreDrag:function(n){this._marker.options.autoPan&&(x(this._panRequest),this._panRequest=S(this._adjustPan.bind(this,n)))},_onDrag:function(n){var s=this._marker,c=s._shadow,l=hn(s._icon),m=s._map.layerPointToLatLng(l);c&&kt(c,l),s._latlng=m,n.latlng=m,n.oldLatLng=this._oldLatLng,s.fire("move",n).fire("drag",n)},_onDragEnd:function(n){x(this._panRequest),delete this._oldLatLng,this._marker.fire("moveend").fire("dragend",n)}}),wo=Ne.extend({options:{icon:new ms,interactive:!0,keyboard:!0,title:"",alt:"Marker",zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250,pane:"markerPane",shadowPane:"shadowPane",bubblingMouseEvents:!1,autoPanOnFocus:!0,draggable:!1,autoPan:!1,autoPanPadding:[50,50],autoPanSpeed:10},initialize:function(n,s){B(this,s),this._latlng=at(n)},onAdd:function(n){this._zoomAnimated=this._zoomAnimated&&n.options.markerZoomAnimation,this._zoomAnimated&&n.on("zoomanim",this._animateZoom,this),this._initIcon(),this.update()},onRemove:function(n){this.dragging&&this.dragging.enabled()&&(this.options.draggable=!0,this.dragging.removeHooks()),delete this.dragging,this._zoomAnimated&&n.off("zoomanim",this._animateZoom,this),this._removeIcon(),this._removeShadow()},getEvents:function(){return{zoom:this.update,viewreset:this.update}},getLatLng:function(){return this._latlng},setLatLng:function(n){var s=this._latlng;return this._latlng=at(n),this.update(),this.fire("move",{oldLatLng:s,latlng:this._latlng})},setZIndexOffset:function(n){return this.options.zIndexOffset=n,this.update()},getIcon:function(){return this.options.icon},setIcon:function(n){return this.options.icon=n,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup,this._popup.options),this},getElement:function(){return this._icon},update:function(){if(this._icon&&this._map){var n=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(n)}return this},_initIcon:function(){var n=this.options,s="leaflet-zoom-"+(this._zoomAnimated?"animated":"hide"),c=n.icon.createIcon(this._icon),l=!1;c!==this._icon&&(this._icon&&this._removeIcon(),l=!0,n.title&&(c.title=n.title),c.tagName==="IMG"&&(c.alt=n.alt||"")),$(c,s),n.keyboard&&(c.tabIndex="0",c.setAttribute("role","button")),this._icon=c,n.riseOnHover&&this.on({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&et(c,"focus",this._panOnFocus,this);var m=n.icon.createShadow(this._shadow),y=!1;m!==this._shadow&&(this._removeShadow(),y=!0),m&&($(m,s),m.alt=""),this._shadow=m,n.opacity<1&&this._updateOpacity(),l&&this.getPane().appendChild(this._icon),this._initInteraction(),m&&y&&this.getPane(n.shadowPane).appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&this.off({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&Et(this._icon,"focus",this._panOnFocus,this),gt(this._icon),this.removeInteractiveTarget(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&gt(this._shadow),this._shadow=null},_setPos:function(n){this._icon&&kt(this._icon,n),this._shadow&&kt(this._shadow,n),this._zIndex=n.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(n){this._icon&&(this._icon.style.zIndex=this._zIndex+n)},_animateZoom:function(n){var s=this._map._latLngToNewLayerPoint(this._latlng,n.zoom,n.center).round();this._setPos(s)},_initInteraction:function(){if(this.options.interactive&&($(this._icon,"leaflet-interactive"),this.addInteractiveTarget(this._icon),Mc)){var n=this.options.draggable;this.dragging&&(n=this.dragging.enabled(),this.dragging.disable()),this.dragging=new Mc(this),n&&this.dragging.enable()}},setOpacity:function(n){return this.options.opacity=n,this._map&&this._updateOpacity(),this},_updateOpacity:function(){var n=this.options.opacity;this._icon&&le(this._icon,n),this._shadow&&le(this._shadow,n)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)},_panOnFocus:function(){var n=this._map;if(n){var s=this.options.icon.options,c=s.iconSize?tt(s.iconSize):tt(0,0),l=s.iconAnchor?tt(s.iconAnchor):tt(0,0);n.panInside(this._latlng,{paddingTopLeft:l,paddingBottomRight:c.subtract(l)})}},_getPopupAnchor:function(){return this.options.icon.options.popupAnchor},_getTooltipAnchor:function(){return this.options.icon.options.tooltipAnchor}});function Cm(n,s){return new wo(n,s)}var Fn=Ne.extend({options:{stroke:!0,color:"#3388ff",weight:3,opacity:1,lineCap:"round",lineJoin:"round",dashArray:null,dashOffset:null,fill:!1,fillColor:null,fillOpacity:.2,fillRule:"evenodd",interactive:!0,bubblingMouseEvents:!0},beforeAdd:function(n){this._renderer=n.getRenderer(this)},onAdd:function(){this._renderer._initPath(this),this._reset(),this._renderer._addPath(this)},onRemove:function(){this._renderer._removePath(this)},redraw:function(){return this._map&&this._renderer._updatePath(this),this},setStyle:function(n){return B(this,n),this._renderer&&(this._renderer._updateStyle(this),this.options.stroke&&n&&Object.prototype.hasOwnProperty.call(n,"weight")&&this._updateBounds()),this},bringToFront:function(){return this._renderer&&this._renderer._bringToFront(this),this},bringToBack:function(){return this._renderer&&this._renderer._bringToBack(this),this},getElement:function(){return this._path},_reset:function(){this._project(),this._update()},_clickTolerance:function(){return(this.options.stroke?this.options.weight/2:0)+(this._renderer.options.tolerance||0)}}),To=Fn.extend({options:{fill:!0,radius:10},initialize:function(n,s){B(this,s),this._latlng=at(n),this._radius=this.options.radius},setLatLng:function(n){var s=this._latlng;return this._latlng=at(n),this.redraw(),this.fire("move",{oldLatLng:s,latlng:this._latlng})},getLatLng:function(){return this._latlng},setRadius:function(n){return this.options.radius=this._radius=n,this.redraw()},getRadius:function(){return this._radius},setStyle:function(n){var s=n&&n.radius||this._radius;return Fn.prototype.setStyle.call(this,n),this.setRadius(s),this},_project:function(){this._point=this._map.latLngToLayerPoint(this._latlng),this._updateBounds()},_updateBounds:function(){var n=this._radius,s=this._radiusY||n,c=this._clickTolerance(),l=[n+c,s+c];this._pxBounds=new Pt(this._point.subtract(l),this._point.add(l))},_update:function(){this._map&&this._updatePath()},_updatePath:function(){this._renderer._updateCircle(this)},_empty:function(){return this._radius&&!this._renderer._bounds.intersects(this._pxBounds)},_containsPoint:function(n){return n.distanceTo(this._point)<=this._radius+this._clickTolerance()}});function Rm(n,s){return new To(n,s)}var Ga=To.extend({initialize:function(n,s,c){if(typeof s=="number"&&(s=o({},c,{radius:s})),B(this,s),this._latlng=at(n),isNaN(this.options.radius))throw new Error("Circle radius cannot be NaN");this._mRadius=this.options.radius},setRadius:function(n){return this._mRadius=n,this.redraw()},getRadius:function(){return this._mRadius},getBounds:function(){var n=[this._radius,this._radiusY||this._radius];return new Qt(this._map.layerPointToLatLng(this._point.subtract(n)),this._map.layerPointToLatLng(this._point.add(n)))},setStyle:Fn.prototype.setStyle,_project:function(){var n=this._latlng.lng,s=this._latlng.lat,c=this._map,l=c.options.crs;if(l.distance===we.distance){var m=Math.PI/180,y=this._mRadius/we.R/m,I=c.project([s+y,n]),M=c.project([s-y,n]),O=I.add(M).divideBy(2),U=c.unproject(O).lat,G=Math.acos((Math.cos(y*m)-Math.sin(s*m)*Math.sin(U*m))/(Math.cos(s*m)*Math.cos(U*m)))/m;(isNaN(G)||G===0)&&(G=y/Math.cos(Math.PI/180*s)),this._point=O.subtract(c.getPixelOrigin()),this._radius=isNaN(G)?0:O.x-c.project([U,n-G]).x,this._radiusY=O.y-I.y}else{var Q=l.unproject(l.project(this._latlng).subtract([this._mRadius,0]));this._point=c.latLngToLayerPoint(this._latlng),this._radius=this._point.x-c.latLngToLayerPoint(Q).x}this._updateBounds()}});function Lm(n,s,c){return new Ga(n,s,c)}var mn=Fn.extend({options:{smoothFactor:1,noClip:!1},initialize:function(n,s){B(this,s),this._setLatLngs(n)},getLatLngs:function(){return this._latlngs},setLatLngs:function(n){return this._setLatLngs(n),this.redraw()},isEmpty:function(){return!this._latlngs.length},closestLayerPoint:function(n){for(var s=1/0,c=null,l=nt,m,y,I=0,M=this._parts.length;I<M;I++)for(var O=this._parts[I],U=1,G=O.length;U<G;U++){m=O[U-1],y=O[U];var Q=l(n,m,y,!0);Q<s&&(s=Q,c=l(n,m,y))}return c&&(c.distance=Math.sqrt(s)),c},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return Mt(this._defaultShape(),this._map.options.crs)},getBounds:function(){return this._bounds},addLatLng:function(n,s){return s=s||this._defaultShape(),n=at(n),s.push(n),this._bounds.extend(n),this.redraw()},_setLatLngs:function(n){this._bounds=new Qt,this._latlngs=this._convertLatLngs(n)},_defaultShape:function(){return yt(this._latlngs)?this._latlngs:this._latlngs[0]},_convertLatLngs:function(n){for(var s=[],c=yt(n),l=0,m=n.length;l<m;l++)c?(s[l]=at(n[l]),this._bounds.extend(s[l])):s[l]=this._convertLatLngs(n[l]);return s},_project:function(){var n=new Pt;this._rings=[],this._projectLatlngs(this._latlngs,this._rings,n),this._bounds.isValid()&&n.isValid()&&(this._rawPxBounds=n,this._updateBounds())},_updateBounds:function(){var n=this._clickTolerance(),s=new J(n,n);this._rawPxBounds&&(this._pxBounds=new Pt([this._rawPxBounds.min.subtract(s),this._rawPxBounds.max.add(s)]))},_projectLatlngs:function(n,s,c){var l=n[0]instanceof _t,m=n.length,y,I;if(l){for(I=[],y=0;y<m;y++)I[y]=this._map.latLngToLayerPoint(n[y]),c.extend(I[y]);s.push(I)}else for(y=0;y<m;y++)this._projectLatlngs(n[y],s,c)},_clipPoints:function(){var n=this._renderer._bounds;if(this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(n))){if(this.options.noClip){this._parts=this._rings;return}var s=this._parts,c,l,m,y,I,M,O;for(c=0,m=0,y=this._rings.length;c<y;c++)for(O=this._rings[c],l=0,I=O.length;l<I-1;l++)M=v(O[l],O[l+1],n,l,!0),M&&(s[m]=s[m]||[],s[m].push(M[0]),(M[1]!==O[l+1]||l===I-2)&&(s[m].push(M[1]),m++))}},_simplifyPoints:function(){for(var n=this._parts,s=this.options.smoothFactor,c=0,l=n.length;c<l;c++)n[c]=te(n[c],s)},_update:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),this._updatePath())},_updatePath:function(){this._renderer._updatePoly(this)},_containsPoint:function(n,s){var c,l,m,y,I,M,O=this._clickTolerance();if(!this._pxBounds||!this._pxBounds.contains(n))return!1;for(c=0,y=this._parts.length;c<y;c++)for(M=this._parts[c],l=0,I=M.length,m=I-1;l<I;m=l++)if(!(!s&&l===0)&&fs(n,M[m],M[l])<=O)return!0;return!1}});function xm(n,s){return new mn(n,s)}mn._flat=wt;var cr=mn.extend({options:{fill:!0},isEmpty:function(){return!this._latlngs.length||!this._latlngs[0].length},getCenter:function(){if(!this._map)throw new Error("Must add layer to map before using getCenter()");return ds(this._defaultShape(),this._map.options.crs)},_convertLatLngs:function(n){var s=mn.prototype._convertLatLngs.call(this,n),c=s.length;return c>=2&&s[0]instanceof _t&&s[0].equals(s[c-1])&&s.pop(),s},_setLatLngs:function(n){mn.prototype._setLatLngs.call(this,n),yt(this._latlngs)&&(this._latlngs=[this._latlngs])},_defaultShape:function(){return yt(this._latlngs[0])?this._latlngs[0]:this._latlngs[0][0]},_clipPoints:function(){var n=this._renderer._bounds,s=this.options.weight,c=new J(s,s);if(n=new Pt(n.min.subtract(c),n.max.add(c)),this._parts=[],!(!this._pxBounds||!this._pxBounds.intersects(n))){if(this.options.noClip){this._parts=this._rings;return}for(var l=0,m=this._rings.length,y;l<m;l++)y=ls(this._rings[l],n,!0),y.length&&this._parts.push(y)}},_updatePath:function(){this._renderer._updatePoly(this,!0)},_containsPoint:function(n){var s=!1,c,l,m,y,I,M,O,U;if(!this._pxBounds||!this._pxBounds.contains(n))return!1;for(y=0,O=this._parts.length;y<O;y++)for(c=this._parts[y],I=0,U=c.length,M=U-1;I<U;M=I++)l=c[I],m=c[M],l.y>n.y!=m.y>n.y&&n.x<(m.x-l.x)*(n.y-l.y)/(m.y-l.y)+l.x&&(s=!s);return s||mn.prototype._containsPoint.call(this,n,!0)}});function km(n,s){return new cr(n,s)}var pn=fn.extend({initialize:function(n,s){B(this,s),this._layers={},n&&this.addData(n)},addData:function(n){var s=st(n)?n:n.features,c,l,m;if(s){for(c=0,l=s.length;c<l;c++)m=s[c],(m.geometries||m.geometry||m.features||m.coordinates)&&this.addData(m);return this}var y=this.options;if(y.filter&&!y.filter(n))return this;var I=Eo(n,y);return I?(I.feature=Ao(n),I.defaultOptions=I.options,this.resetStyle(I),y.onEachFeature&&y.onEachFeature(n,I),this.addLayer(I)):this},resetStyle:function(n){return n===void 0?this.eachLayer(this.resetStyle,this):(n.options=o({},n.defaultOptions),this._setLayerStyle(n,this.options.style),this)},setStyle:function(n){return this.eachLayer(function(s){this._setLayerStyle(s,n)},this)},_setLayerStyle:function(n,s){n.setStyle&&(typeof s=="function"&&(s=s(n.feature)),n.setStyle(s))}});function Eo(n,s){var c=n.type==="Feature"?n.geometry:n,l=c?c.coordinates:null,m=[],y=s&&s.pointToLayer,I=s&&s.coordsToLatLng||Wa,M,O,U,G;if(!l&&!c)return null;switch(c.type){case"Point":return M=I(l),Nc(y,n,M,s);case"MultiPoint":for(U=0,G=l.length;U<G;U++)M=I(l[U]),m.push(Nc(y,n,M,s));return new fn(m);case"LineString":case"MultiLineString":return O=Io(l,c.type==="LineString"?0:1,I),new mn(O,s);case"Polygon":case"MultiPolygon":return O=Io(l,c.type==="Polygon"?1:2,I),new cr(O,s);case"GeometryCollection":for(U=0,G=c.geometries.length;U<G;U++){var Q=Eo({geometry:c.geometries[U],type:"Feature",properties:n.properties},s);Q&&m.push(Q)}return new fn(m);case"FeatureCollection":for(U=0,G=c.features.length;U<G;U++){var ct=Eo(c.features[U],s);ct&&m.push(ct)}return new fn(m);default:throw new Error("Invalid GeoJSON object.")}}function Nc(n,s,c,l){return n?n(s,c):new wo(c,l&&l.markersInheritOptions&&l)}function Wa(n){return new _t(n[1],n[0],n[2])}function Io(n,s,c){for(var l=[],m=0,y=n.length,I;m<y;m++)I=s?Io(n[m],s-1,c):(c||Wa)(n[m]),l.push(I);return l}function $a(n,s){return n=at(n),n.alt!==void 0?[b(n.lng,s),b(n.lat,s),b(n.alt,s)]:[b(n.lng,s),b(n.lat,s)]}function Po(n,s,c,l){for(var m=[],y=0,I=n.length;y<I;y++)m.push(s?Po(n[y],yt(n[y])?0:s-1,c,l):$a(n[y],l));return!s&&c&&m.length>0&&m.push(m[0].slice()),m}function hr(n,s){return n.feature?o({},n.feature,{geometry:s}):Ao(s)}function Ao(n){return n.type==="Feature"||n.type==="FeatureCollection"?n:{type:"Feature",properties:{},geometry:n}}var Za={toGeoJSON:function(n){return hr(this,{type:"Point",coordinates:$a(this.getLatLng(),n)})}};wo.include(Za),Ga.include(Za),To.include(Za),mn.include({toGeoJSON:function(n){var s=!yt(this._latlngs),c=Po(this._latlngs,s?1:0,!1,n);return hr(this,{type:(s?"Multi":"")+"LineString",coordinates:c})}}),cr.include({toGeoJSON:function(n){var s=!yt(this._latlngs),c=s&&!yt(this._latlngs[0]),l=Po(this._latlngs,c?2:s?1:0,!0,n);return s||(l=[l]),hr(this,{type:(c?"Multi":"")+"Polygon",coordinates:l})}}),ar.include({toMultiPoint:function(n){var s=[];return this.eachLayer(function(c){s.push(c.toGeoJSON(n).geometry.coordinates)}),hr(this,{type:"MultiPoint",coordinates:s})},toGeoJSON:function(n){var s=this.feature&&this.feature.geometry&&this.feature.geometry.type;if(s==="MultiPoint")return this.toMultiPoint(n);var c=s==="GeometryCollection",l=[];return this.eachLayer(function(m){if(m.toGeoJSON){var y=m.toGeoJSON(n);if(c)l.push(y.geometry);else{var I=Ao(y);I.type==="FeatureCollection"?l.push.apply(l,I.features):l.push(I)}}}),c?hr(this,{geometries:l,type:"GeometryCollection"}):{type:"FeatureCollection",features:l}}});function Oc(n,s){return new pn(n,s)}var Mm=Oc,bo=Ne.extend({options:{opacity:1,alt:"",interactive:!1,crossOrigin:!1,errorOverlayUrl:"",zIndex:1,className:""},initialize:function(n,s,c){this._url=n,this._bounds=bt(s),B(this,c)},onAdd:function(){this._image||(this._initImage(),this.options.opacity<1&&this._updateOpacity()),this.options.interactive&&($(this._image,"leaflet-interactive"),this.addInteractiveTarget(this._image)),this.getPane().appendChild(this._image),this._reset()},onRemove:function(){gt(this._image),this.options.interactive&&this.removeInteractiveTarget(this._image)},setOpacity:function(n){return this.options.opacity=n,this._image&&this._updateOpacity(),this},setStyle:function(n){return n.opacity&&this.setOpacity(n.opacity),this},bringToFront:function(){return this._map&&Ee(this._image),this},bringToBack:function(){return this._map&&Ie(this._image),this},setUrl:function(n){return this._url=n,this._image&&(this._image.src=n),this},setBounds:function(n){return this._bounds=bt(n),this._map&&this._reset(),this},getEvents:function(){var n={zoom:this._reset,viewreset:this._reset};return this._zoomAnimated&&(n.zoomanim=this._animateZoom),n},setZIndex:function(n){return this.options.zIndex=n,this._updateZIndex(),this},getBounds:function(){return this._bounds},getElement:function(){return this._image},_initImage:function(){var n=this._url.tagName==="IMG",s=this._image=n?this._url:mt("img");if($(s,"leaflet-image-layer"),this._zoomAnimated&&$(s,"leaflet-zoom-animated"),this.options.className&&$(s,this.options.className),s.onselectstart=T,s.onmousemove=T,s.onload=h(this.fire,this,"load"),s.onerror=h(this._overlayOnError,this,"error"),(this.options.crossOrigin||this.options.crossOrigin==="")&&(s.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),this.options.zIndex&&this._updateZIndex(),n){this._url=s.src;return}s.src=this._url,s.alt=this.options.alt},_animateZoom:function(n){var s=this._map.getZoomScale(n.zoom),c=this._map._latLngBoundsToNewLayerBounds(this._bounds,n.zoom,n.center).min;cn(this._image,c,s)},_reset:function(){var n=this._image,s=new Pt(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),c=s.getSize();kt(n,s.min),n.style.width=c.x+"px",n.style.height=c.y+"px"},_updateOpacity:function(){le(this._image,this.options.opacity)},_updateZIndex:function(){this._image&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._image.style.zIndex=this.options.zIndex)},_overlayOnError:function(){this.fire("error");var n=this.options.errorOverlayUrl;n&&this._url!==n&&(this._url=n,this._image.src=n)},getCenter:function(){return this._bounds.getCenter()}}),Nm=function(n,s,c){return new bo(n,s,c)},Dc=bo.extend({options:{autoplay:!0,loop:!0,keepAspectRatio:!0,muted:!1,playsInline:!0},_initImage:function(){var n=this._url.tagName==="VIDEO",s=this._image=n?this._url:mt("video");if($(s,"leaflet-image-layer"),this._zoomAnimated&&$(s,"leaflet-zoom-animated"),this.options.className&&$(s,this.options.className),s.onselectstart=T,s.onmousemove=T,s.onloadeddata=h(this.fire,this,"load"),n){for(var c=s.getElementsByTagName("source"),l=[],m=0;m<c.length;m++)l.push(c[m].src);this._url=c.length>0?l:[s.src];return}st(this._url)||(this._url=[this._url]),!this.options.keepAspectRatio&&Object.prototype.hasOwnProperty.call(s.style,"objectFit")&&(s.style.objectFit="fill"),s.autoplay=!!this.options.autoplay,s.loop=!!this.options.loop,s.muted=!!this.options.muted,s.playsInline=!!this.options.playsInline;for(var y=0;y<this._url.length;y++){var I=mt("source");I.src=this._url[y],s.appendChild(I)}}});function Om(n,s,c){return new Dc(n,s,c)}var Vc=bo.extend({_initImage:function(){var n=this._image=this._url;$(n,"leaflet-image-layer"),this._zoomAnimated&&$(n,"leaflet-zoom-animated"),this.options.className&&$(n,this.options.className),n.onselectstart=T,n.onmousemove=T}});function Dm(n,s,c){return new Vc(n,s,c)}var We=Ne.extend({options:{interactive:!1,offset:[0,0],className:"",pane:void 0,content:""},initialize:function(n,s){n&&(n instanceof _t||st(n))?(this._latlng=at(n),B(this,s)):(B(this,n),this._source=s),this.options.content&&(this._content=this.options.content)},openOn:function(n){return n=arguments.length?n:this._source._map,n.hasLayer(this)||n.addLayer(this),this},close:function(){return this._map&&this._map.removeLayer(this),this},toggle:function(n){return this._map?this.close():(arguments.length?this._source=n:n=this._source,this._prepareOpen(),this.openOn(n._map)),this},onAdd:function(n){this._zoomAnimated=n._zoomAnimated,this._container||this._initLayout(),n._fadeAnimated&&le(this._container,0),clearTimeout(this._removeTimeout),this.getPane().appendChild(this._container),this.update(),n._fadeAnimated&&le(this._container,1),this.bringToFront(),this.options.interactive&&($(this._container,"leaflet-interactive"),this.addInteractiveTarget(this._container))},onRemove:function(n){n._fadeAnimated?(le(this._container,0),this._removeTimeout=setTimeout(h(gt,void 0,this._container),200)):gt(this._container),this.options.interactive&&(At(this._container,"leaflet-interactive"),this.removeInteractiveTarget(this._container))},getLatLng:function(){return this._latlng},setLatLng:function(n){return this._latlng=at(n),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(n){return this._content=n,this.update(),this},getElement:function(){return this._container},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},getEvents:function(){var n={zoom:this._updatePosition,viewreset:this._updatePosition};return this._zoomAnimated&&(n.zoomanim=this._animateZoom),n},isOpen:function(){return!!this._map&&this._map.hasLayer(this)},bringToFront:function(){return this._map&&Ee(this._container),this},bringToBack:function(){return this._map&&Ie(this._container),this},_prepareOpen:function(n){var s=this._source;if(!s._map)return!1;if(s instanceof fn){s=null;var c=this._source._layers;for(var l in c)if(c[l]._map){s=c[l];break}if(!s)return!1;this._source=s}if(!n)if(s.getCenter)n=s.getCenter();else if(s.getLatLng)n=s.getLatLng();else if(s.getBounds)n=s.getBounds().getCenter();else throw new Error("Unable to get source layer LatLng.");return this.setLatLng(n),this._map&&this.update(),!0},_updateContent:function(){if(this._content){var n=this._contentNode,s=typeof this._content=="function"?this._content(this._source||this):this._content;if(typeof s=="string")n.innerHTML=s;else{for(;n.hasChildNodes();)n.removeChild(n.firstChild);n.appendChild(s)}this.fire("contentupdate")}},_updatePosition:function(){if(this._map){var n=this._map.latLngToLayerPoint(this._latlng),s=tt(this.options.offset),c=this._getAnchor();this._zoomAnimated?kt(this._container,n.add(c)):s=s.add(n).add(c);var l=this._containerBottom=-s.y,m=this._containerLeft=-Math.round(this._containerWidth/2)+s.x;this._container.style.bottom=l+"px",this._container.style.left=m+"px"}},_getAnchor:function(){return[0,0]}});ut.include({_initOverlay:function(n,s,c,l){var m=s;return m instanceof n||(m=new n(l).setContent(s)),c&&m.setLatLng(c),m}}),Ne.include({_initOverlay:function(n,s,c,l){var m=c;return m instanceof n?(B(m,l),m._source=this):(m=s&&!l?s:new n(l,this),m.setContent(c)),m}});var So=We.extend({options:{pane:"popupPane",offset:[0,7],maxWidth:300,minWidth:50,maxHeight:null,autoPan:!0,autoPanPaddingTopLeft:null,autoPanPaddingBottomRight:null,autoPanPadding:[5,5],keepInView:!1,closeButton:!0,autoClose:!0,closeOnEscapeKey:!0,className:""},openOn:function(n){return n=arguments.length?n:this._source._map,!n.hasLayer(this)&&n._popup&&n._popup.options.autoClose&&n.removeLayer(n._popup),n._popup=this,We.prototype.openOn.call(this,n)},onAdd:function(n){We.prototype.onAdd.call(this,n),n.fire("popupopen",{popup:this}),this._source&&(this._source.fire("popupopen",{popup:this},!0),this._source instanceof Fn||this._source.on("preclick",vt))},onRemove:function(n){We.prototype.onRemove.call(this,n),n.fire("popupclose",{popup:this}),this._source&&(this._source.fire("popupclose",{popup:this},!0),this._source instanceof Fn||this._source.off("preclick",vt))},getEvents:function(){var n=We.prototype.getEvents.call(this);return(this.options.closeOnClick!==void 0?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(n.preclick=this.close),this.options.keepInView&&(n.moveend=this._adjustPan),n},_initLayout:function(){var n="leaflet-popup",s=this._container=mt("div",n+" "+(this.options.className||"")+" leaflet-zoom-animated"),c=this._wrapper=mt("div",n+"-content-wrapper",s);if(this._contentNode=mt("div",n+"-content",c),Ei(s),is(this._contentNode),et(s,"contextmenu",vt),this._tipContainer=mt("div",n+"-tip-container",s),this._tip=mt("div",n+"-tip",this._tipContainer),this.options.closeButton){var l=this._closeButton=mt("a",n+"-close-button",s);l.setAttribute("role","button"),l.setAttribute("aria-label","Close popup"),l.href="#close",l.innerHTML='<span aria-hidden="true">&#215;</span>',et(l,"click",function(m){Dt(m),this.close()},this)}},_updateLayout:function(){var n=this._contentNode,s=n.style;s.width="",s.whiteSpace="nowrap";var c=n.offsetWidth;c=Math.min(c,this.options.maxWidth),c=Math.max(c,this.options.minWidth),s.width=c+1+"px",s.whiteSpace="",s.height="";var l=n.offsetHeight,m=this.options.maxHeight,y="leaflet-popup-scrolled";m&&l>m?(s.height=m+"px",$(n,y)):At(n,y),this._containerWidth=this._container.offsetWidth},_animateZoom:function(n){var s=this._map._latLngToNewLayerPoint(this._latlng,n.zoom,n.center),c=this._getAnchor();kt(this._container,s.add(c))},_adjustPan:function(){if(this.options.autoPan){if(this._map._panAnim&&this._map._panAnim.stop(),this._autopanning){this._autopanning=!1;return}var n=this._map,s=parseInt(Nn(this._container,"marginBottom"),10)||0,c=this._container.offsetHeight+s,l=this._containerWidth,m=new J(this._containerLeft,-c-this._containerBottom);m._add(hn(this._container));var y=n.layerPointToContainerPoint(m),I=tt(this.options.autoPanPadding),M=tt(this.options.autoPanPaddingTopLeft||I),O=tt(this.options.autoPanPaddingBottomRight||I),U=n.getSize(),G=0,Q=0;y.x+l+O.x>U.x&&(G=y.x+l-U.x+O.x),y.x-G-M.x<0&&(G=y.x-M.x),y.y+c+O.y>U.y&&(Q=y.y+c-U.y+O.y),y.y-Q-M.y<0&&(Q=y.y-M.y),(G||Q)&&(this.options.keepInView&&(this._autopanning=!0),n.fire("autopanstart").panBy([G,Q]))}},_getAnchor:function(){return tt(this._source&&this._source._getPopupAnchor?this._source._getPopupAnchor():[0,0])}}),Vm=function(n,s){return new So(n,s)};ut.mergeOptions({closePopupOnClick:!0}),ut.include({openPopup:function(n,s,c){return this._initOverlay(So,n,s,c).openOn(this),this},closePopup:function(n){return n=arguments.length?n:this._popup,n&&n.close(),this}}),Ne.include({bindPopup:function(n,s){return this._popup=this._initOverlay(So,this._popup,n,s),this._popupHandlersAdded||(this.on({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this.off({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!1,this._popup=null),this},openPopup:function(n){return this._popup&&(this instanceof fn||(this._popup._source=this),this._popup._prepareOpen(n||this._latlng)&&this._popup.openOn(this._map)),this},closePopup:function(){return this._popup&&this._popup.close(),this},togglePopup:function(){return this._popup&&this._popup.toggle(this),this},isPopupOpen:function(){return this._popup?this._popup.isOpen():!1},setPopupContent:function(n){return this._popup&&this._popup.setContent(n),this},getPopup:function(){return this._popup},_openPopup:function(n){if(!(!this._popup||!this._map)){ze(n);var s=n.layer||n.target;if(this._popup._source===s&&!(s instanceof Fn)){this._map.hasLayer(this._popup)?this.closePopup():this.openPopup(n.latlng);return}this._popup._source=s,this.openPopup(n.latlng)}},_movePopup:function(n){this._popup.setLatLng(n.latlng)},_onKeyPress:function(n){n.originalEvent.keyCode===13&&this._openPopup(n)}});var Co=We.extend({options:{pane:"tooltipPane",offset:[0,0],direction:"auto",permanent:!1,sticky:!1,opacity:.9},onAdd:function(n){We.prototype.onAdd.call(this,n),this.setOpacity(this.options.opacity),n.fire("tooltipopen",{tooltip:this}),this._source&&(this.addEventParent(this._source),this._source.fire("tooltipopen",{tooltip:this},!0))},onRemove:function(n){We.prototype.onRemove.call(this,n),n.fire("tooltipclose",{tooltip:this}),this._source&&(this.removeEventParent(this._source),this._source.fire("tooltipclose",{tooltip:this},!0))},getEvents:function(){var n=We.prototype.getEvents.call(this);return this.options.permanent||(n.preclick=this.close),n},_initLayout:function(){var n="leaflet-tooltip",s=n+" "+(this.options.className||"")+" leaflet-zoom-"+(this._zoomAnimated?"animated":"hide");this._contentNode=this._container=mt("div",s),this._container.setAttribute("role","tooltip"),this._container.setAttribute("id","leaflet-tooltip-"+p(this))},_updateLayout:function(){},_adjustPan:function(){},_setPosition:function(n){var s,c,l=this._map,m=this._container,y=l.latLngToContainerPoint(l.getCenter()),I=l.layerPointToContainerPoint(n),M=this.options.direction,O=m.offsetWidth,U=m.offsetHeight,G=tt(this.options.offset),Q=this._getAnchor();M==="top"?(s=O/2,c=U):M==="bottom"?(s=O/2,c=0):M==="center"?(s=O/2,c=U/2):M==="right"?(s=0,c=U/2):M==="left"?(s=O,c=U/2):I.x<y.x?(M="right",s=0,c=U/2):(M="left",s=O+(G.x+Q.x)*2,c=U/2),n=n.subtract(tt(s,c,!0)).add(G).add(Q),At(m,"leaflet-tooltip-right"),At(m,"leaflet-tooltip-left"),At(m,"leaflet-tooltip-top"),At(m,"leaflet-tooltip-bottom"),$(m,"leaflet-tooltip-"+M),kt(m,n)},_updatePosition:function(){var n=this._map.latLngToLayerPoint(this._latlng);this._setPosition(n)},setOpacity:function(n){this.options.opacity=n,this._container&&le(this._container,n)},_animateZoom:function(n){var s=this._map._latLngToNewLayerPoint(this._latlng,n.zoom,n.center);this._setPosition(s)},_getAnchor:function(){return tt(this._source&&this._source._getTooltipAnchor&&!this.options.sticky?this._source._getTooltipAnchor():[0,0])}}),Fm=function(n,s){return new Co(n,s)};ut.include({openTooltip:function(n,s,c){return this._initOverlay(Co,n,s,c).openOn(this),this},closeTooltip:function(n){return n.close(),this}}),Ne.include({bindTooltip:function(n,s){return this._tooltip&&this.isTooltipOpen()&&this.unbindTooltip(),this._tooltip=this._initOverlay(Co,this._tooltip,n,s),this._initTooltipInteractions(),this._tooltip.options.permanent&&this._map&&this._map.hasLayer(this)&&this.openTooltip(),this},unbindTooltip:function(){return this._tooltip&&(this._initTooltipInteractions(!0),this.closeTooltip(),this._tooltip=null),this},_initTooltipInteractions:function(n){if(!(!n&&this._tooltipHandlersAdded)){var s=n?"off":"on",c={remove:this.closeTooltip,move:this._moveTooltip};this._tooltip.options.permanent?c.add=this._openTooltip:(c.mouseover=this._openTooltip,c.mouseout=this.closeTooltip,c.click=this._openTooltip,this._map?this._addFocusListeners():c.add=this._addFocusListeners),this._tooltip.options.sticky&&(c.mousemove=this._moveTooltip),this[s](c),this._tooltipHandlersAdded=!n}},openTooltip:function(n){return this._tooltip&&(this instanceof fn||(this._tooltip._source=this),this._tooltip._prepareOpen(n)&&(this._tooltip.openOn(this._map),this.getElement?this._setAriaDescribedByOnLayer(this):this.eachLayer&&this.eachLayer(this._setAriaDescribedByOnLayer,this))),this},closeTooltip:function(){if(this._tooltip)return this._tooltip.close()},toggleTooltip:function(){return this._tooltip&&this._tooltip.toggle(this),this},isTooltipOpen:function(){return this._tooltip.isOpen()},setTooltipContent:function(n){return this._tooltip&&this._tooltip.setContent(n),this},getTooltip:function(){return this._tooltip},_addFocusListeners:function(){this.getElement?this._addFocusListenersOnLayer(this):this.eachLayer&&this.eachLayer(this._addFocusListenersOnLayer,this)},_addFocusListenersOnLayer:function(n){var s=typeof n.getElement=="function"&&n.getElement();s&&(et(s,"focus",function(){this._tooltip._source=n,this.openTooltip()},this),et(s,"blur",this.closeTooltip,this))},_setAriaDescribedByOnLayer:function(n){var s=typeof n.getElement=="function"&&n.getElement();s&&s.setAttribute("aria-describedby",this._tooltip._container.id)},_openTooltip:function(n){if(!(!this._tooltip||!this._map)){if(this._map.dragging&&this._map.dragging.moving()&&!this._openOnceFlag){this._openOnceFlag=!0;var s=this;this._map.once("moveend",function(){s._openOnceFlag=!1,s._openTooltip(n)});return}this._tooltip._source=n.layer||n.target,this.openTooltip(this._tooltip.options.sticky?n.latlng:void 0)}},_moveTooltip:function(n){var s=n.latlng,c,l;this._tooltip.options.sticky&&n.originalEvent&&(c=this._map.mouseEventToContainerPoint(n.originalEvent),l=this._map.containerPointToLayerPoint(c),s=this._map.layerPointToLatLng(l)),this._tooltip.setLatLng(s)}});var Fc=ur.extend({options:{iconSize:[12,12],html:!1,bgPos:null,className:"leaflet-div-icon"},createIcon:function(n){var s=n&&n.tagName==="DIV"?n:document.createElement("div"),c=this.options;if(c.html instanceof Element?(oe(s),s.appendChild(c.html)):s.innerHTML=c.html!==!1?c.html:"",c.bgPos){var l=tt(c.bgPos);s.style.backgroundPosition=-l.x+"px "+-l.y+"px"}return this._setIconStyles(s,"icon"),s},createShadow:function(){return null}});function Um(n){return new Fc(n)}ur.Default=ms;var ps=Ne.extend({options:{tileSize:256,opacity:1,updateWhenIdle:Z.mobile,updateWhenZooming:!0,updateInterval:200,zIndex:1,bounds:null,minZoom:0,maxZoom:void 0,maxNativeZoom:void 0,minNativeZoom:void 0,noWrap:!1,pane:"tilePane",className:"",keepBuffer:2},initialize:function(n){B(this,n)},onAdd:function(){this._initContainer(),this._levels={},this._tiles={},this._resetView()},beforeAdd:function(n){n._addZoomLimit(this)},onRemove:function(n){this._removeAllTiles(),gt(this._container),n._removeZoomLimit(this),this._container=null,this._tileZoom=void 0},bringToFront:function(){return this._map&&(Ee(this._container),this._setAutoZIndex(Math.max)),this},bringToBack:function(){return this._map&&(Ie(this._container),this._setAutoZIndex(Math.min)),this},getContainer:function(){return this._container},setOpacity:function(n){return this.options.opacity=n,this._updateOpacity(),this},setZIndex:function(n){return this.options.zIndex=n,this._updateZIndex(),this},isLoading:function(){return this._loading},redraw:function(){if(this._map){this._removeAllTiles();var n=this._clampZoom(this._map.getZoom());n!==this._tileZoom&&(this._tileZoom=n,this._updateLevels()),this._update()}return this},getEvents:function(){var n={viewprereset:this._invalidateAll,viewreset:this._resetView,zoom:this._resetView,moveend:this._onMoveEnd};return this.options.updateWhenIdle||(this._onMove||(this._onMove=g(this._onMoveEnd,this.options.updateInterval,this)),n.move=this._onMove),this._zoomAnimated&&(n.zoomanim=this._animateZoom),n},createTile:function(){return document.createElement("div")},getTileSize:function(){var n=this.options.tileSize;return n instanceof J?n:new J(n,n)},_updateZIndex:function(){this._container&&this.options.zIndex!==void 0&&this.options.zIndex!==null&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(n){for(var s=this.getPane().children,c=-n(-1/0,1/0),l=0,m=s.length,y;l<m;l++)y=s[l].style.zIndex,s[l]!==this._container&&y&&(c=n(c,+y));isFinite(c)&&(this.options.zIndex=c+n(-1,1),this._updateZIndex())},_updateOpacity:function(){if(this._map&&!Z.ielt9){le(this._container,this.options.opacity);var n=+new Date,s=!1,c=!1;for(var l in this._tiles){var m=this._tiles[l];if(!(!m.current||!m.loaded)){var y=Math.min(1,(n-m.loaded)/200);le(m.el,y),y<1?s=!0:(m.active?c=!0:this._onOpaqueTile(m),m.active=!0)}}c&&!this._noPrune&&this._pruneTiles(),s&&(x(this._fadeFrame),this._fadeFrame=S(this._updateOpacity,this))}},_onOpaqueTile:T,_initContainer:function(){this._container||(this._container=mt("div","leaflet-layer "+(this.options.className||"")),this._updateZIndex(),this.options.opacity<1&&this._updateOpacity(),this.getPane().appendChild(this._container))},_updateLevels:function(){var n=this._tileZoom,s=this.options.maxZoom;if(n!==void 0){for(var c in this._levels)c=Number(c),this._levels[c].el.children.length||c===n?(this._levels[c].el.style.zIndex=s-Math.abs(n-c),this._onUpdateLevel(c)):(gt(this._levels[c].el),this._removeTilesAtZoom(c),this._onRemoveLevel(c),delete this._levels[c]);var l=this._levels[n],m=this._map;return l||(l=this._levels[n]={},l.el=mt("div","leaflet-tile-container leaflet-zoom-animated",this._container),l.el.style.zIndex=s,l.origin=m.project(m.unproject(m.getPixelOrigin()),n).round(),l.zoom=n,this._setZoomTransform(l,m.getCenter(),m.getZoom()),T(l.el.offsetWidth),this._onCreateLevel(l)),this._level=l,l}},_onUpdateLevel:T,_onRemoveLevel:T,_onCreateLevel:T,_pruneTiles:function(){if(this._map){var n,s,c=this._map.getZoom();if(c>this.options.maxZoom||c<this.options.minZoom){this._removeAllTiles();return}for(n in this._tiles)s=this._tiles[n],s.retain=s.current;for(n in this._tiles)if(s=this._tiles[n],s.current&&!s.active){var l=s.coords;this._retainParent(l.x,l.y,l.z,l.z-5)||this._retainChildren(l.x,l.y,l.z,l.z+2)}for(n in this._tiles)this._tiles[n].retain||this._removeTile(n)}},_removeTilesAtZoom:function(n){for(var s in this._tiles)this._tiles[s].coords.z===n&&this._removeTile(s)},_removeAllTiles:function(){for(var n in this._tiles)this._removeTile(n)},_invalidateAll:function(){for(var n in this._levels)gt(this._levels[n].el),this._onRemoveLevel(Number(n)),delete this._levels[n];this._removeAllTiles(),this._tileZoom=void 0},_retainParent:function(n,s,c,l){var m=Math.floor(n/2),y=Math.floor(s/2),I=c-1,M=new J(+m,+y);M.z=+I;var O=this._tileCoordsToKey(M),U=this._tiles[O];return U&&U.active?(U.retain=!0,!0):(U&&U.loaded&&(U.retain=!0),I>l?this._retainParent(m,y,I,l):!1)},_retainChildren:function(n,s,c,l){for(var m=2*n;m<2*n+2;m++)for(var y=2*s;y<2*s+2;y++){var I=new J(m,y);I.z=c+1;var M=this._tileCoordsToKey(I),O=this._tiles[M];if(O&&O.active){O.retain=!0;continue}else O&&O.loaded&&(O.retain=!0);c+1<l&&this._retainChildren(m,y,c+1,l)}},_resetView:function(n){var s=n&&(n.pinch||n.flyTo);this._setView(this._map.getCenter(),this._map.getZoom(),s,s)},_animateZoom:function(n){this._setView(n.center,n.zoom,!0,n.noUpdate)},_clampZoom:function(n){var s=this.options;return s.minNativeZoom!==void 0&&n<s.minNativeZoom?s.minNativeZoom:s.maxNativeZoom!==void 0&&s.maxNativeZoom<n?s.maxNativeZoom:n},_setView:function(n,s,c,l){var m=Math.round(s);this.options.maxZoom!==void 0&&m>this.options.maxZoom||this.options.minZoom!==void 0&&m<this.options.minZoom?m=void 0:m=this._clampZoom(m);var y=this.options.updateWhenZooming&&m!==this._tileZoom;(!l||y)&&(this._tileZoom=m,this._abortLoading&&this._abortLoading(),this._updateLevels(),this._resetGrid(),m!==void 0&&this._update(n),c||this._pruneTiles(),this._noPrune=!!c),this._setZoomTransforms(n,s)},_setZoomTransforms:function(n,s){for(var c in this._levels)this._setZoomTransform(this._levels[c],n,s)},_setZoomTransform:function(n,s,c){var l=this._map.getZoomScale(c,n.zoom),m=n.origin.multiplyBy(l).subtract(this._map._getNewPixelOrigin(s,c)).round();Z.any3d?cn(n.el,m,l):kt(n.el,m)},_resetGrid:function(){var n=this._map,s=n.options.crs,c=this._tileSize=this.getTileSize(),l=this._tileZoom,m=this._map.getPixelWorldBounds(this._tileZoom);m&&(this._globalTileRange=this._pxBoundsToTileRange(m)),this._wrapX=s.wrapLng&&!this.options.noWrap&&[Math.floor(n.project([0,s.wrapLng[0]],l).x/c.x),Math.ceil(n.project([0,s.wrapLng[1]],l).x/c.y)],this._wrapY=s.wrapLat&&!this.options.noWrap&&[Math.floor(n.project([s.wrapLat[0],0],l).y/c.x),Math.ceil(n.project([s.wrapLat[1],0],l).y/c.y)]},_onMoveEnd:function(){!this._map||this._map._animatingZoom||this._update()},_getTiledPixelBounds:function(n){var s=this._map,c=s._animatingZoom?Math.max(s._animateToZoom,s.getZoom()):s.getZoom(),l=s.getZoomScale(c,this._tileZoom),m=s.project(n,this._tileZoom).floor(),y=s.getSize().divideBy(l*2);return new Pt(m.subtract(y),m.add(y))},_update:function(n){var s=this._map;if(s){var c=this._clampZoom(s.getZoom());if(n===void 0&&(n=s.getCenter()),this._tileZoom!==void 0){var l=this._getTiledPixelBounds(n),m=this._pxBoundsToTileRange(l),y=m.getCenter(),I=[],M=this.options.keepBuffer,O=new Pt(m.getBottomLeft().subtract([M,-M]),m.getTopRight().add([M,-M]));if(!(isFinite(m.min.x)&&isFinite(m.min.y)&&isFinite(m.max.x)&&isFinite(m.max.y)))throw new Error("Attempted to load an infinite number of tiles");for(var U in this._tiles){var G=this._tiles[U].coords;(G.z!==this._tileZoom||!O.contains(new J(G.x,G.y)))&&(this._tiles[U].current=!1)}if(Math.abs(c-this._tileZoom)>1){this._setView(n,c);return}for(var Q=m.min.y;Q<=m.max.y;Q++)for(var ct=m.min.x;ct<=m.max.x;ct++){var ue=new J(ct,Q);if(ue.z=this._tileZoom,!!this._isValidTile(ue)){var $t=this._tiles[this._tileCoordsToKey(ue)];$t?$t.current=!0:I.push(ue)}}if(I.sort(function(fe,dr){return fe.distanceTo(y)-dr.distanceTo(y)}),I.length!==0){this._loading||(this._loading=!0,this.fire("loading"));var Se=document.createDocumentFragment();for(ct=0;ct<I.length;ct++)this._addTile(I[ct],Se);this._level.el.appendChild(Se)}}}},_isValidTile:function(n){var s=this._map.options.crs;if(!s.infinite){var c=this._globalTileRange;if(!s.wrapLng&&(n.x<c.min.x||n.x>c.max.x)||!s.wrapLat&&(n.y<c.min.y||n.y>c.max.y))return!1}if(!this.options.bounds)return!0;var l=this._tileCoordsToBounds(n);return bt(this.options.bounds).overlaps(l)},_keyToBounds:function(n){return this._tileCoordsToBounds(this._keyToTileCoords(n))},_tileCoordsToNwSe:function(n){var s=this._map,c=this.getTileSize(),l=n.scaleBy(c),m=l.add(c),y=s.unproject(l,n.z),I=s.unproject(m,n.z);return[y,I]},_tileCoordsToBounds:function(n){var s=this._tileCoordsToNwSe(n),c=new Qt(s[0],s[1]);return this.options.noWrap||(c=this._map.wrapLatLngBounds(c)),c},_tileCoordsToKey:function(n){return n.x+":"+n.y+":"+n.z},_keyToTileCoords:function(n){var s=n.split(":"),c=new J(+s[0],+s[1]);return c.z=+s[2],c},_removeTile:function(n){var s=this._tiles[n];s&&(gt(s.el),delete this._tiles[n],this.fire("tileunload",{tile:s.el,coords:this._keyToTileCoords(n)}))},_initTile:function(n){$(n,"leaflet-tile");var s=this.getTileSize();n.style.width=s.x+"px",n.style.height=s.y+"px",n.onselectstart=T,n.onmousemove=T,Z.ielt9&&this.options.opacity<1&&le(n,this.options.opacity)},_addTile:function(n,s){var c=this._getTilePos(n),l=this._tileCoordsToKey(n),m=this.createTile(this._wrapCoords(n),h(this._tileReady,this,n));this._initTile(m),this.createTile.length<2&&S(h(this._tileReady,this,n,null,m)),kt(m,c),this._tiles[l]={el:m,coords:n,current:!0},s.appendChild(m),this.fire("tileloadstart",{tile:m,coords:n})},_tileReady:function(n,s,c){s&&this.fire("tileerror",{error:s,tile:c,coords:n});var l=this._tileCoordsToKey(n);c=this._tiles[l],c&&(c.loaded=+new Date,this._map._fadeAnimated?(le(c.el,0),x(this._fadeFrame),this._fadeFrame=S(this._updateOpacity,this)):(c.active=!0,this._pruneTiles()),s||($(c.el,"leaflet-tile-loaded"),this.fire("tileload",{tile:c.el,coords:n})),this._noTilesToLoad()&&(this._loading=!1,this.fire("load"),Z.ielt9||!this._map._fadeAnimated?S(this._pruneTiles,this):setTimeout(h(this._pruneTiles,this),250)))},_getTilePos:function(n){return n.scaleBy(this.getTileSize()).subtract(this._level.origin)},_wrapCoords:function(n){var s=new J(this._wrapX?w(n.x,this._wrapX):n.x,this._wrapY?w(n.y,this._wrapY):n.y);return s.z=n.z,s},_pxBoundsToTileRange:function(n){var s=this.getTileSize();return new Pt(n.min.unscaleBy(s).floor(),n.max.unscaleBy(s).ceil().subtract([1,1]))},_noTilesToLoad:function(){for(var n in this._tiles)if(!this._tiles[n].loaded)return!1;return!0}});function Bm(n){return new ps(n)}var lr=ps.extend({options:{minZoom:0,maxZoom:18,subdomains:"abc",errorTileUrl:"",zoomOffset:0,tms:!1,zoomReverse:!1,detectRetina:!1,crossOrigin:!1,referrerPolicy:!1},initialize:function(n,s){this._url=n,s=B(this,s),s.detectRetina&&Z.retina&&s.maxZoom>0?(s.tileSize=Math.floor(s.tileSize/2),s.zoomReverse?(s.zoomOffset--,s.minZoom=Math.min(s.maxZoom,s.minZoom+1)):(s.zoomOffset++,s.maxZoom=Math.max(s.minZoom,s.maxZoom-1)),s.minZoom=Math.max(0,s.minZoom)):s.zoomReverse?s.minZoom=Math.min(s.maxZoom,s.minZoom):s.maxZoom=Math.max(s.minZoom,s.maxZoom),typeof s.subdomains=="string"&&(s.subdomains=s.subdomains.split("")),this.on("tileunload",this._onTileRemove)},setUrl:function(n,s){return this._url===n&&s===void 0&&(s=!0),this._url=n,s||this.redraw(),this},createTile:function(n,s){var c=document.createElement("img");return et(c,"load",h(this._tileOnLoad,this,s,c)),et(c,"error",h(this._tileOnError,this,s,c)),(this.options.crossOrigin||this.options.crossOrigin==="")&&(c.crossOrigin=this.options.crossOrigin===!0?"":this.options.crossOrigin),typeof this.options.referrerPolicy=="string"&&(c.referrerPolicy=this.options.referrerPolicy),c.alt="",c.src=this.getTileUrl(n),c},getTileUrl:function(n){var s={r:Z.retina?"@2x":"",s:this._getSubdomain(n),x:n.x,y:n.y,z:this._getZoomForUrl()};if(this._map&&!this._map.options.crs.infinite){var c=this._globalTileRange.max.y-n.y;this.options.tms&&(s.y=c),s["-y"]=c}return ot(this._url,o(s,this.options))},_tileOnLoad:function(n,s){Z.ielt9?setTimeout(h(n,this,null,s),0):n(null,s)},_tileOnError:function(n,s,c){var l=this.options.errorTileUrl;l&&s.getAttribute("src")!==l&&(s.src=l),n(c,s)},_onTileRemove:function(n){n.tile.onload=null},_getZoomForUrl:function(){var n=this._tileZoom,s=this.options.maxZoom,c=this.options.zoomReverse,l=this.options.zoomOffset;return c&&(n=s-n),n+l},_getSubdomain:function(n){var s=Math.abs(n.x+n.y)%this.options.subdomains.length;return this.options.subdomains[s]},_abortLoading:function(){var n,s;for(n in this._tiles)if(this._tiles[n].coords.z!==this._tileZoom&&(s=this._tiles[n].el,s.onload=T,s.onerror=T,!s.complete)){s.src=Ht;var c=this._tiles[n].coords;gt(s),delete this._tiles[n],this.fire("tileabort",{tile:s,coords:c})}},_removeTile:function(n){var s=this._tiles[n];if(s)return s.el.setAttribute("src",Ht),ps.prototype._removeTile.call(this,n)},_tileReady:function(n,s,c){if(!(!this._map||c&&c.getAttribute("src")===Ht))return ps.prototype._tileReady.call(this,n,s,c)}});function Uc(n,s){return new lr(n,s)}var Bc=lr.extend({defaultWmsParams:{service:"WMS",request:"GetMap",layers:"",styles:"",format:"image/jpeg",transparent:!1,version:"1.1.1"},options:{crs:null,uppercase:!1},initialize:function(n,s){this._url=n;var c=o({},this.defaultWmsParams);for(var l in s)l in this.options||(c[l]=s[l]);s=B(this,s);var m=s.detectRetina&&Z.retina?2:1,y=this.getTileSize();c.width=y.x*m,c.height=y.y*m,this.wmsParams=c},onAdd:function(n){this._crs=this.options.crs||n.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var s=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[s]=this._crs.code,lr.prototype.onAdd.call(this,n)},getTileUrl:function(n){var s=this._tileCoordsToNwSe(n),c=this._crs,l=Kt(c.project(s[0]),c.project(s[1])),m=l.min,y=l.max,I=(this._wmsVersion>=1.3&&this._crs===or?[m.y,m.x,y.y,y.x]:[m.x,m.y,y.x,y.y]).join(","),M=lr.prototype.getTileUrl.call(this,n);return M+q(this.wmsParams,M,this.options.uppercase)+(this.options.uppercase?"&BBOX=":"&bbox=")+I},setParams:function(n,s){return o(this.wmsParams,n),s||this.redraw(),this}});function zm(n,s){return new Bc(n,s)}lr.WMS=Bc,Uc.wms=zm;var _n=Ne.extend({options:{padding:.1},initialize:function(n){B(this,n),p(this),this._layers=this._layers||{}},onAdd:function(){this._container||(this._initContainer(),$(this._container,"leaflet-zoom-animated")),this.getPane().appendChild(this._container),this._update(),this.on("update",this._updatePaths,this)},onRemove:function(){this.off("update",this._updatePaths,this),this._destroyContainer()},getEvents:function(){var n={viewreset:this._reset,zoom:this._onZoom,moveend:this._update,zoomend:this._onZoomEnd};return this._zoomAnimated&&(n.zoomanim=this._onAnimZoom),n},_onAnimZoom:function(n){this._updateTransform(n.center,n.zoom)},_onZoom:function(){this._updateTransform(this._map.getCenter(),this._map.getZoom())},_updateTransform:function(n,s){var c=this._map.getZoomScale(s,this._zoom),l=this._map.getSize().multiplyBy(.5+this.options.padding),m=this._map.project(this._center,s),y=l.multiplyBy(-c).add(m).subtract(this._map._getNewPixelOrigin(n,s));Z.any3d?cn(this._container,y,c):kt(this._container,y)},_reset:function(){this._update(),this._updateTransform(this._center,this._zoom);for(var n in this._layers)this._layers[n]._reset()},_onZoomEnd:function(){for(var n in this._layers)this._layers[n]._project()},_updatePaths:function(){for(var n in this._layers)this._layers[n]._update()},_update:function(){var n=this.options.padding,s=this._map.getSize(),c=this._map.containerPointToLayerPoint(s.multiplyBy(-n)).round();this._bounds=new Pt(c,c.add(s.multiplyBy(1+n*2)).round()),this._center=this._map.getCenter(),this._zoom=this._map.getZoom()}}),zc=_n.extend({options:{tolerance:0},getEvents:function(){var n=_n.prototype.getEvents.call(this);return n.viewprereset=this._onViewPreReset,n},_onViewPreReset:function(){this._postponeUpdatePaths=!0},onAdd:function(){_n.prototype.onAdd.call(this),this._draw()},_initContainer:function(){var n=this._container=document.createElement("canvas");et(n,"mousemove",this._onMouseMove,this),et(n,"click dblclick mousedown mouseup contextmenu",this._onClick,this),et(n,"mouseout",this._handleMouseOut,this),n._leaflet_disable_events=!0,this._ctx=n.getContext("2d")},_destroyContainer:function(){x(this._redrawRequest),delete this._ctx,gt(this._container),Et(this._container),delete this._container},_updatePaths:function(){if(!this._postponeUpdatePaths){var n;this._redrawBounds=null;for(var s in this._layers)n=this._layers[s],n._update();this._redraw()}},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){_n.prototype._update.call(this);var n=this._bounds,s=this._container,c=n.getSize(),l=Z.retina?2:1;kt(s,n.min),s.width=l*c.x,s.height=l*c.y,s.style.width=c.x+"px",s.style.height=c.y+"px",Z.retina&&this._ctx.scale(2,2),this._ctx.translate(-n.min.x,-n.min.y),this.fire("update")}},_reset:function(){_n.prototype._reset.call(this),this._postponeUpdatePaths&&(this._postponeUpdatePaths=!1,this._updatePaths())},_initPath:function(n){this._updateDashArray(n),this._layers[p(n)]=n;var s=n._order={layer:n,prev:this._drawLast,next:null};this._drawLast&&(this._drawLast.next=s),this._drawLast=s,this._drawFirst=this._drawFirst||this._drawLast},_addPath:function(n){this._requestRedraw(n)},_removePath:function(n){var s=n._order,c=s.next,l=s.prev;c?c.prev=l:this._drawLast=l,l?l.next=c:this._drawFirst=c,delete n._order,delete this._layers[p(n)],this._requestRedraw(n)},_updatePath:function(n){this._extendRedrawBounds(n),n._project(),n._update(),this._requestRedraw(n)},_updateStyle:function(n){this._updateDashArray(n),this._requestRedraw(n)},_updateDashArray:function(n){if(typeof n.options.dashArray=="string"){var s=n.options.dashArray.split(/[, ]+/),c=[],l,m;for(m=0;m<s.length;m++){if(l=Number(s[m]),isNaN(l))return;c.push(l)}n.options._dashArray=c}else n.options._dashArray=n.options.dashArray},_requestRedraw:function(n){this._map&&(this._extendRedrawBounds(n),this._redrawRequest=this._redrawRequest||S(this._redraw,this))},_extendRedrawBounds:function(n){if(n._pxBounds){var s=(n.options.weight||0)+1;this._redrawBounds=this._redrawBounds||new Pt,this._redrawBounds.extend(n._pxBounds.min.subtract([s,s])),this._redrawBounds.extend(n._pxBounds.max.add([s,s]))}},_redraw:function(){this._redrawRequest=null,this._redrawBounds&&(this._redrawBounds.min._floor(),this._redrawBounds.max._ceil()),this._clear(),this._draw(),this._redrawBounds=null},_clear:function(){var n=this._redrawBounds;if(n){var s=n.getSize();this._ctx.clearRect(n.min.x,n.min.y,s.x,s.y)}else this._ctx.save(),this._ctx.setTransform(1,0,0,1,0,0),this._ctx.clearRect(0,0,this._container.width,this._container.height),this._ctx.restore()},_draw:function(){var n,s=this._redrawBounds;if(this._ctx.save(),s){var c=s.getSize();this._ctx.beginPath(),this._ctx.rect(s.min.x,s.min.y,c.x,c.y),this._ctx.clip()}this._drawing=!0;for(var l=this._drawFirst;l;l=l.next)n=l.layer,(!s||n._pxBounds&&n._pxBounds.intersects(s))&&n._updatePath();this._drawing=!1,this._ctx.restore()},_updatePoly:function(n,s){if(this._drawing){var c,l,m,y,I=n._parts,M=I.length,O=this._ctx;if(M){for(O.beginPath(),c=0;c<M;c++){for(l=0,m=I[c].length;l<m;l++)y=I[c][l],O[l?"lineTo":"moveTo"](y.x,y.y);s&&O.closePath()}this._fillStroke(O,n)}}},_updateCircle:function(n){if(!(!this._drawing||n._empty())){var s=n._point,c=this._ctx,l=Math.max(Math.round(n._radius),1),m=(Math.max(Math.round(n._radiusY),1)||l)/l;m!==1&&(c.save(),c.scale(1,m)),c.beginPath(),c.arc(s.x,s.y/m,l,0,Math.PI*2,!1),m!==1&&c.restore(),this._fillStroke(c,n)}},_fillStroke:function(n,s){var c=s.options;c.fill&&(n.globalAlpha=c.fillOpacity,n.fillStyle=c.fillColor||c.color,n.fill(c.fillRule||"evenodd")),c.stroke&&c.weight!==0&&(n.setLineDash&&n.setLineDash(s.options&&s.options._dashArray||[]),n.globalAlpha=c.opacity,n.lineWidth=c.weight,n.strokeStyle=c.color,n.lineCap=c.lineCap,n.lineJoin=c.lineJoin,n.stroke())},_onClick:function(n){for(var s=this._map.mouseEventToLayerPoint(n),c,l,m=this._drawFirst;m;m=m.next)c=m.layer,c.options.interactive&&c._containsPoint(s)&&(!(n.type==="click"||n.type==="preclick")||!this._map._draggableMoved(c))&&(l=c);this._fireEvent(l?[l]:!1,n)},_onMouseMove:function(n){if(!(!this._map||this._map.dragging.moving()||this._map._animatingZoom)){var s=this._map.mouseEventToLayerPoint(n);this._handleMouseHover(n,s)}},_handleMouseOut:function(n){var s=this._hoveredLayer;s&&(At(this._container,"leaflet-interactive"),this._fireEvent([s],n,"mouseout"),this._hoveredLayer=null,this._mouseHoverThrottled=!1)},_handleMouseHover:function(n,s){if(!this._mouseHoverThrottled){for(var c,l,m=this._drawFirst;m;m=m.next)c=m.layer,c.options.interactive&&c._containsPoint(s)&&(l=c);l!==this._hoveredLayer&&(this._handleMouseOut(n),l&&($(this._container,"leaflet-interactive"),this._fireEvent([l],n,"mouseover"),this._hoveredLayer=l)),this._fireEvent(this._hoveredLayer?[this._hoveredLayer]:!1,n),this._mouseHoverThrottled=!0,setTimeout(h(function(){this._mouseHoverThrottled=!1},this),32)}},_fireEvent:function(n,s,c){this._map._fireDOMEvent(s,c||s.type,n)},_bringToFront:function(n){var s=n._order;if(s){var c=s.next,l=s.prev;if(c)c.prev=l;else return;l?l.next=c:c&&(this._drawFirst=c),s.prev=this._drawLast,this._drawLast.next=s,s.next=null,this._drawLast=s,this._requestRedraw(n)}},_bringToBack:function(n){var s=n._order;if(s){var c=s.next,l=s.prev;if(l)l.next=c;else return;c?c.prev=l:l&&(this._drawLast=l),s.prev=null,s.next=this._drawFirst,this._drawFirst.prev=s,this._drawFirst=s,this._requestRedraw(n)}}});function qc(n){return Z.canvas?new zc(n):null}var _s=function(){try{return document.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(n){return document.createElement("<lvml:"+n+' class="lvml">')}}catch{}return function(n){return document.createElement("<"+n+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}(),qm={_initContainer:function(){this._container=mt("div","leaflet-vml-container")},_update:function(){this._map._animatingZoom||(_n.prototype._update.call(this),this.fire("update"))},_initPath:function(n){var s=n._container=_s("shape");$(s,"leaflet-vml-shape "+(this.options.className||"")),s.coordsize="1 1",n._path=_s("path"),s.appendChild(n._path),this._updateStyle(n),this._layers[p(n)]=n},_addPath:function(n){var s=n._container;this._container.appendChild(s),n.options.interactive&&n.addInteractiveTarget(s)},_removePath:function(n){var s=n._container;gt(s),n.removeInteractiveTarget(s),delete this._layers[p(n)]},_updateStyle:function(n){var s=n._stroke,c=n._fill,l=n.options,m=n._container;m.stroked=!!l.stroke,m.filled=!!l.fill,l.stroke?(s||(s=n._stroke=_s("stroke")),m.appendChild(s),s.weight=l.weight+"px",s.color=l.color,s.opacity=l.opacity,l.dashArray?s.dashStyle=st(l.dashArray)?l.dashArray.join(" "):l.dashArray.replace(/( *, *)/g," "):s.dashStyle="",s.endcap=l.lineCap.replace("butt","flat"),s.joinstyle=l.lineJoin):s&&(m.removeChild(s),n._stroke=null),l.fill?(c||(c=n._fill=_s("fill")),m.appendChild(c),c.color=l.fillColor||l.color,c.opacity=l.fillOpacity):c&&(m.removeChild(c),n._fill=null)},_updateCircle:function(n){var s=n._point.round(),c=Math.round(n._radius),l=Math.round(n._radiusY||c);this._setPath(n,n._empty()?"M0 0":"AL "+s.x+","+s.y+" "+c+","+l+" 0,"+65535*360)},_setPath:function(n,s){n._path.v=s},_bringToFront:function(n){Ee(n._container)},_bringToBack:function(n){Ie(n._container)}},Ro=Z.vml?_s:Ys,gs=_n.extend({_initContainer:function(){this._container=Ro("svg"),this._container.setAttribute("pointer-events","none"),this._rootGroup=Ro("g"),this._container.appendChild(this._rootGroup)},_destroyContainer:function(){gt(this._container),Et(this._container),delete this._container,delete this._rootGroup,delete this._svgSize},_update:function(){if(!(this._map._animatingZoom&&this._bounds)){_n.prototype._update.call(this);var n=this._bounds,s=n.getSize(),c=this._container;(!this._svgSize||!this._svgSize.equals(s))&&(this._svgSize=s,c.setAttribute("width",s.x),c.setAttribute("height",s.y)),kt(c,n.min),c.setAttribute("viewBox",[n.min.x,n.min.y,s.x,s.y].join(" ")),this.fire("update")}},_initPath:function(n){var s=n._path=Ro("path");n.options.className&&$(s,n.options.className),n.options.interactive&&$(s,"leaflet-interactive"),this._updateStyle(n),this._layers[p(n)]=n},_addPath:function(n){this._rootGroup||this._initContainer(),this._rootGroup.appendChild(n._path),n.addInteractiveTarget(n._path)},_removePath:function(n){gt(n._path),n.removeInteractiveTarget(n._path),delete this._layers[p(n)]},_updatePath:function(n){n._project(),n._update()},_updateStyle:function(n){var s=n._path,c=n.options;s&&(c.stroke?(s.setAttribute("stroke",c.color),s.setAttribute("stroke-opacity",c.opacity),s.setAttribute("stroke-width",c.weight),s.setAttribute("stroke-linecap",c.lineCap),s.setAttribute("stroke-linejoin",c.lineJoin),c.dashArray?s.setAttribute("stroke-dasharray",c.dashArray):s.removeAttribute("stroke-dasharray"),c.dashOffset?s.setAttribute("stroke-dashoffset",c.dashOffset):s.removeAttribute("stroke-dashoffset")):s.setAttribute("stroke","none"),c.fill?(s.setAttribute("fill",c.fillColor||c.color),s.setAttribute("fill-opacity",c.fillOpacity),s.setAttribute("fill-rule",c.fillRule||"evenodd")):s.setAttribute("fill","none"))},_updatePoly:function(n,s){this._setPath(n,Ui(n._parts,s))},_updateCircle:function(n){var s=n._point,c=Math.max(Math.round(n._radius),1),l=Math.max(Math.round(n._radiusY),1)||c,m="a"+c+","+l+" 0 1,0 ",y=n._empty()?"M0 0":"M"+(s.x-c)+","+s.y+m+c*2+",0 "+m+-c*2+",0 ";this._setPath(n,y)},_setPath:function(n,s){n._path.setAttribute("d",s)},_bringToFront:function(n){Ee(n._path)},_bringToBack:function(n){Ie(n._path)}});Z.vml&&gs.include(qm);function Hc(n){return Z.svg||Z.vml?new gs(n):null}ut.include({getRenderer:function(n){var s=n.options.renderer||this._getPaneRenderer(n.options.pane)||this.options.renderer||this._renderer;return s||(s=this._renderer=this._createRenderer()),this.hasLayer(s)||this.addLayer(s),s},_getPaneRenderer:function(n){if(n==="overlayPane"||n===void 0)return!1;var s=this._paneRenderers[n];return s===void 0&&(s=this._createRenderer({pane:n}),this._paneRenderers[n]=s),s},_createRenderer:function(n){return this.options.preferCanvas&&qc(n)||Hc(n)}});var jc=cr.extend({initialize:function(n,s){cr.prototype.initialize.call(this,this._boundsToLatLngs(n),s)},setBounds:function(n){return this.setLatLngs(this._boundsToLatLngs(n))},_boundsToLatLngs:function(n){return n=bt(n),[n.getSouthWest(),n.getNorthWest(),n.getNorthEast(),n.getSouthEast()]}});function Hm(n,s){return new jc(n,s)}gs.create=Ro,gs.pointsToPath=Ui,pn.geometryToLayer=Eo,pn.coordsToLatLng=Wa,pn.coordsToLatLngs=Io,pn.latLngToCoords=$a,pn.latLngsToCoords=Po,pn.getFeature=hr,pn.asFeature=Ao,ut.mergeOptions({boxZoom:!0});var Gc=ye.extend({initialize:function(n){this._map=n,this._container=n._container,this._pane=n._panes.overlayPane,this._resetStateTimeout=0,n.on("unload",this._destroy,this)},addHooks:function(){et(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){Et(this._container,"mousedown",this._onMouseDown,this)},moved:function(){return this._moved},_destroy:function(){gt(this._pane),delete this._pane},_resetState:function(){this._resetStateTimeout=0,this._moved=!1},_clearDeferredResetState:function(){this._resetStateTimeout!==0&&(clearTimeout(this._resetStateTimeout),this._resetStateTimeout=0)},_onMouseDown:function(n){if(!n.shiftKey||n.which!==1&&n.button!==1)return!1;this._clearDeferredResetState(),this._resetState(),xe(),Qi(),this._startPoint=this._map.mouseEventToContainerPoint(n),et(document,{contextmenu:ze,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseMove:function(n){this._moved||(this._moved=!0,this._box=mt("div","leaflet-zoom-box",this._container),$(this._container,"leaflet-crosshair"),this._map.fire("boxzoomstart")),this._point=this._map.mouseEventToContainerPoint(n);var s=new Pt(this._point,this._startPoint),c=s.getSize();kt(this._box,s.min),this._box.style.width=c.x+"px",this._box.style.height=c.y+"px"},_finish:function(){this._moved&&(gt(this._box),At(this._container,"leaflet-crosshair")),ge(),Yi(),Et(document,{contextmenu:ze,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseUp:function(n){if(!(n.which!==1&&n.button!==1)&&(this._finish(),!!this._moved)){this._clearDeferredResetState(),this._resetStateTimeout=setTimeout(h(this._resetState,this),0);var s=new Qt(this._map.containerPointToLatLng(this._startPoint),this._map.containerPointToLatLng(this._point));this._map.fitBounds(s).fire("boxzoomend",{boxZoomBounds:s})}},_onKeyDown:function(n){n.keyCode===27&&(this._finish(),this._clearDeferredResetState(),this._resetState())}});ut.addInitHook("addHandler","boxZoom",Gc),ut.mergeOptions({doubleClickZoom:!0});var Wc=ye.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(n){var s=this._map,c=s.getZoom(),l=s.options.zoomDelta,m=n.originalEvent.shiftKey?c-l:c+l;s.options.doubleClickZoom==="center"?s.setZoom(m):s.setZoomAround(n.containerPoint,m)}});ut.addInitHook("addHandler","doubleClickZoom",Wc),ut.mergeOptions({dragging:!0,inertia:!0,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,easeLinearity:.2,worldCopyJump:!1,maxBoundsViscosity:0});var $c=ye.extend({addHooks:function(){if(!this._draggable){var n=this._map;this._draggable=new ke(n._mapPane,n._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),this._draggable.on("predrag",this._onPreDragLimit,this),n.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDragWrap,this),n.on("zoomend",this._onZoomEnd,this),n.whenReady(this._onZoomEnd,this))}$(this._map._container,"leaflet-grab leaflet-touch-drag"),this._draggable.enable(),this._positions=[],this._times=[]},removeHooks:function(){At(this._map._container,"leaflet-grab"),At(this._map._container,"leaflet-touch-drag"),this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},moving:function(){return this._draggable&&this._draggable._moving},_onDragStart:function(){var n=this._map;if(n._stop(),this._map.options.maxBounds&&this._map.options.maxBoundsViscosity){var s=bt(this._map.options.maxBounds);this._offsetLimit=Kt(this._map.latLngToContainerPoint(s.getNorthWest()).multiplyBy(-1),this._map.latLngToContainerPoint(s.getSouthEast()).multiplyBy(-1).add(this._map.getSize())),this._viscosity=Math.min(1,Math.max(0,this._map.options.maxBoundsViscosity))}else this._offsetLimit=null;n.fire("movestart").fire("dragstart"),n.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(n){if(this._map.options.inertia){var s=this._lastTime=+new Date,c=this._lastPos=this._draggable._absPos||this._draggable._newPos;this._positions.push(c),this._times.push(s),this._prunePositions(s)}this._map.fire("move",n).fire("drag",n)},_prunePositions:function(n){for(;this._positions.length>1&&n-this._times[0]>50;)this._positions.shift(),this._times.shift()},_onZoomEnd:function(){var n=this._map.getSize().divideBy(2),s=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=s.subtract(n).x,this._worldWidth=this._map.getPixelWorldBounds().getSize().x},_viscousLimit:function(n,s){return n-(n-s)*this._viscosity},_onPreDragLimit:function(){if(!(!this._viscosity||!this._offsetLimit)){var n=this._draggable._newPos.subtract(this._draggable._startPos),s=this._offsetLimit;n.x<s.min.x&&(n.x=this._viscousLimit(n.x,s.min.x)),n.y<s.min.y&&(n.y=this._viscousLimit(n.y,s.min.y)),n.x>s.max.x&&(n.x=this._viscousLimit(n.x,s.max.x)),n.y>s.max.y&&(n.y=this._viscousLimit(n.y,s.max.y)),this._draggable._newPos=this._draggable._startPos.add(n)}},_onPreDragWrap:function(){var n=this._worldWidth,s=Math.round(n/2),c=this._initialWorldOffset,l=this._draggable._newPos.x,m=(l-s+c)%n+s-c,y=(l+s+c)%n-s-c,I=Math.abs(m+c)<Math.abs(y+c)?m:y;this._draggable._absPos=this._draggable._newPos.clone(),this._draggable._newPos.x=I},_onDragEnd:function(n){var s=this._map,c=s.options,l=!c.inertia||n.noInertia||this._times.length<2;if(s.fire("dragend",n),l)s.fire("moveend");else{this._prunePositions(+new Date);var m=this._lastPos.subtract(this._positions[0]),y=(this._lastTime-this._times[0])/1e3,I=c.easeLinearity,M=m.multiplyBy(I/y),O=M.distanceTo([0,0]),U=Math.min(c.inertiaMaxSpeed,O),G=M.multiplyBy(U/O),Q=U/(c.inertiaDeceleration*I),ct=G.multiplyBy(-Q/2).round();!ct.x&&!ct.y?s.fire("moveend"):(ct=s._limitOffset(ct,s.options.maxBounds),S(function(){s.panBy(ct,{duration:Q,easeLinearity:I,noMoveStart:!0,animate:!0})}))}}});ut.addInitHook("addHandler","dragging",$c),ut.mergeOptions({keyboard:!0,keyboardPanDelta:80});var Zc=ye.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,54,173]},initialize:function(n){this._map=n,this._setPanDelta(n.options.keyboardPanDelta),this._setZoomDelta(n.options.zoomDelta)},addHooks:function(){var n=this._map._container;n.tabIndex<=0&&(n.tabIndex="0"),et(n,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.on({focus:this._addHooks,blur:this._removeHooks},this)},removeHooks:function(){this._removeHooks(),Et(this._map._container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.off({focus:this._addHooks,blur:this._removeHooks},this)},_onMouseDown:function(){if(!this._focused){var n=document.body,s=document.documentElement,c=n.scrollTop||s.scrollTop,l=n.scrollLeft||s.scrollLeft;this._map._container.focus(),window.scrollTo(l,c)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanDelta:function(n){var s=this._panKeys={},c=this.keyCodes,l,m;for(l=0,m=c.left.length;l<m;l++)s[c.left[l]]=[-1*n,0];for(l=0,m=c.right.length;l<m;l++)s[c.right[l]]=[n,0];for(l=0,m=c.down.length;l<m;l++)s[c.down[l]]=[0,n];for(l=0,m=c.up.length;l<m;l++)s[c.up[l]]=[0,-1*n]},_setZoomDelta:function(n){var s=this._zoomKeys={},c=this.keyCodes,l,m;for(l=0,m=c.zoomIn.length;l<m;l++)s[c.zoomIn[l]]=n;for(l=0,m=c.zoomOut.length;l<m;l++)s[c.zoomOut[l]]=-n},_addHooks:function(){et(document,"keydown",this._onKeyDown,this)},_removeHooks:function(){Et(document,"keydown",this._onKeyDown,this)},_onKeyDown:function(n){if(!(n.altKey||n.ctrlKey||n.metaKey)){var s=n.keyCode,c=this._map,l;if(s in this._panKeys){if(!c._panAnim||!c._panAnim._inProgress)if(l=this._panKeys[s],n.shiftKey&&(l=tt(l).multiplyBy(3)),c.options.maxBounds&&(l=c._limitOffset(tt(l),c.options.maxBounds)),c.options.worldCopyJump){var m=c.wrapLatLng(c.unproject(c.project(c.getCenter()).add(l)));c.panTo(m)}else c.panBy(l)}else if(s in this._zoomKeys)c.setZoom(c.getZoom()+(n.shiftKey?3:1)*this._zoomKeys[s]);else if(s===27&&c._popup&&c._popup.options.closeOnEscapeKey)c.closePopup();else return;ze(n)}}});ut.addInitHook("addHandler","keyboard",Zc),ut.mergeOptions({scrollWheelZoom:!0,wheelDebounceTime:40,wheelPxPerZoomLevel:60});var Kc=ye.extend({addHooks:function(){et(this._map._container,"wheel",this._onWheelScroll,this),this._delta=0},removeHooks:function(){Et(this._map._container,"wheel",this._onWheelScroll,this)},_onWheelScroll:function(n){var s=ss(n),c=this._map.options.wheelDebounceTime;this._delta+=s,this._lastMousePos=this._map.mouseEventToContainerPoint(n),this._startTime||(this._startTime=+new Date);var l=Math.max(c-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(h(this._performZoom,this),l),ze(n)},_performZoom:function(){var n=this._map,s=n.getZoom(),c=this._map.options.zoomSnap||0;n._stop();var l=this._delta/(this._map.options.wheelPxPerZoomLevel*4),m=4*Math.log(2/(1+Math.exp(-Math.abs(l))))/Math.LN2,y=c?Math.ceil(m/c)*c:m,I=n._limitZoom(s+(this._delta>0?y:-y))-s;this._delta=0,this._startTime=null,I&&(n.options.scrollWheelZoom==="center"?n.setZoom(s+I):n.setZoomAround(this._lastMousePos,s+I))}});ut.addInitHook("addHandler","scrollWheelZoom",Kc);var jm=600;ut.mergeOptions({tapHold:Z.touchNative&&Z.safari&&Z.mobile,tapTolerance:15});var Qc=ye.extend({addHooks:function(){et(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){Et(this._map._container,"touchstart",this._onDown,this)},_onDown:function(n){if(clearTimeout(this._holdTimeout),n.touches.length===1){var s=n.touches[0];this._startPos=this._newPos=new J(s.clientX,s.clientY),this._holdTimeout=setTimeout(h(function(){this._cancel(),this._isTapValid()&&(et(document,"touchend",Dt),et(document,"touchend touchcancel",this._cancelClickPrevent),this._simulateEvent("contextmenu",s))},this),jm),et(document,"touchend touchcancel contextmenu",this._cancel,this),et(document,"touchmove",this._onMove,this)}},_cancelClickPrevent:function n(){Et(document,"touchend",Dt),Et(document,"touchend touchcancel",n)},_cancel:function(){clearTimeout(this._holdTimeout),Et(document,"touchend touchcancel contextmenu",this._cancel,this),Et(document,"touchmove",this._onMove,this)},_onMove:function(n){var s=n.touches[0];this._newPos=new J(s.clientX,s.clientY)},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_simulateEvent:function(n,s){var c=new MouseEvent(n,{bubbles:!0,cancelable:!0,view:window,screenX:s.screenX,screenY:s.screenY,clientX:s.clientX,clientY:s.clientY});c._simulated=!0,s.target.dispatchEvent(c)}});ut.addInitHook("addHandler","tapHold",Qc),ut.mergeOptions({touchZoom:Z.touch,bounceAtZoomLimits:!0});var Yc=ye.extend({addHooks:function(){$(this._map._container,"leaflet-touch-zoom"),et(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){At(this._map._container,"leaflet-touch-zoom"),Et(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(n){var s=this._map;if(!(!n.touches||n.touches.length!==2||s._animatingZoom||this._zooming)){var c=s.mouseEventToContainerPoint(n.touches[0]),l=s.mouseEventToContainerPoint(n.touches[1]);this._centerPoint=s.getSize()._divideBy(2),this._startLatLng=s.containerPointToLatLng(this._centerPoint),s.options.touchZoom!=="center"&&(this._pinchStartLatLng=s.containerPointToLatLng(c.add(l)._divideBy(2))),this._startDist=c.distanceTo(l),this._startZoom=s.getZoom(),this._moved=!1,this._zooming=!0,s._stop(),et(document,"touchmove",this._onTouchMove,this),et(document,"touchend touchcancel",this._onTouchEnd,this),Dt(n)}},_onTouchMove:function(n){if(!(!n.touches||n.touches.length!==2||!this._zooming)){var s=this._map,c=s.mouseEventToContainerPoint(n.touches[0]),l=s.mouseEventToContainerPoint(n.touches[1]),m=c.distanceTo(l)/this._startDist;if(this._zoom=s.getScaleZoom(m,this._startZoom),!s.options.bounceAtZoomLimits&&(this._zoom<s.getMinZoom()&&m<1||this._zoom>s.getMaxZoom()&&m>1)&&(this._zoom=s._limitZoom(this._zoom)),s.options.touchZoom==="center"){if(this._center=this._startLatLng,m===1)return}else{var y=c._add(l)._divideBy(2)._subtract(this._centerPoint);if(m===1&&y.x===0&&y.y===0)return;this._center=s.unproject(s.project(this._pinchStartLatLng,this._zoom).subtract(y),this._zoom)}this._moved||(s._moveStart(!0,!1),this._moved=!0),x(this._animRequest);var I=h(s._move,s,this._center,this._zoom,{pinch:!0,round:!1},void 0);this._animRequest=S(I,this,!0),Dt(n)}},_onTouchEnd:function(){if(!this._moved||!this._zooming){this._zooming=!1;return}this._zooming=!1,x(this._animRequest),Et(document,"touchmove",this._onTouchMove,this),Et(document,"touchend touchcancel",this._onTouchEnd,this),this._map.options.zoomAnimation?this._map._animateZoom(this._center,this._map._limitZoom(this._zoom),!0,this._map.options.zoomSnap):this._map._resetView(this._center,this._map._limitZoom(this._zoom))}});ut.addInitHook("addHandler","touchZoom",Yc),ut.BoxZoom=Gc,ut.DoubleClickZoom=Wc,ut.Drag=$c,ut.Keyboard=Zc,ut.ScrollWheelZoom=Kc,ut.TapHold=Qc,ut.TouchZoom=Yc,e.Bounds=Pt,e.Browser=Z,e.CRS=_e,e.Canvas=zc,e.Circle=Ga,e.CircleMarker=To,e.Class=Ct,e.Control=de,e.DivIcon=Fc,e.DivOverlay=We,e.DomEvent=Pi,e.DomUtil=ja,e.Draggable=ke,e.Evented=ai,e.FeatureGroup=fn,e.GeoJSON=pn,e.GridLayer=ps,e.Handler=ye,e.Icon=ur,e.ImageOverlay=bo,e.LatLng=_t,e.LatLngBounds=Qt,e.Layer=Ne,e.LayerGroup=ar,e.LineUtil=Ae,e.Map=ut,e.Marker=wo,e.Mixin=yo,e.Path=Fn,e.Point=J,e.PolyUtil=rr,e.Polygon=cr,e.Polyline=mn,e.Popup=So,e.PosAnimation=as,e.Projection=Ge,e.Rectangle=jc,e.Renderer=_n,e.SVG=gs,e.SVGOverlay=Vc,e.TileLayer=lr,e.Tooltip=Co,e.Transformation=Gr,e.Util=P,e.VideoOverlay=Dc,e.bind=h,e.bounds=Kt,e.canvas=qc,e.circle=Lm,e.circleMarker=Rm,e.control=He,e.divIcon=Um,e.extend=o,e.featureGroup=bm,e.geoJSON=Oc,e.geoJson=Mm,e.gridLayer=Bm,e.icon=Sm,e.imageOverlay=Nm,e.latLng=at,e.latLngBounds=bt,e.layerGroup=Am,e.map=tr,e.marker=Cm,e.point=tt,e.polygon=km,e.polyline=xm,e.popup=Vm,e.rectangle=Hm,e.setOptions=B,e.stamp=p,e.svg=Hc,e.svgOverlay=Dm,e.tileLayer=Uc,e.tooltip=Fm,e.transformation=Cn,e.version=r,e.videoOverlay=Om;var Gm=window.L;e.noConflict=function(){return window.L=Gm,this},window.L=e})})(Vl,Vl.exports);function GE(i){i.innerHTML=`
    <div class="game-menu-container">
      <header class="game-header">
        <h2>Guess The Place</h2>
        <div id="sessionContainer"></div>
      </header>

      <main class="game-main">
        <div class="menu-section">
          <input 
            type="text" 
            id="userSearchInput" 
            placeholder="🔍 Search user by username..." 
            class="menu-input"
          />
          <button id="searchButton" class="menu-button">Search</button>
        </div>

        <div class="menu-section">
          <button id="startGameButton" class="menu-button">🎮 Start New Game</button>
          <button id="leaderboardButton" class="menu-button">🏆 Leaderboard</button>
        </div>

        <div id="searchResults" class="menu-section search-results"></div>
        <div id="gameContainer" class="hidden"></div>
        </main>
    </div>
    `;const t=i.querySelector("#sessionContainer");HE(t);const e=i.querySelector("#userSearchInput"),r=i.querySelector("#searchButton"),o=i.querySelector("#startGameButton"),a=i.querySelector("#leaderboardButton"),h=i.querySelector("#searchResults"),f=i.querySelector("#gameContainer");let p;e.addEventListener("input",()=>{const g=e.value.trim();clearTimeout(p),p=setTimeout(async()=>{if(g.length<3){h.innerHTML="";return}try{const{SearchUser:w}=await Dl(async()=>{const{SearchUser:b}=await import("./SearchUser-BZSr-mBW.js");return{SearchUser:b}},[]),T=await w.byUsernamePrefix(g,10);h.innerHTML=T.length?T.map(b=>`<div class="search-result-item">${b.getUsername()}</div>`).join(""):"<p>No users found.</p>"}catch(w){console.error("Error during user search: ",w),h.innerHTML=`<p class="error">Error searching users: ${w.message}</p>`}},300)}),r.addEventListener("click",async()=>{const g=e.value.trim();if(!g){h.innerHTML="<p>Please enter a username prefix to search.</p>";return}h.innerHTML="<p>Searching...</p>";try{const{SearchUser:w}=await Dl(async()=>{const{SearchUser:b}=await import("./SearchUser-BZSr-mBW.js");return{SearchUser:b}},[]),T=await w.byUsernamePrefix(g);if(T.length===0){h.innerHTML="<p>No users found.</p>";return}h.innerHTML=T.length?T.map(b=>`<div class="search-result-item">${b.getUsername()}</div>`).join(""):"<p>No users found.</p>"}catch(w){console.error("Error during user search: ",w),h.innerHTML=`<p class="error">Error searching users: ${w.message}</p>`}}),h.addEventListener("click",g=>{const w=g.target.closest(".search-result-item");w&&console.log(`User selected: ${w.textContent}`)}),o.addEventListener("click",()=>{f.classList.remove("hidden");const g=new gp(f);g.renderGameUI();const w=new mp,T=new _p(g.getMapContainerId()),b=new NE({gameController:w,gameMapController:T,uiView:g});g.on("onConfirmGuess",()=>b.confirmGuess()),g.on("onNextRound",()=>b.nextRound()),T.onMapClick(V=>b.setTempGuess(V)),b.startNewGame()}),a.addEventListener("click",()=>{alert("Showing leaderboard...")})}const uu=document.getElementById("app");async function WE(){await OE(),ce.subscribe(Fl),Fl(ce)}function Fl(i){uu.innerHTML="",i.authReady&&(i.isAuthenticated&&i.user?GE(uu):BE(uu))}WE();export{Da as U};
