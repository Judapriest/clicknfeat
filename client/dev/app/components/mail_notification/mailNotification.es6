(function() {
  angular.module('clickApp.directives')
    .directive('clickMailNotification', mailNotificationDirectiveFactory);

  mailNotificationDirectiveFactory.$inject = [
    '$rootScope'
  ];
  function mailNotificationDirectiveFactory($rootScope) {
    return {
      restrict: 'E',
      scope: { type: '@' },
      templateUrl: 'app/components/mail_notification/mail_notification.html',
      link: link
    };

    function link(scope, element) {
      const audio = element[0].querySelector('audio');
      $rootScope.onStateChangeEvent(`${s.capitalize(scope.type)}.chat`,
                                    onChat, scope);

      function onChat(event, chat) {
        console.log(`${scope.type}MailNotification`, event, chat);
        if(chat.from === $rootScope.state.user.state.stamp) return;

        audio.currentTime = 0;
        audio.play();
      }
    }
  }
})();
