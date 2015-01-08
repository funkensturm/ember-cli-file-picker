# Ember-cli-file-picker

An addon for ember-cli that provides a component to easily add a filepicker to your ember-cli app.

It supports:
* A preview of the uploaded file
* A dropzone to drag and drop your file
* Currently it only support single file uploads but multiples will come soon


## Installation

* `npm install --save-dev ember-cli-file-picker`

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
* `readAs` default `readAsFile` Options: readAsFile, readAsArrayBuffer, readAsBinaryString, readAsDataURL, readAsText

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
			console.log(file.filename, file.type, file.data, file.size);
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
		  filename: image[:filename],
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
