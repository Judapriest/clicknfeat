'use strict';

self.rulerModeServiceFactory = function rulerModeServiceFactory(modesService,
                                                                settingsService,
                                                                commonModeService,
                                                                gameService,
                                                                gameRulerService,
                                                                promptService) {
  var ruler_actions = Object.create(commonModeService.actions);
  ruler_actions.dragStartMap = function rulerDragMap(scope, drag, event) {
    scope.game.ruler = gameRulerService.setLocal(drag.start, drag.now,
                                                 scope, scope.game.ruler);
  };
  ruler_actions.dragMap = function rulerDragMap(scope, drag, event) {
    scope.game.ruler = gameRulerService.setLocal(drag.start, drag.now,
                                                 scope, scope.game.ruler);
  };
  ruler_actions.dragEndMap = function rulerDragMap(scope, drag, event) {
    gameService.executeCommand('setRuler', 'setRemote', drag.start, drag.now,
                               scope,  scope.game);
  };
  ruler_actions.setMaxLength = function rulerSetMaxLength(scope, event) {
    promptService.prompt('prompt',
                         'Set ruler max length :',
                         gameRulerService.maxLength(scope.game.ruler))
      .then(function(value) {
        value = (value === 0) ? null : value;
        scope.game.ruler = gameRulerService.setMaxLength(value, scope.game.ruler);
      })
      .catch(function(error) {
        scope.game.ruler = gameRulerService.setMaxLength(null, scope.game.ruler);
      })
      .then(function() {
        var max = gameRulerService.maxLength(scope.game.ruler);
        ruler_mode.buttons[0][0] = 'Set Max Len. ('+max+')';
        scope.gameEvent('refreshActions');
      });
  };
  ruler_actions.leaveRulerMode = function rulerLeaveRulerMode(scope, event) {
    modesService.switchToMode('Default', scope, scope.modes);
  };
  var ruler_default_bindings = {
    leaveRulerMode: 'r',
  };
  var ruler_bindings = R.extend(Object.create(commonModeService.bindings),
                                ruler_default_bindings);
  var ruler_buttons = [
    [ 'Set Max Len.', 'setMaxLength' ],
  ];
  var ruler_mode = {
    onEnter: function rulerOnEnter(scope) {
    },
    onLeave: function rulerOnLeave(scope) {
    },
    name: 'Ruler',
    actions: ruler_actions,
    buttons: ruler_buttons,
    bindings: ruler_bindings,
  };
  modesService.registerMode(ruler_mode);
  settingsService.register('Bindings',
                           ruler_mode.name,
                           ruler_default_bindings,
                           function(bs) {
                             R.extend(ruler_mode.bindings, bs);
                           });
  return ruler_mode;
};
