import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

const {
  get: get
} = Ember;

moduleForComponent('file-picker', 'FilePickerComponent');

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it has correct defaults', function(assert) {
  assert.expect(6);

  var component = this.subject();

  assert.equal(get(component, 'accept'), '*');
  assert.equal(get(component, 'multiple'), false);
  assert.equal(get(component, 'preview'), true);
  assert.equal(get(component, 'dropzone'), true);
  assert.equal(get(component, 'progress'), true);
  assert.equal(get(component, 'readAs'), 'readAsFile');
});