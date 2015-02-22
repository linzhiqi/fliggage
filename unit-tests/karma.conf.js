module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'fliggage/bower_components/angular/angular.js',
      'fliggage/bower_components/angular-route/angular-route.js',
      'fliggage/bower_components/angular-mocks/angular-mocks.js',
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
