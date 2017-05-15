
angular.module('ancl').directive('focus', ['FocusForm', function (fucusForm) {

  return {
    restrict:  'A',
    link: function (scope, el) {
      fucusForm(el[0]);
    }
  };

}]);