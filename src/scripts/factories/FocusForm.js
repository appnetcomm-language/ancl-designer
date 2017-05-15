
angular.module('ancl').factory('FocusForm', function ($timeout, $window) {
  var inputs = ['INPUT', 'SELECT', 'TEXTAREA'];

  return function (id) {
    $timeout(function () {
      var element = id;

      if (typeof(id) === 'string') {
        element = $window.document.getElementById(id);
      }

      if (!element) {
        return;
      }

      if (element && inputs.indexOf(element.nodeName) >= 0) {
        element.focus();
      }
    });
  };

});