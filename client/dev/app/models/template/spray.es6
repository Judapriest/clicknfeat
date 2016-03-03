(function() {
  angular.module('clickApp.models')
    .factory('sprayTemplate', sprayTemplateModelFactory);

  sprayTemplateModelFactory.$inject = [
    'template',
    // 'model',
    'point',
  ];
  function sprayTemplateModelFactory(templateModel,
                                     // modelModel,
                                     pointModel) {
    const sprayTemplateModel = Object.create(templateModel);
    R.deepExtend(sprayTemplateModel, {
      _create: sprayTemplateCreate,
      setSizeP: sprayTemplateSetSizeP,
      size: sprayTemplateSize,
      // origin: sprayTemplateOrigin,
      // setOriginP: sprayTemplateSetOriginP,
      // setTargetP: sprayTemplateSetTargetP,
      // rotateLeftP: sprayTemplateRotateLeft,
      // rotateRightP: sprayTemplateRotateRight
    });
    const FORWARD_MOVES = [
      'moveFrontP',
      'moveBackP',
      'shiftLeftP',
      'shiftRightP',
      'shiftUpP',
      'shiftDownP',
      'setPositionP',
    ];
    R.forEach(buildSprayMove, FORWARD_MOVES);

    templateModel.registerTemplate('spray', sprayTemplateModel);
    R.curryService(sprayTemplateModel);
    return sprayTemplateModel;

    function sprayTemplateCreate(temp) {
      return R.assocPath(['state','s'], 6, temp);
    }
    function sprayTemplateSetSizeP(size, temp) {
      return R.threadP(size)(
        (size) => R.find(R.equals(size), [6,8,10]),
        R.rejectIf(R.isNil, 'Invalid size for a Spray'),
        () => R.assocPath(['state','s'], size, temp)
      );
    }
    function sprayTemplateSize(temp) {
      return R.path(['state','s'], temp);
    }
    // function sprayTemplateOrigin(temp) {
    //   return R.path(['state','o'], temp);
    // }
    // function sprayTemplateSetOriginP(factions, origin, temp) {
    //   return R.threadP(temp)(
    //     R.rejectIf(templateModel.isLocked, 'Template is locked'),
    //     () => modelModel.baseEdgeInDirection$(factions, temp.state.r, origin),
    //     (position) => R.thread(temp)(
    //       R.assocPath(['state','o'], origin.state.stamp),
    //       templateModel.setPosition$(position)
    //     )
    //   );
    // }
    // function sprayTemplateSetTargetP(factions, origin, target, temp) {
    //   return R.threadP(temp)(
    //     R.rejectIf(templateModel.isLocked, 'Template is locked'),
    //     () => pointModel.directionTo(target.state, origin.state),
    //     (direction) => R.threadP(origin)(
    //       modelModel.baseEdgeInDirection$(factions, direction),
    //       (position) => R.thread(temp)(
    //         R.assocPath(['state','r'], direction),
    //         templateModel.setPosition$(position)
    //       )
    //     )
    //   );
    // }
    function buildSprayMove(move) {
      sprayTemplateModel[move] = sprayTemplateForwardMove;

      function sprayTemplateForwardMove(small, template) {
        return R.threadP(template)(
          R.rejectIf(templateModel.isLocked,
                     'Template is locked'),
          R.assocPath(['state','o'], null),
          (template) => templateModel[move](small, template)
        );
      }
    }
    // function sprayTemplateRotateLeft(factions, origin,
    //                                  small, template) {
    //   return R.threadP(template)(
    //     templateModel.rotateLeftP$(small),
    //     handleOrigin
    //   );

    //   function handleOrigin(template) {
    //     if(R.isNil(origin)) return template;

    //     return R.threadP(origin)(
    //       modelModel.baseEdgeInDirection$(factions, template.state.r),
    //       (base_edge) => templateModel.setPositionP(base_edge, template)
    //     );
    //   }
    // }
    // function sprayTemplateRotateRight(factions, origin,
    //                                   small, template) {
    //   return R.threadP(template)(
    //     templateModel.rotateRightP$(small),
    //     handleOrigin
    //   );

    //   function handleOrigin(template) {
    //     if(R.isNil(origin)) return template;

    //     return R.threadP(origin)(
    //       modelModel.baseEdgeInDirection$(factions, template.state.r),
    //       (base_edge) => templateModel.setPositionP(base_edge, template)
    //     );
    //   }
    // }
  }
})();
