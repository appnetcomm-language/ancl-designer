angular.module('ancl').directive('isNotNode', function () {
  return {
    require:  'ngModel',
    scope: {
      'isNotNode': '='
    },
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$validators.isNotNode = function (modelValue) {
        if (!scope.isNotNode) {
          return true;
        }
        if (scope.isNotNode.indexOf(modelValue) === -1) {
          return true;
        }

        return (!modelValue);
      };
    }
  };

});