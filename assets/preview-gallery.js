(()=>{
 const dialog=document.querySelector('#preview-lightbox');
 const items=[...document.querySelectorAll('.gallery-preview-rail [data-preview-index]')];
 if(!dialog||!items.length)return;
 const base=new URL('gallery/2026-gallery/',document.baseURI);
 const stage=dialog.querySelector('.preview-stage'),image=stage.querySelector('img'),video=stage.querySelector('video'),caption=dialog.querySelector('.preview-caption'),count=dialog.querySelector('.lightbox-count'),label=dialog.querySelector('.preview-media-label');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,gsap=window.gsap,motion=!!gsap&&!reduce;
 let active=0,returnFocus=null,previousOverflow='',touchX=0,closing=false;
 const asset=file=>new URL(encodeURIComponent(file),base).href;
 const previews=items.map(item=>item.querySelector('video')).filter(Boolean);
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{
  const v=entry.target;
  if(entry.isIntersecting){
   if(!v.src){v.src=asset(items.find(item=>item.querySelector('video')===v).dataset.src);v.load()}
   const play=()=>v.play().catch(()=>{});
   if(v.readyState>=2)play();else v.addEventListener('loadeddata',play,{once:true});
  }else v.pause();
 }),{rootMargin:'120px 0px'}):null;
 previews.forEach(v=>observer?.observe(v));
 const pausePreviews=()=>previews.forEach(v=>v.pause());
 const resumePreviews=()=>previews.forEach(v=>{const r=v.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)v.play().catch(()=>{})});
 const stopVideo=()=>{video.pause();video.removeAttribute('src');video.load();video.hidden=true;video.controls=false};
 const current=()=>video.hidden?image:video;
 const show=i=>{
  active=(i+items.length)%items.length;
  const item=items[active],kind=item.dataset.media||'image',src=item.dataset.src;
  stopVideo();image.hidden=true;
  if(kind==='video'){
   video.hidden=false;video.controls=true;video.src=asset(src);video.load();video.play().catch(()=>{});
   label.textContent='ELEVATION / MOTION';
  }else{
   image.hidden=false;image.src=asset(src);image.alt=item.querySelector('img')?.alt||'Elevation Security Group photograph';
   label.textContent='ELEVATION / PHOTOGRAPHY';
  }
  count.textContent=String(active+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
 };
 const animateMedia=()=>{if(motion)gsap.fromTo(current(),{autoAlpha:0,scale:.985},{autoAlpha:1,scale:1,duration:.34,ease:'power2.out',clearProps:'transform'})};
 const open=i=>{
  if(closing)return;
  returnFocus=items[i];previousOverflow=document.body.style.overflow;
  pausePreviews();show(i);dialog.classList.add('open');dialog.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  if(motion){
   gsap.set(dialog,{autoAlpha:0});gsap.set(stage,{autoAlpha:0,scale:.985,y:10});gsap.set(caption,{autoAlpha:0,y:8});
   gsap.to(dialog,{autoAlpha:1,duration:.24,ease:'power1.out'});
   gsap.to(stage,{autoAlpha:1,scale:1,y:0,duration:.42,ease:'power3.out',delay:.04});
   gsap.to(caption,{autoAlpha:1,y:0,duration:.32,ease:'power2.out',delay:.12});
  }
  dialog.querySelector('.lightbox-close').focus();
 };
 const close=()=>{
  if(!dialog.classList.contains('open')||closing)return;
  closing=true;stopVideo();
  const finish=()=>{
   dialog.classList.remove('open');dialog.setAttribute('aria-hidden','true');document.body.style.overflow=previousOverflow;
   image.removeAttribute('src');image.hidden=true;closing=false;
   if(motion)gsap.set([dialog,stage,caption],{clearProps:'all'});
   returnFocus?.focus();resumePreviews();
  };
  if(motion)gsap.to(dialog,{autoAlpha:0,duration:.2,ease:'power1.in',onComplete:finish});else finish();
 };
 const navigate=delta=>{
  if(closing)return;
  const next=active+delta;
  if(motion)gsap.to(current(),{autoAlpha:0,duration:.12,ease:'power1.in',onComplete:()=>{show(next);animateMedia()}});
  else show(next);
 };
 items.forEach((item,i)=>item.addEventListener('click',()=>open(i)));
 dialog.querySelector('.lightbox-close').addEventListener('click',close);
 dialog.querySelector('.lightbox-prev').addEventListener('click',()=>navigate(-1));
 dialog.querySelector('.lightbox-next').addEventListener('click',()=>navigate(1));
 dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 stage.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
 stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>55)navigate(dx<0?1:-1)},{passive:true});
 document.addEventListener('keydown',e=>{if(!dialog.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')navigate(-1);if(e.key==='ArrowRight')navigate(1)});
})();