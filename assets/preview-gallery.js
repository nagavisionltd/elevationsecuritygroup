(()=>{
 const container=document.querySelector('#homepage-gallery'),dialog=document.querySelector('#preview-lightbox');
 if(!container||!dialog||!Array.isArray(window.ELEVATION_MEDIA))return;
 const items=window.ELEVATION_MEDIA.filter(item=>item.home).sort((a,b)=>a.homeOrder-b.homeOrder);
 const asset=item=>new URL(item.src,document.baseURI).href;
 const stage=dialog.querySelector('.preview-stage'),image=stage.querySelector('img'),video=stage.querySelector('video'),caption=dialog.querySelector('.preview-caption'),count=dialog.querySelector('.lightbox-count'),label=dialog.querySelector('.preview-media-label');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,gsap=window.gsap,motion=!!gsap&&!reduce;
 let active=0,returnFocus=null,previousOverflow='',touchX=0,closing=false;
 const tiles=[],previews=[];
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{
  const v=entry.target;
  if(entry.isIntersecting){
   if(!v.src){v.src=v.dataset.src;v.load()}
   const play=()=>v.play().catch(()=>{});
   if(v.readyState>=2)play();else v.addEventListener('loadeddata',play,{once:true});
  }else v.pause();
 }),{rootMargin:'120px 0px'}):null;
 const pausePreviews=()=>previews.forEach(v=>v.pause());
 const resumePreviews=()=>previews.forEach(v=>{const r=v.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)v.play().catch(()=>{})});
 const stopVideo=()=>{video.pause();video.removeAttribute('src');video.load();video.hidden=true;video.controls=false};
 const current=()=>video.hidden?image:video;
 const show=i=>{
  active=(i+items.length)%items.length;
  const item=items[active];stopVideo();image.hidden=true;
  if(item.type==='video'){
   video.hidden=false;video.controls=true;video.src=asset(item);video.load();video.play().catch(()=>{});
   label.textContent='ELEVATION / MOTION';
  }else{
   image.hidden=false;image.src=asset(item);image.alt=item.alt||'Elevation Security Group photograph';
   label.textContent='ELEVATION / PHOTOGRAPHY';
  }
  count.textContent=String(active+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
 };
 const animateMedia=()=>{if(motion)gsap.fromTo(current(),{autoAlpha:0,scale:.985},{autoAlpha:1,scale:1,duration:.34,ease:'power2.out',clearProps:'transform'})};
 const open=i=>{
  if(closing)return;
  returnFocus=tiles[i];previousOverflow=document.body.style.overflow;pausePreviews();show(i);
  dialog.classList.add('open');dialog.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
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
 items.forEach((item,i)=>{
  const tile=document.createElement('button');tile.type='button';tile.className='preview-image';
  tile.dataset.previewIndex=i;tile.setAttribute('aria-label',(item.type==='video'?'Play video: ':'View photograph: ')+(item.alt||'Elevation Security Group media'));
  if(item.type==='video'){
   tile.classList.add('preview-video-tile');
   const thumb=document.createElement('video');thumb.className='preview-thumb';thumb.muted=true;thumb.loop=true;thumb.playsInline=true;thumb.preload='none';thumb.setAttribute('aria-hidden','true');thumb.dataset.src=asset(item);tile.append(thumb);previews.push(thumb);observer?.observe(thumb);
   if(!observer){thumb.src=thumb.dataset.src;thumb.play().catch(()=>{})}
   const play=document.createElement('span');play.className='preview-play';play.setAttribute('aria-hidden','true');play.textContent='▶';tile.append(play);
  }else{
   const thumb=document.createElement('img');thumb.src=asset(item);thumb.alt=item.alt||'Elevation Security Group photograph';thumb.loading='lazy';thumb.decoding='async';tile.append(thumb);
  }
  tile.addEventListener('click',()=>open(i));tiles.push(tile);container.append(tile);
 });
 dialog.querySelector('.lightbox-close').addEventListener('click',close);
 dialog.querySelector('.lightbox-prev').addEventListener('click',()=>navigate(-1));
 dialog.querySelector('.lightbox-next').addEventListener('click',()=>navigate(1));
 dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 stage.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
 stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>55)navigate(dx<0?1:-1)},{passive:true});
 document.addEventListener('keydown',e=>{if(!dialog.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')navigate(-1);if(e.key==='ArrowRight')navigate(1)});
})();