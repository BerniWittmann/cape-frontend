export const START_EVENT_TYPE = 'bpmn:StartEvent'
export const END_EVENT_TYPE = 'bpmn:EndEvent'
export const INTERMEDIATE_EVENT_TYPE = 'bpmn:IntermediateThrowEvent'
export const GATEWAY_TYPES = ['bpmn:ExclusiveGateway', 'bpmn:ParallelGateway', 'bpmn:InclusiveGateway', 'bpmn:ComplexGateway', 'bpmn:EventBasedGateway']
export const TASK_TYPES = ['bpmn:Task', 'bpmn:SendTask', 'bpmn:ReceiveTask', 'bpmn:UserTask', 'bpmn:ManualTask', 'bpmn:BusinessRuleTask', 'bpmn:ServiceTask', 'bpmn:ScriptTask', 'bpmn:CallActivity', 'bpmn:SubProcess']
export const DATA_OBJECT_TYPES = ['bpmn:DataObjectReference', 'bpmn:DataStoreReference']
export const MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES = [...GATEWAY_TYPES, ...DATA_OBJECT_TYPES]
export const NO_CONNECTIONS_DISALLOWED_OBJECTS = [START_EVENT_TYPE, END_EVENT_TYPE, INTERMEDIATE_EVENT_TYPE, ...TASK_TYPES, ...GATEWAY_TYPES]
export const PROCESS_TYPES = ['bpmn:Process', 'bpmn:SubProcess']
