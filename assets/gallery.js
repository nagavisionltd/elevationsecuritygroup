(()=> {
 const grid=document.querySelector('#gallery-grid'),box=document.querySelector('#gallery-lightbox');
 if(!grid||!box)return;
 const base=new URL('./gallery/2026-gallery/',document.baseURI);
 const media=[
  {type:'image',file:'gallery-2.webp'},{type:'video',file:'VID-20261009-WA0014.mp4',poster:'gallery-6.webp'},
  {type:'image',file:'gallery-3.webp'},{type:'video',file:'VID-20261009-WA0015.mp4',poster:'gallery-7.webp'},
  {type:'image',file:'gallery-4.webp'},{type:'image',file:'gallery-5.webp'},
  {type:'video',file:'VID-20261009-WA0016.mp4',poster:'gallery-8.webp'},{type:'image',file:'gallery-6.webp'},
  {type:'image',file:'gallery-7.webp'},{type:'video',file:'VID-20261009-WA0017.mp4',poster:'gallery-9.webp'},
  {type:'image',file:'gallery-8.webp'},{type:'image',file:'gallery-9.webp'},
  {type:'video',file:'VID-20261009-WA0018.mp4',poster:'gallery-10.webp'},{type:'image',file:'gallery-10.webp'},
  {type:'image',file:'gallery-11.webp'},{type:'video',file:'VID-20261009-WA0020.mp4',poster:'gallery-11.webp'},
  {type:'image',file:'gallery-12.webp'},{type:'image',file:'gallery-13.webp'},
  {type:'video',file:'WhatsApp Video 2026-11-10 at 5.17.16 PM.mp4',poster:'gallery-12.webp'},
  {type:'image',file:'IMG-20260321-WA0047.jpg'},{type:'image',file:'IMG-20261007-WA0002.jpg'},
  {type:'video',file:'operations.mp4',poster:'gallery-13.webp'},{type:'image',file:'IMG-20261009-WA0019.jpg'}
 ];
 const asset=name=>new URL(encodeURIComponent(name),base).href;
 const gsap=window.gsap;
 const stage=box.querySelector('.preview-stage'),image=stage.querySelector('img'),video=stage.querySelector('video');
 const caption=box.querySelector('.preview-caption'),count=box.querySelector('.lightbox-count'),label=box.querySelector('.preview-media-label');
 let active=0,returnFocus=null,closing=false,touchStartX=0;
 const stopVideo=()=>{video.pause();video.removeAttribute('src');video.removeAttribute('poster');video.load();video.hidden=true;video.style.opacity=''};
 const currentTarget=()=>media[active].type==='video'?video:image;
 const show=i=>{
  active=(i+media.length)%media.length;const item=media[active];
  stopVideo();image.hidden=true;image.style.opacity='';
  if(item.type==='video'){
   video.hidden=false;video.src=asset(item.file);video.poster=asset(item.poster);video.load();
   video.play().catch(()=>{video.controls=true});
   label.textContent='ELEVATION / MOTION';
  }else{
   image.hidden=false;image.src=asset(item.file);image.alt='Elevation Security Group gallery photograph '+(active+1);
   label.textContent='ELEVATION / PHOTOGRAPHY';
  }
  count.textContent=String(active+1).padStart(2,'0')+' / '+String(media.length).padStart(2,'0');
  return item;
 };
 const flipFromTile=async(tile,item)=>{
  if(!gsap||!tile)return;
  const thumb=tile.querySelector('img');if(!thumb)return;
  const target=item.type==='video'?video:image;
  if(item.type==='image'&&image.decode){try{await image.decode()}catch(e){}}
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const from=thumb.getBoundingClientRect(),to=target.getBoundingClientRect();
  if(!from.width||!to.width)return;
  const clone=document.createElement('img');clone.className='gallery-flip-clone';
  clone.src=thumb.currentSrc||thumb.src;clone.alt='';
  Object.assign(clone.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});
  document.body.append(clone);target.style.opacity='0';
  gsap.to(clone,{left:to.left,top:to.top,width:to.width,height:to.height,duration:.78,ease:'power3.inOut',onComplete:()=>{clone.remove();target.style.opacity=''}});
 };
 const open=async(i,tile)=>{
  if(closing)return;
  returnFocus=document.activeElement;
  const item=show(i);
  box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  box.querySelector('.lightbox-close').focus();
  if(gsap){
   gsap.killTweensOf([box,stage,caption]);
   gsap.set(box,{autoAlpha:0});
   gsap.set(stage,{scale:1,y:0,transformOrigin:'50% 50%'});
   gsap.set(caption,{autoAlpha:0,y:12});
   gsap.to(box,{autoAlpha:1,duration:.3,ease:'power1.out'});
   gsap.to(caption,{autoAlpha:1,y:0,duration:.5,delay:.16,ease:'power2.out'});
   await flipFromTile(tile,item);
  }
 };
 const close=()=>{
  if(!box.classList.contains('open')||closing)return;
  closing=true;stopVideo();
  const finish=()=>{
   box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';
   image.removeAttribute('src');image.style.opacity='';closing=false;
   if(gsap)gsap.set([box,stage,caption],{clearProps:'all'});
   returnFocus?.focus();
  };
  if(gsap){gsap.to([stage,caption],{autoAlpha:0,y:10,scale:.985,duration:.2,ease:'power2.in'});gsap.to(box,{autoAlpha:0,duration:.26,ease:'power1.in',onComplete:finish})}
  else finish();
 };
 media.forEach((item,i)=>{
  const tile=document.createElement('button');tile.type='button';tile.className='masonry-item gallery-tile';tile.setAttribute('aria-label',(item.type==='video'?'Play video ':'View photograph ')+(i+1));tile.dataset.galleryIndex=i;
  const thumb=document.createElement('img');thumb.src=asset(item.type==='video'?item.poster:item.file);thumb.alt='';thumb.loading='lazy';thumb.decoding='async';
  tile.append(thumb);
  if(item.type==='video'){tile.classList.add('gallery-video-tile');const play=document.createElement('span');play.className='gallery-tile-play';play.setAttribute('aria-hidden','true');play.textContent='▶';tile.append(play)}
  tile.addEventListener('click',()=>open(i,tile));grid.append(tile);
 });
 const tiles=[...grid.querySelectorAll('.gallery-tile')];
 if(gsap&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  gsap.fromTo(tiles,{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.72,stagger:.045,ease:'power3.out',clearProps:'all',delay:.08});
 }
 box.querySelector('.lightbox-close').addEventListener('click',close);
 box.querySelector('.lightbox-prev').addEventListener('click',()=>{const item=show(active-1);if(gsap)gsap.fromTo(currentTarget(),{autoAlpha:0,scale:.985},{autoAlpha:1,scale:1,duration:.38,ease:'power2.out'})});
 box.querySelector('.lightbox-next').addEventListener('click',()=>{const item=show(active+1);if(gsap)gsap.fromTo(currentTarget(),{autoAlpha:0,scale:.985},{autoAlpha:1,scale:1,duration:.38,ease:'power2.out'})});
 box.addEventListener('click',e=>{if(e.target===box)close()});
 stage.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX},{passive:true});
 stage.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>55){show(active+(dx<0?1:-1));if(gsap)gsap.fromTo(currentTarget(),{autoAlpha:0,x:dx<0?18:-18},{autoAlpha:1,x:0,duration:.35,ease:'power2.out'})}},{passive:true});
 document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')box.querySelector('.lightbox-prev').click();if(e.key==='ArrowRight')box.querySelector('.lightbox-next').click()});
})();