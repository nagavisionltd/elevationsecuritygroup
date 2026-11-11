(()=> {
 const dialog=document.querySelector('#preview-lightbox');
 const items=[...document.querySelectorAll('.gallery-preview-rail [data-preview-index]')];
 if(!dialog||!items.length)return;
 const base=new URL('gallery/2026-gallery/',document.baseURI);
 const stage=dialog.querySelector('.preview-stage'),image=stage.querySelector('img'),video=stage.querySelector('video'),count=dialog.querySelector('.lightbox-count'),label=dialog.querySelector('.preview-media-label');
 let active=0,returnFocus=null;
 const asset=name=>new URL(encodeURIComponent(name),base).href;
 const stopVideo=()=>{video.pause();video.removeAttribute('src');video.removeAttribute('poster');video.load();video.hidden=true};
 const show=i=>{
  active=(i+items.length)%items.length;
  const item=items[active],kind=item.dataset.media||'image',src=item.dataset.src;
  stopVideo();image.hidden=true;
  if(kind==='video'){
   video.hidden=false;video.src=asset(src);video.poster=asset(item.dataset.poster||'poster.jpg');video.load();video.play().catch(()=>{});
   label.textContent='ELEVATION / MOTION';
  }else{
   video.hidden=true;image.hidden=false;image.src=asset(src);image.alt=item.querySelector('img')?.alt||'Elevation Security Group gallery photograph';
   label.textContent='ELEVATION / PHOTOGRAPHY';
  }
  count.textContent=String(active+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
 };
 const open=i=>{returnFocus=document.activeElement;show(i);dialog.classList.add('open');dialog.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';dialog.querySelector('.lightbox-close').focus()};
 const close=()=>{dialog.classList.remove('open');dialog.setAttribute('aria-hidden','true');stopVideo();image.removeAttribute('src');document.body.style.overflow='';returnFocus?.focus()};
 items.forEach((item,i)=>item.addEventListener('click',()=>open(i)));
 dialog.querySelector('.lightbox-close').addEventListener('click',close);
 dialog.querySelector('.lightbox-prev').addEventListener('click',()=>show(active-1));
 dialog.querySelector('.lightbox-next').addEventListener('click',()=>show(active+1));
 dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 document.addEventListener('keydown',e=>{if(!dialog.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(active-1);if(e.key==='ArrowRight')show(active+1)});
})();