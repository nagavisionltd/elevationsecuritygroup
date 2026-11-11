(()=>{
 const grid=document.querySelector('#gallery-grid'),box=document.querySelector('#gallery-lightbox');
 if(!grid||!box||!Array.isArray(window.ELEVATION_MEDIA))return;
 const media=window.ELEVATION_MEDIA.filter(item=>item.gallery).sort((a,b)=>a.galleryOrder-b.galleryOrder);
 const asset=item=>new URL(item.src,document.baseURI).href;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,gsap=window.gsap,motion=!!gsap&&!reduce;
 const stage=box.querySelector('.preview-stage'),image=stage.querySelector('img'),video=stage.querySelector('video');
 const caption=box.querySelector('.preview-caption'),count=box.querySelector('.lightbox-count'),label=box.querySelector('.preview-media-label');
 let active=0,returnFocus=null,previousOverflow='',closing=false,touchX=0;
 const tiles=[];
 const previewObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   const v=entry.target;
   if(entry.isIntersecting){
    if(!v.src){v.src=v.dataset.src;v.load()}
    const play=()=>v.play().catch(()=>{});
    if(v.readyState>=2)play();else v.addEventListener('loadeddata',play,{once:true});
   }else v.pause();
  });
 },{rootMargin:'180px 0px'}):null;
 const pausePreviews=()=>tiles.forEach(tile=>tile.querySelector('video')?.pause());
 const resumePreviews=()=>tiles.forEach(tile=>{
  const v=tile.querySelector('video');
  if(v&&v.getBoundingClientRect().bottom>0&&v.getBoundingClientRect().top<innerHeight)v.play().catch(()=>{});
 });
 const stopViewerVideo=()=>{video.pause();video.removeAttribute('src');video.load();video.hidden=true;video.controls=false};
 const current=()=>media[active].type==='video'?video:image;
 const show=i=>{
  active=(i+media.length)%media.length;
  const item=media[active];
  stopViewerVideo();image.hidden=true;
  if(item.type==='video'){
   video.hidden=false;video.controls=true;video.src=asset(item);video.load();video.play().catch(()=>{});
   label.textContent='ELEVATION / MOTION';
  }else{
   image.hidden=false;image.src=asset(item);image.alt=item.alt||'Elevation Security Group photograph';
   label.textContent='ELEVATION / PHOTOGRAPHY';
  }
  count.textContent=String(active+1).padStart(2,'0')+' / '+String(media.length).padStart(2,'0');
 };
 const animateMedia=()=>{if(motion)gsap.fromTo(current(),{autoAlpha:0,scale:.985},{autoAlpha:1,scale:1,duration:.34,ease:'power2.out',clearProps:'transform'})};
 const open=(i,tile)=>{
  if(closing)return;
  returnFocus=tile||document.activeElement;previousOverflow=document.body.style.overflow;
  pausePreviews();show(i);box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  if(motion){
   gsap.set(box,{autoAlpha:0});gsap.set(stage,{autoAlpha:0,scale:.985,y:10});gsap.set(caption,{autoAlpha:0,y:8});
   gsap.to(box,{autoAlpha:1,duration:.24,ease:'power1.out'});
   gsap.to(stage,{autoAlpha:1,scale:1,y:0,duration:.42,ease:'power3.out',delay:.04});
   gsap.to(caption,{autoAlpha:1,y:0,duration:.32,ease:'power2.out',delay:.12});
  }
  box.querySelector('.lightbox-close').focus();
 };
 const close=()=>{
  if(!box.classList.contains('open')||closing)return;
  closing=true;stopViewerVideo();
  const finish=()=>{
   box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow=previousOverflow;
   image.removeAttribute('src');image.hidden=true;closing=false;
   if(motion)gsap.set([box,stage,caption],{clearProps:'all'});
   returnFocus?.focus();resumePreviews();
  };
  if(motion)gsap.to(box,{autoAlpha:0,duration:.2,ease:'power1.in',onComplete:finish});else finish();
 };
 const navigate=delta=>{
  if(closing)return;
  const next=active+delta;
  if(motion)gsap.to(current(),{autoAlpha:0,duration:.12,ease:'power1.in',onComplete:()=>{show(next);animateMedia()}});
  else show(next);
 };
 media.forEach((item,i)=>{
  const tile=document.createElement('button');tile.type='button';tile.className='masonry-item gallery-tile';
  tile.setAttribute('aria-label',(item.type==='video'?'Play video ':'View photograph ')+(i+1));
  tile.dataset.mediaId=item.id;
  if(item.type==='video'){
   tile.classList.add('gallery-video-tile');
   const preview=document.createElement('video');preview.className='gallery-video-preview';preview.muted=true;preview.loop=true;preview.playsInline=true;preview.preload='none';preview.setAttribute('aria-hidden','true');preview.dataset.src=asset(item);
   tile.append(preview);
   const play=document.createElement('span');play.className='gallery-tile-play';play.setAttribute('aria-hidden','true');play.textContent='▶';tile.append(play);
   if(previewObserver)previewObserver.observe(preview);else{preview.src=preview.dataset.src;preview.play().catch(()=>{})}
  }else{
   const thumb=document.createElement('img');thumb.src=asset(item);thumb.alt=item.alt||'Elevation Security Group photograph';thumb.loading='lazy';thumb.decoding='async';tile.append(thumb);
  }
  tile.addEventListener('click',()=>open(i,tile));tiles.push(tile);grid.append(tile);
 });
 box.querySelector('.lightbox-close').addEventListener('click',close);
 box.querySelector('.lightbox-prev').addEventListener('click',()=>navigate(-1));
 box.querySelector('.lightbox-next').addEventListener('click',()=>navigate(1));
 box.addEventListener('click',e=>{if(e.target===box)close()});
 stage.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
 stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>55)navigate(dx<0?1:-1)},{passive:true});
 document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')navigate(-1);if(e.key==='ArrowRight')navigate(1)});
 if(motion)gsap.fromTo(tiles,{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.55,stagger:.025,ease:'power2.out',clearProps:'all'});
})();