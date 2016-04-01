describe('commonMode model', function() {
  beforeEach(inject([
    'commonMode',
    function(commonModeModel) {
      this.commonModeModel = commonModeModel;

      this.appStateService = spyOnService('appState');
    }
  ]));

  example(function(e) {
    describe(e.action+'()', function() {
      it('should broadcast "'+e.event+'" event', function() {
        this.commonModeModel.actions[e.action](this.state);
        expect(this.appStateService.emit)
          .toHaveBeenCalledWith(e.event);
      });
    });
  }, [
    [ 'action', 'event'  ],
    [ 'viewScrollLeft', 'Game.view.scrollLeft' ],
    [ 'viewScrollRight', 'Game.view.scrollRight' ],
    [ 'viewScrollDown', 'Game.view.scrollDown' ],
    [ 'viewScrollUp', 'Game.view.scrollUp' ],
    [ 'viewZoomIn', 'Game.view.zoomIn' ],
    [ 'viewZoomOut', 'Game.view.zoomOut' ],
    [ 'viewZoomReset', 'Game.view.zoomReset' ],
    [ 'flipMap', 'Game.view.flipMap' ],
    [ 'toggleMenu', 'Game.toggleMenu' ],
  ]);

  describe('modeBackToDefault', function() {
    it('should switch to default mode', function() {
      this.commonModeModel.actions
        .modeBackToDefault();
      expect(this.appStateService.reduce)
        .toHaveBeenCalledWith('Modes.switchTo', 'Default');
    });
  });

  describe('commandUndoLast', function() {
    it('should undo last command', function() {
      this.commonModeModel.actions
        .commandUndoLast();
      expect(this.appStateService.reduce)
        .toHaveBeenCalledWith('Game.command.undoLast');
    });
  });

  describe('commandReplayNext', function() {
    it('should switch to default mode', function() {
      this.commonModeModel.actions
        .commandReplayNext();
      expect(this.appStateService.reduce)
        .toHaveBeenCalledWith('Game.command.replayNext');
    });
  });
});
