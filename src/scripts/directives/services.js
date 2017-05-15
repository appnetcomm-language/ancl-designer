angular.module('ancl').directive('services', function () {
  return {
    require:  'ngModel',
    scope: {
      'ngModel': '='
    },
    replace: true,
    templateUrl: 'views/services.html',
    controller: 'servicesCtl'
  };
});
