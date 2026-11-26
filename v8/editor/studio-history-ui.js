export function createHistoryUi(history,undoBtn,redoBtn){
  return {
    checkpoint(state){history.checkpoint(state)},
    sync(){if(undoBtn)undoBtn.disabled=!history.canUndo;if(redoBtn)redoBtn.disabled=!history.canRedo}
  };
}
