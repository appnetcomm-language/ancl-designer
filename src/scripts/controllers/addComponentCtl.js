
angular.module('ancl').controller('addComponentCtl', ['$scope', '$uibModalInstance', 'Elements', 'node', function ($modal, $uibModalInstance, Elements, node) {
          
    $modal.node = node;

    var elements = Object.values(Elements.list()).filter(function (e) {
      return (e.classes && e.classes.indexOf('model') !== -1);
    });

    $modal.elements = elements.map(function (e) {
      return e.data.label;
    });

    $modal.done = function () {
      $uibModalInstance.close($modal.node);
    };
    $modal.cancel = function () {
      $uibModalInstance.dismiss();
    };
    $modal.select = function () {
      $uibModalInstance.close('parent');
    };

}]);