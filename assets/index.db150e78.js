(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function l(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=l(n);fetch(n.href,r)}})();const style="";window.onload=()=>{const themeSwitch=document.getElementById("theme_switch"),colorView=document.getElementById("color_view"),millisecondView=document.getElementById("millisecond_view"),editView=document.getElementById("edit_view"),periodInputs=document.getElementsByClassName("pinput"),colorViewLabel=document.getElementById("color_view_label"),colorMenu=document.getElementById("color_menu"),lightDarkLabel=document.getElementById("light_dark_label"),lightDarkIcons=lightDarkLabel.children;colorView.onclick=e=>handleColorViewClick(),themeSwitch.onclick=()=>handleThemeClick(),colorViewLabel.onmouseenter=()=>{colorViewLabel.classList.contains("selected")||rotateChildren(colorViewLabel,-15)},colorViewLabel.onmouseleave=()=>{colorViewLabel.classList.contains("selected")||rotateChildren(colorViewLabel,15)},lightDarkLabel.onmouseenter=()=>rotateChildren(lightDarkLabel,-15),lightDarkLabel.onmouseleave=()=>rotateChildren(lightDarkLabel,15),millisecondView.onclick=()=>handleMillisecondClick(),editView.onclick=()=>handleEditClick();for(let e=0;e<periodInputs.length;e++)periodInputs.item(e).oninput=t=>setClassName(parseInt(t.target.parentElement.previousElementSibling.textContent.slice(-1)),t.target.value),periodInputs.item(e).onfocus=t=>{t.target.parentElement.animate({backgroundColor:document.documentElement.style.getPropertyValue("--surface0-hex")},{duration:100,fill:"forwards"}),t.target.parentElement.style.border=`solid 1px ${document.documentElement.style.getPropertyValue("--accent-hex")}`},periodInputs.item(e).addEventListener("focusout",t=>{t.target.parentElement.animate({backgroundColor:document.documentElement.style.getPropertyValue("--surface1-hex")},{duration:100,fill:"forwards"}),t.target.parentElement.style.border=""});let hasStorage=typeof Storage<"u",allSchedules=JSON.parse('{"A":[{"name":"1","start":"8:30","end":"9:20"},{"name":"2","start":"9:25","end":"10:20"},{"name":"3","start":"10:25","end":"11:15"},{"name":"Break","start":"11:15","end":"11:30"},{"name":"4","start":"11:35","end":"12:25"},{"name":"5","start":"12:30","end":"13:20"},{"name":"Lunch","start":"13:20","end":"13:50"},{"name":"6","start":"13:55","end":"14:45"},{"name":"7","start":"14:50","end":"15:40"}],"E":[{"name":"1","start":"8:30","end":"9:20"},{"name":"2","start":"9:25","end":"10:55"},{"name":"Break","start":"10:55","end":"11:10"},{"name":"Tutorial","start":"11:15","end":"12:00"},{"name":"4","start":"12:05","end":"13:35"},{"name":"Lunch","start":"13:35","end":"14:05"},{"name":"6","start":"14:10","end":"15:40"}],"O":[{"name":"1","start":"8:30","end":"9:20"},{"name":"3","start":"9:25","end":"10:55"},{"name":"Break","start":"10:55","end":"11:10"},{"name":"5","start":"11:15","end":"12:45"},{"name":"Lunch","start":"12:45","end":"13:15"},{"name":"7","start":"13:20","end":"14:50"}],"SA":[{"name":"1","start":"8:30","end":"9:25"},{"name":"3","start":"9:30","end":"10:45"},{"name":"Rally","start":"10:50","end":"11:25"},{"name":"Break","start":"11:25","end":"11:40"},{"name":"5","start":"11:45","end":"13:00"},{"name":"Lunch","start":"13:00","end":"13:30"},{"name":"7","start":"13:35","end":"14:50"}],"LA":[{"name":"1","start":"8:30","end":"9:15"},{"name":"3","start":"9:20","end":"10:30"},{"name":"Assembly","start":"10:35","end":"11:35"},{"name":"Break","start":"11:35","end":"11:50"},{"name":"5","start":"11:55","end":"13:05"},{"name":"Lunch","start":"13:05","end":"13:35"},{"name":"7","start":"13:40","end":"14:50"}],"NS":"none"}'),days=JSON.parse('["LA","TE","O","TE","O"]'),latestIntervalID,overrideSchedules,nextItem,palette,themeIDs=[],accentColors=[],recursiveAnimationInProgress=!1,colorViewIsHidden=!0,editViewIsHidden=!0,millisecondsAreEnabled=!1;hasStorage&&localStorage.getItem("showMs")!=null&&localStorage.getItem("showMs")!=null&&eval(localStorage.getItem("showMs"))&&handleMillisecondClick();let accentColor="mauve";hasStorage&&localStorage.getItem("accentColor")!=null&&localStorage.getItem("accentColor")!=null&&(accentColor=localStorage.getItem("accentColor"));let themeID="mocha";hasStorage&&localStorage.getItem("themeID")!=null&&localStorage.getItem("themeID")!=null&&(themeID=localStorage.getItem("themeID"));function loadTheme(){if(palette==null)return;themeIDs=[];for(var e in palette)themeIDs.push(e);console.log(themeID);const t=palette[themeID].colors;for(var e in t)document.documentElement.style.setProperty(`--${e}-hex`,t[e].hex);document.documentElement.style.setProperty("--accent-hex",t[accentColor].hex),document.documentElement.style.setProperty("--accent-h",t[accentColor].hsl.h),document.documentElement.style.setProperty("--accent-s",`${t[accentColor].hsl.s*100}%`),document.documentElement.style.setProperty("--accent-l",`${t[accentColor].hsl.l*100}%`);for(let l=0;l<lightDarkIcons.length;l++)lightDarkIcons.item(l).style.setProperty("opacity",lightDarkIcons.item(l).id==themeID?"100%":"0%")}function populateColorMenu(){if(palette==null)return;colorMenu.innerHTML="",accentColors=[];const e=palette[themeID].colors;for(var t in e){if(!e[t].accent)continue;accentColors.push(t);let l=document.createElement("div");l.classList.add("color_option_container"),t==accentColor&&l.classList.add("selected");let o=document.createElement("label");o.classList.add("color_option_label"),o.id=`${t}_label`,o.htmlFor=t,o.style.backgroundColor=`var(--${t}-hex)`;let n=document.createElement("input");n.id=t,n.type="button",n.hidden=!0,n.onclick=r=>handleColorOptionClick(r),l.appendChild(o),l.appendChild(n),colorMenu.appendChild(l)}}function receivePalette(){fetch("https://raw.githubusercontent.com/catppuccin/palette/main/palette.json").then(async e=>{palette=await e.json(),loadTheme(),populateColorMenu()},()=>{})}function checkForChanges(){fetch("https://everythingischaos.com/schedule-data/overrides.json?="+Math.floor(Math.random()*1e3),{cache:"no-store"}).then(async e=>{const t=await e.json();JSON.stringify(t)!=JSON.stringify(overrideSchedules)&&(overrideSchedules=t,updateTable())},()=>{}),fetch("https://everythingischaos.com/schedule-data/schedules.json?="+Math.floor(Math.random()*1e3),{cache:"no-store"}).then(async e=>{const t=await e.json();JSON.stringify(t)!=JSON.stringify(allSchedules)&&(allSchedules=t,updateTable())},()=>{})}receivePalette(),checkForChanges(),setInterval(checkForChanges,1e4);async function updateTable(){let e=new Date,t=allSchedules[days[e.getDay()-1]];if(overrideSchedules&&!!1){const o=`${e.getDate()}-${e.getMonth()+1}-${e.getFullYear()}`;overrideSchedules[o]&&(t=allSchedules[overrideSchedules[o]],console.log(t))}if(e.getDay()==0||e.getDay()==6||t=="none"){document.querySelector("#timer").textContent="No school today!";return}document.getElementById("periods").parentElement.animate({opacity:0},{duration:300,fill:"forwards"}).finished.then(()=>{document.querySelector("#periods").innerHTML="<tr><th>Period</th><th>Start</th><th>End</th></tr>";let o=[];latestIntervalID&&clearInterval(latestIntervalID);for(let n=0;n<t.length;n++){let r=t[n],a=timeStringToDate(r.start),c=timeStringToDate(r.end);o.push({time:a.getTime(),name:"Start of "+r.name}),o.push({time:c.getTime(),name:"End of "+r.name});let d=a.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),m=c.toLocaleString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}),s;parseInt(r.name.charAt(0))!=null&&getClassName(r.name)?(console.log(parseInt(r.name.charAt(0))),console.log(r.name),s=r.name+": "+getClassName(r.name)):s=r.name;let i="<tr";r.name=="Break"||r.name=="Lunch"?i+=' class="break"':i+=" value="+r.name,i+=`>
      <td>${s}</td>
      <td>${d}</td>
      <td>${m}</td>
      </tr>`,document.getElementById("periods").innerHTML+=i}for(let n=0;n<periodInputs.length;n++)periodInputs.item(n).value=getClassName(n+1)?getClassName(n+1):"";latestIntervalID=setInterval(renderTimer,3.33,o,e.getDay()),document.getElementById("periods").parentElement.animate({opacity:1},{duration:200,fill:"forwards"})})}function getClassName(e){if(hasStorage)return localStorage.getItem(e)?localStorage.getItem(e):void 0}function timeStringToDate(e){let t=new Date,l=e.split(":");return t.setHours(l[0],l[1],0),t}function findNext(e){for(let t=0;t<e.length;t++)if(e[t].time>=new Date().getTime())return e[t]}let prevSec=0,prevNext=0;function renderTimer(e,t){t!=new Date().getDay()&&updateTable(),nextItem=findNext(e);let l=document.getElementById("timer");if(nextItem){let o=nextItem.time-new Date().getTime(),n=msToTime(o);document.visibilityState=="visible"&&(l.innerHTML=`${n.minutes}:${n.seconds}${millisecondsAreEnabled?"."+n.millisconds:""}`,prevNext!=nextItem&&(document.querySelector("#next").textContent="Until "+nextItem.name+(getClassName(nextItem.name.charAt(0))?": "+getClassName(nextItem.name.charAt(0)):""),prevNext=nextItem)),prevSec!=n.seconds&&(document.title=n.minutes+":"+n.seconds,prevSec=n.seconds)}else l.innerText="School's Out!",document.title="School's Out!"}function msToTime(e){var t=Math.floor(e%1e3),l=Math.floor(e/1e3%60),o=Math.floor(e/(1e3*60));return o=o<10?"0"+o:o,l=l<10?"0"+l:l,t=t<100?t<10?"00"+t:"0"+t:t,{minutes:o,seconds:l,millisconds:t}}function handleColorViewClick(){recursiveAnimationInProgress||(colorViewIsHidden=!colorViewIsHidden,colorMenu.style.height=colorViewIsHidden?"0":`${accentColors.length*2.3+accentColors.length*.3}rem`,colorMenu.style.padding=colorViewIsHidden?"0":"0.3rem",colorViewIsHidden?colorViewLabel.classList.remove("selected"):colorViewLabel.classList.add("selected"),document.documentElement.style.setProperty("--current-easing",colorViewIsHidden?"cubic-bezier(0.36, 0, 0.66, -0.56)":"cubic-bezier(0.34, 1.56, 0.64, 1)"),recursiveAnimateOpacity(document.getElementsByClassName("color_option_container"),0,500,!!colorViewIsHidden,colorViewIsHidden?"0%":"100%"),rotateChildren(colorViewLabel,360))}function handleColorOptionClick(e){e.target.id==accentColor||!colorViewIsHidden||recursiveAnimationInProgress||(document.getElementById(`${accentColor}_label`).parentElement.classList.remove("selected"),accentColor=e.target.id,localStorage.setItem("accentColor",accentColor),e.target.parentElement.classList.add("selected"),loadTheme())}function recursiveAnimateOpacity(e,t,l,o,n){if(recursiveAnimationInProgress=!0,t>=e.length||t<0){recursiveAnimationInProgress=!1;return}e.item(o?e.length-(t+1):t).style.opacity=n,l/e.length*funnyEaseOutBackBecauseWhyNot((t+1)/e.length),setTimeout(()=>{recursiveAnimateOpacity(e,t+1,l,o,n)},.5*l/e.length)}function handleThemeClick(){themeID=themeIDs[(themeIDs.indexOf(themeID)+1)%themeIDs.length],localStorage.setItem("themeID",themeID),rotateChildren(lightDarkLabel,360),loadTheme()}function handleMillisecondClick(){millisecondsAreEnabled=!millisecondsAreEnabled,localStorage.setItem("showMs",millisecondsAreEnabled),millisecondView.previousElementSibling.textContent=millisecondsAreEnabled?"Hide Milliseconds":"Show Milliseconds",millisecondsAreEnabled?millisecondView.previousElementSibling.classList.add("selected"):millisecondView.previousElementSibling.classList.remove("selected")}function handleEditClick(){editViewIsHidden=!editViewIsHidden,editView.previousElementSibling.textContent=editViewIsHidden?"Edit Schedule":"Close",editViewIsHidden?editView.previousElementSibling.classList.remove("selected"):editView.previousElementSibling.classList.add("selected");const e=document.querySelector("#edit");e.animate({opacity:editViewIsHidden?0:1},{duration:100,fill:"forwards"}),e.style.visibility=editViewIsHidden?"hidden":"visible"}function rotateChildren(e,t){for(let l=0;l<e.children.length;l++){const o=e.children.item(l).style.getPropertyValue("transform");let n=0;o.includes("rotate")&&(n+=parseInt(o.substring(o.lastIndexOf("rotate")+7,o.lastIndexOf("deg)")))),e.children.item(0).style.setProperty("transform",`rotate(${n+t}deg)`),e.children.item(l).style.setProperty("-webkit-transform",`rotate(${n+t}deg)`)}}function funnyEaseOutBackBecauseWhyNot(e){return 1+2.70158*Math.pow(e-1,3)+1.70158*Math.pow(e-1,2)}function setClassName(e,t){if(hasStorage){const l=document.querySelector(`tr[value="${e}"] td:nth-child(1)`);t&&t!=""?(localStorage.setItem(e,t),l&&(l.textContent=e+": "+t)):(localStorage.removeItem(e),l&&(l.textContent=e))}}};
//# sourceMappingURL=index.db150e78.js.map