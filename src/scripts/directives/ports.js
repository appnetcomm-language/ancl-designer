angular.module('ancl').directive('ports', function () {
  return {
    require:  'ngModel',
    scope: {
      'ngModel': '='
    },
    replace: true,
    templateUrl: 'views/ports.html',
    controller: 'portsCtl'
  };
});
