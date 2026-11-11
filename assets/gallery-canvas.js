(()=> {
 const viewport=document.getElementById('gallery-viewport');
 const grid=document.getElementById('gallery-grid');
 const trigger=document.getElementById('gallery-explore-open');
 if(!viewport||!grid||!trigger)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const gsap=window.gsap;
 let active=false,scale=1,x=0,y=0,pointer=null,captureTarget=null,lastX=0,lastY=0,downX=0,downY=0,lastTime=0,vx=0,vy=0,moved=false,suppressClick=false;
 let naturalWidth=0,naturalHeight=0;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const set=()=>{grid.style.transform='translate3d('+x+'px,'+y+'px,0) scale('+scale+')'};
 const animate=(vars)=>gsap&&!reduce?gsap.to(grid,{...vars,overwrite:true}):Object.assign(grid.style,{transform:'translate3d('+vars.x+'px,'+vars.y+'px,0) scale('+vars.scale+')'});
 const fit=()=>{
  naturalWidth=grid.offsetWidth;naturalHeight=grid.offsetHeight;
  const margin=window.innerWidth<700?34:64;
  scale=Math.min(1,(window.innerWidth-margin*2)/naturalWidth,(window.innerHeight-margin*2)/naturalHeight);
  scale=clamp(scale,.12,1);
  x=(window.innerWidth-naturalWidth*scale)/2;
  y=(window.innerHeight-naturalHeight*scale)/2;
  if(gsap&&!reduce)gsap.to(grid,{x,y,scale,duration:.7,ease:'power3.out',overwrite:true});
  else set();
  updatePercent();
 };
 const updatePercent=()=>{const el=viewport.querySelector('[data-zoom-value]');if(el)el.textContent=Math.round(scale*100)+'%';};
 const zoomAt=(next,cx=window.innerWidth/2,cy=window.innerHeight/2)=>{
  const nextScale=clamp(next,.28,1.8);
  const worldX=(cx-x)/scale,worldY=(cy-y)/scale;
  x=cx-worldX*nextScale;y=cy-worldY*nextScale;scale=nextScale;
  if(gsap&&!reduce)gsap.to(grid,{x,y,scale,duration:.42,ease:'power3.out',overwrite:true});
  else set();
  updatePercent();
 };
 const close=()=>{
  if(!active)return;
  active=false;document.body.classList.remove('gallery-explore-mode');
  viewport.classList.remove('is-dragging');
  const controls=viewport.querySelector('.gallery-canvas-ui');controls?.remove();
  grid.style.transform='';
  trigger.focus();
 };
 const open=()=>{
  if(active)return;
  active=true;document.body.classList.add('gallery-explore-mode');
  const ui=document.createElement('div');ui.className='gallery-canvas-ui';
  ui.innerHTML='<div class="gallery-canvas-top"><span class="gallery-canvas-brand">Elevation / Field notes</span><div class="gallery-canvas-controls"><span data-zoom-value>100%</span><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="fit">Fit</button><button type="button" class="gallery-canvas-close" aria-label="Close canvas">×</button></div></div><div class="gallery-canvas-foot"><span>Drag to explore · Scroll to zoom</span><strong>Photography / Motion</strong></div>';
  viewport.append(ui);
  ui.querySelector('[data-zoom="out"]').addEventListener('click',()=>zoomAt(scale/1.2));
  ui.querySelector('[data-zoom="in"]').addEventListener('click',()=>zoomAt(scale*1.2));
  ui.querySelector('[data-zoom="fit"]').addEventListener('click',fit);
  ui.querySelector('.gallery-canvas-close').addEventListener('click',close);
  requestAnimationFrame(()=>{naturalWidth=grid.offsetWidth;naturalHeight=grid.offsetHeight;scale=window.innerWidth<700?.86:.6;x=(window.innerWidth-naturalWidth*scale)/2;y=(window.innerHeight-naturalHeight*scale)/2;if(gsap&&!reduce)gsap.fromTo(grid,{autoAlpha:0,x,y,scale},{autoAlpha:1,x,y,scale,duration:.65,ease:'power3.out',clearProps:'autoAlpha'});else set();updatePercent();});
 };
 trigger.addEventListener('click',open);
 viewport.addEventListener('pointerdown',e=>{
  if(!active||e.target.closest('.gallery-canvas-ui'))return;
  pointer=e.pointerId;moved=false;downX=lastX=e.clientX;downY=lastY=e.clientY;lastTime=performance.now();vx=vy=0;
  captureTarget=e.target.closest('.gallery-tile')||viewport;if(captureTarget.setPointerCapture)captureTarget.setPointerCapture(pointer);
 });
 viewport.addEventListener('pointermove',e=>{
  if(pointer!==e.pointerId||!active)return;
  const now=performance.now(),dt=Math.max(1,now-lastTime),dx=e.clientX-lastX,dy=e.clientY-lastY;
  if(Math.abs(e.clientX-downX)+Math.abs(e.clientY-downY)>5)moved=true;
  x+=dx;y+=dy;vx=dx/dt;vy=dy/dt;lastX=e.clientX;lastY=e.clientY;lastTime=now;set();
 });
 const end=e=>{
  if(pointer!==e.pointerId)return;
  if(moved){suppressClick=true;setTimeout(()=>suppressClick=false,80);}
  pointer=null;captureTarget=null;viewport.classList.remove('is-dragging');
  if(moved&&!reduce){const targetX=x+clamp(vx*170,-150,150),targetY=y+clamp(vy*170,-150,150);if(gsap)gsap.to(grid,{x:targetX,y:targetY,duration:.65,ease:'power3.out',overwrite:true,onComplete:set});else{x=targetX;y=targetY;set()}}
 };
 viewport.addEventListener('pointerup',end);
 viewport.addEventListener('pointercancel',end);
 viewport.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();}},{capture:true});
 viewport.addEventListener('wheel',e=>{
  if(!active)return;e.preventDefault();
  const rect=viewport.getBoundingClientRect(),cx=e.clientX-rect.left,cy=e.clientY-rect.top;
  zoomAt(scale*(e.deltaY<0?1.08:1/1.08),cx,cy);
 },{passive:false});
 document.addEventListener('keydown',e=>{if(active&&e.key==='Escape')close()});
 window.addEventListener('resize',()=>{if(active)fit()});
 viewport.addEventListener('pointerdown',()=>{if(active)viewport.classList.add('is-dragging')});
})();