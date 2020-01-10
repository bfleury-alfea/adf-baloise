import {Injectable} from '@angular/core';
import * as schemas from '../schemas/schemas';

@Injectable({
  providedIn: 'root'
})

export class CustomTaskListService {
  schemas = schemas;

  constructor() {
  }

  // Permet de faire la liaison entre le schémas demandé par la corbeille, et les schémas définis.
  getSchema(schemaName: any) {
    let ret = [];
    switch (schemaName) {
      case 'TASK_LIST_SCHEMA':
      case 'PROCESS_LIST_SCHEMA':
        ret = this.schemas[schemaName];
        break;
      default:
        ret = [];
        break;
    }
    return ret;
  }

  // permet de construire un tableau acceptable pour la Datatable, depuis le tableau reçu par l'API
  public Format(tableau: any[], manualVariables: any, source: string) {
    let tabTemp: any;

    switch (source) {
      case 'process':
        tabTemp = tableau.map((obj: { id: string | number; value: any; }) => {
          const rObj = {};
          rObj[obj.id] = obj.value;
          return rObj;
        });
        break;
      case 'task':
        tabTemp = tableau.map((obj: { name: string | number; value: any; }) => {
          const rObj = {};
          if (obj.value === '""' || obj.value === null || obj.value === 'null') {
            obj.value = '';
          }
          rObj[obj.name] = obj.value;
          return rObj;
        });
        tabTemp.push({TaskId: manualVariables.taskId.toString()});
        break;
      default:
        tabTemp = [];
        break;
    }

    return Object.assign({}, ...tabTemp, ...manualVariables);
  }

  // Permet de ne garder que les variables qui sont défini dans le schéma.
  public purge(tableau: any, schemas: any[], source: string) {
    const tableauCorrect = [];
    for (const ligne of tableau) {
      for (const colonne of schemas) {
        if (source === 'task' && colonne.key === ligne.name) {
          tableauCorrect.push(ligne);
        } else if (source === 'process' && colonne.key === ligne.id) {
          tableauCorrect.push(ligne);
        }
      }
    }
    return tableauCorrect;
  }
}
