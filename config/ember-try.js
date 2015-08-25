/* jshint node:true */

module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'components/ember#canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    },
    // Legacy
    {
      name: 'ember-1.11.1',
      dependencies: {
        "ember": "1.11.1"
      }
    },
    {
      name: 'ember-1.12.0',
      dependencies: {
        "ember": "1.12.0"
      }
    }
  ]
};