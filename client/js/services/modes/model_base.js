'use strict';

self.modelBaseModeServiceFactory = function modelBaseModeServiceFactory(modesService,
                                                                        settingsService,
                                                                        modelsModeService,
                                                                        sprayTemplateModeService,
                                                                        modelService,
                                                                        gameService,
                                                                        gameModelsService,
                                                                        gameModelSelectionService
                                                                       ) {
  var model_actions = Object.create(modelsModeService.actions);
  model_actions.createAoEOnModel = function modelCreateAoEModel(scope, event) {
    var stamps = gameModelSelectionService.get('local', scope.game.model_selection);
    var model = gameModelsService.findStamp(stamps[0], scope.game.models);
    var position = R.pick(['x','y'], model.state);
    position.type = 'aoe';
    gameService.executeCommand('createTemplate', position,
                               scope, scope.game);
  };
  model_actions.createSprayOnModel = function modelCreateSprayModel(scope, event) {
    var stamps = gameModelSelectionService.get('local', scope.game.model_selection);
    var model = gameModelsService.findStamp(stamps[0], scope.game.models);
    var position = R.pick(['x','y'], model.state);
    position.type = 'spray';
    gameService.executeCommand('createTemplate', position,
                               scope, scope.game);
    // simulate ctrl-click on model in sprayTemplateMode
    sprayTemplateModeService.actions.clickModel(scope,
                                                { target: model },
                                                { ctrlKey: true });
  };
  model_actions.selectAllFriendly = function modelSelectAllFriendly(scope, event) {
    var selection = gameModelSelectionService.get('local', scope.game.model_selection);
    var model = gameModelsService.findStamp(selection[0], scope.game.models);
    var stamps = R.pipe(
      gameModelsService.all,
      R.filter(modelService.userIs$(modelService.user(model))),
      R.map(modelService.stamp)
    )(scope.game.models);
    gameService.executeCommand('setModelSelection', 'set', stamps,
                               scope, scope.game);
  };
  model_actions.selectAllUnit = function modelSelectAllUnit(scope, event) {
    var selection = gameModelSelectionService.get('local', scope.game.model_selection);
    var model = gameModelsService.findStamp(selection[0], scope.game.models);
    var stamps = R.pipe(
      gameModelsService.all,
      R.filter(modelService.userIs$(modelService.user(model))),
      R.filter(modelService.unitIs$(modelService.unit(model))),
      R.map(modelService.stamp)
    )(scope.game.models);
    gameService.executeCommand('setModelSelection', 'set', stamps,
                               scope, scope.game);
  };
  model_actions.clickModel = function modelClickModel(scope, event, dom_event) {
    var stamps = gameModelSelectionService.get('local', scope.game.model_selection);
    var model = gameModelsService.findStamp(stamps[0], scope.game.models);
    if(dom_event.ctrlKey &&
       dom_event.shiftKey &&
       model.state.stamp !== event.target.state.stamp) {
      gameService.executeCommand('onModels', 'setB2B',
                                 scope.factions, event.target,
                                 stamps, scope, scope.game);
      return;
    }
    modelsModeService.actions.clickModel(scope, event, dom_event);
  };

  var model_default_bindings = {
    'createAoEOnModel': 'ctrl+a',
    'createSprayOnModel': 'ctrl+s',
    'selectAllUnit': 'ctrl+u',
    'selectAllFriendly': 'ctrl+f',
  };
  var model_bindings = R.extend(Object.create(modelsModeService.bindings),
                                 model_default_bindings);

  var model_mode = {
    onEnter: function modelOnEnter(scope) {
    },
    onLeave: function modelOnLeave(scope) {
    },
    name: 'ModelBase',
    actions: model_actions,
    buttons: [],
    bindings: model_bindings,
  };
  settingsService.register('Bindings',
                           model_mode.name,
                           model_default_bindings,
                           function(bs) {
                             R.extend(model_mode.bindings, bs);
                           });
  return model_mode;
};
