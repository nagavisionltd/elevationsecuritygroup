(()=> {
 const grid=document.querySelector('#gallery-grid'),box=document.querySelector('.lightbox');
 if(!grid||!box)return;
 const base=new URL('./gallery/2026-gallery/',document.baseURI);
 const photos=['gallery-2.webp','gallery-3.webp','gallery-4.webp','gallery-5.webp','gallery-6.webp','gallery-7.webp','gallery-8.webp','gallery-9.webp','gallery-10.webp','gallery-11.webp','gallery-12.webp','gallery-13.webp','IMG-20260321-WA0047.jpg','IMG-20261007-WA0002.jpg','IMG-20261009-WA0019.jpg'];
 const videos=[{file:'VID-20261009-WA0014.mp4',poster:'gallery-6.webp'},{file:'VID-20261009-WA0015.mp4',poster:'gallery-7.webp'},{file:'VID-20261009-WA0016.mp4',poster:'gallery-8.webp'},{file:'VID-20261009-WA0017.mp4',poster:'gallery-9.webp'},{file:'VID-20261009-WA0018.mp4',poster:'gallery-10.webp'},{file:'VID-20261009-WA0020.mp4',poster:'gallery-11.webp'},{file:'WhatsApp Video 2026-11-10 at 5.17.16 PM.mp4',poster:'gallery-12.webp'},{file:'operations.mp4',poster:'gallery-13.webp'}];
 const url=n=>new URL(encodeURIComponent(n),base).href;
 grid.classList.add('gallery-rail');
 const lightboxImage=box.querySelector('img'),count=box.querySelector('.lightbox-count');
 const loaded=new Set();
 let available=[],active=0,returnFocus=null;
 const refreshAvailable=()=>{available=photos.filter(file=>loaded.has(file))};
 const show=i=>{if(!available.length)return;active=(i+available.length)%available.length;lightboxImage.src=url(available[active]);lightboxImage.alt='Elevation Security Group gallery photograph '+(active+1);count.textContent=String(active+1).padStart(2,'0')+' / '+String(available.length).padStart(2,'0')};
 const open=i=>{refreshAvailable();if(i<0||!available.length)return;returnFocus=document.activeElement;show(i);box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';box.querySelector('.lightbox-close').focus()};
 const close=()=>{box.classList.remove('open');box.setAttribute('aria-hidden','true');lightboxImage.src='';document.body.style.overflow='';returnFocus?.focus()};
 photos.forEach((file)=>{
  const b=document.createElement('button');b.type='button';b.className='masonry-item';b.setAttribute('aria-label','Enlarge photograph');
  const img=document.createElement('img');img.src=url(file);img.alt='Elevation Security Group operations';img.loading='lazy';img.decoding='async';
  img.onload=()=>{loaded.add(file);refreshAvailable()};
  img.onerror=()=>b.remove();b.append(img);b.addEventListener('click',()=>open(available.indexOf(file)));grid.append(b);
 });
 videos.forEach(({file,poster},i)=>{
  const item=document.createElement('div');item.className='masonry-item gallery-video';
  const v=document.createElement('video');v.src=url(file);v.poster=url(poster);v.preload='none';v.muted=true;v.playsInline=true;
  const play=document.createElement('button');play.type='button';play.className='gallery-play';play.setAttribute('aria-label','Play video '+(i+1));play.innerHTML='<span aria-hidden="true">▶</span>';
  const stop=()=>{v.pause();v.controls=false;play.hidden=false;play.focus()};
  play.addEventListener('click',()=>{v.controls=true;v.muted=false;play.hidden=true;v.play().catch(()=>{v.controls=false;play.hidden=false})});
  v.addEventListener('ended',()=>{v.controls=false;play.hidden=false});
  v.addEventListener('error',()=>item.remove());
  item.append(v,play);grid.append(item);
 });
 box.querySelector('.lightbox-close').addEventListener('click',close);
 box.querySelector('.lightbox-prev').addEventListener('click',()=>show(active-1));
 box.querySelector('.lightbox-next').addEventListener('click',()=>show(active+1));
 box.addEventListener('click',e=>{if(e.target===box)close()});
 document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(active-1);if(e.key==='ArrowRight')show(active+1)});
})();