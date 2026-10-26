/* Venue maps for every template. venueMap.image stays the first map, so single-map projects
   render exactly as before; venueMap.more adds maps that visitors swipe through.
   bindMapCarousels must stay self-contained: the exporter inlines it via toString(). */
export function venueMapList(map){
  const first=String(map?.image||'').trim();
  const rest=(Array.isArray(map?.more)?map.more:[]).filter(x=>String(x?.image||'').trim());
  return [...(first?[{image:first,title:String(map?.imageTitle||'')}]:[]),...rest.map(x=>({image:String(x.image),title:String(x.title||'')}))];
}

export function mapCarouselMarkup(maps,esc){
  const slides=maps.map((m,i)=>'<figure class="map-slide" data-map-slide="'+i+'"><button class="map-image-view" type="button" data-product-lightbox="'+esc(m.image)+'" aria-label="查看场地图大图"><img src="'+esc(m.image)+'" alt="'+esc(m.title||'场地图 '+(i+1))+'"><span>查看大图 ↗</span></button>'+(m.title?'<figcaption>'+esc(m.title)+'</figcaption>':'')+'</figure>').join('');
  return '<div class="map-carousel" data-map-carousel><div class="map-track" data-map-track>'+slides+'</div>'+
    '<div class="map-carousel-controls"><button type="button" data-map-step="-1" aria-label="上一张场地图">‹</button><span data-map-count>1 / '+maps.length+'</span><button type="button" data-map-step="1" aria-label="下一张场地图">›</button></div></div>';
}

export function bindMapCarousels(root){
  (root||document).querySelectorAll('[data-map-carousel]').forEach(carousel=>{
    if(carousel.dataset.mapBound==='1')return;
    carousel.dataset.mapBound='1';
    const track=carousel.querySelector('[data-map-track]'),count=carousel.querySelector('[data-map-count]');
    const total=track.children.length,current=()=>Math.round(track.scrollLeft/Math.max(1,track.clientWidth));
    const paint=()=>{if(count)count.textContent=(Math.min(total-1,current())+1)+' / '+total};
    carousel.querySelectorAll('[data-map-step]').forEach(button=>button.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const next=(current()+Number(button.dataset.mapStep)+total)%total;
      track.scrollTo({left:next*track.clientWidth,behavior:'smooth'});
    }));
    track.addEventListener('scroll',()=>requestAnimationFrame(paint),{passive:true});
    paint();
  });
}

export const mapCarouselStyle=`
.map-carousel{position:relative;width:100%;height:100%;min-height:inherit}
.map-track{display:flex;width:100%;height:100%;min-height:inherit;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.map-track::-webkit-scrollbar{display:none}
.map-slide{flex:0 0 100%;margin:0;scroll-snap-align:start;position:relative;display:flex;flex-direction:column;min-height:inherit}
.map-slide .map-image-view{flex:1;width:100%}
.map-slide figcaption{position:absolute;left:14px;top:14px;padding:5px 10px;border-radius:999px;background:#000000a0;color:#fff;font-size:12px;font-weight:800}
.map-carousel-controls{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:5px 8px;border-radius:999px;background:#000000a0;color:#fff;font-size:12px;font-weight:800;z-index:2}
.map-carousel-controls button{width:28px;height:28px;border:0;border-radius:50%;background:#ffffff30;color:#fff;font-size:18px;line-height:1;cursor:pointer}
`;
