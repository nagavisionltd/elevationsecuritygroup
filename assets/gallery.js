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
 const stage=box.querySelector('.preview-stage'),image=stage.querySelector('img'),video=stage.querySelector('video');
 const count=box.querySelector('.lightbox-count'),label=box.querySelector('.preview-media-label');
 let active=0,returnFocus=null;
 const stopVideo=()=>{video.pause();video.removeAttribute('src');video.removeAttribute('poster');video.load();video.hidden=true};
 const show=i=>{
  active=(i+media.length)%media.length;const item=media[active];
  stopVideo();image.hidden=true;
  if(item.type==='video'){
   video.hidden=false;video.src=asset(item.file);video.poster=asset(item.poster);video.load();
   video.play().catch(()=>{video.controls=true});
   label.textContent='ELEVATION / MOTION';
  }else{
   image.hidden=false;image.src=asset(item.file);image.alt='Elevation Security Group gallery photograph '+(active+1);
   label.textContent='ELEVATION / PHOTOGRAPHY';
  }
  count.textContent=String(active+1).padStart(2,'0')+' / '+String(media.length).padStart(2,'0');
 };
 const open=i=>{returnFocus=document.activeElement;show(i);box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';box.querySelector('.lightbox-close').focus()};
 const close=()=>{box.classList.remove('open');box.setAttribute('aria-hidden','true');stopVideo();image.removeAttribute('src');document.body.style.overflow='';returnFocus?.focus()};
 media.forEach((item,i)=>{
  const tile=document.createElement('button');tile.type='button';tile.className='masonry-item gallery-tile';tile.setAttribute('aria-label',(item.type==='video'?'Play video ':'View photograph ')+(i+1));
  const thumb=document.createElement('img');thumb.src=asset(item.type==='video'?item.poster:item.file);thumb.alt='';thumb.loading='lazy';thumb.decoding='async';
  tile.append(thumb);
  if(item.type==='video'){tile.classList.add('gallery-video-tile');const play=document.createElement('span');play.className='gallery-tile-play';play.setAttribute('aria-hidden','true');play.textContent='▶';tile.append(play)}
  tile.addEventListener('click',()=>open(i));grid.append(tile);
 });
 box.querySelector('.lightbox-close').addEventListener('click',close);
 box.querySelector('.lightbox-prev').addEventListener('click',()=>show(active-1));
 box.querySelector('.lightbox-next').addEventListener('click',()=>show(active+1));
 box.addEventListener('click',e=>{if(e.target===box)close()});
 document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(active-1);if(e.key==='ArrowRight')show(active+1)});
})();