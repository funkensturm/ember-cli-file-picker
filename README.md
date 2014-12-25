# Ember-cli-file-picker

An addon for ember-cli that provides a component to easily add a filepicker to your ember-cli app.

It supports:
* A preview of the uploaded file
* A dropzone to drag and drop your file
* Currently it only support single file uploads but multiples will come soon


## Installation

* `npm install --save-dev ember-cli-uploader`

## Usage

```handlebars
{{#file-picker fileLoaded="fileLoaded"}}
	Drag here or click to upload a file
{{/file-picker}}
```

### Options

* `accept` default `*`
* `multiple` default `false`
* `preview` default `true`
* `dropzone` default `true`

### Actions

* `fileLoaded` Implement `fileLoaded` in your controller to handle the file.

Exsample:

```js
// app/controllers/image.js
import Ember from 'ember';

export default Ember.ObjectController.extend({
	actions: {
		fileLoaded: function(file) {
			console.log(file.name, file.type, file.size);
		}
	}
});
```

### Bindings

* `errors`

### CSS

The addon provides the following classes to style the file-picker:

* .file-picker(.single|multiple)
  * .file-picker__preview
    * .file-picker__preview__image.single
    * .file-picker__preview__image.multiple
  * .file-picker__dropzone
  * .file-picker__input

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
