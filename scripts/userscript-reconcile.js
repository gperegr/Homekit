  // React only to device/structure changes; unrelated Google UI must not rescan every card.
  function schedule(changes) {
    const owned='#homehub-ui,#homehub-dashboard,#homehub-scroll-heading,#homehub-widgets,#homehub-weather-dialog,#homehub-ambient,.homehub-symbol,.homehub-room-label';
    if(changes&&!changes.some(change=>{
      const element=change.target.nodeType===1?change.target:change.target.parentElement;
      if(element?.closest(owned))return false;
      if(element?.closest('ghw-devices,ghw-toolbar'))return true;
      return change.type==='childList'&&[...change.addedNodes,...change.removedNodes].some(node=>node.nodeType===1&&
        (node.matches('ghw-devices,ghw-toolbar')||node.querySelector('ghw-devices,ghw-toolbar')));
    }))return;
    if(queued)return;queued=true;
    function flush(){
      if(homeHubInteraction.active||performance.now()<homeHubInteraction.until){setTimeout(flush,80);return;}
      apply();
    }
    setTimeout(flush,32);
  }
