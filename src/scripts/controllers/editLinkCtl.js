angular.module('ancl').controller('editLinkCtl', ['$scope', '$uibModalInstance', 'Confirm', 'Elements', 'link', function ($modal, $uibModalInstance, Confirm, Elements, link) {

  $modal.link = link;
  $modal.target = Elements.list()[link.target];
  $modal.source = Elements.list()[link.source];

  $modal.done = function () {
    $uibModalInstance.close($modal.link);
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