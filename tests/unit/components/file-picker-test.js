import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

const {
  get: get
} = Ember;

moduleForComponent('file-picker', 'Unit | Component | file picker', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  const component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it has correct defaults', function(assert) {
  assert.expect(6);

  const component = this.subject();

  assert.equal(get(component, 'accept'), '*');
  assert.equal(get(component, 'multiple'), false);
  assert.equal(get(component, 'preview'), true);
  assert.equal(get(component, 'dropzone'), true);
  assert.equal(get(component, 'progress'), true);
  assert.equal(get(component, 'readAs'), 'readAsFile');
});

test('it handles `filesAreValid` when it returns TRUE', function(assert) {
  assert.expect(2);

  var files = ['test'];
  var component = this.subject({
    filesAreValid: function() {
      assert.ok(true, '`filesAreValid` is called when defined');
      return true;
    },
    updatePreview: function() {
      assert.ok(true, '`handleFiles` continues execution when `filesAreValid returns true`');
    }
  });

  component.handleFiles(files);
});

test('it handles `filesAreValid` when it returns FALSE', function(assert) {
  assert.expect(0);

  var files = ['test'];
  var component = this.subject({
    filesAreValid: function() {
      return false;
    },
    updatePreview: function() {
      assert.ok(false, '`handleFiles` continued execution when `filesAreValid returned false`');
    }
  });

  component.handleFiles(files);
});
