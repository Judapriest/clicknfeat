'use strict';

(function () {
  angular.module('clickApp.services').factory('segmentMode', segmentModeModelFactory);

  segmentModeModelFactory.$inject = ['appAction', 'appGame', 'appState', 'modes', 'settings', 'commonMode', 'gameModels', 'gameModelSelection'];
  function segmentModeModelFactory(appActionService, appGameService, appStateService, modesModel, settingsModel, commonModeModel, gameModelsModel, gameModelSelectionModel) {
    return function buildSegmentModeModel(type, gameSegmentModel, default_bindings) {
      var TYPE_LENS = R.lensPath(['game', type]);
      var MODELS_LENS = R.lensPath(['game', 'models']);
      var segment_actions = Object.create(commonModeModel.actions);
      segment_actions['exit' + s.capitalize(type) + 'Mode'] = commonModeModel.actions.modeBackToDefault;
      segment_actions.dragStartMap = segmentDragStartMap;
      segment_actions.dragMap = segmentDragMap;
      segment_actions.dragEndMap = segmentDragEndMap;
      segment_actions.dragStartTemplate = segment_actions.dragStartMap;
      segment_actions.dragTemplate = segment_actions.dragMap;
      segment_actions.dragEndTemplate = segment_actions.dragEndMap;
      segment_actions.dragStartModel = segment_actions.dragStartMap;
      segment_actions.dragModel = segment_actions.dragMap;
      segment_actions.dragEndModel = segment_actions.dragEndMap;

      var segment_bindings = R.extend(Object.create(commonModeModel.bindings), default_bindings);
      var segment_buttons = [];
      var segment_mode = {
        onEnter: segmentOnEnter,
        name: s.capitalize(type),
        actions: segment_actions,
        buttons: segment_buttons,
        bindings: segment_bindings
      };
      modesModel.registerMode(segment_mode);
      settingsModel.register('Bindings', segment_mode.name, default_bindings, function (bs) {
        R.extend(segment_mode.bindings, bs);
      });
      return segment_mode;

      function segmentDragStartMap(state, drag) {
        return R.over(TYPE_LENS, gameSegmentModel.setLocal$(drag.start, drag.now), state);
      }
      function segmentDragMap(state, drag) {
        return R.over(TYPE_LENS, gameSegmentModel.setLocal$(drag.start, drag.now), state);
      }
      function segmentDragEndMap(state, drag) {
        return appStateService.onAction(state, ['Game.command.execute', 'set' + s.capitalize(type), ['setRemote', [drag.start, drag.now, R.view(MODELS_LENS, state)]]]);
      }
      function segmentOnEnter() {
        var selection = appGameService.models.selection.sample();
        var models = appGameService.models.models.sample();
        return R.thread(selection)(gameModelSelectionModel.get$('local'), function (stamps) {
          if (R.length(stamps) !== 1) return null;

          return gameModelsModel.findStamp(stamps[0], models);
        }, function (model) {
          if (R.isNil(model)) return;

          appActionService.defer('Game.command.execute', 'set' + s.capitalize(type), ['setOriginResetTarget', [model, models]]);
        });
      }
    };
  }
})();
//# sourceMappingURL=segment.js.map
