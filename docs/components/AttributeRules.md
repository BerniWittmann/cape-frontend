# AttributeRules

The component to allow to view and edit the Attributes and Rules for the States of a Context Factor

## Props

<!-- @vuese:AttributeRules:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|contextFactor|gets the Context Factor|`Object`|`true`|-|

<!-- @vuese:AttributeRules:props:end -->


## Methods

<!-- @vuese:AttributeRules:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|convertToTableData|Converts the context rules to a representation that can be used in the table|-|
|convertFromTableData|Converts the context rules table representation to a string that can be stored|-|
|deleteState|Deletes a State after asking for confirmation|the index of the state to be deleted|
|reRender|Triggers a new render of the component|-|
|checkStateName|=, |, . and & are not allowed to be part of the name|-|

<!-- @vuese:AttributeRules:methods:end -->


