import {ProcessInstanceRepresentation} from '@alfresco/js-api/src/api/activiti-rest-api/model/processInstanceRepresentation';
import {TaskRepresentation} from '@alfresco/js-api/src/api/activiti-rest-api/model/taskRepresentation';

export class FormattedProcess {
  appId: number;
  instance: ProcessInstanceRepresentation;
  state: string;
  running_tasks?: TaskRepresentation[];
  completed_tasks?: TaskRepresentation[];
  variables?: any[];

  constructor(appId, instance, state) {
    this.appId = appId;
    this.instance = instance;
    this.state = state;
  }
}
