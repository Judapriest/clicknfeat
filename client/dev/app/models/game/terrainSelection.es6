(function() {
  angular.module('clickApp.services')
    .factory('gameTerrainSelection', gameTerrainSelectionModelFactory);

  gameTerrainSelectionModelFactory.$inject = [
    'gameElementSelection',
  ];
  function gameTerrainSelectionModelFactory(gameElementSelectionModel) {
    return gameElementSelectionModel('terrain');
  }
})();
