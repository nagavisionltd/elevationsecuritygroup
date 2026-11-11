(()=>{
 const grid=document.querySelector('#gallery-grid');
 const box=document.querySelector('#gallery-lightbox');
 if(!grid||!box)return;
 const base=new URL('./gallery/2026-gallery/',document.baseURI);
 const media=[
  {type:'image',file:'gallery-2.webp',alt:'Elevation Security Group photograph'},
  {type:'video',file:'VID-20261009-WA0014.mp4',alt:'Elevation Security Group video'},
  {type:'image',file:'gallery-3.webp',alt:'Elevation Security Group photograph'},
  {type:'video',file:'VID-20261009-WA0015.mp4',alt:'Elevation Security Group video'},
  {type:'image',file:'gallery-4.webp',alt:'Elevation Security Group photograph'},
  {type:'image',file:'gallery-5.webp',alt:'Elevation Security Group photograph'},
  {type:'video',file:'VID-20261009-WA0016.mp4',alt:'Elevation Security Group video'},
  {type:'image',file:'gallery-7.webp',alt:'Elevation Security Group photograph'},
  {type:'video',file:'VID-20261009-WA0017.mp4',alt:'Elevation Security Group video'},
  {type:'image',file:'gallery-8.webp',alt:'Elevation Security Group photograph'},
  {type:'video',file:'VID-20261009-WA0018.mp4',alt:'Elevation Security Group video'},
  {type:'image',file:'gallery-10.webp',alt:'Elevation Security Group photograph'},
  {type:'image',file:'gallery-11.webp',alt:'Elevation Security Group photograph'},
  {type:'video',file:'VID-20261009-WA0020.mp4',alt:'Elevation Security Group video'},
  {type:'video',file:'WhatsApp Video 2026-11-10 at 5.17.16 PM.mp4',alt:'Elevation Security Group video'},
  {type:'image',file:'IMG-20260321-WA0047.jpg',alt:'Elevation Security Group photograph'},
  {type:'image',file:'IMG-20261007-WA0002.jpg',alt:'Elevation Security Group photograph'},
  {type:'image',file:'IMG-20261009-WA0019.jpg',alt:'Elevation Security Group photograph'}
 ];
 const asset=file=>new URL(encodeURIComponent(file),base).href;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const gsap=window.gsap;
 const motion=!!gsap&&!reduce;
 const stage=box.querySelector('.preview-stage');
 const image=stage.querySelector('img');
 const video=stage.querySelector('video');
 const caption=box.querySelector('.preview-caption');
 const count=box.querySelector('.lightbox-count');
 const label=box.querySelector('.preview-media-label');
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
  stopViewerVideo();
  image.hidden=true;
  if(item.type==='video'){
   video.hidden=false;video.controls=true;video.src=asset(item.file);video.load();
   video.play().catch(()=>{});
   label.textContent='ELEVATION / MOTION';
  }else{
   image.hidden=false;image.src=asset(item.file);image.alt=item.alt;
   label.textContent='ELEVATION / PHOTOGRAPHY';
  }
  count.textContent=String(active+1).padStart(2,'0')+' / '+String(media.length).padStart(2,'0');
  return item;
 };
 const animateMedia=()=>{
  if(!motion)return;
  gsap.fromTo(current(),{autoAlpha:0,scale:.985},{autoAlpha:1,scale:1,duration:.34,ease:'power2.out',clearProps:'transform'});
 };
 const open=(i,tile)=>{
  if(closing)return;
  returnFocus=tile||document.activeElement;
  previousOverflow=document.body.style.overflow;
  pausePreviews();show(i);
  box.classList.add('open');box.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  if(motion){
   gsap.set(box,{autoAlpha:0});
   gsap.set(stage,{autoAlpha:0,scale:.985,y:10});
   gsap.set(caption,{autoAlpha:0,y:8});
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
   box.classList.remove('open');box.setAttribute('aria-hidden','true');
   document.body.style.overflow=previousOverflow;
   image.removeAttribute('src');image.hidden=true;closing=false;
   if(motion)gsap.set([box,stage,caption],{clearProps:'all'});
   returnFocus?.focus();resumePreviews();
  };
  if(motion)gsap.to(box,{autoAlpha:0,duration:.2,ease:'power1.in',onComplete:finish});
  else finish();
 };
 const navigate=delta=>{
  if(closing)return;
  const next=active+delta;
  if(motion)gsap.to(current(),{autoAlpha:0,duration:.12,ease:'power1.in',onComplete:()=>{show(next);animateMedia()}});
  else show(next);
 };
 media.forEach((item,i)=>{
  const tile=document.createElement('button');
  tile.type='button';tile.className='masonry-item gallery-tile';
  tile.setAttribute('aria-label',(item.type==='video'?'Play video ':'View photograph ')+(i+1));
  tile.dataset.galleryIndex=i;
  if(item.type==='video'){
   tile.classList.add('gallery-video-tile');
   const preview=document.createElement('video');
   preview.className='gallery-video-preview';preview.muted=true;preview.loop=true;preview.playsInline=true;preview.preload='none';preview.setAttribute('aria-hidden','true');preview.dataset.src=asset(item.file);
   tile.append(preview);
   const play=document.createElement('span');play.className='gallery-tile-play';play.setAttribute('aria-hidden','true');play.textContent='▶';tile.append(play);
   if(previewObserver)previewObserver.observe(preview);
   else{preview.src=preview.dataset.src;preview.play().catch(()=>{})}
  }else{
   const thumb=document.createElement('img');thumb.src=asset(item.file);thumb.alt=item.alt;thumb.loading='lazy';thumb.decoding='async';tile.append(thumb);
  }
  tile.addEventListener('click',()=>open(i,tile));
  tiles.push(tile);grid.append(tile);
 });
 const navIn=box.querySelector('.lightbox-prev'),navOut=box.querySelector('.lightbox-next');
 box.querySelector('.lightbox-close').addEventListener('click',close);
 navIn.addEventListener('click',()=>navigate(-1));
 navOut.addEventListener('click',()=>navigate(1));
 box.addEventListener('click',e=>{if(e.target===box)close()});
 stage.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
 stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>55)navigate(dx<0?1:-1)},{passive:true});
 document.addEventListener('keydown',e=>{
  if(!box.classList.contains('open'))return;
  if(e.key==='Escape')close();
  if(e.key==='ArrowLeft')navigate(-1);
  if(e.key==='ArrowRight')navigate(1);
 });
 if(motion)gsap.fromTo(tiles,{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.55,stagger:.025,ease:'power2.out',clearProps:'all'});
})();