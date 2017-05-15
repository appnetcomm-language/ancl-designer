
angular.module('ancl').directive('fileReader', function () {
  return {
    require:  'ngModel',
    scope: {
      'ngModel': '=',
      'onParsed': '=',
      'fileName': '=?'
    },
    replace: true,
    template: '<input type="file" class="form-control">',
    controller: function ($scope) {
      $scope.reader = function (e) {
        var obj = e.target.files[0],
          reader = new FileReader();
        

        reader.onload =function (e) {
          var parsed = jsyaml.load(e.target.result);


          if (Object.keys(parsed).length > 0) {
            $scope.ngModel = parsed;
              $scope.fileName = obj.name;

            if ($scope.onParsed) {
              setTimeout($scope.onParsed.bind(undefined, parsed), 0);
            }
            $scope.$parent.$apply();
          }
        };

        reader.readAsText(obj);
      };

      $scope.$emit('ready');
    },
    link: function (scope, el) {
      el[0].addEventListener('change', scope.reader, false);
    }
  };
});