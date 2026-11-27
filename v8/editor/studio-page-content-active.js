export function setPageContentActive({tool='',collection=''}={}){
  /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-page-content-manager],[data-page-tool]')).forEach(x=>{
    const on=collection?x.dataset.pageContentManager===collection:tool?x.dataset.pageTool===tool:false;
    x.classList.toggle('active',on);
  });
}
