(function() {
  angular.module('clickApp')
    .config(defaultRoute)
    .config(allowBlobUrls);

  defaultRoute.$inject = [
    '$urlRouterProvider',
  ];
  function defaultRoute($urlRouterProvider) {
    $urlRouterProvider.otherwise('/lounge');
    // $stateProvider
      // .state('lounge', {
      //   url: '/lounge',
      //   templateUrl: 'partials/lounge.html',
      //   controller: 'loungeCtrl',
      //   data: {}
      // })
      // .state('user', {
      //   url: '/user',
      //   templateUrl: 'partials/user.html',
      //   controller: 'userCtrl',
      //   data: {}
      // })
      // .state('settings', {
      //   abstract: true,
      //   url: '/settings',
      //   templateUrl: 'partials/settings.html',
      //   controller: 'settingsCtrl',
      //   data: {}
      // })
      // .state('settings.Main', {
      //   url: '/main',
      //   templateUrl: 'partials/settings/main.html',
      //   controller: 'settingsMainCtrl'
      // })
      // .state('settings.Models', {
      //   url: '/models',
      //   templateUrl: 'partials/settings/models.html',
      //   controller: 'settingsModelsCtrl'
      // })
      // .state('settings.Bindings', {
      //   url: '/bindings',
      //   templateUrl: 'partials/settings/bindings.html',
      //   controller: 'settingsBindingsCtrl'
      // })
      // .state('settings.Moves', {
      //   url: '/moves',
      //   templateUrl: 'partials/settings/moves.html',
      //   controller: 'settingsMovesCtrl'
      // })
      // .state('game', {
      //   abstract: true,
      //   url: '/game/:online/:private/:id',
      //   templateUrl: 'partials/game.html',
      //   controller: 'gameCtrl',
      //   data: { hide_nav: true }
      // })
      // .state('game.main', {
      //   url: '/main',
      //   templateUrl: 'partials/game/main.html',
      //   controller: 'gameMainCtrl',
      //   data: { hide_nav: true }
      // })
      // .state('game.model', {
      //   url: '/model',
      //   templateUrl: 'partials/game/model.html',
      //   controller: 'gameModelCtrl',
      //   data: { hide_nav: true }
      // })
      // .state('game.setup', {
      //   url: '/setup',
      //   templateUrl: 'partials/game/setup.html',
      //   controller: 'gameSetupCtrl',
      //   data: { hide_nav: true }
      // })
      // .state('game.save', {
      //   url: '/save',
      //   templateUrl: 'partials/game/save.html',
      //   controller: 'gameSaveCtrl',
      //   data: { hide_nav: true }
      // })
      // .state('game.help', {
      //   url: '/help',
      //   templateUrl: 'partials/game/help.html',
      //   controller: 'gameHelpCtrl',
      //   data: { hide_nav: true }
      // })
      // .state('game.log', {
      //   url: '/log',
      //   templateUrl: 'partials/game/log.html',
      //   controller: 'gameLogCtrl',
      //   data: { hide_nav: true }
      // })
      // .state('game.online', {
      //   url: '/online',
      //   templateUrl: 'partials/game/online.html',
      //   controller: 'gameOnlineCtrl',
      //   data: { hide_nav: true }
      // })
      // .state('debug', {
      //   url: '/debug',
      //   templateUrl: 'partials/debug.html',
      //   controller: 'debugCtrl'
      // })
      // .state('info', {
      //   url: '/info',
      //   templateUrl: 'partials/info.html',
      //   controller: 'infoCtrl',
      //   data: {}
      // })
    // ;
  }
  allowBlobUrls.$inject = [ '$compileProvider' ];
  function allowBlobUrls($compileProvider) {   
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
  }
})();