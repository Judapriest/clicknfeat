'use strict';

(function () {
  angular.module('clickApp.services').factory('rulerMode', rulerModeModelFactory);

  rulerModeModelFactory.$inject = ['appAction', 'appState', 'segmentMode', 'gameRuler', 'prompt'];
  function rulerModeModelFactory(appActionService, appStateService, segmentModeModel, gameRulerModel, promptModel) {
    var MODELS_LENS = R.lensPath(['game', 'models']);
    var RULER_LENS = R.lensPath(['game', 'ruler']);
    var ruler_default_bindings = {
      exitRulerMode: 'ctrl+r',
      setMaxLength: 'shift+r',
      setOriginModel: 'ctrl+clickModel',
      setTargetModel: 'shift+clickModel',
      createAoEOnTarget: 'ctrl+a'
    };

    var ruler_mode = segmentModeModel('ruler', gameRulerModel, ruler_default_bindings);
    ruler_mode.actions.setOriginModel = rulerSetOriginModel;
    ruler_mode.actions.setTargetModel = rulerSetTargetModel;
    ruler_mode.actions.setMaxLength = rulerSetMaxLength;
    ruler_mode.actions.createAoEOnTarget = rulerCreateAoEOnTarget;

    ruler_mode.buttons = R.concat(ruler_mode.buttons, [['Set Max Len.', 'setMaxLength'], ['AoE on Target', 'createAoEOnTarget']]);
    // const baseOnEnter = ruler_mode.onEnter;
    // ruler_mode.onEnter = rulerOnEnter;

    return ruler_mode;

    function rulerSetOriginModel(state, event) {
      return appStateService.onAction(state, ['Game.command.execute', 'setRuler', ['setOrigin', [event['click#'].target, R.view(MODELS_LENS, state)]]]);
    }
    function rulerSetTargetModel(state, event) {
      return appStateService.onAction(state, ['Game.command.execute', 'setRuler', ['setTarget', [event['click#'].target, R.view(MODELS_LENS, state)]]]);
    }
    function rulerSetMaxLength(state) {
      return R.threadP()(function () {
        return promptModel.promptP('prompt', 'Set ruler max length :', gameRulerModel.maxLength(R.view(RULER_LENS, state))).catch(R.always(null));
      }, function (value) {
        return value === 0 ? null : value;
      }, function (value) {
        return R.threadP()(function () {
          appActionService.do('Game.command.execute', 'setRuler', ['setMaxLength', [value, R.view(MODELS_LENS, state)]]);
        }, function () {
          var origin = gameRulerModel.origin(R.view(RULER_LENS, state));
          if (R.isNil(origin)) return;

          appActionService.defer('Game.command.execute', 'onModels', ['setRulerMaxLength', [value], [origin]]);
        });
      });
    }
    function rulerCreateAoEOnTarget(state) {
      return R.thread(state.game.ruler)(gameRulerModel.targetAoEPosition$(R.view(MODELS_LENS, state)), function (position) {
        return {
          base: { x: 0, y: 0, r: 0 },
          templates: [R.assoc('type', 'aoe', position)]
        };
      }, function (create) {
        appStateService.onAction(state, ['Game.command.execute', 'createTemplate', [create, false]]);
      });
    }
    // function rulerOnEnter() {
    //   const state = appStateService.current();
    //   return R.threadP()(
    //     () => baseOnEnter(state),
    //     () => updateMaxLengthButton(state)
    //   );
    // }
    // function updateMaxLengthButton(state) {
    //   const max = gameRulerModel.maxLength(R.view(RULER_LENS, state));
    //   ruler_mode.buttons[0][0] = `Set Max Len. (${max})`;
    //   appStateService.emit('Modes.buttons.update');
    // }
  }
})();
//# sourceMappingURL=ruler.js.map
