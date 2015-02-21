'use strict';

angular.module('envconfig', [])

.constant('ENV', {
  'name': 'development',
  'apiRootUrl': 'http://localhost:3000'
});
