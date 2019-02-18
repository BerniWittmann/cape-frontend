# InputEdit

A component to edit a text but hidden behind a text with an edit button

## Props

<!-- @vuese:InputEdit:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|value|The Value of the input field|`String`|`true`|-|
|rules|The Rules array that the input field should be validated against|`Array`|`false`||
|size|Size of the controls|`'medium'` / `'small'` / `'mini'`|`false`|'normal'|
|placeholder|The Placeholder for the input field|`String`|`false`|undefined|
|propName|The name the field should be referenced with within the form|`String`|`false`|'text'|

<!-- @vuese:InputEdit:props:end -->


## Events

<!-- @vuese:InputEdit:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|change|Fired when the text changes|The new text|

<!-- @vuese:InputEdit:events:end -->


## Methods

<!-- @vuese:InputEdit:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|showInput|shows the Input field|-|

<!-- @vuese:InputEdit:methods:end -->


