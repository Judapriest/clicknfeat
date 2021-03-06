'use strict';

(function () {
  angular.module('clickApp.services').factory('rollDiceCommand', rollDiceCommandModelFactory);

  rollDiceCommandModelFactory.$inject = ['commands'];
  function rollDiceCommandModelFactory(commandsModel) {
    var rollDiceCommandModel = {
      executeP: rollDiceExecuteP,
      replayP: rollDiceReplayP,
      undoP: rollDiceUndoP
    };
    commandsModel.registerCommand('rollDice', rollDiceCommandModel);
    return rollDiceCommandModel;

    function rollDiceExecuteP(sides, nb_dice, game) {
      var dice = R.times(function () {
        return R.randomRange(1, sides);
      }, nb_dice);
      var total = R.reduce(R.add, 0, dice);
      var ctxt = {
        desc: 'd' + sides + '[' + dice.join(',') + '] = ' + total,
        s: sides,
        n: nb_dice,
        d: dice
      };
      return [ctxt, game];
    }
    function rollDiceReplayP(_ctxt_, game) {
      return game;
    }
    function rollDiceUndoP(_ctxt_, game) {
      return game;
    }
  }
})();
//# sourceMappingURL=dice.js.map
