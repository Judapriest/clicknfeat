'use strict';

(function () {
  angular.module('clickApp.directives').directive('clickGamePage', clickGamePageDirectiveFactory);

  clickGamePageDirectiveFactory.$inject = ['appGame'];
  function clickGamePageDirectiveFactory(appGameService) {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope, element) {
      element = element[0];
      var menuToggle = buildMenuToggle(element);

      element.querySelector('#menu-toggle').addEventListener('click', menuToggle);
      scope.listenSignal(menuToggle, appGameService.view.toggle_menu, scope);

      var gameview = element.querySelector('#gameview');
      var rect = gameview.getBoundingClientRect();
      gameview.style.width = rect.height + 'px';
    }

    function buildMenuToggle(element) {
      var gameview_width_mem = undefined;
      return function () {
        var gameview = element.querySelector('#gameview');
        var menu = element.querySelector('#menu');
        var tool_osd = element.querySelector('#tool-osd');
        var chat_osd = element.querySelector('#chat-osd');

        var menu_hidden = menu.classList.contains('hidden');
        if (!menu_hidden) {
          var rect = gameview.getBoundingClientRect();
          gameview_width_mem = rect.width;
          gameview.style.width = self.window.innerWidth + 'px';
        } else {
          gameview.style.width = gameview_width_mem + 'px';
        }
        gameview.classList.toggle('resizable');
        menu.classList.toggle('hidden');
        tool_osd.classList.toggle('show');
        chat_osd.classList.toggle('show');
      };
    }
  }
})();
//# sourceMappingURL=gamePage.js.map
