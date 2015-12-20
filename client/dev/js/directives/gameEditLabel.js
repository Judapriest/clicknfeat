'use strict';

angular.module('clickApp.controllers').controller('clickGameEditLabelCtrl', ['$scope', function ($scope) {
  console.log('init clickGameEditLabelCtrl');

  $scope.edit = { label: '' };

  $scope.doAddLabel = function doAddLabel() {
    var new_label = s.trim($scope.edit.label);
    if (R.length(new_label) === 0) return;

    $scope.doExecuteCommand('onModels', 'addLabel', new_label, [$scope.selection.state.stamp]).then(function () {
      $scope.edit.label = '';
      $scope.doClose();
      $scope.$digest();
    });
  };
}]);

angular.module('clickApp.directives').directive('clickGameEditLabel', ['$window', 'gameMap', function ($window, gameMapService) {
  return {
    restrict: 'A',
    template: ['<form ng-submit="doAddLabel()">', '<input type="text" ng-model="edit.label" ng-change="doRefresh()" />', '</form>'].join(''),
    scope: true,
    controller: 'clickGameEditLabelCtrl',
    link: function link(scope, element /*, attrs*/) {
      console.log('gameEditLabel');
      var map = document.getElementById('map');
      var input = element[0].querySelector('input');

      closeEditLabel();

      function closeEditLabel() {
        console.log('closeEditLabel');

        scope.selection = {};

        $window.requestAnimationFrame(function _closeEditLabel() {
          element[0].style.display = 'none';
          element[0].style.visibility = 'hidden';
          element[0].style.left = 0 + 'px';
          element[0].style.top = 0 + 'px';
        });
      }
      function openEditLabel(event, selection) {
        console.log('openEditLabel');

        scope.selection = selection;
        scope.edit = { label: '' };
        scope.$digest();

        $window.requestAnimationFrame(displayEditLabel);
      }
      function displayEditLabel() {
        element[0].style.display = 'initial';
        element[0].style.visibility = 'hidden';
        setEditLabelWidth();

        $window.requestAnimationFrame(showEditLabel);
      }
      function showEditLabel() {
        placeEditLabel();
        element[0].style.visibility = 'visible';

        $window.requestAnimationFrame(function () {
          input.focus();
        });
      }
      function refreshEditLabel() {
        setEditLabelWidth();

        $window.requestAnimationFrame(placeEditLabel);
      }
      function placeEditLabel() {
        var detail_rect = input.getBoundingClientRect();
        var screen_pos = gameMapService.mapToScreenCoordinates(map, scope.selection.state);

        element[0].style.left = screen_pos.x - detail_rect.width / 2 + 'px';
        element[0].style.top = screen_pos.y - detail_rect.height / 2 + 'px';
      }
      function setEditLabelWidth() {
        input.style.width = R.length(scope.edit.label) + 'em';
      }

      scope.onGameEvent('openEditLabel', openEditLabel, scope);
      scope.onGameEvent('closeEditLabel', closeEditLabel, scope);
      input.addEventListener('keydown', function (event) {
        console.log('toto', event);
        if (event.keyCode === 27) {
          // ESC
          closeEditLabel();
        }
      });

      scope.doRefresh = refreshEditLabel;
      scope.doClose = closeEditLabel;
    }
  };
}]);
//# sourceMappingURL=gameEditLabel.js.map
