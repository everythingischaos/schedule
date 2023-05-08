(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const e of a)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function r(a){const e={};return a.integrity&&(e.integrity=a.integrity),a.referrerpolicy&&(e.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?e.credentials="include":a.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function s(a){if(a.ep)return;a.ep=!0;const e=r(a);fetch(a.href,e)}})();let f=!1;typeof Storage<"u"?f=!0:f=!1;let l=JSON.parse('[[{"name":"1","start":"8:30","end":"9:15"},{"name":"2","start":"9:20","end":"10:10"},{"name":"3","start":"10:15","end":"11:05"},{"name":"Break","start":"11:05","end":"11:20"},{"name":"4","start":"11:25","end":"12:15"},{"name":"5","start":"12:20","end":"13:10"},{"name":"Lunch","start":"13:10","end":"13:40"},{"name":"6","start":"13:45","end":"14:35"},{"name":"7","start":"14:40","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"3","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"5","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"7","start":"13:53","end":"15:30"}],[{"name":"2","start":"8:30","end":"10:07"},{"name":"Tutorial","start":"10:12","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"4","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"6","start":"13:53","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"3","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"5","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"7","start":"13:53","end":"15:30"}],[{"name":"1","start":"8:30","end":"9:36"},{"name":"2","start":"9:41","end":"11:18"},{"name":"Break","start":"11:18","end":"11:33"},{"name":"4","start":"11:38","end":"13:15"},{"name":"Lunch","start":"13:15","end":"13:48"},{"name":"6","start":"13:53","end":"15:30"}]]'),S;function u(){let n=new Date,a=((0*60+0)*60+0)*1e3+0;return n.setTime(n.getTime()+a),n}let c,i;function T(){fetch("https://everythingischaos.com/schedule-data/schedule.json?="+Math.floor(Math.random()*1e3),{cache:"no-store"}).then(async n=>{const t=await n.json();JSON.stringify(t)!=JSON.stringify(l)&&(l=t,h(l))},()=>{}),fetch("https://everythingischaos.com/schedule-data/overrides.json?="+Math.floor(Math.random()*1e3),{cache:"no-store"}).then(async n=>{const t=await n.json();JSON.stringify(t)!=JSON.stringify(c)&&(c=t,h(l))},()=>{})}T();setInterval(T,1e4);function h(n){let t=u().getDay(),r=n[t-1];if(c){const s=u(),a=`${s.getDate()}-${s.getMonth()+1}-${s.getFullYear()}`;c[a]&&(r=c[a])}if((t==0||t==6)&&!c){document.querySelector("#timer").textContent="No school today!";return}else{document.querySelector("#periods").innerHTML="<tr><th>Period</th><th>Start</th><th>End</th></tr>";let s=[];S&&clearInterval(S);for(let a=0;a<r.length;a++){let e=r[a],o=p(e.start),y=p(e.end);s.push({time:o.getTime(),name:"Start of "+e.name}),s.push({time:y.getTime(),name:"End of "+e.name});let M=o.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),k=y.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),g;e.name!="Break"&&e.name!="Lunch"&&!e.name.includes("walkout")&&m(e.name)?g=e.name+": "+m(e.name):g=e.name;let d="<tr";e.name.includes("walkout")?d+=' class="walkout"':e.name=="Break"||e.name=="Lunch"?d+=' class="break"':d+=" value="+e.name,d+=`>
      <td>${g}</td>
      <td>${M}</td>
      <td>${e.name.includes("walkout")?"~":""}${k}</td>
    </tr>`,document.getElementById("periods").innerHTML+=d}document.querySelectorAll(".pinput").forEach((a,e)=>{const o=m(String(e+1));a.value=o||""}),S=setInterval(w,1,s,t)}}function m(n){if(f)return localStorage.getItem(n)?localStorage.getItem(n):void 0}h(l);function p(n){let t=u(),r=n.split(":");return t.setHours(r[0],r[1],0),t}function q(n){let t=u();for(let r=0;r<n.length;r++)if(n[r].time>=t.getTime())return n[r]}let v=0,L=0;function w(n,t){t!=u().getDay()&&h(l),i=q(n);let r=u(),s=document.getElementById("timer");if(i){let a=i.time-r.getTime(),e=D(a);document.visibilityState=="visible"&&(s.innerHTML=e.minutes+":"+e.seconds+"."+e.milliseconds,L!=i&&(document.querySelector("#next").textContent="Until "+i.name+(m(i.name.slice(-1))?": "+m(i.name.slice(-1)):""),L=i)),v!=e.seconds&&(document.title=e.minutes+":"+e.seconds,v=e.seconds)}else s.innerText="School's Out!",document.title="School's Out!"}function D(n){var t=Math.floor(n%1e3),r=Math.floor(n/1e3%60),s=Math.floor(n/(1e3*60));return s=s<10?"0"+s:s,r=r<10?"0"+r:r,t=t<100?t<10?"00"+t:"0"+t:t,{minutes:s,seconds:r,milliseconds:t}}document.querySelector("#shownaming").addEventListener("click",()=>{const n=document.querySelector("#naming");n.classList.contains("hidden")?(document.querySelector("#naming").classList.add("shown"),document.querySelector("#naming").classList.remove("hidden")):n.classList.contains("shown")&&(document.querySelector("#naming").classList.add("hidden"),document.querySelector("#naming").classList.remove("shown"))});document.querySelectorAll(".pinput").forEach(n=>{n.addEventListener("input",t=>{let r=t.target;I(r.attributes.id.value[1],r.value)})});function I(n,t){if(f){const r=document.querySelector(`tr[value="${n}"] td:nth-child(1)`);t&&t!=""?(localStorage.setItem(n,t),r&&(r.textContent=n+": "+t)):(localStorage.removeItem(n),r&&(r.textContent=n))}}
//# sourceMappingURL=index.4db64161.js.map
