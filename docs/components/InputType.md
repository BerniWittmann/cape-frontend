# InputType

A component to edit a value and it's type

## Props

<!-- @vuese:InputType:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|value|The Value of the input field|`String`|`false`|''|
|type|The Type of the input field|`String`|`false`|'String'|
|size|Size of the controls|`'medium'` / `'small'` / `'mini'`|`false`|'normal'|
|placeholder|The Placeholder for the input field|`String`|`false`|undefined|
|typePlaceholder|The Placeholder for the type field|`String`|`false`|undefined|
|showTypeSelect|Display the select to change the type|`Boolean`|`false`|true|

<!-- @vuese:InputType:props:end -->


## Events

<!-- @vuese:InputType:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|change|Emitted when the input value or type is changed|data object with value and type|

<!-- @vuese:InputType:events:end -->


## Methods

<!-- @vuese:InputType:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|validate|validates the form|Callback function with the result as boolean|

<!-- @vuese:InputType:methods:end -->


