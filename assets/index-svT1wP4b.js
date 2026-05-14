(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();function de(a){const e=[],t=new Map;for(const i of a){const r=i.defaultColor.toUpperCase();t.has(r)||(t.set(r,e.length+1),e.push(r))}return{palette:e,numberFor:i=>t.get(i.toUpperCase())??0}}function te(a,e=1){let t=a.replace("#","");t.length===3&&(t=t.split("").map(r=>r+r).join(""));const i=parseInt(t,16);return[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255,e]}const he=2048,g="#2A2A2E";function d(a){return new Path2D(a)}const q=[{id:0,path:d("M 0 0 L 2048 0 L 2048 1080 L 0 1080 Z"),defaultColor:"#B6DCEF",number:0,hint:"Sky is blue"},{id:1,path:d("M 200 700 A 824 824 0 0 1 1848 700 L 1738 700 A 714 714 0 0 0 310 700 Z"),defaultColor:"#E74C3C",number:0,hint:"Rainbow"},{id:2,path:d("M 310 700 A 714 714 0 0 1 1738 700 L 1628 700 A 604 604 0 0 0 420 700 Z"),defaultColor:"#F39C12",number:0},{id:3,path:d("M 420 700 A 604 604 0 0 1 1628 700 L 1518 700 A 494 494 0 0 0 530 700 Z"),defaultColor:"#F4D03F",number:0},{id:4,path:d("M 530 700 A 494 494 0 0 1 1518 700 L 1408 700 A 384 384 0 0 0 640 700 Z"),defaultColor:"#7DCE82",number:0},{id:5,path:d("M 640 700 A 384 384 0 0 1 1408 700 L 1298 700 A 274 274 0 0 0 750 700 Z"),defaultColor:"#5B9CFF",number:0},{id:6,path:d("M 0 1080 L 2048 1080 L 2048 2048 L 0 2048 Z"),defaultColor:"#3498DB",number:0,hint:"Water is blue"},{id:7,path:d("M 420 1240 Q 420 1500 540 1620 L 1508 1620 Q 1628 1500 1628 1240 Z"),defaultColor:"#A0522D",number:0,hint:"Boat is brown"},{id:8,path:d("M 640 880 L 1408 880 L 1408 1240 L 640 1240 Z"),defaultColor:"#CD7F32",number:0},{id:9,path:d("M 580 880 L 1024 700 L 1468 880 Z"),defaultColor:"#8B4513",number:0,hint:"Roof is dark brown"},{id:10,path:d("M 740 980 L 880 980 L 880 1100 L 740 1100 Z"),defaultColor:"#F4D03F",number:0,hint:"Window glows yellow"},{id:11,path:d("M 1168 980 L 1308 980 L 1308 1100 L 1168 1100 Z"),defaultColor:"#F4D03F",number:0},{id:12,path:d("M 1700 300 m -120 0 a 120 120 0 1 0 240 0 a 120 120 0 1 0 -240 0"),defaultColor:"#FFD93D",number:0,hint:"Sun is yellow"}],{palette:pe,numberFor:fe}=de(q);for(const a of q)a.number=fe(a.defaultColor);const me=[{path:d("M 200 700 A 824 824 0 0 1 1848 700"),width:16,color:g,fill:!1},{path:d("M 310 700 A 714 714 0 0 1 1738 700"),width:12,color:g,fill:!1},{path:d("M 420 700 A 604 604 0 0 1 1628 700"),width:12,color:g,fill:!1},{path:d("M 530 700 A 494 494 0 0 1 1518 700"),width:12,color:g,fill:!1},{path:d("M 640 700 A 384 384 0 0 1 1408 700"),width:12,color:g,fill:!1},{path:d("M 750 700 A 274 274 0 0 1 1298 700"),width:12,color:g,fill:!1},{path:d("M 0 1080 L 2048 1080"),width:10,color:g,fill:!1},{path:d("M 420 1240 Q 420 1500 540 1620 L 1508 1620 Q 1628 1500 1628 1240 Z"),width:18,color:g,fill:!1},{path:d("M 460 1380 L 1588 1380"),width:6,color:g,fill:!1},{path:d("M 480 1500 L 1568 1500"),width:6,color:g,fill:!1},{path:d("M 640 880 L 1408 880 L 1408 1240 L 640 1240 Z"),width:16,color:g,fill:!1},{path:d("M 580 880 L 1024 700 L 1468 880 Z"),width:16,color:g,fill:!1},{path:d("M 740 980 L 880 980 L 880 1100 L 740 1100 Z"),width:10,color:g,fill:!1},{path:d("M 1168 980 L 1308 980 L 1308 1100 L 1168 1100 Z"),width:10,color:g,fill:!1},{path:d("M 810 980 L 810 1100 M 740 1040 L 880 1040"),width:6,color:g,fill:!1},{path:d("M 1238 980 L 1238 1100 M 1168 1040 L 1308 1040"),width:6,color:g,fill:!1},{path:d("M 1700 300 m -120 0 a 120 120 0 1 0 240 0 a 120 120 0 1 0 -240 0"),width:14,color:g,fill:!1},...[0,1,2,3,4,5,6,7].map(a=>{const e=a/8*Math.PI*2,t=140,i=190,r=1700,n=300,c=r+Math.cos(e)*t,o=n+Math.sin(e)*t,f=r+Math.cos(e)*i,h=n+Math.sin(e)*i;return{path:d(`M ${c} ${o} L ${f} ${h}`),width:10,color:g,fill:!1}}),{path:d("M 80 1280 Q 220 1240 360 1280 T 640 1280"),width:6,color:g,fill:!1},{path:d("M 1408 1280 Q 1548 1240 1688 1280 T 1968 1280"),width:6,color:g,fill:!1},{path:d("M 80 1480 Q 220 1440 360 1480 T 640 1480"),width:6,color:g,fill:!1},{path:d("M 1408 1480 Q 1548 1440 1688 1480 T 1968 1480"),width:6,color:g,fill:!1},{path:d("M 80 1700 Q 220 1660 360 1700 T 640 1700"),width:6,color:g,fill:!1},{path:d("M 1408 1700 Q 1548 1660 1688 1700 T 1968 1700"),width:6,color:g,fill:!1}],ge={id:"noahs-ark",title:"Noah's Ark",size:he,regions:q,lineart:me,palette:pe},Y=[{page:ge,category:"Old Testament Heroes"}];function Te(){const a=new Map;for(const e of Y){const t=a.get(e.category)??[];t.push(e.page),a.set(e.category,t)}return a}function Ee(a){return Y.find(e=>e.page.id===a)?.page}function s(a,e={},t=null){const i=document.createElement(a);for(const[r,n]of Object.entries(e))if(!(n===void 0||n===!1))if(r==="class"&&typeof n=="string")i.className=n;else if(r==="style"&&typeof n=="string")i.setAttribute("style",n);else if(r==="dataset"&&typeof n=="object"&&n!==null)for(const[c,o]of Object.entries(n))i.dataset[c]=o;else r.startsWith("on")&&typeof n=="function"?i.addEventListener(r.slice(2).toLowerCase(),n):typeof n=="boolean"?n&&i.setAttribute(r,""):i.setAttribute(r,String(n));return ae(i,t),i}function ae(a,e){if(e!=null){if(Array.isArray(e)){for(const t of e)ae(a,t);return}if(typeof e=="string"){a.appendChild(document.createTextNode(e));return}a.appendChild(e)}}function xe(a){for(;a.firstChild;)a.removeChild(a.firstChild)}function b(a,e=24){return`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="currentColor">${a}</svg>`}function _(a){const e=document.createElement("div");return e.insertAdjacentHTML("afterbegin",a),e.firstElementChild}const C={gear:()=>_(b('<path d="M19.14 12.94c.04-.31.06-.62.06-.94 0-.32-.02-.63-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.49.49 0 00-.49-.42h-3.84a.49.49 0 00-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.49.49 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94 0 .32.02.63.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.14.24.43.34.69.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.27.42.49.42h3.84c.24 0 .44-.18.49-.42l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.27.1.55 0 .69-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z"/>')),crayon:()=>_(b('<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 000-1.42l-2.33-2.33a1 1 0 00-1.41 0L15.13 5.13l3.75 3.75 1.83-1.84z"/>')),numbers:()=>_(b('<text x="12" y="17" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="900">1 2 3</text>')),back:()=>_(b('<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>')),undo:()=>_(b('<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>')),redo:()=>_(b('<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>')),save:()=>_(b('<path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>')),trash:()=>_(b('<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>')),brush_crayon:()=>_(b('<path d="M8.7 11.66c.21.21.41.43.61.65l9.07-7.36c.32-.26.6-.54.85-.84l.05-.06-.18-.21c-.25-.3-.54-.58-.85-.84l-7.36 9.07c-.21-.2-.43-.4-.65-.61L8.7 11.66zm7.43 1.36l-.74-.74-1.41 1.41.74.74c.39.39.39 1.02 0 1.41l-2.83 2.83c-.39.39-1.02.39-1.41 0l-.74-.74-1.41 1.41.74.74c1.17 1.17 3.07 1.17 4.24 0l2.83-2.83c1.17-1.17 1.17-3.07 0-4.23zM6 14c-2.21 0-4 1.79-4 4 0 1.45.78 2.71 1.93 3.4.96.57 2.62 1.1 4.07 1.1.83 0 1.93-.16 2.61-.36-2.21-.92-4.61-3.34-4.61-6.14 0-.69.16-1.34.43-1.92C6.29 14.04 6.15 14 6 14z"/>')),brush_pencil:()=>_(b('<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>')),brush_chalk:()=>_(b('<circle cx="6" cy="6" r="1.5"/><circle cx="12" cy="9" r="1.5"/><circle cx="18" cy="6" r="1.5"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="17" r="1.5"/><circle cx="6" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/>')),brush_marker:()=>_(b('<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-4 17l-3-3 3-3v2h6v2h-6v2z"/>')),brush_paint:()=>_(b('<path d="M18 4V3a1 1 0 00-1-1H5a1 1 0 00-1 1v4a1 1 0 001 1h12a1 1 0 001-1V6h1v4H9v11a1 1 0 001 1h2a1 1 0 001-1v-9h9V4h-4z"/>')),brush_rainbow:()=>_(b('<path d="M12 7c-5.52 0-10 4.48-10 10h2c0-4.42 3.58-8 8-8s8 3.58 8 8h2c0-5.52-4.48-10-10-10zm0 4c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4s4 1.79 4 4h2c0-3.31-2.69-6-6-6zm0 4c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z"/>'))};function ve(a,e){xe(a);let t=null;const i=(h,p)=>{t=h,a.querySelectorAll(".mode-card").forEach(U=>U.classList.toggle("primed",U===p));const m=a.querySelector(".home-scroll"),E=m?.querySelector(".category");E&&m&&m.scrollTo({top:E.offsetTop-60,behavior:"smooth"})},r=s("button",{class:"mode-card free",dataset:{mode:"free"}},[s("div",{class:"mode-card-icon"},C.crayon()),s("div",{class:"mode-card-title"},"Color It In"),s("div",{class:"mode-card-sub"},"Pick any color, anywhere")]);r.addEventListener("click",()=>i("free",r));const n=s("button",{class:"mode-card numbers",dataset:{mode:"cbn"}},[s("div",{class:"mode-card-icon"},C.numbers()),s("div",{class:"mode-card-title"},"By the Numbers"),s("div",{class:"mode-card-sub"},"Tap to fill each piece")]);n.addEventListener("click",()=>i("cbn",n));const c=s("div",{class:"mode-row"},[r,n]),o=s("div",{});for(const[h,p]of Te()){const m=s("div",{class:"category-strip"});for(const E of p){const U=s("div",{class:"story-thumb"});U.appendChild(be(E));const w=s("button",{class:"story-tile",dataset:{page:E.id}},[U,s("div",{class:"story-title"},E.title)]);w.addEventListener("click",()=>{e.onOpenPage(E,t??"free")}),m.appendChild(w)}o.appendChild(s("div",{class:"category"},[s("div",{class:"category-title"},h),m]))}const f=s("div",{class:"home"},[s("div",{class:"home-topbar"},[s("div",{class:"home-logo"},["Bible ",s("span",{class:"accent"},"Coloring")]),s("button",{class:"home-gear","aria-label":"Settings (grown-ups only)"},C.gear())]),s("div",{class:"home-scroll"},[c,o,s("div",{style:"height: 40px"})])]);a.appendChild(f)}function be(a){const e=document.createElement("canvas");e.width=320,e.height=320;const t=e.getContext("2d");t.fillStyle="#FFFBF0",t.fillRect(0,0,320,320);const i=320/a.size;t.save(),t.scale(i,i);for(const r of a.regions)t.fillStyle=r.defaultColor+"60",t.fill(r.path);t.lineCap="round",t.lineJoin="round";for(const r of a.lineart)t.strokeStyle=r.color,t.lineWidth=r.width,r.fill&&(t.fillStyle=r.color,t.fill(r.path)),t.stroke(r.path);return t.restore(),e}const X=`#version 300 es
precision highp float;

// Generic full-quad vertex shader.
// Vertex positions are unit-quad corners in [0, 1].
// Uniforms remap them into clip-space at the desired location/size.

layout(location = 0) in vec2 a_unitPos;

uniform vec2 u_centerUV;    // stamp center in paint-texture UV (0..1) for stamps;
                            // ignored (set to 0.5,0.5) for fullscreen composite.
uniform vec2 u_radiusUV;    // half-width/half-height in UV units; 0.5 for fullscreen.
uniform float u_angle;      // rotation in radians, for brush stamp rotation.
uniform bool u_yFlip;       // true when rendering to default framebuffer (display);
                            // false when rendering to offscreen FBO (paint texture).

out vec2 v_localUV;         // [-1, 1] from quad center — for stamp falloff.
out vec2 v_pageUV;          // (0..1) in paint-texture coordinate space.

void main() {
  // Local position: -1..1 from quad center.
  vec2 local = a_unitPos * 2.0 - 1.0;

  // Rotate the local vec by u_angle.
  float c = cos(u_angle);
  float s = sin(u_angle);
  vec2 rotated = vec2(c * local.x - s * local.y,
                      s * local.x + c * local.y);

  // Compute page UV = center + rotated * radius.
  vec2 uv = u_centerUV + rotated * u_radiusUV;

  // Convert to clip space. For display: y is flipped because gl-Y is up but
  // we treat texture-UV-Y as down. For FBO: don't flip — the FBO's coordinate
  // system already matches our UV convention.
  float clipY = u_yFlip ? (1.0 - uv.y) * 2.0 - 1.0 : uv.y * 2.0 - 1.0;
  gl_Position = vec4(uv.x * 2.0 - 1.0, clipY, 0.0, 1.0);

  v_localUV = local;
  v_pageUV = uv;
}
`,_e=`#version 300 es
precision highp float;

// =====================================================================
// Brush stamp fragment — the Procreate-style dual-texture model:
//
//   coverage = shape(stampUV)            // organic stamp silhouette
//            * grainMask(pageUV)         // paper-anchored wax skips
//
// The paper-grain texture is sampled in PAGE UV (not stamp-local), so as
// the brush drags across the page, the grain stays put on the paper —
// which is exactly what makes a real crayon stroke skip on raised paper
// fibers. This is the key change from the procedural-noise approach.
// =====================================================================

in vec2 v_localUV;          // [-1, 1] from stamp center
in vec2 v_pageUV;           // (0..1) in paint-texture coords

uniform vec4 u_color;
uniform float u_pressure;
uniform float u_hardness;
uniform float u_grainStrength;
uniform int u_textureMode;
uniform float u_clipRegionID;

uniform sampler2D u_regionTex;    // texture unit 0 — region IDs
uniform sampler2D u_paperGrainTex;// texture unit 1 — tileable paper texture
uniform sampler2D u_shapeTex;     // texture unit 2 — per-brush stamp shape
uniform float u_hasShape;         // 1.0 if shape texture is bound, else 0
uniform float u_hasPaperGrain;    // 1.0 if paper texture is bound, else 0
uniform float u_paperTile;        // page-UV multiplier for grain frequency

out vec4 fragColor;

// Cheap hash-based value noise — fallback when paper texture isn't loaded.
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float proceduralGrain(vec2 uv) {
  vec2 f = fract(uv);
  vec2 i = floor(uv);
  vec2 w = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i),                hash21(i + vec2(1, 0)), w.x),
             mix(hash21(i + vec2(0, 1)),   hash21(i + vec2(1, 1)), w.x), w.y);
}

float paperGrainAt(vec2 pageUV) {
  if (u_hasPaperGrain > 0.5) {
    // Sample the paper texture, tiled. Use the luminance — the paper
    // texture is a warm cream image, so luminance ≈ how "raised" the
    // paper fiber is at that point. High luminance = bumpy fiber that
    // catches wax. Low luminance = dip that wax skips.
    vec3 c = texture(u_paperGrainTex, pageUV * u_paperTile).rgb;
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
  }
  // Fallback procedural multi-octave noise.
  float g1 = proceduralGrain(pageUV * 280.0);
  float g2 = proceduralGrain(pageUV * 850.0);
  float g3 = proceduralGrain(pageUV * 160.0);
  return g1 * 0.45 + g2 * 0.30 + g3 * 0.25;
}

void main() {
  float r = length(v_localUV);
  if (r > 1.0) discard;

  if (u_clipRegionID > 0.5 / 255.0) {
    float id = texture(u_regionTex, v_pageUV).r;
    if (abs(id - u_clipRegionID) > 0.5 / 255.0) discard;
  }

  // Soft disc falloff.
  float edgeStart = u_hardness * 0.95;
  float disc = 1.0 - smoothstep(edgeStart, 1.0, r);

  float coverage;
  int mode = u_textureMode;

  if (mode == 1) {
    // FLAT marker — uniform coverage, no grain. The "confident" brush.
    coverage = 1.0;
  } else {
    // All textured modes share the same recipe — different tuning per brush.

    // Step 1: shape mask (organic stamp silhouette).
    float shape = 1.0;
    if (u_hasShape > 0.5) {
      // Stamp-local UV: localUV is [-1, 1]; map to [0, 1] for the shape texture.
      vec2 texUV = v_localUV * 0.5 + 0.5;
      // Use alpha channel (Deevad stamps are white-on-transparent).
      vec4 s = texture(u_shapeTex, texUV);
      // Some textures have alpha; some are luminance-on-white. Use either:
      // alpha if it's meaningful (< 1.0 anywhere), else invert luminance.
      shape = (s.a < 0.99) ? s.a : (1.0 - dot(s.rgb, vec3(0.333)));
    } else if (mode == 2) {
      // Procedural chalk speckle fallback (when no shape texture).
      float n1 = proceduralGrain(v_localUV * 38.0);
      float n2 = proceduralGrain(v_localUV * 15.0);
      shape = step(0.30 + u_grainStrength * 0.18 + r * 0.22, n1 * 0.65 + n2 * 0.35);
    } else if (mode == 3) {
      // Procedural bristle fallback.
      float stripe = 0.5 + 0.5 * sin(v_localUV.x * 26.0);
      shape = mix(0.35, 1.0, stripe * 0.55 + proceduralGrain(v_localUV * 6.0) * 0.45);
    }

    // Step 2: paper grain — page-anchored. This is the WAX-SKIP effect.
    // As the brush drags across the page, this stays put. Stamps overlap
    // and reveal the SAME paper bumps each time — exactly like real wax.
    float paper = paperGrainAt(v_pageUV);

    // The grain modulates coverage with a configurable floor. A grainFloor
    // of 1.0 = paper has no effect; 0.0 = paper completely gates the stamp.
    float grainFloor = 1.0 - u_grainStrength * 0.85;
    float grainMod = mix(grainFloor, 1.0, paper);

    // Hard "skip threshold" — below this, the wax skipped that paper bump
    // entirely. This is what creates the visible breaks that distinguish
    // crayon from marker.
    float skipT = 0.20 + u_grainStrength * 0.18;
    float skipMask = smoothstep(skipT, skipT + 0.10, paper);

    coverage = shape * grainMod * skipMask;
  }

  float effectivePressure = mix(0.55, 1.0, u_pressure);
  float alpha = disc * coverage * u_color.a * effectivePressure;
  fragColor = vec4(u_color.rgb * alpha, alpha);
}
`,Ue=`#version 300 es
precision highp float;

// Flood-fill fragment shader — the color-by-number mechanic.
// Renders a full-page quad over the paint texture; outputs the fill color
// where the region ID matches; discards otherwise.

in vec2 v_pageUV;

uniform sampler2D u_regionTex;
uniform float u_targetID;     // normalized region index (id / 255)
uniform float u_idTolerance;  // typically 0.5 / 255
uniform vec4 u_fillColor;     // rgb + alpha; shader premultiplies

out vec4 fragColor;

void main() {
  float id = texture(u_regionTex, v_pageUV).r;
  if (abs(id - u_targetID) > u_idTolerance) discard;
  float a = u_fillColor.a;
  fragColor = vec4(u_fillColor.rgb * a, a);
}
`,ye=`#version 300 es
precision highp float;

// Composite fragment shader. Renders the layered page to the screen:
//   1. Cream paper background with subtle grain
//   2. Paint texture (the user's coloring) — premultiplied alpha
//   3. Lineart (region outlines) — drawn on top so paint never escapes visually
//
// All three are sampled in page UV (0..1).

in vec2 v_pageUV;

uniform sampler2D u_paintTex;
uniform sampler2D u_lineartTex;
uniform vec3 u_paperColor;
uniform float u_paperGrain;  // 0..1 — how visible the paper texture is

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

void main() {
  // Paper base with subtle high-frequency grain for warmth.
  float n = hash21(v_pageUV * 1600.0);
  vec3 paper = u_paperColor * (1.0 - u_paperGrain * 0.12 * (1.0 - n));

  // Paint sample (premultiplied).
  vec4 paint = texture(u_paintTex, v_pageUV);

  // Composite paint over paper.
  vec3 afterPaint = paint.rgb + paper * (1.0 - paint.a);

  // Lineart on top — sample as straight RGBA, premultiply at use time.
  vec4 line = texture(u_lineartTex, v_pageUV);
  vec3 finalRGB = line.rgb * line.a + afterPaint * (1.0 - line.a);

  fragColor = vec4(finalRGB, 1.0);
}
`;function Q(a,e,t,i){const r=a.createShader(e);if(!r)throw new Error(`Failed to create shader: ${i}`);if(a.shaderSource(r,t),a.compileShader(r),!a.getShaderParameter(r,a.COMPILE_STATUS)){const n=a.getShaderInfoLog(r);throw a.deleteShader(r),new Error(`Shader compile failed (${i}): ${n}`)}return r}function we(a,e,t,i){const r=a.createProgram();if(!r)throw new Error(`Failed to create program: ${i}`);if(a.attachShader(r,e),a.attachShader(r,t),a.linkProgram(r),!a.getProgramParameter(r,a.LINK_STATUS)){const n=a.getProgramInfoLog(r);throw a.deleteProgram(r),new Error(`Program link failed (${i}): ${n}`)}return r}function G(a,e,t,i){const r=Q(a,a.VERTEX_SHADER,e,`${i}.vert`),n=Q(a,a.FRAGMENT_SHADER,t,`${i}.frag`);return we(a,r,n,i)}function z(a,e){const t=new Map;return i=>{if(t.has(i))return t.get(i)??null;const r=a.getUniformLocation(e,i);return t.set(i,r),r}}function Re(a){const e=a.createVertexArray();if(!e)throw new Error("Failed to create VAO");a.bindVertexArray(e);const t=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,t);const i=new Float32Array([0,0,1,0,0,1,1,0,1,1,0,1]);return a.bufferData(a.ARRAY_BUFFER,i,a.STATIC_DRAW),a.enableVertexAttribArray(0),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0),a.bindVertexArray(null),e}function Ce(a,e,t,i,r,n,c=null){const o=a.createTexture();if(!o)throw new Error("Failed to create texture");return a.bindTexture(a.TEXTURE_2D,o),a.texImage2D(a.TEXTURE_2D,0,i,e,t,0,r,n,c),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),o}function Ae(a,e){const t=a.createFramebuffer();if(!t)throw new Error("Failed to create framebuffer");a.bindFramebuffer(a.FRAMEBUFFER,t),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,e,0);const i=a.checkFramebufferStatus(a.FRAMEBUFFER);if(i!==a.FRAMEBUFFER_COMPLETE)throw new Error(`Framebuffer incomplete: 0x${i.toString(16)}`);return a.bindFramebuffer(a.FRAMEBUFFER,null),t}const j={crayon:{name:"Crayon",icon:"🖍️",radius:28,spacing:.32,baseAlpha:.45,hardness:.5,angleJitter:Math.PI,grainStrength:.95,sizeJitter:.15,hueStep:0,textureMode:0,shapeTexture:null,paperTile:7},pencil:{name:"Pencil",icon:"✏️",radius:10,spacing:.2,baseAlpha:.55,hardness:.85,angleJitter:.3,grainStrength:.92,sizeJitter:.06,hueStep:0,textureMode:4,shapeTexture:null,paperTile:14},chalk:{name:"Chalk",icon:"🎨",radius:38,spacing:.18,baseAlpha:.55,hardness:.4,angleJitter:Math.PI,grainStrength:.8,sizeJitter:.12,hueStep:0,textureMode:2,shapeTexture:"shape_chalk.png",paperTile:9},marker:{name:"Marker",icon:"🖊️",radius:22,spacing:.08,baseAlpha:.97,hardness:.98,angleJitter:0,grainStrength:0,sizeJitter:0,hueStep:0,textureMode:1,shapeTexture:null,paperTile:0},paint:{name:"Paint",icon:"🖌️",radius:42,spacing:.12,baseAlpha:.55,hardness:.25,angleJitter:Math.PI,grainStrength:.4,sizeJitter:.12,hueStep:0,textureMode:3,shapeTexture:"shape_bristle.png",paperTile:6},rainbow:{name:"Rainbow",icon:"🌈",radius:26,spacing:.1,baseAlpha:.92,hardness:.95,angleJitter:0,grainStrength:.1,sizeJitter:0,hueStep:.013,textureMode:1,shapeTexture:null,paperTile:0}};function Fe(a,e,t){const i=Math.floor(a*6),r=a*6-i,n=t*(1-e),c=t*(1-r*e),o=t*(1-(1-r)*e);switch(i%6){case 0:return[t,o,n];case 1:return[c,t,n];case 2:return[n,t,o];case 3:return[n,c,t];case 4:return[o,n,t];case 5:return[t,n,c];default:return[t,t,t]}}function Le(a){const e=document.createElement("canvas");e.width=a.size,e.height=a.size;const t=e.getContext("2d");if(!t)throw new Error("Failed to get 2D context");t.fillStyle="rgb(0, 0, 0)",t.fillRect(0,0,a.size,a.size);for(const i of a.regions){const r=Math.min(254,i.id+1);t.fillStyle=`rgb(${r}, 0, 0)`,t.fill(i.path)}return e}function Me(a){const e=document.createElement("canvas");e.width=a.size,e.height=a.size;const t=e.getContext("2d");if(!t)throw new Error("Failed to get 2D context");t.clearRect(0,0,a.size,a.size),t.lineCap="round",t.lineJoin="round";for(const i of a.lineart)t.strokeStyle=i.color,t.lineWidth=i.width,i.fill&&(t.fillStyle=i.color,t.fill(i.path)),t.stroke(i.path);return e}class Pe{gl;canvas;stampProgram;floodProgram;compositeProgram;stampU;floodU;compositeU;quad;page;paintTex;paintFbo;regionTex;regionCanvas;lineartTex;paperGrainTex=null;shapeTextures=new Map;shapeLoadPromises=new Map;dragLastX=0;dragLastY=0;dragAccumulated=0;hueCycle=0;rngState=0;onRedraw=null;constructor(e){this.canvas=e;const t=e.getContext("webgl2",{premultipliedAlpha:!1,alpha:!1,antialias:!1,preserveDrawingBuffer:!1});if(!t)throw new Error("WebGL2 unavailable");this.gl=t,this.initPrograms(),this.quad=Re(t),this.loadImageTexture("/textures/paper.jpg").then(i=>{this.paperGrainTex=i,this.onRedraw?.()})}setRedrawCallback(e){this.onRedraw=e}initPrograms(){const e=this.gl;this.stampProgram=G(e,X,_e,"stamp"),this.floodProgram=G(e,X,Ue,"flood"),this.compositeProgram=G(e,X,ye,"composite"),this.stampU=z(e,this.stampProgram),this.floodU=z(e,this.floodProgram),this.compositeU=z(e,this.compositeProgram)}loadImageTexture(e){return new Promise((t,i)=>{const r=new Image;r.crossOrigin="anonymous",r.onload=()=>{const n=this.gl,c=n.createTexture();if(!c)return i(new Error("createTexture failed"));n.bindTexture(n.TEXTURE_2D,c),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,n.RGBA,n.UNSIGNED_BYTE,r),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.REPEAT),n.generateMipmap(n.TEXTURE_2D),t(c)},r.onerror=()=>i(new Error(`Texture load failed: ${e}`)),r.src=e})}getShapeTexture(e){const t=this.shapeTextures.get(e);return t||(this.shapeLoadPromises.has(e)||this.shapeLoadPromises.set(e,this.loadImageTexture(`/textures/${e}`).then(i=>(this.shapeTextures.set(e,i),this.onRedraw?.(),i))),null)}loadPage(e){const t=this.gl;this.page=e,this.paintTex=Ce(t,e.size,e.size,t.RGBA8,t.RGBA,t.UNSIGNED_BYTE,null),this.paintFbo=Ae(t,this.paintTex),this.clearPaint(),this.regionCanvas=Le(e),this.regionTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.regionTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA8,t.RGBA,t.UNSIGNED_BYTE,this.regionCanvas),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);const i=Me(e);this.lineartTex=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.lineartTex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA8,t.RGBA,t.UNSIGNED_BYTE,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}clearPaint(){const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,this.paintFbo),e.viewport(0,0,this.page.size,this.page.size),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.bindFramebuffer(e.FRAMEBUFFER,null)}startStroke(e){this.dragLastX=e.x,this.dragLastY=e.y,this.dragAccumulated=0}continueStroke(e,t,i,r,n){const c=e.radius,f=Math.max(1,c*e.spacing)/this.page.size,h=i.x-this.dragLastX,p=i.y-this.dragLastY,m=Math.sqrt(h*h+p*p);if(m===0)return;let E=m+this.dragAccumulated,U=this.dragLastX-h/m*this.dragAccumulated,w=this.dragLastY-p/m*this.dragAccumulated;for(;E>=f;)U+=h/m*f,w+=p/m*f,E-=f,this.emitStamp(e,t,U,w,r,n);this.dragAccumulated=E,this.dragLastX=i.x,this.dragLastY=i.y}endStroke(){this.dragAccumulated=0}emitStamp(e,t,i,r,n,c){const o=this.gl,f=(this.rand()*2-1)*e.angleJitter,h=1+(this.rand()*2-1)*e.sizeJitter,p=e.radius*h/this.page.size;let m=t[0],E=t[1],U=t[2];if(e.hueStep>0){const[x,R,M]=Fe(this.hueCycle,1,1);m=x,E=R,U=M,this.hueCycle=(this.hueCycle+e.hueStep)%1}o.bindFramebuffer(o.FRAMEBUFFER,this.paintFbo),o.viewport(0,0,this.page.size,this.page.size),o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o.useProgram(this.stampProgram),o.bindVertexArray(this.quad),o.uniform2f(this.stampU("u_centerUV"),i,r),o.uniform2f(this.stampU("u_radiusUV"),p,p),o.uniform1f(this.stampU("u_angle"),f),o.uniform1i(this.stampU("u_yFlip"),0),o.uniform4f(this.stampU("u_color"),m,E,U,e.baseAlpha),o.uniform1f(this.stampU("u_pressure"),n),o.uniform1f(this.stampU("u_hardness"),e.hardness),o.uniform1f(this.stampU("u_grainStrength"),e.grainStrength),o.uniform1i(this.stampU("u_textureMode"),e.textureMode),o.uniform1f(this.stampU("u_clipRegionID"),c/255),o.uniform1f(this.stampU("u_paperTile"),e.paperTile),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.regionTex),o.uniform1i(this.stampU("u_regionTex"),0),o.activeTexture(o.TEXTURE1),this.paperGrainTex?(o.bindTexture(o.TEXTURE_2D,this.paperGrainTex),o.uniform1f(this.stampU("u_hasPaperGrain"),1)):(o.bindTexture(o.TEXTURE_2D,this.regionTex),o.uniform1f(this.stampU("u_hasPaperGrain"),0)),o.uniform1i(this.stampU("u_paperGrainTex"),1),o.activeTexture(o.TEXTURE2);const w=e.shapeTexture?this.getShapeTexture(e.shapeTexture):null;w?(o.bindTexture(o.TEXTURE_2D,w),o.uniform1f(this.stampU("u_hasShape"),1)):(o.bindTexture(o.TEXTURE_2D,this.regionTex),o.uniform1f(this.stampU("u_hasShape"),0)),o.uniform1i(this.stampU("u_shapeTex"),2),o.drawArrays(o.TRIANGLES,0,6),o.bindFramebuffer(o.FRAMEBUFFER,null)}rand(){return this.rngState=(this.rngState*9301+49297)%233280,this.rngState/233280}floodFill(e,t,i=1){if(e<0)return;const r=this.gl,[n,c,o,f]=te(t,i);r.bindFramebuffer(r.FRAMEBUFFER,this.paintFbo),r.viewport(0,0,this.page.size,this.page.size),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA),r.useProgram(this.floodProgram),r.bindVertexArray(this.quad),r.uniform2f(this.floodU("u_centerUV"),.5,.5),r.uniform2f(this.floodU("u_radiusUV"),.5,.5),r.uniform1f(this.floodU("u_angle"),0),r.uniform1i(this.floodU("u_yFlip"),0),r.uniform1f(this.floodU("u_targetID"),(e+1)/255),r.uniform1f(this.floodU("u_idTolerance"),.5/255),r.uniform4f(this.floodU("u_fillColor"),n,c,o,f),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,this.regionTex),r.uniform1i(this.floodU("u_regionTex"),0),r.drawArrays(r.TRIANGLES,0,6),r.bindFramebuffer(r.FRAMEBUFFER,null)}regionAt(e){const t=this.regionCanvas.getContext("2d"),i=Math.floor(e.x*this.regionCanvas.width),r=Math.floor(e.y*this.regionCanvas.height);if(i<0||r<0||i>=this.regionCanvas.width||r>=this.regionCanvas.height)return-1;const c=t.getImageData(i,r,1,1).data[0]??0;return c===0?-1:c-1}draw(){const e=this.gl,t=this.canvas.width,i=this.canvas.height;e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,t,i),e.disable(e.BLEND),e.clearColor(1,1,1,1),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(this.compositeProgram),e.bindVertexArray(this.quad),e.uniform2f(this.compositeU("u_centerUV"),.5,.5),e.uniform2f(this.compositeU("u_radiusUV"),.5,.5),e.uniform1f(this.compositeU("u_angle"),0),e.uniform1i(this.compositeU("u_yFlip"),1),e.uniform3f(this.compositeU("u_paperColor"),1,.99,.95),e.uniform1f(this.compositeU("u_paperGrain"),.6),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.paintTex),e.uniform1i(this.compositeU("u_paintTex"),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.lineartTex),e.uniform1i(this.compositeU("u_lineartTex"),1),e.drawArrays(e.TRIANGLES,0,6)}exportPNG(){return this.draw(),this.canvas.toDataURL("image/png")}}const B=["#E8B547","#6FBF73","#F08A6E","#5B9CFF","#FBF3E4"];function Se(a){const e=s("div",{class:"celebration modal"});e.appendChild(s("div",{class:"sparkle-sweep"}));const t=a.canvasContainer.clientWidth,i=a.canvasContainer.clientHeight,r=a.originX??t/2,n=a.originY??i/2;for(let o=0;o<40;o++){const f=s("div",{class:"confetti-particle"});f.style.left=`${r}px`,f.style.top=`${n}px`,f.style.background=B[o%B.length]??"#E8B547";const h=(Math.random()-.5)*Math.PI*1.4-Math.PI/2,p=180+Math.random()*320,m=Math.cos(h)*p,E=Math.sin(h)*p+(Math.random()*200+100);f.style.setProperty("--cx",`${m}px`),f.style.setProperty("--cy",`${E}px`),f.style.animationDelay=`${Math.random()*.15}s`,e.appendChild(f)}const c=s("div",{class:"celebration-card"},[s("div",{class:"celebration-emoji"},"🎉"),s("div",{class:"celebration-title"},"Great job!"),s("div",{class:"celebration-sub"},`You finished ${a.storyTitle}!`),s("div",{class:"celebration-actions"},[N("secondary","↻ Replay",a.onReplay),N("primary","💾 Save",a.onSave),N("secondary","→ Next",a.onNext)])]);return e.appendChild(c),e.addEventListener("click",o=>{o.target===e&&a.onDismiss()}),document.body.appendChild(e),De(),()=>e.remove()}function N(a,e,t){const i=s("button",{class:`celebration-btn ${a}`},e);return i.addEventListener("click",t),i}function De(){try{const a=window,e=a.AudioContext??a.webkitAudioContext;if(!e)return;const t=new e,i=(r,n,c)=>{const o=t.createOscillator(),f=t.createGain();o.type="triangle",o.frequency.value=r,f.gain.setValueAtTime(0,t.currentTime+n),f.gain.linearRampToValueAtTime(.18,t.currentTime+n+.04),f.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+n+c),o.connect(f).connect(t.destination),o.start(t.currentTime+n),o.stop(t.currentTime+n+c)};i(523.25,.3,.6),i(659.25,.45,.8),i(783.99,.6,1)}catch{}}function ke(a,e,t,i=18){for(let r=0;r<i;r++){const n=s("div",{class:"confetti-particle"});n.style.position="absolute",n.style.left=`${e}px`,n.style.top=`${t}px`,n.style.background=B[r%B.length]??"#E8B547";const c=Math.random()*Math.PI*2,o=60+Math.random()*120;n.style.setProperty("--cx",`${Math.cos(c)*o}px`),n.style.setProperty("--cy",`${Math.sin(c)*o+80}px`),a.appendChild(n),setTimeout(()=>n.remove(),2400)}}const $=["#E74C3C","#F39C12","#F4D03F","#7DCE82","#3498DB","#5B9CFF","#8E44AD","#FF6B9D","#FF8A47","#A0522D","#8B4513","#2A2A2E","#FFFFFF","#B6DCEF","#6FBF73","#F08A6E"];function Be(a,e){const t=s("button",{class:"icon-button","aria-label":"Back to stories"},C.back()),i=s("button",{class:"icon-button","aria-label":"Undo",disabled:"true"},C.undo()),r=s("button",{class:"icon-button","aria-label":"Clear page"},C.trash()),n=s("button",{class:"icon-button primary","aria-label":"Save your art"},C.save()),c=s("div",{class:"progress-fill"});c.style.width="0%";const o=s("div",{class:"progress-bar"},[c]),f=s("div",{class:"top-bar"},[t,i,...e.mode==="cbn"?[o]:[s("div",{class:"top-bar-spacer"})],r,n]),h=document.createElement("canvas");h.id="canvas";const p=s("div",{class:"canvas-wrap"},[h]),m=s("div",{class:"palette"}),E=s("div",{class:"toolbox"}),U=s("div",{class:"bottom-panel"},[m,...e.mode==="free"?[E]:[]]),w=s("div",{class:"coloring"},[f,p,U]);a.replaceChildren(w),ee(h,p,e.page);let x;try{x=new Pe(h),x.loadPage(e.page)}catch(l){p.replaceChildren(s("div",{style:"padding: 24px; text-align: center; color: var(--ink-2)"},`Sorry, this browser can't run the coloring engine. (${l.message})`));return}let R=e.mode==="cbn"?e.page.palette[0]??$[0]:$[0],M=j.crayon,P=!1,H=0,W=0;const A=new Map,re=()=>A.size,ne=e.page.regions.length;function V(){const l=Math.round(re()/ne*100);c.style.width=`${l}%`}function ie(){if(e.mode!=="cbn")return!1;for(const l of e.page.regions){const u=A.get(l.id);if(!u||u.toUpperCase()!==l.defaultColor.toUpperCase())return!1}return!0}function S(l){const u=l.toUpperCase();for(const T of e.page.regions)if(T.defaultColor.toUpperCase()===u&&(A.get(T.id)??"").toUpperCase()!==u)return!1;return!0}function D(){m.replaceChildren(),(e.mode==="cbn"?e.page.palette:$).forEach((u,T)=>{const v=s("button",{class:"swatch","aria-label":`Color ${u}`,dataset:{hex:u}});if(v.style.background=u,e.mode==="cbn"){const y=T+1;v.appendChild(s("div",{class:"swatch-number"},String(y))),S(u)&&v.classList.add("completed")}u.toUpperCase()===R.toUpperCase()&&v.classList.add("selected"),v.addEventListener("click",()=>{e.mode==="cbn"&&S(u)||(R=u,m.querySelectorAll(".swatch").forEach(y=>{y.classList.toggle("selected",y.dataset.hex===u)}))}),m.appendChild(v)})}D();function oe(){if(e.mode!=="free")return;E.replaceChildren();const l=["crayon","pencil","chalk","marker","paint","rainbow"];for(const u of l){const T=j[u],v=`brush_${u}`,y=(C[v]??C.brush_crayon)(),F=s("button",{class:"tool","aria-label":T.name,dataset:{brush:u}},[s("div",{class:"tool-icon"},y),s("div",{class:"tool-label"},T.name)]);M===T&&F.classList.add("selected"),F.addEventListener("click",()=>{M=T,E.querySelectorAll(".tool").forEach(L=>{L.classList.toggle("selected",L.dataset.brush===u)})}),E.appendChild(F)}}oe();function I(l){const u=h.getBoundingClientRect(),T=(l.clientX-u.left)/u.width,v=(l.clientY-u.top)/u.height;return{x:K(T),y:K(v)}}function se(){for(const l of e.page.palette)if(!S(l)){R=l,D(),m.querySelector(".swatch.selected")?.scrollIntoView({behavior:"smooth",inline:"center"});return}}function le(l){const u=I(l),T=x.regionAt(u);if(T<0)return;const v=e.page.regions.find(F=>F.id===T);if(!v||A.has(T))return;if(v.defaultColor.toUpperCase()!==R.toUpperCase()){p.classList.remove("shake"),p.offsetWidth,p.classList.add("shake");const F=e.page.palette.indexOf(v.defaultColor.toUpperCase())+1,L=s("div",{class:"wrong-hint"},`Try color #${F}`);L.style.left=`${l.clientX-p.getBoundingClientRect().left}px`,L.style.top=`${l.clientY-p.getBoundingClientRect().top-50}px`,p.appendChild(L),setTimeout(()=>L.remove(),1400);return}x.floodFill(T,R,1),x.draw(),A.set(T,R),V();const y=p.getBoundingClientRect();ke(p,l.clientX-y.left,l.clientY-y.top,8),S(R)&&se(),ie()&&(H=l.clientX-y.left,W=l.clientY-y.top,setTimeout(()=>ue(),350))}function ce(l){h.setPointerCapture(l.pointerId),P=!0;const u=I(l);x.startStroke(u),Z(l)}function Z(l){if(!P)return;const u=I(l),T=l.pressure>0?l.pressure:.5,v=te(R);x.continueStroke(M,[v[0],v[1],v[2]],u,T,0),x.draw()}function J(l){P&&(P=!1,h.releasePointerCapture(l.pointerId),x.endStroke())}e.mode==="cbn"?h.addEventListener("pointerdown",l=>{l.preventDefault(),le(l)}):(h.addEventListener("pointerdown",l=>{l.preventDefault(),ce(l)}),h.addEventListener("pointermove",Z),h.addEventListener("pointerup",J),h.addEventListener("pointercancel",J)),t.addEventListener("click",()=>e.onBack()),r.addEventListener("click",()=>{confirm("Clear the page and start over?")&&(x.clearPaint(),x.draw(),A.clear(),V(),D())}),n.addEventListener("click",()=>{const l=x.exportPNG(),u=document.createElement("a");u.href=l,u.download=`${e.page.id}.png`,u.click()}),new ResizeObserver(()=>{ee(h,p,e.page),x.draw()}).observe(p),x.draw();function ue(){Se({canvasContainer:p,originX:H,originY:W,storyTitle:e.page.title,onSave:()=>{const u=x.exportPNG(),T=document.createElement("a");T.href=u,T.download=`${e.page.id}.png`,T.click()},onReplay:()=>{x.clearPaint(),x.draw(),A.clear(),V(),D(),l()},onNext:()=>e.onNext(),onDismiss:()=>l()});function l(){document.querySelector(".celebration")?.remove()}}}function K(a){return a<0?0:a>1?1:a}function ee(a,e,t){const i=window.devicePixelRatio||1,r=e.clientWidth-24,n=e.clientHeight-24,c=Math.min(r,n);a.style.width=`${c}px`,a.style.height=`${c}px`;const o=Math.min(t.size,Math.round(c*i));a.width=o,a.height=o}const O=document.getElementById("app");function k(a){a.kind==="home"?(history.replaceState(null,"","#"),ve(O,{onOpenPage:(e,t)=>k({kind:"coloring",page:e,mode:t})})):(history.replaceState(null,"",`#/${a.mode}/${a.page.id}`),Be(O,{page:a.page,mode:a.mode,onBack:()=>k({kind:"home"}),onNext:()=>k({kind:"home"})}))}function Ve(){const a=location.hash.match(/^#\/(free|cbn)\/([\w-]+)/);if(a){const e=Ee(a[2]);if(e)return{kind:"coloring",page:e,mode:a[1]}}return{kind:"home"}}Y.length===0?O.textContent="No pages registered. See web/src/pages/index.ts":k(Ve());
