import { Component } from '@angular/core';
import { Task } from 'tasklist/models';
import { UserStoreService } from 'app/user/state/user.store-service';
import { TaskStoreService } from 'app/task/state/task.store-service';
import { itemsPerPage } from 'app/task/state/task.selectors';

@Component({
  selector: 'tasks-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['tasklist.component.scss']
})
export class TasklistComponent {

  currentDataTab = 'description';
  itemsPerPage = itemsPerPage;

  totalItems = this.taskStore.taskCount$();
  page = this.taskStore.selectedPage$();
  currentProfile$ = this.userStore.currentUserProfile$();
  tasks = this.taskStore.tasks();

  constructor(
    private taskStore: TaskStoreService,
    private userStore: UserStoreService
  ) {}

  claim($event, task: Task) {
    this.taskStore.claim({task});
  }

  unclaim($event, task: Task) {
    this.taskStore.unclaim({task});
  }

  reload() {
    this.taskStore.loadTasks();
  }

  loadPage(page: number) {
    this.taskStore.selectPage({pageNumber: page});
  }

  toFieldSet(payload: any) {
    return Object.keys(payload)
      .map(prop => ({name: prop, value: payload[prop]}));
  }
}
