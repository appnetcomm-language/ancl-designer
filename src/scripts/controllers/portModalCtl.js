angular.module('ancl').controller('portModalCtl', ['$scope', '$uibModalInstance', 'port', function ($modal, $uibModalInstance, port) {
  $modal.protocols = ['tcp', 'udp'];

  $modal.adding = (!port);
  $modal.port = port || {};

  $modal.done = function () {
    $uibModalInstance.close($modal.port);
  };

  $modal.cancel = function () {
    $uibModalInstance.dismiss();
  };

}]);