# ContextFactorEditDialog

A Dialog to edit or delete a Context Factor, allows to change the name, context type, attributes and its context attribute states and rules.

## Methods

<!-- @vuese:ContextFactorEditDialog:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|save|saves the context factor|boolean which either saves and closes the dialog (true) or just saves it (false)|
|reset|resets the context factor back to the saved data|-|
|deleteContextFactor|deletes the context factor after asking for confirmation first|-|
|validateAttributes|validates the context factor attributes|-|
|resetAttributeForms|resets the context factor attribute forms|-|
|addAttribute|adds a new the context factor attribute|-|
|removeAttribute|removes a the chosen context factor attribute|index of the attribute to be removed|
|selectChange|handles the change of the context factor type to none type|the selected type|
|handleAttributeChange|handles the change of a context factor attribute to set the new values|the new data and the index of the attribute|
|updateStates|used to update the the rules depending on the tab|the selected tab|
|copyActiveContextFactorData|copy the data of the active context factor using deep copy|-|
|deepCopyData|creates and returns a deep copy of the given context factor|the context factor to be copied|

<!-- @vuese:ContextFactorEditDialog:methods:end -->


