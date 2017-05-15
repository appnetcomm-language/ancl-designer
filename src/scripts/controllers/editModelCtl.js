angular.module('ancl').controller('editModelCtl', ['$scope', '$uibModalInstance', 'Confirm', 'node', function ($modal, $uibModalInstance, Confirm, node) {
          
  $modal.node = node;

  $modal.done = function () {
    $uibModalInstance.close($modal.node);
  };
  $modal.cancel = function () {
    $uibModalInstance.dismiss();
  };
  $modal.delete = function () {
    Confirm('Are you sure?').then(function () {
      $uibModalInstance.close();
    });
  };
  
}]);