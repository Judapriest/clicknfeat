'use strict';

describe('select template', function() {
  describe('defaultMode service', function() {
    beforeEach(inject([
      'defaultMode',
      function(defaultModeService) {
        this.defaultModeService = defaultModeService;
        this.gameTemplateSelectionService = spyOnService('gameTemplateSelection');
      
        this.scope = { game: { template_selection: 'selection' } };
        this.scope.gameEvent = jasmine.createSpy('gameEvent');
        this.event = { target: { state: { stamp: 'stamp' } } };
      }
    ]));

    when('user click on template', function() {
      this.defaultModeService.actions
        .clickTemplate(this.scope, this.event);
    }, function() {
      it('should set gameTemplateSelection', function() {
        expect(this.gameTemplateSelectionService.set)
          .toHaveBeenCalledWith('local', 'stamp', this.scope, 'selection');
      });
    });

    when('user right-click on template', function() {
      this.defaultModeService.actions
        .rightClickTemplate(this.scope, this.event);
    }, function() {
      it('should open template selection detail', function() {
        expect(this.scope.gameEvent)
          .toHaveBeenCalledWith('openSelectionDetail', 'template',
                                { state: { stamp: 'stamp' } });
      });

      it('should set gameTemplateSelection', function() {
        expect(this.gameTemplateSelectionService.set)
          .toHaveBeenCalledWith('local', 'stamp', this.scope, 'selection');
      });
    });
  });

  describe('temlateLockedMode service', function() {
    beforeEach(inject([
      'templateLockedMode',
      function(templateLockedModeService) {
        this.templateLockedModeService = templateLockedModeService;
        this.gameTemplateSelectionService = spyOnService('gameTemplateSelection');

        this.scope = { game: { template_selection: 'selection' } };
      }
    ]));

    using([
      [ 'action' ],
      [ 'click' ],
      [ 'rightClick' ],
      [ 'drag' ],
    ], function(e,d) {
      when('user '+e.action+' on map', function() {
        this.templateLockedModeService
          .actions[e.action+'Map'](this.scope);
      }, function() {
        it('should clear gameTemplateSelection', function() {
          expect(this.gameTemplateSelectionService.clear)
            .toHaveBeenCalledWith('local', this.scope, 'selection');
        });
      });
    });
  });

  describe('gameTemplateSelection service', function() {
    beforeEach(inject([
      'gameTemplateSelection',
      function(gameTemplateSelectionService) {
        this.gameTemplateSelectionService = gameTemplateSelectionService;
        this.gameTemplatesService = spyOnService('gameTemplates');
        this.modesService = spyOnService('modes');

        this.scope = jasmine.createSpyObj('scope', ['gameEvent']);
        this.scope.game = { template: 'templates' };
        this.scope.modes = 'modes';
      }
    ]));

    using([
      [ 'where' ],
      [ 'local' ],
      [ 'remote' ],
    ], function(e, d) {
      when('set(<where>, <stamp>, <scope>)', function() {
        this.ret = this.gameTemplateSelectionService.set(e.where, 'stamp',
                                                         this.scope, this.selection);
      }, function() {
        beforeEach(function() {
          this.selection = { local: { stamps: [] },
                             remote: { stamps: [] }
                           };
        });

        it('should set <where> selection', function() {
          expect(this.gameTemplateSelectionService.in(e.where, 'stamp', this.ret))
            .toBeTruthy();
        });

        it('should emit changeTemplate event', function() {
          expect(this.scope.gameEvent)
            .toHaveBeenCalledWith('changeTemplate-stamp', this.ret);
        });

        if(e.where === 'local') {
          using([
            [ 'isLocked', 'mode'],
            [ true      , 'TemplateLocked' ],
            [ false     , 'Template' ],
          ], function(e,d) {
            when('<stamp> is '+(e.isLocked?'':'not ')+'locked', function() {
              this.gameTemplatesService.isLocked._retVal = e.isLocked;
            }, function() {
              it('should switch to '+e.mode+' mode', function() {            
                expect(this.modesService.switchToMode)
                  .toHaveBeenCalledWith(e.mode, this.scope, 'modes');
              });
            });
          });
        }
        
        when('there is a previous selection', function() {
          this.selection[e.where].stamps = [ 'previous' ];
        }, function() {
          it('should emit changeTemplate event', function() {            
            expect(this.scope.gameEvent)
              .toHaveBeenCalledWith('changeTemplate-previous', this.ret);
          });
        });
      });

      when('removeFrom(<where>, <stamp>, <scope>)', function() {
        this.ret = this.gameTemplateSelectionService.removeFrom(e.where, 'stamp',
                                                                this.scope, this.selection);
      }, function() {
        when('<stamp> is in previous selection', function() {
          this.selection = { local: { stamps: ['stamp'] },
                             remote: { stamps: ['stamp'] }
                           };
        }, function() {
          it('should clear <where> selection', function() {
            expect(this.gameTemplateSelectionService.in(e.where, 'stamp', this.ret))
              .toBeFalsy();
          });

          if(e.where === 'local') {
            it('should switch to Default mode', function() {            
              expect(this.modesService.switchToMode)
                .toHaveBeenCalledWith('Default', this.scope, 'modes');
            });
          }

          it('should emit changeTemplate event', function() {            
            expect(this.scope.gameEvent)
              .toHaveBeenCalledWith('changeTemplate-stamp', this.ret);
          });
        });

        when('<stamp> is not in previous selection', function() {
          this.selection = { local: { stamps: ['other'] },
                             remote: { stamps: ['other'] }
                           };
        }, function() {
          it('should do nothing', function() {
            expect(this.gameTemplateSelectionService.in(e.where, 'other', this.selection))
              .toBeTruthy();
            expect(this.modesService.switchToMode)
              .not.toHaveBeenCalled();
            expect(this.scope.gameEvent)
              .not.toHaveBeenCalled();
          });
        });
      });

      when('clear(<where>, <scope>)', function() {
        this.ret = this.gameTemplateSelectionService.clear(e.where, this.scope,
                                                           this.selection);
      }, function() {
        beforeEach(function() {
          this.selection = { local: { stamps: ['stamp'] },
                             remote: { stamps: ['stamp'] }
                           };
        });

        it('should clear <where> selection', function() {
          expect(this.gameTemplateSelectionService.in(e.where, 'stamp', this.ret))
            .toBeFalsy();
        });

        if(e.where === 'local') {
          it('should switch to Default mode', function() {            
            expect(this.modesService.switchToMode)
              .toHaveBeenCalledWith('Default', this.scope, 'modes');
          });
        }

        when('there is a previous selection', function() {
          this.selection[e.where].stamps = [ 'previous' ];
        }, function() {
          it('should emit changeTemplate event', function() {            
            expect(this.scope.gameEvent)
              .toHaveBeenCalledWith('changeTemplate-previous', this.ret);
          });
        });
      });
    });
  });
});