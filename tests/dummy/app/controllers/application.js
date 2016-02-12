import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    fileLoaded(file) {
      this.set('data', file.data);
      this.set('loaded', true);
      this.set('name', file.name);
      this.set('size', file.size);
    }
  },
  data: null,
  loaded: false,
  name: null,
  readAs: 'readAsFile',
  readAsValues: [
    'readAsFile',
    'readAsArrayBuffer',
    'readAsBinaryString',
    'readAsDataUrl',
    'readAsText'
  ],
  size: null
});
