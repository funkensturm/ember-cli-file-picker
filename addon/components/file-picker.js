import Ember from 'ember';
import { readFile } from '../lib/helpers';

const {
  Component,
  computed,
  observer,
  run: {
    bind
  },
  String: {
    htmlSafe
  },
  isEmpty,
  $
} = Ember;


export default Component.extend({
  classNames: ['file-picker'],
  classNameBindings: ['multiple:multiple:single'],
  accept: '*',
  multiple: false,
  preview: true,
  dropzone: true,
  progress: true,
  showProgress: false,
  hideFileInput: true,
  readAs: 'readAsFile',
  selectOnClick: true,
  count: 0,
  errors: [],
  progressValue: null,

  progressStyle: computed('progressValue', function() {
    var width = this.get('progressValue') || 0;

    return htmlSafe('width: ' + width + '%;');
  }),

  /**
   * When the component got inserted
   */
  didInsertElement: function() {
    if (this.get('hideFileInput')) {
      this.hideInput();
    }
    this.hidePreview();
    this.hideProgress();

    this.$('.file-picker__input').on(
      'change', bind(this, 'filesSelected')
    );
  },

  willDestroyElement: function() {
    this.$('.file-picker__input').off(
      'change', bind(this, 'filesSelected')
    );
  },

  /**
   * When the file input changed (a file got selected)
   * @param  {Event} event The file change event
   */
  filesSelected: function(event) {
    var files = event.target.files;
    if (files.length) {
      this.handleFiles(files);
    } else {
      this.clearPreview();
      this.set('progressValue', 0);
    }
  },

  handleFiles: function(files) {
    if (typeof(this.filesAreValid) === 'function') {
      if (!this.filesAreValid(files)) {
        return;
      }
    }

    if (this.get('preview')) {
      this.updatePreview(files);
    }

    if (this.get('multiple')) {
      this.sendAction('filesLoaded', files, this);
    } else {
      if (this.get('readAs') === 'readAsFile') {
        this.sendAction('fileLoaded', files[0], this);
      } else {
        readFile(files[0], this.get('readAs'), bind(this, 'updateProgress'))
          .then((file) => {
            this.sendAction('fileLoaded', file, this);
          });
      }
    }

    if (!this.get('hideFileInput')) {
      this.$('.file-picker__input').val(null);
    }
  },

  /**
   * Update preview
   * @param  {Array} files The selected files
   */
  updatePreview: function(files) {
    if (this.get('multiple')) {
      // TODO
    } else {
      this.clearPreview();
      this.set('showProgress', true);

      readFile(files[0], 'readAsDataURL', bind(this, 'updateProgress'))
        .then(bind(this, 'addPreviewImage'));

      this.$('.file-picker__dropzone').hide();
    }

    this.$('.file-picker__preview').show();
  },

  addPreviewImage: function(file) {
    var image = this.$(
      '<img src="' + file.data + '" class="file-picker__preview__image ' +
      (this.get('multiple') ? 'multiple' : 'single') + '">');

    this.hideProgress();
    this.$('.file-picker__preview').append(image);
  },

  updateProgress: function(event) {
    const {
      loaded,
      total
    } = event;

    let value = null;

    if (!isEmpty(loaded) && !isEmpty(total) && parseFloat(total) !== 0) {
      value = loaded / total * 100;
    }

    this.set('progressValue', value);
  },

  hideInput: function() {
    this.$('.file-picker__input').hide();
  },

  hidePreview: function() {
    this.$('.file-picker__preview').hide();
  },

  hideProgress: function() {
    this.set('showProgress', false);
  },

  clearPreview: function() {
    this.$('.file-picker__preview').html('');
    this.hidePreview();
    this.$('.file-picker__dropzone').show();

    // reset
    this.set('removePreview', false);
  },

  removePreviewDidChange: observer('removePreview', function() {
    if (this.get('removePreview')) {
      this.clearPreview();
    }
  }),

  // handles DOM events
  // Trigger a input click to open file dialog
  click: function(event) {
    if (this.get('selectOnClick') === true) {
      if (!$(event.target).hasClass('file-picker__input')) {
        this.$('.file-picker__input').trigger('click');
      }
    }
  },
  /* Drag'n'Drop events */
  dragOver: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (!this.get('dropzone')) {
      return;
    }

    event.dataTransfer.dropEffect = 'copy';
  },
  drop: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (!this.get('dropzone')) {
      return;
    }

    this.handleFiles(event.dataTransfer.files);
    this.set('count', 0);
    this.$().removeClass('over');
  },
  dragEnter: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (!this.get('dropzone')) {
      return;
    }

    if (!this.get('multiple')) {
      this.clearPreview();
    }
    var count = this.incrementProperty('count');
    if (count === 1) {
      this.$().addClass('over');
    }
  },
  dragLeave: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (!this.get('dropzone')) {
      return;
    }

    var count = this.decrementProperty('count');
    if (count === 0) {
      this.$().removeClass('over');
    }
  },

  /*
   * returns true if browser supportes progress element
   *
   * browser support overview:
   * http://caniuse.com/#feat=progress
   *
   * uses test from Modernizr
   * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/elem/progress-meter.js
   */
  isProgressSupported: Ember.computed(function() {
    return document.createElement('progress').max !== undefined;
  })
});
