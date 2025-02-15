import { ProcessEffects } from './process.effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { ProcessService } from 'tasklist/services';
import { UserStoreService } from 'app/user/state/user.store-service';
import { createStoreServiceMock } from '@ngxp/store-service/testing';
import { loadStartableProcessDefinitions } from 'app/process/state/process.actions';
import { ProcessDefinition as ApiProcessDefinition } from 'tasklist/models/process-definition';

describe('ProcessEffects', () => {

  let processService: ProcessService;
  let userStore: UserStoreService;

  beforeEach(() => {
    processService = new ProcessService(null, null);
    // default user store to be overridden in test if needed.
    userStore = createStoreServiceMock(UserStoreService,
      {userId$: 'kermit'});
  });

  function effectsFor(action: Action): ProcessEffects {
    return new ProcessEffects(processService, userStore, new Actions(of(action)));
  }

  it('should load available process definitions', (done) => {
    // given:
    const action = loadStartableProcessDefinitions();
    const procDtos: ApiProcessDefinition[] = [
      {processName: 'foo', description: '', url: '', candidateGroups: [], candidateUsers: [], definitionId: 'foo-id',
          definitionKey: 'foo-key', definitionVersion: '', versionTag: '1'},
      {processName: 'bar', description: '', url: '', candidateGroups: [], candidateUsers: [], definitionId: 'foo-id',
          definitionKey: 'foo-key', definitionVersion: '', versionTag: '2'}
    ];
    const serviceSpy = spyOn(processService, 'getStartableProcesses').and.returnValue(of(procDtos));

    // when:
    effectsFor(action).loadStartableProcesses$.subscribe((newAction) => {
      expect(serviceSpy).toHaveBeenCalled();
      expect(newAction.definitions).toEqual([
        { name: 'foo', description: '', url: ''},
        { name: 'bar', description: '', url: ''}
      ]);
      done();
    });
  });

});
