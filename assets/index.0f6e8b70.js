(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const t of a)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function r(a){const t={};return a.integrity&&(t.integrity=a.integrity),a.referrerpolicy&&(t.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?t.credentials="include":a.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(a){if(a.ep)return;a.ep=!0;const t=r(a);fetch(a.href,t)}})();let f=!1;typeof Storage<"u"?f=!0:f=!1;let l=JSON.parse('[[{"name":"1","start":"8:30","end":"9:15"},{"name":"2","start":"9:20","end":"10:10"},{"name":"3","start":"10:15","end":"11:05"},{"name":"Break","start":"11:05","end":"11:20"},{"name":"4","start":"11:25","end":"12:15"},{"name":"5","start":"12:20","end":"13:10"},{"name":"Lunch","start":"13:10","end":"13:40"},{"name":"6","start":"13:45","end":"14:35"},{"name":"7","start":"14:40","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"3","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"5","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"7","start":"13:53","end":"15:30"}],[{"name":"2","start":"8:30","end":"10:07"},{"name":"Tutorial","start":"10:12","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"4","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"6","start":"13:53","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"3","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"5","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"7","start":"13:53","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"2","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"4","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"6","start":"13:53","end":"15:30"}]]'),y;function u(){let n=new Date,a=((0*60+0)*60+0)*1e3+0;return n.setTime(n.getTime()+a),n}let c,i;function T(){fetch("https://gist.githubusercontent.com/piguyisme/e652e0a5009f17efde347c390767d069/raw/schedule.json?="+Math.floor(Math.random()*1e3),{cache:"no-store"}).then(async n=>{const e=await n.json();JSON.stringify(e)!=JSON.stringify(l)&&(l=e,h(l))},()=>{}),fetch("https://gist.githubusercontent.com/piguyisme/db88af35c569b7b5a8aff60c679f527c/raw/overrides.json?="+Math.floor(Math.random()*1e3),{cache:"no-store"}).then(async n=>{const e=await n.json();JSON.stringify(e)!=JSON.stringify(c)&&(c=e,h(l))},()=>{})}T();setInterval(T,1e4);function h(n){let e=u().getDay(),r;if(c){const s=u(),a=`${s.getDate()}-${s.getMonth()+1}-${s.getFullYear()}`;c[a]?r=c[a]:r=n[e-1]}else r=n[e-1];if((e==0||e==6)&&!c){document.querySelector("#timer").textContent="No school today!";return}else{document.querySelector("#periods").innerHTML="<tr><th>Period</th><th>Start</th><th>End</th></tr>";let s=[];y&&clearInterval(y);for(let a=0;a<r.length;a++){let t=r[a],o=p(t.start),S=p(t.end);s.push({time:o.getTime(),name:"Start of "+t.name}),s.push({time:S.getTime(),name:"End of "+t.name});let w=o.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),M=S.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),g;t.name!="Break"&&t.name!="Lunch"&&!t.name.includes("walkout")&&m(t.name)?g=t.name+": "+m(t.name):g=t.name;let d="<tr";t.name.includes("walkout")?d+=' class="walkout"':t.name=="Break"||t.name=="Lunch"?d+=' class="break"':d+=" value="+t.name,d+=`>
      <td>${g}</td>
      <td>${w}</td>
      <td>${t.name.includes("walkout")?"~":""}${M}</td>
    </tr>`,document.getElementById("periods").innerHTML+=d}document.querySelectorAll(".pinput").forEach((a,t)=>{const o=m(String(t+1));a.value=o||""}),y=setInterval(k,1,s,e)}}function m(n){if(f)return localStorage.getItem(n)?localStorage.getItem(n):void 0}h(l);function p(n){let e=u(),r=n.split(":");return e.setHours(r[0],r[1],0),e}function b(n){let e=u();for(let r=0;r<n.length;r++)if(n[r].time>=e.getTime())return n[r]}let v=0,L=0;function k(n,e){e!=u().getDay()&&h(l),i=b(n);let r=u(),s=document.getElementById("timer");if(i){let a=i.time-r.getTime(),t=q(a);document.visibilityState=="visible"&&(s.innerHTML=t.minutes+":"+t.seconds+"."+t.milliseconds,L!=i&&(document.querySelector("#next").textContent="Until "+i.name+(m(i.name.slice(-1))?": "+m(i.name.slice(-1)):""),L=i)),v!=t.seconds&&(document.title=t.minutes+":"+t.seconds,v=t.seconds)}else s.innerText="School's Out!",document.title="School's Out!"}function q(n){var e=Math.floor(n%1e3),r=Math.floor(n/1e3%60),s=Math.floor(n/(1e3*60));return s=s<10?"0"+s:s,r=r<10?"0"+r:r,e=e<100?e<10?"00"+e:"0"+e:e,{minutes:s,seconds:r,milliseconds:e}}document.querySelector("#shownaming").addEventListener("click",()=>{const n=document.querySelector("#naming");n.classList.contains("hidden")?(document.querySelector("#naming").classList.add("shown"),document.querySelector("#naming").classList.remove("hidden")):n.classList.contains("shown")&&(document.querySelector("#naming").classList.add("hidden"),document.querySelector("#naming").classList.remove("shown"))});document.querySelectorAll(".pinput").forEach(n=>{n.addEventListener("input",e=>{let r=e.target;D(r.attributes.id.value[1],r.value)})});function D(n,e){if(f){const r=document.querySelector(`tr[value="${n}"] td:nth-child(1)`);e&&e!=""?(localStorage.setItem(n,e),r&&(r.textContent=n+": "+e)):(localStorage.removeItem(n),r&&(r.textContent=n))}}
//# sourceMappingURL=index.0f6e8b70.js.map
