(()=> {
 const grid=document.querySelector('#gallery-grid');
 const box=document.querySelector('.lightbox');
 if(!grid||!box){console.error('Gallery: required gallery elements are missing.');return;}
 const base=new URL('./gallery/2026-gallery/',document.baseURI);
 const photos=['gallery-2.webp','gallery-3.webp','gallery-4.webp','gallery-5.webp','gallery-6.webp','gallery-7.webp','gallery-8.webp','gallery-9.webp','gallery-10.webp','gallery-11.webp','gallery-12.webp','gallery-13.webp','IMG-20260321-WA0047.jpg','IMG-20261007-WA0002.jpg','IMG-20261009-WA0019.jpg'];
 const videos=['operations.mp4','VID-20261009-WA0014.mp4','VID-20261009-WA0015.mp4','VID-20261009-WA0016.mp4','VID-20261009-WA0017.mp4','VID-20261009-WA0018.mp4','VID-20261009-WA0020.mp4','WhatsApp Video 2026-11-10 at 5.17.16 PM.mp4'];
 const url=name=>new URL(encodeURIComponent(name),base).href;
 const image=box.querySelector('img'),count=box.querySelector('.lightbox-count');
 let availablePhotos=[],current=0,loaded=0,failed=0;
 const total=photos.length+videos.length;
 function updateFailure(){if(failed===total&&loaded===0)grid.innerHTML='<p class="gallery-load-error">Gallery media could not be loaded. Please upload the complete <code>gallery/2026-gallery</code> folder beside gallery.html.</p>';}
 function show(i){if(!availablePhotos.length)return;current=(i+availablePhotos.length)%availablePhotos.length;image.src=url(availablePhotos[current]);image.alt='Elevation Security Group gallery photograph '+(current+1);count.textContent=String(current+1).padStart(2,'0')+' / '+String(availablePhotos.length).padStart(2,'0');}
 function open(file){const i=availablePhotos.indexOf(file);if(i<0)return;show(i);box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';box.querySelector('.lightbox-close').focus();}
 function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');image.src='';document.body.style.overflow='';}
 photos.forEach((file,i)=>{
  const button=document.createElement('button');button.className='masonry-item';button.type='button';button.setAttribute('aria-label','Open gallery photograph '+(i+1));
  const img=document.createElement('img');img.src=url(file);img.alt='Elevation Security Group operations and events';img.loading='lazy';img.decoding='async';
  img.onload=()=>{loaded++;availablePhotos.push(file);};img.onerror=()=>{failed++;button.remove();updateFailure();};
  button.append(img);button.addEventListener('click',()=>open(file));grid.append(button);
 });
 videos.forEach((file,i)=>{
  const wrap=document.createElement('div');wrap.className='masonry-item gallery-video';
  const video=document.createElement('video');video.src=url(file);video.controls=true;video.playsInline=true;video.preload='metadata';video.muted=true;video.setAttribute('aria-label','Elevation Security Group video '+(i+1));
  video.onloadedmetadata=()=>{loaded++;};video.onerror=()=>{failed++;wrap.remove();updateFailure();};
  wrap.append(video);grid.append(wrap);
 });
 box.querySelector('.lightbox-close').addEventListener('click',close);
 box.querySelector('.lightbox-prev').addEventListener('click',()=>show(current-1));
 box.querySelector('.lightbox-next').addEventListener('click',()=>show(current+1));
 box.addEventListener('click',e=>{if(e.target===box)close();});
 document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1);});
})();