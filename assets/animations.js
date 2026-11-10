(()=> {
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const items=[...document.querySelectorAll('.reveal')];
 if(!window.gsap||reduce){
  items.forEach(el=>el.classList.add('visible'));
  return;
 }
 const gsap=window.gsap;
 gsap.config({nullTargetWarn:false});
 const isMobile=window.matchMedia('(max-width: 700px)').matches;
 const distance=isMobile?34:76;
 const hero=gsap.timeline({defaults:{ease:'power4.out'}});
 hero.from('.hero-kicker',{y:24,opacity:.35,duration:.65})
     .from('.hero h1',{y:72,opacity:.35,duration:1.05},'-.25')
     .from('.hero-bottom > *',{y:34,opacity:.4,duration:.75,stagger:.14},'-.48')
     .from('.scroll-cue',{x:18,opacity:0,duration:.55},'-.3');

 const direction=(el,index)=>{
  if(el.matches('.director-image')) return {x:-distance,y:10};
  if(el.matches('.director-copy,.contact-form')) return {x:distance,y:8};
  if(el.matches('.section-head')) return {x:-distance*.65,y:8};
  if(el.matches('.preview-grid')) return {x:distance*.55,y:12};
  if(el.matches('.service-card')) return {x:index%2===0?-distance*.55:distance*.55,y:18};
  return {x:0,y:distance*.55};
 };
 const groups=[...document.querySelectorAll('.service-grid,.preview-grid')];
 const grouped=new Set(groups.flatMap(g=>[...g.children]));
 items.forEach((el,index)=>{
  if(grouped.has(el)) return;
  const start=direction(el,index);
  gsap.set(el,{x:start.x,y:start.y,opacity:.35,willChange:'transform,opacity'});
 });
 const revealOne=(el)=>{
  const start=direction(el,0);
  gsap.to(el,{x:0,y:0,opacity:1,duration:.95,ease:'power4.out',clearProps:'transform,willChange',onStart:()=>el.classList.add('visible')});
  const image=el.querySelector(':scope > img, .director-image img');
  if(image) gsap.fromTo(image,{scale:1.08},{scale:1,duration:1.3,ease:'power3.out',overwrite:'auto'});
 };
 const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   io.unobserve(entry.target);
   revealOne(entry.target);
  });
 },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 items.filter(el=>!grouped.has(el)).forEach(el=>io.observe(el));

 groups.forEach(group=>{
  const cards=[...group.children];
  cards.forEach((card,index)=>{
   const start=card.classList.contains('service-card')
    ? {x:index%2===0?-distance*.55:distance*.55,y:18}
    : {x:0,y:distance*.42};
   gsap.set(card,{...start,opacity:.25,willChange:'transform,opacity'});
  });
  const groupObserver=new IntersectionObserver(entries=>{
   if(!entries[0].isIntersecting)return;
   groupObserver.disconnect();
   gsap.to(cards,{x:0,y:0,opacity:1,duration:.9,stagger:.13,ease:'power4.out',clearProps:'transform,willChange',onStart:()=>cards.forEach(c=>c.classList.add('visible'))});
  },{threshold:.12,rootMargin:'0px 0px -5% 0px'});
  groupObserver.observe(group);
 });

 if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('.preview-image,.service-card').forEach(el=>{
   el.addEventListener('mouseenter',()=>gsap.to(el,{y:-5,duration:.28,ease:'power2.out'}));
   el.addEventListener('mouseleave',()=>gsap.to(el,{y:0,duration:.34,ease:'power2.out'}));
  });
 }
})();