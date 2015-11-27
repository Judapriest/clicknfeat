'use strict';

angular.module('clickApp.controllers')
  .controller('gameCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    'game',
    'games',
    'modes',
    'pubSub',
    'allModes',
    'allCommands',
    'allTemplates',
    function($scope,
             $state,
             $stateParams,
             $window,
             gameService,
             gamesService,
             modesService,
             pubSubService) {
      console.log('init gameCtrl', $stateParams, $state.current.name);
      var online = ($stateParams.where === 'online');
      $scope.ui_state = {};

      var game_event_channel = pubSubService.init();
      pubSubService.subscribe('#watch#', function() {
        console.log('gameEvent', arguments);
      }, game_event_channel);
      $scope.gameEvent = function gameEvent() {
        var args = Array.prototype.slice.apply(arguments);
        pubSubService.publish.apply(null, R.append(game_event_channel, args));
      };
      $scope.onGameEvent = function onGameEvent(event, listener, scope) {
        // console.log('subscribe onGameEvent', arguments);
        var unsubscribe = pubSubService.subscribe(event, listener, game_event_channel);
        scope.$on('$destroy', function unsubscribeOnGameEvent() {
          // console.log('unsubscribe onGameEvent', event, game_event_channel);
          unsubscribe();
        });
      };
      $scope.digestOnGameEvent = function digestOnGameEvent(event, scope) {
        // console.log('subscribe digestOnGameEvent', arguments);
        var unsubscribe = pubSubService.subscribe(event, function _digestOnGameEvent() {
          console.log('digestOnGameEvent', event);
          $scope.$digest(scope);
        }, game_event_channel);
        scope.$on('$destroy', function unsubscribeDigestOnGameEvent() {
          // console.log('unsubscribe digestOnGameEvent', event, game_event_channel);
          unsubscribe();
        });
      };

      $scope.saveGame = function saveGame(game) {
        var res;
        if(!online) {
          res = gamesService.updateLocalGame($scope.game_index, game,
                                             $scope.local_games)
            .then(function(games) {
              $scope.local_games = games;
              return game;
            });
        }
        return self.Promise.resolve(res)
          .then(function(game) {
            if(R.isNil(game)) return;

            $scope.game = game;
            $scope.gameEvent('saveGame', game);
          });
      };

      $scope.currentModeName = function currentModeName(mode) {
        if(!R.exists($scope.modes)) return '';
        return modesService.currentModeName($scope.modes);
      };
      $scope.currentModeIs = function currentModeIs(mode) {
        if(!R.exists($scope.modes)) return false;
        return modesService.currentModeName($scope.modes) === mode;
      };
      $scope.doSwitchToMode = function doSwitchToMode(mode) {
        return modesService.switchToMode(mode, $scope, $scope.modes)
          .catch(function(reason) {
            $scope.gameEvent('modeActionError', reason);
            return self.Promise.reject(reason);
          });
      };
      $scope.doModeAction = function doModeAction(action) {
        return modesService.currentModeAction(action, $scope, $scope.modes)
          .catch(function(reason) {
            $scope.gameEvent('modeActionError', reason);
            return self.Promise.reject(reason);
          });
      };
      $scope.doExecuteCommand = function doExecuteCommand() {
        var args = Array.prototype.slice.apply(arguments);
        args = R.concat(args, [$scope, $scope.game]);
        return gameService.executeCommand.apply(gameService, args)
          .catch(function(reason) {
            $scope.gameEvent('modeActionError', reason);
            return self.Promise.reject(reason);
          });
      };
      $scope.show_action_group = null;
      $scope.doActionButton = function doActionButton(action) {
        if(action[1] === 'toggle') {
          $scope.show_action_group = ($scope.show_action_group === action[2]) ? null : action[2];
          return;
        }
        $scope.doModeAction(action[1]);
      };

      var forward_events = [
        // 'clickModel',
        // 'rightClickModel',
        'dragStartModel',
        'dragModel',
        'dragEndModel',
        // 'clickTemplate',
        // 'rightClickTemplate',
        'dragStartTemplate',
        'dragTemplate',
        'dragEndTemplate',
        // 'clickMap',
        // 'rightClickMap',
        'moveMap',
        'dragStartMap',
        'dragMap',
        'dragEndMap',
      ];
      R.forEach(function(fwd) {
        $scope.$on(fwd, function onForwardEvent(e, target, event) {
          console.log('$on '+fwd, arguments);
          $scope.gameEvent('closeSelectionDetail');
          modesService.currentModeAction(fwd, $scope, target, event, $scope.modes)
            .catch(function(reason) {
              $scope.gameEvent('modeActionError', reason);
            });
        });
      }, forward_events);
      $scope.$on('$destroy', function onGameCtrlDestroy() {
        console.log('on gameCtrl $destroy');
        Mousetrap.reset();
      });

      var onLoad;
      if(!online) {
        onLoad = gamesService.loadLocalGames()
            .then(function(local_games) {
              $scope.local_games = local_games;
              $scope.game_index = $stateParams.id >> 0;
              var game = R.nth($scope.game_index,
                               $scope.local_games);
              console.log('load local game', game);
              return game;
            });
      }
      $scope.onGameLoad = self.Promise.resolve(onLoad)
        .then(function(game) {
          if(R.isNil(game)) {
            $scope.goToState('lounge');
            return self.Promise.reject('load game: unknown');
          }
          $scope.game = game;
          return modesService.init($scope);
        })
        .then(function(modes) {
          $scope.modes = modes;
          
          if($state.current.name === 'game') {
            $scope.goToState('.main');
          } 
          $scope.create = {};
          
          return $scope.data_ready;
        })
        .then(function() {
          return gameService.load($scope, $scope.game);
        })
        .then(function(game) {
          $scope.game = game;
          console.log('#### Game Loaded', $scope.game);
        });
    }
  ]);
