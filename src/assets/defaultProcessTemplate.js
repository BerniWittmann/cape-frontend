export default '<?xml version="1.0" encoding="UTF-8"?> ' +
'<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0pzq2xr" targetNamespace="http://bpmn.io/schema/bpmn"> ' +
'<bpmn:process id="Process_1" isExecutable="false"> ' +
'<bpmn:startEvent id="StartEvent_1"> ' +
'<bpmn:outgoing>SequenceFlow_1efzkxz</bpmn:outgoing> ' +
'</bpmn:startEvent> ' +
'<bpmn:intermediateThrowEvent id="IntermediateThrowEvent_12et4wi"> ' +
'<bpmn:incoming>SequenceFlow_1efzkxz</bpmn:incoming> ' +
'</bpmn:intermediateThrowEvent> ' +
'<bpmn:sequenceFlow id="SequenceFlow_1efzkxz" sourceRef="StartEvent_1" targetRef="IntermediateThrowEvent_12et4wi" /> ' +
'</bpmn:process> ' +
'<bpmndi:BPMNDiagram id="BPMNDiagram_1"> ' +
'<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"> ' +
'<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"> ' +
'<dc:Bounds x="173" y="102" width="36" height="36" /> ' +
'</bpmndi:BPMNShape> ' +
'<bpmndi:BPMNShape id="IntermediateThrowEvent_12et4wi_di" bpmnElement="IntermediateThrowEvent_12et4wi"> ' +
'<dc:Bounds x="259" y="102" width="36" height="36" /> ' +
'</bpmndi:BPMNShape> ' +
'<bpmndi:BPMNEdge id="SequenceFlow_1efzkxz_di" bpmnElement="SequenceFlow_1efzkxz"> ' +
'<di:waypoint x="209" y="120" /> ' +
'<di:waypoint x="259" y="120" /> ' +
'</bpmndi:BPMNEdge> ' +
'</bpmndi:BPMNPlane> ' +
'</bpmndi:BPMNDiagram>' +
'</bpmn:definitions>'
