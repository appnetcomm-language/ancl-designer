angular.module('ancl').controller('serviceModalCtl', ['$scope', '$uibModalInstance', 'service', function ($modal, $uibModalInstance, service) {

  $modal.adding = (!service);

  $modal.service = service;

  $modal.done = function () {
    $uibModalInstance.close($modal.service);
  };
  $modal.cancel = function () {
    $uibModalInstance.dismiss();
  };

}]);