
angular.module('ancl').directive('isNode', function () {
  return {
    require:  'ngModel',
    scope: {
      'isNode': '='
    },
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$validators.isNode = function (modelValue) {
        if (scope.isNode.indexOf(modelValue) >= 0) {
          return true;
        }

        return (!modelValue);
      };
    }
  };

});