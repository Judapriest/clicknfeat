angular.module('clickApp.services')
  .factory('gameRuler', [
    'point',
    'model',
    'gameModels',
    function gameRulerServiceFactory(pointService,
                                     modelService,
                                     gameModelsService) {
      var gameRulerService = {
        create: function gameRulerCreate() {
          return {
            local: {
              display: false,
              start: { x: 0, y: 0 },
              end: { x: 0, y: 0 },
              length: null
            },
            remote: {
              display: false,
              start: { x: 0, y: 0 },
              end: { x: 0, y: 0 },
              length: null
            }
          };
        },
        isDisplayed: function gameRulerIsDisplayed(ruler) {
          return R.path(['remote','display'], ruler);
        },
        maxLength: function gameRulerMaxLength(ruler) {
          return R.pathOr(0, ['remote','max'], ruler);
        },
        setMaxLength: function gameRulerSetMaxLength(length, state, ruler) {
          ruler = R.pipe(
            R.assocPath(['local', 'max'], length),
            R.assocPath(['remote', 'max'], length)
          )(ruler);
          return setupRemoteRuler(state, ruler);
        },
        origin: function gameRulerOrigin(ruler) {
          return R.path(['remote', 'origin'], ruler);
        },
        clearOrigin: function gameRulerClearOrigin(state, ruler) {
          return setOriginTarget(null,
                                 ruler.remote.target,
                                 ruler.remote.max,
                                 state, ruler);
        },
        setOrigin: function gameRulerSetOrigin(origin_model, state, ruler) {
          var origin = origin_model.state.stamp;
          var target = gameRulerService.target(ruler);
          target = (target === origin) ? null : target;
          var max_length = modelService.rulerMaxLength(origin_model);
          return setOriginTarget(origin, target, max_length, state, ruler);
        },
        setOriginResetTarget: function gameRulerSetOrigin(origin_model, state, ruler) {
          var origin = origin_model.state.stamp;
          var max_length = modelService.rulerMaxLength(origin_model);
          return setOriginTarget(origin, null, max_length, state, ruler);
        },
        target: function gameRulerTarget(ruler) {
          return R.path(['remote', 'target'], ruler);
        },
        targetReached: function gameRulerTargetReached(ruler) {
          return R.path(['remote', 'reached'], ruler);
        },
        clearTarget: function gameRulerClearTarget(state, ruler) {
          return setOriginTarget(ruler.remote.origin,
                                 null,
                                 null,
                                 state, ruler);
        },
        setTarget: function gameRulerSetTarget(target_model, state, ruler) {
          var origin = gameRulerService.origin(ruler);
          var target = target_model.state.stamp;
          origin = (origin === target) ? null : origin;
          return setOriginTarget(origin, target, null, state, ruler);
        },
        updateOriginTarget: function gameRulerUpdateOriginTarget(state, ruler) {
          return setupRemoteRuler(state, ruler);
        },
        toggleDisplay: function gameRulerToggleDisplay(state, ruler) {
          var path = ['remote','display'];
          ruler = R.assocPath(path, !R.path(path, ruler), ruler);
          state.changeEvent('Game.ruler.remote.change');
          return ruler;
        },
        setLocal: function gameRulerSetLocal(start, end, state, ruler) {
          return R.pipe(
            R.prop('local'),
            R.assoc('start', R.clone(start)),
            enforceEndToMaxLength(end),
            R.assoc('length', null),
            R.assoc('display', true),
            (local) => {
              state.changeEvent('Game.ruler.local.change');

              return R.assoc('local', local, ruler);
            }
          )(ruler);
        },
        setRemote: function gameRulerSetRemote(start, end, state, ruler) {
          ruler = R.assocPath(['local','display'], false, ruler);          
          state.changeEvent('Game.ruler.local.change');

          let remote = R.pipe(
            R.assoc('origin', null),
            R.assoc('target', null),
            R.assoc('start', R.clone(start)),
            R.assoc('end', R.clone(end)),
            R.assoc('display', true)
          )(ruler.remote);
          ruler = R.assoc('remote', remote, ruler);
          
          return setupRemoteRuler(state, ruler);
        },
        saveRemoteState: function gameRulerSaveRemoteState(ruler) {
          return R.clone(R.prop('remote', ruler));
        },
        resetRemote: function gameRulerResetRemote(remote, state, ruler) {
          var ret = R.assoc('remote', R.clone(remote), ruler);
          state.changeEvent('Game.ruler.remote.change');
          return ret;
        },
        targetAoEPosition: function gameRulerTargetAoEPosition(models, ruler) {
          var dir = pointService.directionTo(ruler.remote.end, ruler.remote.start);
          var max = ruler.remote.length / 2;
          var end = ruler.remote.end;
          var target = gameRulerService.target(ruler);
          return R.pipePromise(
            (end) => {
              if( R.exists(target) &&
                  gameRulerService.targetReached(ruler) ) {
                return R.pipeP(
                  gameModelsService.findStamp$(target),
                  R.prop('state')
                )(models);
              }
              return end;
            },
            R.pick(['x', 'y']),
            R.assoc('r', dir),
            R.assoc('m', max)
          )(end);
        }
      };
      var enforceEndToMaxLength = R.curry(function _enforceEndToMaxLength(end, ruler) {
        var length = pointService.distanceTo(end, ruler.start);
        var dir = pointService.directionTo(end, ruler.start);
        var max = 10 * R.defaultTo(length/10, ruler.max);
        length = Math.min(length, max);
        end = pointService.translateInDirection(length, dir, ruler.start);
        return R.assoc('end', end, ruler);
      });
      function setOriginTarget(origin, target, max_length, state, ruler) {
        var display = R.exists(origin) && R.exists(target);
        ruler = R.assoc('remote', R.pipe(
          R.assoc('origin', origin),
          R.assoc('target', target),
          R.assoc('display', display),
          (remote) => {
            if(R.exists(max_length)) {
              return R.assoc('max', max_length, remote);
            }
            return remote;
          }
        )(ruler.remote), ruler);
        return setupRemoteRuler(state, ruler);
      }
      function setupRemoteRuler(state, ruler) {
        return R.pipeP(
          () => {
            var origin = R.path(['remote','origin'], ruler);
            if(R.exists(origin)) {
              return gameModelsService.findStamp(origin, state.game.models)
                .catch(R.always(null));
            }
            return self.Promise.resolve(null);
          },
          (origin_model) => {
            return R.pipeP(
              () => {
                var target = R.path(['remote','target'], ruler);
                if(R.exists(target)) {
                  return gameModelsService.findStamp(target, state.game.models)
                    .catch(R.always(null));
                }
                return self.Promise.resolve(null);
              },
              (target_model) => {
                if(R.exists(origin_model) &&
                   R.exists(target_model)) {
                  return modelService.shortestLineTo(state.factions,
                                                     target_model,
                                                     origin_model);
                }
                if(R.exists(origin_model)) {
                  return {
                    start: R.pick(['x','y'], origin_model.state),
                    end: R.pick(['x','y'], origin_model.state)
                  };
                }
                if(R.exists(target_model)) {
                  return {
                    start: R.pick(['x','y'], target_model.state),
                    end: R.pick(['x','y'], target_model.state)
                  };
                }
                return R.pick(['start', 'end'], R.prop('remote', ruler));
              },
              ({ start, end }) => {
                var models_dist = pointService.distanceTo(end, start);
                ruler = R.over(R.lensProp('remote'), R.pipe(
                  R.assoc('start', start),
                  enforceEndToMaxLength(end),
                  (remote) => {
                    var ruler_length = pointService.distanceTo(remote.end, remote.start);
                    return R.pipe(
                      R.assoc('reached', ruler_length >= models_dist - 0.1),
                      R.assoc('length', Math.round(ruler_length * 10) / 100)
                    )(remote);
                  }
                ), ruler);

                state.changeEvent('Game.ruler.remote.change');

                return ruler;
              }
            )();
          }
        )();
      }
      R.curryService(gameRulerService);
      return gameRulerService;
    }
  ]);