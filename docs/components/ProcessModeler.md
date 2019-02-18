# ProcessModeler

A Component which allows the process itself to be edited. This is a wrapper for the bpmn-io library

## Props

<!-- @vuese:ProcessModeler:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|value|The value object containing the keys `xml`, `svg`, `extensionAreas`|`Object`|`true`|-|

<!-- @vuese:ProcessModeler:props:end -->


## Events

<!-- @vuese:ProcessModeler:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|input|Fired when the data changed|The new value object with `svg`, `xml`and `extensionAreas`|

<!-- @vuese:ProcessModeler:events:end -->


## Methods

<!-- @vuese:ProcessModeler:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|validate|Validate the Process Model|-|
|reloadXML|Reload the XML data into the modeler|-|

<!-- @vuese:ProcessModeler:methods:end -->


