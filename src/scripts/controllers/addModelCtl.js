
angular.module('ancl').controller('addModelCtl', ['$scope', '$uibModalInstance', 'node', function ($modal, $uibModalInstance, node) {

    $modal.node = node;

    $modal.done = function () {
      $uibModalInstance.close($modal.node);
    };
    $modal.cancel = function () {
      $uibModalInstance.dismiss();
    };

}]);
