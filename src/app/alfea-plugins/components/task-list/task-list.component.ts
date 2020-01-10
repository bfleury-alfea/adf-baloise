import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AlfrescoApiService, AppConfigService, AuthenticationService, ObjectDataTableAdapter} from '@alfresco/adf-core';

import {Router} from '@angular/router';
import {CustomTaskListService} from '../../services/custom-list.service';


@Component({
  selector: 'bal-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  vueService = new CustomTaskListService();

  table: any[];
  dataProcesses: ObjectDataTableAdapter;
  schema: any[];
  appId: string;
  dashboard: any[];
  loggedUser: any;

  is_manager: boolean;

  constructor(
    protected router: Router,
    protected appConfig: AppConfigService,
    protected alfrescoApiService: AlfrescoApiService,
    protected authService: AuthenticationService,
  ) {

  }

  ngOnInit(): void {

    this.schema = this.vueService.getSchema('TASK_LIST_SCHEMA');

    this.table = [];

    // this.dataProcesses = new ObjectDataTableAdapter(this.table, this.schema);

    this.appId = this.appConfig.get('appIds.process1');

    this.dashboard = [];

    this.is_manager = false;

    this.getLoggedUser();

    this.getKey().then(() => {
      console.log('Chargement terminé');
    });
  }


  /** Récupère le user en cours */
  getLoggedUser(): void {
    this.authService.getBpmLoggedUser().subscribe((user) => {
      this.loggedUser = user;
      console.log('this.loggedUser');
      console.log(this.loggedUser);

      for (const group of this.loggedUser.groups) {
        if (group.name === 'manager') {
          this.is_manager = true;
          return;
        }
      }
    });
  }

  /** Récupère le key definition d'une application */
  async getKey(): Promise<void> {
    const opts = {latest: true, appDefinitionId: this.appId};
    await this.alfrescoApiService.getInstance().activiti.processDefinitionsApi.getProcessDefinitions(opts).then(async (reponse) => {
      console.log('Process Definitions');
      console.log(reponse);

      for (const data of reponse.data) {
        await this.getIdProcessInstance(data.key);
      }
    }).catch(console.error);
  }

  /** Récupère les processus de la definiton `processDefinitionKey` */
  async getIdProcessInstance(processDefinitionKey: string): Promise<void> {
    try {
      const filterRequest = {'filter': {'processDefinitionKey': processDefinitionKey, 'state': 'running'}}; // running / completed / all
      const response = await this.alfrescoApiService.getInstance().activiti.processApi.filterProcessInstances(filterRequest);

      console.log('Process Instance');
      console.log(response);

      for (const element of response.data) {
        // if (await this.customConditionProcessInstance(element)) {

        const opts = {processInstanceId: element.id.toString(), state: 'running'}; // running / completed / all
        const tasks = await this.alfrescoApiService.getInstance().activiti.taskApi.listTasks(opts);

        console.log('Tasks');
        console.log(tasks);

        for (const task of tasks.data) {
          this.table.push({
            processInstanceId: (element.id ? element.id : '-'),
            processInstanceName: (element.name ? element.name : '-'),
            processInstanceStarted: (element.started ? element.started : null),
            processInstanceEnded: (element.ended ? element.ended : null),
            processInstanceState: (element.ended ? 'Completed' : 'Running'),

            taskId: (task ? task.id : ''),
            taskName: (task ? task.name : '-'),
            taskAssignee: (task && task.assignee ? task.assignee.firstName + ' ' + task.assignee.lastName : '-'),
            taskCreated: (task && task.created ? task.created : null),
            taskDueDate: (task && task.dueDate ? task.dueDate : null),
          });
        }

      //     // if (await this.customConditionTasks(element, tasks)) {
      //       // await this.getProcessInstanceVariables(manualVariables);
      }
      // this.addLineIfEmpty(); // TODO : Trouver une meilleur solution ?

      this.dataProcesses = new ObjectDataTableAdapter(this.table, this.schema);
    } catch (error) {
      console.error(error);
    }
  }

  /** Affiche les détails du processus lorsqu'on clique dessus */
  onRowClick(event): void {
    console.log(event);
    const taskId = event.value.obj.taskId;

    if (taskId) {
      // this.taskListService.claimTask(taskId);
      this.router.navigate(['/task-details', taskId]).then();
    }
  }
}
