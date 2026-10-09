// Dedicated activity layout safety patch.
// Kept separate from runtime-style.js so activity layout can evolve without
// risking the large generated style string.
export const activityLayoutFixStyle=`
@media(min-width:850px){
  #activities .activity-feature{
    display:grid!important;
    grid-template-columns:minmax(0,1.16fr) minmax(300px,.84fr)!important;
    gap:28px!important;
    align-items:start!important;
    height:auto!important;
    min-height:0!important;
  }
  #activities .activity-feature-copy,
  #activities .activity-feature-head{
    display:block!important;
    height:auto!important;
    min-height:0!important;
    margin:0!important;
    padding:0!important;
  }
  #activities .activity-feature-body{
    display:block!important;
    height:auto!important;
    min-height:0!important;
    margin:14px 0 0!important;
    padding:0!important;
    border-top:1px solid #d8d0d6!important;
    overflow:visible!important;
  }
  #activities .activity-feature-media{
    align-self:start!important;
    height:300px!important;
    min-height:300px!important;
    max-height:300px!important;
  }
  #activities .activity-feature-media img,
  #activities .activity-feature-media-empty{
    height:300px!important;
    min-height:300px!important;
    max-height:300px!important;
  }
}


/* v8.34.22 — product zoom affordance */
.directory-product-image{
  position:relative!important;
}
.directory-product-image .product-image-zoom{
  position:absolute!important;
  right:9px!important;
  bottom:9px!important;
  z-index:2!important;
  display:grid!important;
  place-items:center!important;
  width:28px!important;
  height:28px!important;
  border:1px solid rgba(23,21,27,.18)!important;
  border-radius:999px!important;
  background:rgba(255,255,255,.92)!important;
  color:var(--ink)!important;
  font-size:12px!important;
  font-weight:950!important;
  pointer-events:none!important;
  box-shadow:0 2px 8px rgba(23,21,27,.08)!important;
}
.oe-preview .directory-product-image[data-product-lightbox]{
  cursor:zoom-in!important;
}

`;
