# Ember-cli-file-picker

[![Build Status](https://travis-ci.org/funkensturm/ember-cli-file-picker.svg)](https://travis-ci.org/funkensturm/ember-cli-file-picker)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-file-picker.svg)](http://emberobserver.com/addons/ember-cli-file-picker)
[![Greenkeeper badge](https://badges.greenkeeper.io/funkensturm/ember-cli-file-picker.svg)](https://greenkeeper.io/)

An addon for ember-cli that provides a component to easily add a filepicker to your ember-cli app.

It supports:
* A preview of the uploaded file
* A dropzone to drag and drop your file
* Currently it only support single file uploads but multiples will come soon

## Installation

* `ember install ember-cli-file-picker`

## Changelog

### 0.0.10
* [BUGFIX] Set input to null after select to fix webkit caching. [@nicford-gojimo](https://github.com/nicford-gojimo)

### 0.0.9
* [BUGFIX] Restore preview after selecting 'cancel' from the browser file dialog. [@quiaro](https://github.com/quiaro)

### 0.0.8
* [ENHANCEMENT] Add `hideFileInput` option to configure the file input visibility.

### 0.0.7
* [BUGFIX] `filesAreValid` was never called. [@green-arrow](https://github.com/green-arrow)

### 0.0.6
* removes "Binding style attributes..." warning

### 0.0.5
* ember-cli-file-picker now depends on ember >= `1.11.1`

## Usage

```handlebars
{{#file-picker fileLoaded="fileLoaded"}}
	Drag here or click to upload a file
{{/file-picker}}
```

### Options

* `accept` default `*`
* `multiple` default `false`
* `selectOnClick` default `true`
* `validateExtensions` default `true`
* `dropzone` default `true`
* `preview` default `true`
* `progress` default `true`
* `hideFileInput` default `true`
* `readAs` default `readAsFile`
	* `readAsFile`
	* `readAsArrayBuffer`
	* `readAsBinaryString`
	* `readAsDataURL`
	* `readAsText`

### Actions

* `fileLoaded` Implement `fileLoaded` in your controller to handle the file.

Example:

```js
// app/controllers/image.js
import Ember from 'ember';

export default Ember.ObjectController.extend({
	actions: {
		fileLoaded: function(file) {
			// readAs="readAsFile"
			console.log(file.name, file.type, file.size);
			// readAs="readAsArrayBuffer|readAsBinaryString|readAsDataURL|readAsText"
			console.log(file.name, file.type, file.data, file.size);
			// There is also file.filename for backward compatibility
		}
	}
});
```

### Bindings

* `errors`
* `removePreview`

### Validations

If you need to validate the files you can subclass the component and add a `filesAreValid` method.
The method should return a falsy value to stop file handling.

```js
// app/components/file-picker.js

import Ember from 'ember';
import FilePicker from 'ember-cli-file-picker/components/file-picker';

export default FilePicker.extend({
  filesAreValid: function(files) {
    // do something with the files and add errors:
    this.get('errors').addObject('wrong file type');
    return false;
  }
});
```


### CSS

The addon provides the following classes to style the file-picker:

* `.file-picker(.single|multiple &.over)`
  * `.file-picker__preview`
    * `.file-picker__preview__image.single`
    * `.file-picker__preview__image.multiple`
  * `.file-picker__progress`
    * `.file-picker__preview__value`
  * `.file-picker__dropzone`
  * `.file-picker__input`

## Test helpers
ember-cli-file-picker exports a test helper for acceptance tests.

```js
// tests/helpers/start-app.js
import './ember-cli-file-picker';

// tests/.jshintrc
{
  "predef": [
    "uploadFile"
  ]
}

// tests/acceptance/file-upload.js
import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | file upload');

test('visiting /file-upload', function(assert) {
  visit('/file-upload');

  // content is passed to [Blob() constructor](https://developer.mozilla.org/de/docs/Web/API/Blob/Blob)
  const content = [
    '"var";"value"\n',
    '"foo";"10"\n',
    '"bar";"20"'
  ];
  const filename = 'example.csv';
  const lastModifiedDate = new Date();

  // all arguments are optional
  uploadFile(content, filename, lastModifiedDate);
});
```

## Use with CarrierWave

```js
// app/models/post.js
import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
	image: attr('raw')
});
```

```js
// app/transforms/raw.js
import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
	deserialize: function(serialized) {
		return Ember.isNone(serialized) ? {} : serialized;
	},

	serialize: function(deserialized) {
		return Ember.isNone(deserialized) ? {} : deserialized;
	}
});
```

```html
// app/templates/application.hbs

{{#file-picker
  accept=".jpg,.jpeg,.gif,.png"
  fileLoaded="fileLoaded"
  readAs="readAsDataURL"
}}
```

```js
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		fileLoaded: function(file) {
			var post = this.get('store').createRecord('post', {
				image: file
			});
			post.save();
		}
	}
});
```

```ruby
class PostsController < ApplicationController
	def create
		params[:post][:image] = convert_to_upload(params[:post][:image])
		@post = Post.create(params)
	end

	protected

	def convert_to_upload(image)
		image_data = split_base64(image[:data])

		temp_img_file = Tempfile.new("data_uri-upload")
		temp_img_file.binmode
		temp_img_file << Base64.decode64(image_data[:data])
		temp_img_file.rewind

		ActionDispatch::Http::UploadedFile.new({
		  filename: image[:name],
		  type: image[:type],
		  tempfile: temp_img_file
		})
	end

	def split_base64(uri_str)
		if uri_str.match(%r{^data:(.*?);(.*?),(.*)$})
			uri = Hash.new
			uri[:type] = $1 # "image/gif"
			uri[:encoder] = $2 # "base64"
			uri[:data] = $3 # data string
			uri[:extension] = $1.split('/')[1] # "gif"
			return uri
		end
	end
end
```

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Publishing

```bash
ember release
npm publish
```
