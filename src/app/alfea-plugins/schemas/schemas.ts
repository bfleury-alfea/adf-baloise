const TASK_LIST_SCHEMA = [
  {
    type: 'text',
    key: 'processInstanceId',
    title: 'processInstanceId',
    sortable: true,
  },
  {
    type: 'text',
    key: 'processInstanceName',
    title: 'Process Name',
    sortable: true,
  },
  {
    type: 'date',
    key: 'processInstanceStarted',
    title: 'Process Launch Date',
    format: 'dd/MM/yyyy hh-mm-ss',
    sortable: true,
  },
  {
    type: 'date',
    key: 'processInstanceEnded',
    title: 'Process End Date',
    format: 'dd/MM/yyyy hh-mm-ss',
    sortable: true,
  },
  {
    type: 'text',
    key: 'processInstanceState',
    title: 'Process State',
    sortable: true,
  },
  {
    type: 'text',
    key: 'taskId',
    title: 'taskId',
    sortable: true,
  },
  {
    type: 'text',
    key: 'taskName',
    title: 'Task Name',
    sortable: true,
  },
  {
    type: 'text',
    key: 'taskAssignee',
    title: 'Task Assignee',
    sortable: true,
  },
  {
    type: 'date',
    key: 'taskCreated',
    title: 'Task Creation Date',
    format: 'dd/MM/yyyy hh-mm-ss',
    sortable: true,
  },
  {
    type: 'date',
    key: 'taskDueDate',
    title: 'Task Due Date',
    format: 'dd/MM/yyyy hh-mm-ss',
    sortable: true,
  },
];
const PROCESS_LIST_SCHEMA = [
  {
    type: 'text',
    key: 'processInstanceId',
    title: 'processInstanceId',
    sortable: true,
  },
  {
    type: 'text',
    key: 'processInstanceName',
    title: 'Process Name',
    sortable: true,
  },
  {
    type: 'date',
    key: 'processInstanceStarted',
    title: 'Process Launch Date',
    format: 'dd/MM/yyyy hh-mm-ss',
    sortable: true,
  },
  {
    type: 'text',
    key: 'taskId',
    title: 'taskId',
    sortable: true,
  },
  {
    type: 'text',
    key: 'taskName',
    title: 'Task Name',
    sortable: true,
  },
  {
    type: 'text',
    key: 'taskAssignee',
    title: 'Task Assignee',
    sortable: true,
  },
  {
    type: 'date',
    key: 'taskDueDate',
    title: 'Task Due Date',
    format: 'dd/MM/yyyy hh-mm-ss',
    sortable: true,
  },
];

export {
  TASK_LIST_SCHEMA,
  PROCESS_LIST_SCHEMA
};
