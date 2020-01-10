import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlfrescoApiService, AppConfigService, AuthenticationService} from '@alfresco/adf-core';
import {ResultListDataRepresentationProcessInstanceRepresentation} from '@alfresco/js-api/src/api/activiti-rest-api/model/resultListDataRepresentationProcessInstanceRepresentation';
import {ResultListDataRepresentationTaskRepresentation} from '@alfresco/js-api/src/api/activiti-rest-api/model/resultListDataRepresentationTaskRepresentation';
import {UserRepresentation} from '@alfresco/js-api/src/api/activiti-rest-api/model/userRepresentation';
import {FormattedProcess} from '../../models/formatted-process.model';
import * as _ from 'lodash';
import {TaskFilterService} from '@alfresco/adf-process-services';

@Component({
  selector: 'bal-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  appIds: any;

  loggedUser: UserRepresentation;
  formattedProcesses: FormattedProcess[];

  counter = {
    'process1_instances': '-',
    'process1_task1': '-',
    'process1_task2': '-',
    'process1_task3': '-',
  };

  constructor(
    private alfrescoApiService: AlfrescoApiService,
    private appConfig: AppConfigService,
    private authService: AuthenticationService,
    private router: Router,
    private taskFilterService: TaskFilterService
  ) {
  }

  /** Se lance au chargement du composant */
  async ngOnInit(): Promise<void> {
    this.appIds = this.appConfig.get('appIds');

    const promises = _.chain(this.appIds).map((appId) => appId).map((appId) => {
      return this.getProcess(appId);
    }).value();

    await Promise.all(promises).then((datas: ResultListDataRepresentationProcessInstanceRepresentation[]) => {
      this.formattedProcesses = _.chain(datas).map((data, index) => {
        return _.chain(data.data).map((instance) => {
          return {
            appId: _.get(this.appIds, _.chain(this.appIds).keys().get(index).value()),
            instance: instance,
            state: (instance.ended ? 'completed' : 'running'),
          };
        }).value();
      }).flatten().value();
    });

    // récupère l'utilisateur en cours.
    await this.authService.getBpmLoggedUser().subscribe((user) => {
      this.loggedUser = user;
    });

    await this.getAllCounters().then(() => {
      // test taskFilterService //
      console.log('test taskFilterService');
      // this.taskFilterService.getTaskFilterByStarted();
    });
  }

  /** Récupère tous les compteurs pour l'affichage du Dashboard */
  async getAllCounters(): Promise<void> {
    this.counter = {
      process1_instances: await this.getProcessRunning(this.appIds.process1),
      process1_task1: await this.getTaskByName(this.appIds.process1, 'Task 1'),
      process1_task2: await this.getTaskByName(this.appIds.process1, 'Task 2'),
      process1_task3: await this.getTaskByName(this.appIds.process1, 'Task 3'),
    };
  }

  /** Processus en cours */
  async getProcessRunning(appId: number): Promise<string> {
    let counter = 0;
    const processes = this.getLocalProcesses(appId, 'running');
    counter = processes.length;
    return counter.toString();
  }

  /** Je suis la personne qui doit réassigner un processus en cours */
  async getTaskByName(appId: number, taskName: string): Promise<string> {
    let counter = 0;
    const processes = this.getLocalProcesses(appId, 'running');
    for (const process of processes) {
      if (!process.running_tasks) {
        process.running_tasks = (await this.getTasks(_.get(process, 'instance.id', null), 'running')).data;
      }

      for (const task of process.running_tasks) {
        if (_.includes(task.name, taskName)) {
          counter++;
        }
      }
    }

    return counter.toString();
  }

  /** Récupère les processus de l'application `appId` ayant leur état à `state` */
  async getProcess(appId: number, state: string = 'running'): Promise<ResultListDataRepresentationProcessInstanceRepresentation> {
    const filter = {appDefinitionId: appId, 'filter': {'state': state}};
    return this.alfrescoApiService.getInstance().activiti.processApi.filterProcessInstances(filter);
  }

  /** Récupère les processus de l'application `appId` ayant leur état à `state` */
  getLocalProcesses(appId: number, state: string = 'all'): FormattedProcess[] {
    let filter: FormattedProcess[];
    switch (state) {
      case 'running':
        filter = _.filter(this.formattedProcesses, {appId: appId, state: 'running'});
        break;
      case 'completed':
        filter = _.filter(this.formattedProcesses, {appId: appId, state: 'completed'});
        break;
      case 'all':
      default:
        filter = _.filter(this.formattedProcesses, {appId: appId});
        break;
    }
    return filter;
  }

  /** Récupère les tâches du processus `processInstanceId` ayant leur état à `state` */
  async getTasks(processInstanceId: string, state: string = 'running'): Promise<ResultListDataRepresentationTaskRepresentation> {
    const opts = {processInstanceId: processInstanceId, state: state};
    return this.alfrescoApiService.getInstance().activiti.taskApi.listTasks(opts);
  }

  /** Récupère les variables du processus `processInstanceId` */
  async getProcessInstanceVariables(processInstanceId: string): Promise<any[]> {
    return this.alfrescoApiService.getInstance().bpmClient.callApi(
      `/api/enterprise/process-instances/${processInstanceId}/historic-variables`, 'GET',
      {}, {}, {}, {}, {}, ['application/json'], ['application/json']);
  }

  /** Navigate to `route` */
  navigateTo(route: string): void {
    this.router.navigate(['/' + route]).then();
  }
}
