(()=>{
 const media=[
  {id:'service-door',type:'image',src:'gallery/gallery-12-door-supervision.webp',alt:'Door supervision team at an event',service:'Door Supervision',gallery:false,home:false},
  {id:'service-close-protection',type:'image',src:'gallery/gallery-6-close-protection.webp',alt:'Close protection team at an event',service:'Close Protection',gallery:false,home:false},
  {id:'service-festival',type:'image',src:'gallery/gallery-13-festival-event-security.webp',alt:'Festival and event security at a live venue',service:'Festival & Event Security',gallery:false,home:false},
  {id:'service-boxing',type:'image',src:'gallery/gallery-9-boxing-mma.webp',alt:'Security escort at a boxing and MMA event',service:'Boxing & MMA',gallery:false,home:false},

  {id:'photo-02',type:'image',src:'gallery/2026-gallery/gallery-2.webp',alt:'Michael Quinn with a guest at a venue',gallery:true,home:true,galleryOrder:1,homeOrder:1},
  {id:'video-14',type:'video',src:'gallery/2026-gallery/VID-20261009-WA0014.mp4',alt:'Elevation Security Group event footage',gallery:true,home:true,galleryOrder:2,homeOrder:2},
  {id:'photo-03',type:'image',src:'gallery/2026-gallery/gallery-3.webp',alt:'Michael Quinn with a guest in a venue corridor',gallery:true,home:true,galleryOrder:3,homeOrder:3},
  {id:'video-15',type:'video',src:'gallery/2026-gallery/VID-20261009-WA0015.mp4',alt:'Elevation Security Group event footage',gallery:true,home:true,galleryOrder:4,homeOrder:5},
  {id:'photo-04',type:'image',src:'gallery/2026-gallery/gallery-4.webp',alt:'Michael Quinn with a guest at a live event',gallery:true,home:true,galleryOrder:5,homeOrder:4},
  {id:'photo-05',type:'image',src:'gallery/2026-gallery/gallery-5.webp',alt:'Michael Quinn with a guest at an event',gallery:true,home:true,galleryOrder:6,homeOrder:6},
  {id:'video-16',type:'video',src:'gallery/2026-gallery/VID-20261009-WA0016.mp4',alt:'Elevation Security Group event footage',gallery:true,home:true,galleryOrder:7,homeOrder:8},
  {id:'photo-07',type:'image',src:'gallery/2026-gallery/gallery-7.webp',alt:'Michael Quinn with a guest at a venue',gallery:true,home:false,galleryOrder:8},
  {id:'video-17',type:'video',src:'gallery/2026-gallery/VID-20261009-WA0017.mp4',alt:'Elevation Security Group event footage',gallery:true,home:true,galleryOrder:9,homeOrder:10},
  {id:'photo-08',type:'image',src:'gallery/2026-gallery/gallery-8.webp',alt:'Michael Quinn with a guest in a hotel setting',gallery:true,home:true,galleryOrder:10,homeOrder:7},
  {id:'video-18',type:'video',src:'gallery/2026-gallery/VID-20261009-WA0018.mp4',alt:'Elevation Security Group event footage',gallery:true,home:false,galleryOrder:11},
  {id:'photo-10',type:'image',src:'gallery/2026-gallery/gallery-10.webp',alt:'Michael Quinn with a guest at a venue',gallery:true,home:true,galleryOrder:12,homeOrder:9},
  {id:'photo-11',type:'image',src:'gallery/2026-gallery/gallery-11.webp',alt:'Michael Quinn with a guest',gallery:true,home:true,galleryOrder:13,homeOrder:11},
  {id:'video-20',type:'video',src:'gallery/2026-gallery/VID-20261009-WA0020.mp4',alt:'Elevation Security Group event footage',gallery:true,home:false,galleryOrder:14},
  {id:'video-whatsapp-2026-11-10',type:'video',src:'gallery/2026-gallery/WhatsApp Video 2026-11-10 at 5.17.16 PM.mp4',alt:'Elevation Security Group event footage',gallery:true,home:false,galleryOrder:15},
  {id:'photo-march-2026',type:'image',src:'gallery/2026-gallery/IMG-20260321-WA0047.jpg',alt:'Security team member at an MMA event',gallery:true,home:false,galleryOrder:16},
  {id:'photo-poster-dec-2026',type:'image',src:'gallery/2026-gallery/IMG-20261007-WA0002.jpg',alt:'Boxing event promotional poster',gallery:true,home:false,galleryOrder:17},
  {id:'photo-event-sept-2026',type:'image',src:'gallery/2026-gallery/IMG-20261009-WA0019.jpg',alt:'Boxing event promotional display',gallery:true,home:true,galleryOrder:18,homeOrder:12}
  ,{id:'photo-06',type:'image',src:'gallery/2026-gallery/gallery-6.webp',alt:'Close protection at a live event',gallery:true,home:false,galleryOrder:19}
  ,{id:'photo-09',type:'image',src:'gallery/2026-gallery/gallery-9.webp',alt:'Boxing and MMA event security',gallery:true,home:false,galleryOrder:20}
  ,{id:'photo-12',type:'image',src:'gallery/2026-gallery/gallery-12.webp',alt:'Door supervision at a venue',gallery:true,home:false,galleryOrder:21}
  ,{id:'photo-13',type:'image',src:'gallery/2026-gallery/gallery-13.webp',alt:'Festival and event security',gallery:true,home:false,galleryOrder:22}
 ];
 window.ELEVATION_MEDIA=Object.freeze(media.map(item=>Object.freeze(item)));
 const byId=new Map(media.map(item=>[item.id,item]));
 document.querySelectorAll('[data-media-id]').forEach(el=>{
  const item=byId.get(el.dataset.mediaId);
  if(!item)return;
  el.src=new URL(item.src,document.baseURI).href;
  if(item.alt)el.alt=item.alt;
 });
})();