if(!self.define){let i,n={};const e=(e,c)=>(e=new URL(e+".js",c).href,n[e]||new Promise((n=>{if("document"in self){const i=document.createElement("script");i.src=e,i.onload=n,document.head.appendChild(i)}else i=e,importScripts(e),n()})).then((()=>{let i=n[e];if(!i)throw new Error(`Module ${e} didn’t register its module`);return i})));self.define=(c,o)=>{const s=i||("document"in self?document.currentScript.src:"")||location.href;if(n[s])return;let r={};const f=i=>e(i,s),d={module:{uri:s},exports:r,require:f};n[s]=Promise.all(c.map((i=>d[i]||f(i)))).then((i=>(o(...i),r)))}}define(["./workbox-3625d7b0"],(function(i){"use strict";self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"assets/index.f397167f.css",revision:null},{url:"assets/index.f698c6e4.js",revision:null},{url:"assets/x-symbol.f6350803.svg",revision:null},{url:"icons/apple-touch-icon.png",revision:"497437e91dc5c308684ff408f009d980"},{url:"icons/icon-128x128.png",revision:"cb73e793a75373559cd585fb13fe2e9a"},{url:"icons/icon-144x144.png",revision:"725596b4ef42fbdfcfc1efb350edae82"},{url:"icons/icon-152x152.png",revision:"499c4faf10b3fbc55993bb9577a38c24"},{url:"icons/icon-192x192.png",revision:"c50af486427e88c993ef6414dac09da0"},{url:"icons/icon-384x384.png",revision:"70abaf79ce10e191d4fdada8d03b6af9"},{url:"icons/icon-48x48.png",revision:"798fc23614884cd68e2522146e0c8663"},{url:"icons/icon-512x512.png",revision:"644a649e821b1fd7d110a22f8b55cb0f"},{url:"icons/icon-72x72.png",revision:"2ded5695aa6b64112669ac2198028811"},{url:"icons/icon-96x96.png",revision:"1a057d90253a11546d296ead041fd1d9"},{url:"index.html",revision:"15463c578fab4f7044bb08c132d5fa86"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"icons/icon-72x72.png",revision:"2ded5695aa6b64112669ac2198028811"},{url:"icons/icon-96x96.png",revision:"1a057d90253a11546d296ead041fd1d9"},{url:"icons/icon-128x128.png",revision:"cb73e793a75373559cd585fb13fe2e9a"},{url:"icons/icon-144x144.png",revision:"725596b4ef42fbdfcfc1efb350edae82"},{url:"icons/icon-152x152.png",revision:"499c4faf10b3fbc55993bb9577a38c24"},{url:"icons/icon-192x192.png",revision:"c50af486427e88c993ef6414dac09da0"},{url:"icons/icon-384x384.png",revision:"70abaf79ce10e191d4fdada8d03b6af9"},{url:"icons/icon-512x512.png",revision:"644a649e821b1fd7d110a22f8b55cb0f"},{url:"manifest.webmanifest",revision:"9ddae5b5e718ec5a790b33ff9ad1c835"}],{}),i.cleanupOutdatedCaches(),i.registerRoute(new i.NavigationRoute(i.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
