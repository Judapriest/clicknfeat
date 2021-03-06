'use strict';

(function () {
  angular.module('clickApp.services').factory('commonMode', commonModeModelFactory);

  commonModeModelFactory.$inject = ['settings', 'appState'];
  function commonModeModelFactory(settingsModel, appStateService) {
    var DEFAULT_SETTINGS = {
      DragEpsilon: 3,
      ScrollStep: 30,
      ZoomFactor: 2
    };
    var SETTINGS = R.clone(DEFAULT_SETTINGS);
    var common_actions = {
      modeBackToDefault: modeBackToDefault,
      commandUndoLast: commandUndoLast,
      commandReplayNext: commandReplayNext,
      viewScrollLeft: viewScrollLeft,
      viewScrollRight: viewScrollRight,
      viewScrollUp: viewScrollUp,
      viewScrollDown: viewScrollDown,
      viewZoomIn: viewZoomIn,
      viewZoomOut: viewZoomOut,
      viewZoomReset: viewZoomReset,
      viewFlipMap: viewFlipMap,
      viewToggleMenu: viewToggleMenu
    };
    var common_bindings = {
      modeBackToDefault: 'esc',
      commandUndoLast: 'ctrl+z',
      commandReplayNext: 'ctrl+y',
      viewScrollLeft: 'alt+left',
      viewScrollRight: 'alt+right',
      viewScrollUp: 'alt+up',
      viewScrollDown: 'alt+down',
      viewZoomIn: 'alt++',
      viewZoomOut: 'alt+-',
      viewZoomReset: 'alt+z',
      viewFlipMap: 'ctrl+shift+f',
      viewToggleMenu: 'ctrl+shift+m'
    };
    var common_mode = {
      name: 'Common',
      actions: common_actions,
      buttons: [],
      bindings: R.clone(common_bindings),
      settings: function settings() {
        return SETTINGS;
      }
    };
    settingsModel.register('Misc', common_mode.name, DEFAULT_SETTINGS, function (settings) {
      R.extend(SETTINGS, settings);
    });
    settingsModel.register('Bindings', common_mode.name, common_bindings, function (bs) {
      R.extend(common_mode.bindings, bs);
    });
    return common_mode;

    function modeBackToDefault(state) {
      return appStateService.onAction(state, ['Modes.switchTo', 'Default']);
    }
    function commandUndoLast(state) {
      return appStateService.onAction(state, ['Game.command.undoLast']);
    }
    function commandReplayNext(state) {
      return appStateService.onAction(state, ['Game.command.replayNext']);
    }
    function viewScrollLeft(state) {
      return appStateService.onAction(state, ['Game.view.scrollLeft']);
    }
    function viewScrollRight(state) {
      return appStateService.onAction(state, ['Game.view.scrollRight']);
    }
    function viewScrollUp(state) {
      return appStateService.onAction(state, ['Game.view.scrollUp']);
    }
    function viewScrollDown(state) {
      return appStateService.onAction(state, ['Game.view.scrollDown']);
    }
    function viewZoomIn(state) {
      return appStateService.onAction(state, ['Game.view.zoomIn']);
    }
    function viewZoomOut(state) {
      return appStateService.onAction(state, ['Game.view.zoomOut']);
    }
    function viewZoomReset(state) {
      return appStateService.onAction(state, ['Game.view.zoomReset']);
    }
    function viewFlipMap(state) {
      return appStateService.onAction(state, ['Game.view.flipMap']);
    }
    function viewToggleMenu(state) {
      return appStateService.onAction(state, ['Game.view.toggleMenu']);
    }
  }
})();
//# sourceMappingURL=common.js.map
