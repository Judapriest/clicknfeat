'use strict';

describe('model lock', function() {
  describe('modelsMode service', function() {
    beforeEach(inject([
      'modelsMode',
      function(modelsModeService) {
        this.modelsModeService = modelsModeService;
        this.gameService = spyOnService('game');
        this.gameModelsService = spyOnService('gameModels');
        this.gameModelSelectionService = spyOnService('gameModelSelection');
        this.gameModelSelectionService.get._retVal = ['stamp1','stamp2'];
        this.modelService = spyOnService('model');
     
        this.scope = { game: { models: 'models',
                               model_selection: 'selection' },
                       factions: 'factions'
                     };
      }
    ]));

    when('user toggles lock on models', function() {
      this.modelsModeService.actions
        .toggleLock(this.scope);
    }, function() {
      using([
        ['first', 'set'],
        [ true  , false],
        [ false , true ],
      ], function(e, d) {
        when('first selected model\'s isLocked === '+e.first, function() {
          this.modelService.isLocked._retVal = e.first;
        }, function() {
          it('should toggle lock on local selection, '+d, function() {
            expect(this.gameModelSelectionService.get)
              .toHaveBeenCalledWith('local', 'selection');
            expect(this.gameModelsService.findStamp)
              .toHaveBeenCalledWith('stamp1', 'models');
            expect(this.modelService.isLocked)
              .toHaveBeenCalledWith('gameModels.findStamp.returnValue');
            expect(this.gameService.executeCommand)
              .toHaveBeenCalledWith('lockModels', e.set,
                                    this.gameModelSelectionService.get._retVal,
                                    this.scope, this.scope.game);
          });
        });
      });
    });
  });

  describe('lockModelsCommand service', function() {
    beforeEach(inject([
      'lockModelsCommand',
      function(lockModelsCommandService) {
        this.lockModelsCommandService = lockModelsCommandService;
        this.gameModelsService = spyOnService('gameModels');

        this.scope = jasmine.createSpyObj('scope', [
          'gameEvent'
        ]);
        this.game = { models: 'models' };
      }
    ]));

    when('execute(<lock>, <stamps>, <scope>, <game>)', function() {
      this.ctxt = this.lockModelsCommandService
        .execute('lock', this.stamps, this.scope, this.game);
    }, function() {
      beforeEach(function() {
        this.stamps = ['stamp1', 'stamp2'];
      });

      it('should apply <lock> on <stamps>', function() {
        expect(this.gameModelsService.lockStamps)
          .toHaveBeenCalledWith('lock', this.stamps, 'models');
        expect(this.game.models)
          .toBe('gameModels.lockStamps.returnValue');
      });

      it('should emit changeModel gameEvents', function() {
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('changeModel-stamp1');
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('changeModel-stamp2');
      });

      it('should return context', function() {
        expect(this.ctxt)
          .toEqual({
            stamps: this.stamps,
            desc: 'lock'
          });
      });
    });

    when('replay(<ctxt>, <scope>, <game>)', function() {
      this.lockModelsCommandService.replay(this.ctxt, this.scope, this.game);
    }, function() {
      beforeEach(function() {
        this.ctxt = {
          stamps: [ 'stamp1', 'stamp2' ],
          desc: 'lock',
        };
      });

      it('should apply <lock> on <stamps>', function() {
        expect(this.gameModelsService.lockStamps)
          .toHaveBeenCalledWith('lock', this.ctxt.stamps, 'models');
        expect(this.game.models)
          .toBe('gameModels.lockStamps.returnValue');
      });

      it('should emit changeModel gameEvents', function() {
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('changeModel-stamp1');
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('changeModel-stamp2');
      });
    });

    when('undo(<ctxt>, <scope>, <game>)', function() {
      this.lockModelsCommandService.undo(this.ctxt, this.scope, this.game);
    }, function() {
      beforeEach(function() {
        this.ctxt = {
          stamps: [ 'stamp1', 'stamp2' ],
          desc: true,
        };
      });

      it('should apply !<lock> on <stamps>', function() {
        expect(this.gameModelsService.lockStamps)
          .toHaveBeenCalledWith(false, this.ctxt.stamps, 'models');
        expect(this.game.models)
          .toBe('gameModels.lockStamps.returnValue');
      });

      it('should emit changeModel gameEvents', function() {
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('changeModel-stamp1');
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('changeModel-stamp2');
      });
    });
  });

  describe('gameModels service', function() {
    beforeEach(inject([
      'gameModels',
      function(gameModelsService) {
        this.gameModelsService = gameModelsService;
      }
    ]));

    describe('lockStamps(<lock>, <stamps>)', function() {
      beforeEach(function() {
        this.models = {
          active: [ { state: { stamp: 's1', dsp: [] } },
                    { state: { stamp: 's2', dsp: [] } } ],
          locked: [ { state: { stamp: 's3', dsp: ['lk'] } },
                    { state: { stamp: 's4', dsp: ['lk'] } } ],
        };
      });

      using([
        [ 'lock', 'stamps', 'result' ],
        [ true  , ['s1']  , { active: [ { state: { stamp: 's2', dsp: [] } } ],
                              locked: [ { state: { stamp: 's1', dsp: ['lk'] } },
                                        { state: { stamp: 's3', dsp: ['lk'] } },
                                        { state: { stamp: 's4', dsp: ['lk'] } } ],
                            } ],
        [ false , ['s1']  , { active: [ { state: { stamp: 's1', dsp: [] } },
                                        { state: { stamp: 's2', dsp: [] } } ],
                              locked: [ { state: { stamp: 's3', dsp: ['lk'] } },
                                        { state: { stamp: 's4', dsp: ['lk'] } } ],
                            } ],
        [ true  , ['s3']  , { active: [ { state: { stamp: 's1', dsp: [] } },
                                        { state: { stamp: 's2', dsp: [] } } ],
                              locked: [ { state: { stamp: 's3', dsp: ['lk'] } },
                                        { state: { stamp: 's4', dsp: ['lk'] } } ],
                            } ],
        [ false , ['s4']  , { active: [ { state: { stamp: 's1', dsp: [] } },
                                        { state: { stamp: 's2', dsp: [] } },
                                        { state: { stamp: 's4', dsp: [] } } ],
                              locked: [ { state: { stamp: 's3', dsp: ['lk'] } } ],
                            } ],
        [ true  , ['s2','s3'] , { active: [ { state: { stamp: 's1', dsp: [] } } ],
                                  locked: [ { state: { stamp: 's2', dsp: ['lk'] } },
                                            { state: { stamp: 's3', dsp: ['lk'] } },
                                            { state: { stamp: 's4', dsp: ['lk'] } } ],
                                } ],
        [ false , ['s1','s4'] , { active: [ { state: { stamp: 's1', dsp: [] } },
                                            { state: { stamp: 's2', dsp: [] } },
                                            { state: { stamp: 's4', dsp: [] } } ],
                                  locked: [ { state: { stamp: 's3', dsp: ['lk'] } } ],
                                } ],
      ], function(e, d) {
        it('should set lock for <stamps>, '+d, function() {
          expect(this.gameModelsService.lockStamps(e.lock, e.stamps, this.models))
            .toEqual(e.result);
        });
      });
    });
  });

  describe('model service', function() {
    beforeEach(inject([
      'model',
      function(modelService) {
        this.modelService = modelService;
      }
    ]));

    describe('setLock(<set>)', function() {
      it('should set lock for <model>', function() {
        this.model = { state: { dsp: [] } };
        
        this.modelService.setLock(true, this.model);
        expect(this.modelService.isLocked(this.model))
          .toBeTruthy();
        
        this.modelService.setLock(false, this.model);
        expect(this.modelService.isLocked(this.model))
          .toBeFalsy();
      });
    });
  });
});
