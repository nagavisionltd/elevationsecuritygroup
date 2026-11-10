(()=> {
 const grid=document.querySelector('#gallery-grid'),box=document.querySelector('.lightbox');
 if(!grid||!box)return;
 const base=new URL('./gallery/2026-gallery/',document.baseURI);
 const photos=['gallery-2.webp','gallery-3.webp','gallery-4.webp','gallery-5.webp','gallery-6.webp','gallery-7.webp','gallery-8.webp','gallery-9.webp','gallery-10.webp','gallery-11.webp','gallery-12.webp','gallery-13.webp','IMG-20260321-WA0047.jpg','IMG-20261007-WA0002.jpg','IMG-20261009-WA0019.jpg'];
 const videos=['VID-20261009-WA0014.mp4','VID-20261009-WA0015.mp4','VID-20261009-WA0016.mp4','VID-20261009-WA0017.mp4','VID-20261009-WA0018.mp4','VID-20261009-WA0020.mp4','WhatsApp Video 2026-11-10 at 5.17.16 PM.mp4','operations.mp4'];
 const url=n=>new URL(encodeURIComponent(n),base).href;
 grid.classList.add('gallery-rail');
 const lightboxImage=box.querySelector('img'),count=box.querySelector('.lightbox-count');
 let available=[],active=0;
 const show=i=>{active=(i+available.length)%available.length;lightboxImage.src=url(available[active]);lightboxImage.alt='Elevation Security Group gallery photograph '+(active+1);count.textContent=String(active+1).padStart(2,'0')+' / '+String(available.length).padStart(2,'0')};
 const open=i=>{if(!available.length)return;show(i);box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';box.querySelector('.lightbox-close').focus()};
 const close=()=>{box.classList.remove('open');box.setAttribute('aria-hidden','true');lightboxImage.src='';document.body.style.overflow=''};
 photos.forEach((file)=>{
  const b=document.createElement('button');b.type='button';b.className='masonry-item';b.setAttribute('aria-label','Enlarge photograph');
  const img=document.createElement('img');img.src=url(file);img.alt='Elevation Security Group operations';img.loading='lazy';img.decoding='async';
  img.onload=()=>{if(!available.includes(file))available.push(file)};
  img.onerror=()=>b.remove();b.append(img);b.addEventListener('click',()=>open(available.indexOf(file)));grid.append(b);
 });
 videos.forEach((file,i)=>{
  const b=document.createElement('button');b.type='button';b.className='masonry-item gallery-video';b.setAttribute('aria-label','Play video '+(i+1));
  const v=document.createElement('video');v.src=url(file);v.poster=url('poster.jpg');v.preload='none';v.muted=true;v.playsInline=true;
  const play=document.createElement('span');play.className='gallery-play';play.innerHTML='<span aria-hidden="true">▶</span>';
  b.append(v,play);
  b.addEventListener('click',()=>{if(v.paused){v.controls=true;v.muted=false;play.hidden=true;v.play().catch(()=>{play.hidden=false})}else{v.pause();v.controls=false;play.hidden=false}});
  v.addEventListener('ended',()=>{v.controls=false;play.hidden=false});
  v.addEventListener('error',()=>b.remove());grid.append(b);
 });
 box.querySelector('.lightbox-close').addEventListener('click',close);
 box.querySelector('.lightbox-prev').addEventListener('click',()=>show(active-1));
 box.querySelector('.lightbox-next').addEventListener('click',()=>show(active+1));
 box.addEventListener('click',e=>{if(e.target===box)close()});
 document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(active-1);if(e.key==='ArrowRight')show(active+1)});
})();