export function createPageTool({
  $, setPageContentActive, openEntryAnimationInspector, openAddressInspector,
  openLifecycleInspector, openHeroTitleInspector, openBannerInspector,
  openImageInspector, openTrafficInspector, openFieldInspector,
  openSeoInspector, openRecapDialog, openStreetManager, openOptionalPageInspector,
  showInspectorEmpty
}) {
  return function openPageTool(tool) {
    setPageContentActive({tool});
    const panel = $('#contentListPanel');
    if (panel) panel.innerHTML = '';
    if (tool === 'entryAnimation') { openEntryAnimationInspector(); return; }
    if (tool === 'basic') { openAddressInspector(); return; }
    if (tool === 'lifecycle') { openLifecycleInspector(); return; }
    if (tool === 'hero') { openHeroTitleInspector(); return; }
    if (tool === 'banner') { openBannerInspector(); return; }
    if (tool === 'cover') { openImageInspector('heroImage'); return; }
    if (tool === 'traffic') { openTrafficInspector(); return; }
    if (tool === 'intro') { openFieldInspector('tagline'); return; }
    if (tool === 'seo') { openSeoInspector(); return; }
    if (tool === 'recap') { openRecapDialog(); return; }
    if (tool === 'map') { openImageInspector('venueMap.image'); return; }
    if (tool === 'streets') { openStreetManager(); return; }
    if (tool === 'freewalk' || tool === 'itasha') { openOptionalPageInspector(tool); return; }
    showInspectorEmpty();
  };
}
