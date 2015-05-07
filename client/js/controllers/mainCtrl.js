'use strict';

angular.module('clickApp.controllers')
  .controller('mainCtrl', [
    '$scope',
    '$state',
    'user',
    function($scope,
             $state,
             userService) {
      console.log('init mainCtrl');
      
      $scope.user = userService.load();
      console.log('loaded user', $scope.user);
      $scope.checkUser = function checkUser() {
        if(R.isNil($scope.user.name)) {
          $state.go('user');
        }
      };
      $scope.setUser = function(new_user) {
        $scope.user = new_user;
        userService.store($scope.user);
        console.log('set user', $scope.user);
      };

      $scope.goToState = function() {
        var args = Array.prototype.slice.call(arguments);
        $state.go.apply($state, args);
      };
      $scope.stateIs = function(name) {
        return $state.is(name);
      };
      $scope.currentState = function() {
        return $state.current;
      };
    }
  ]);
