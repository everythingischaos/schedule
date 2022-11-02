(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function r(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerpolicy&&(n.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?n.credentials="include":a.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=r(a);fetch(a.href,n)}})();let f=!1;typeof Storage<"u"?f=!0:f=!1;let l=JSON.parse('[[{"name":"1","start":"8:30","end":"9:15"},{"name":"2","start":"9:20","end":"10:10"},{"name":"3","start":"10:15","end":"11:05"},{"name":"Break","start":"11:05","end":"11:20"},{"name":"4","start":"11:25","end":"12:15"},{"name":"5","start":"12:20","end":"13:10"},{"name":"Lunch","start":"13:10","end":"13:40"},{"name":"6","start":"13:45","end":"14:35"},{"name":"7","start":"14:40","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"3","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"5","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"7","start":"13:53","end":"15:30"}],[{"name":"2","start":"8:30","end":"10:07"},{"name":"Tutorial","start":"10:12","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"4","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"6","start":"13:53","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"3","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"5","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"7","start":"13:53","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"2","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"4","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"6","start":"13:53","end":"15:30"}]]'),y;function u(){let t=new Date,a=((0*60+0)*60+0)*1e3+0;return t.setTime(t.getTime()+a),t}let c,i;function w(){fetch("https://gist.githubusercontent.com/piguyisme/e652e0a5009f17efde347c390767d069/raw/schedule.json?="+Math.floor(Math.random()*1e3),{cache:"no-store"}).then(async t=>{const e=await t.json();e!=l&&(l=e,h(l))},()=>{b("Network error, schedule might not be up to date")}),fetch("https://gist.githubusercontent.com/piguyisme/db88af35c569b7b5a8aff60c679f527c/raw/overrides.json?="+Math.floor(Math.random()*1e3),{cache:"no-store"}).then(async t=>{const e=await t.json();JSON.stringify(e)!=JSON.stringify(c)&&(c=e,h(l))},()=>{b("Network error, schedule might not be up to date")})}w();setInterval(w,1e4);function h(t){let e=u().getDay(),r;if(c){const s=u(),a=`${s.getDate()}-${s.getMonth()+1}-${s.getFullYear()}`;c[a]?r=c[a]:r=t[e-1]}else r=t[e-1];if((e==0||e==6)&&!c){document.querySelector("#timer").textContent="No school today!";return}else{document.querySelector("#periods").innerHTML="<tr><th>Period</th><th>Start</th><th>End</th></tr>";let s=[];y&&clearInterval(y);for(let a=0;a<r.length;a++){let n=r[a],o=p(n.start),S=p(n.end);s.push({time:o.getTime(),name:"Start of "+n.name}),s.push({time:S.getTime(),name:"End of "+n.name});let q=o.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),T=S.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),g;n.name!="Break"&&n.name!="Lunch"&&!n.name.includes("walkout")&&m(n.name)?g=n.name+": "+m(n.name):g=n.name;let d="<tr";n.name.includes("walkout")?d+=' class="walkout"':n.name=="Break"||n.name=="Lunch"?d+=' class="break"':d+=" value="+n.name,d+=`>
      <td>${g}</td>
      <td>${q}</td>
      <td>${n.name.includes("walkout")?"~":""}${T}</td>
    </tr>`,document.getElementById("periods").innerHTML+=d}document.querySelectorAll(".pinput").forEach((a,n)=>{const o=m(String(n+1));a.value=o||""}),y=setInterval(x,1,s,e)}}function m(t){if(f)return localStorage.getItem(t)?localStorage.getItem(t):void 0}h(l);function p(t){let e=u(),r=t.split(":");return e.setHours(r[0],r[1],0),e}function M(t){let e=u();for(let r=0;r<t.length;r++)if(t[r].time>=e.getTime())return t[r]}let v=0,L=0;function x(t,e){e!=u().getDay()&&h(l),i=M(t);let r=u(),s=document.getElementById("timer");if(i){let a=i.time-r.getTime(),n=D(a);document.visibilityState=="visible"&&(s.innerHTML=n.minutes+":"+n.seconds+"."+n.milliseconds,L!=i&&(document.querySelector("#next").textContent="Until "+i.name+(m(i.name.slice(-1))?": "+m(i.name.slice(-1)):""),L=i)),v!=n.seconds&&(document.title=n.minutes+":"+n.seconds,v=n.seconds)}else s.innerText="School's Out!",document.title="School's Out!"}function D(t){var e=Math.floor(t%1e3),r=Math.floor(t/1e3%60),s=Math.floor(t/(1e3*60));return s=s<10?"0"+s:s,r=r<10?"0"+r:r,e=e<100?e<10?"00"+e:"0"+e:e,{minutes:s,seconds:r,milliseconds:e}}document.querySelector("#shownaming").addEventListener("click",()=>{const t=document.querySelector("#naming");t.classList.contains("hidden")?(document.querySelector("#naming").classList.add("shown"),document.querySelector("#naming").classList.remove("hidden")):t.classList.contains("shown")&&(document.querySelector("#naming").classList.add("hidden"),document.querySelector("#naming").classList.remove("shown"))});document.querySelectorAll(".pinput").forEach(t=>{t.addEventListener("input",e=>{let r=e.target;I(r.attributes.id.value[1],r.value)})});function I(t,e){if(f){const r=document.querySelector(`tr[value="${t}"] td:nth-child(1)`);e&&e!=""?(localStorage.setItem(t,e),r&&(r.textContent=t+": "+e)):(localStorage.removeItem(t),r&&(r.textContent=t))}}let k=!1;function b(t){if(!k){const e=document.querySelector(".alert");document.querySelector("#alert-text").textContent=t,e.classList.contains("alert-visible")||e.classList.add("alert-visible")}}document.querySelector("#alert-close").addEventListener("click",()=>{document.querySelector(".alert").classList.remove("alert-visible"),k=!0});
//# sourceMappingURL=index.e49b0d4b.js.map
