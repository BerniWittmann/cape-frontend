# RulesCell

A Cell which allows to edit the Attribute Cell of the Rules in the Context Factor. Allows to edit Strings, Booleans and Numbers.

## Props

<!-- @vuese:RulesCell:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|type|The type of the input field|`'Number'` / `'Boolean'` / `'String'`|`true`|-|
|value|The value of the input field|`String`|`false`|-|

<!-- @vuese:RulesCell:props:end -->


## Events

<!-- @vuese:RulesCell:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|change|Emitted on change of the value|The updated value|

<!-- @vuese:RulesCell:events:end -->


## Methods

<!-- @vuese:RulesCell:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|switchNumberView|switches the view from a single number input to the double number input and back|-|
|updateValue|updates a value change, checks string for forbidden characters (=, &, |) and allows to empty a boolean choice|the input/selection|

<!-- @vuese:RulesCell:methods:end -->


