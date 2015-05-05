module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'fliggage/bower_components/angular/angular.js',
      'fliggage/bower_components/angular-route/angular-route.js',
      'fliggage/bower_components/angular-mocks/angular-mocks.js',
      'fliggage/bower_components/angular-resource/angular-resource.js',
      'fliggage/bower_components/ngstorage/ngStorage.js',
      'fliggage/bower_components/ngDialog/js/ngDialog.js',
      'fliggage/bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
      'fliggage/components/**/*.js',
      'fliggage/js/**/*.js',
      'unit-tests/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
