(()=> {
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!window.gsap||reduce){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));return;}
 const gsap=window.gsap;
 gsap.config({nullTargetWarn:false});
 const hero=gsap.timeline({defaults:{ease:'power3.out'}});
 hero.from('.hero-kicker',{y:18,opacity:0,duration:.7})
     .from('.hero h1',{y:54,opacity:0,duration:1.05},'-=.28')
     .from('.hero-bottom > *',{y:24,opacity:0,duration:.8,stagger:.16},'-=.48')
     .from('.scroll-cue',{opacity:0,duration:.7},'-=.35');
 const revealItems=[...document.querySelectorAll('.reveal')];
 revealItems.forEach(el=>gsap.set(el,{opacity:0,y:34}));
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const el=entry.target;
   observer.unobserve(el);
   gsap.to(el,{opacity:1,y:0,duration:.9,ease:'power3.out',clearProps:'transform'});
   const image=el.querySelector(':scope > img, .director-image img, .service-card img');
   if(image)gsap.fromTo(image,{scale:1.075},{scale:1,duration:1.25,ease:'power2.out'});
  });
 },{threshold:.14,rootMargin:'0px 0px -7% 0px'});
 revealItems.forEach(el=>observer.observe(el));
 document.querySelectorAll('.service-card').forEach((el,i)=>{
  gsap.fromTo(el,{y:42,opacity:0},{y:0,opacity:1,duration:.85,delay:(i%2)*.1,ease:'power3.out',scrollTrigger:null,
   onStart:()=>el.classList.add('gsap-animated'),
   scrollTrigger:undefined,
  });
 });
 const staggerGroups=['.service-grid','.preview-grid'];
 staggerGroups.forEach(selector=>{
  const group=document.querySelector(selector);if(!group)return;
  const cards=[...group.children];
  gsap.set(cards,{opacity:0,y:26});
  const io=new IntersectionObserver(entries=>{
   if(!entries[0].isIntersecting)return;
   io.disconnect();
   gsap.to(cards,{opacity:1,y:0,duration:.75,stagger:.12,ease:'power3.out',clearProps:'transform'});
  },{threshold:.12});
  io.observe(group);
 });
 document.querySelectorAll('.section-head h2,.director-copy h2,.contact h2').forEach(el=>{
  gsap.from(el,{y:28,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:undefined,
   onStart:()=>{},paused:true});
  const io=new IntersectionObserver(entries=>{
   if(!entries[0].isIntersecting)return;
   io.disconnect();
   gsap.to(el,{y:0,opacity:1,duration:.85,ease:'power3.out'});
  },{threshold:.25});
  io.observe(el);
 });
 document.querySelectorAll('.preview-image,.service-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>gsap.to(el,{y:-5,duration:.3,ease:'power2.out'}));
  el.addEventListener('mouseleave',()=>gsap.to(el,{y:0,duration:.35,ease:'power2.out'}));
 });
})();