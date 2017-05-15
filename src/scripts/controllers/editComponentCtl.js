angular.module('ancl').controller('editComponentCtl', ['$scope', '$uibModalInstance', 'Confirm', 'Elements', 'node', function ($modal, $uibModalInstance, Confirm, Elements, node) {
          
  $modal.node = node;

  var elements =  Object.values(Elements.list()).filter(function (e) {
      return (e.classes && e.classes.indexOf('model') !== -1);
  });

  $modal.elements = elements.map(function (e) {
    return e.data.label;
  });

  $modal.elements = $modal.elements.filter(function (e) {
    return ($modal.node.label !== e);
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
  $modal.delete = function () {
    Confirm('Are you sure?').then(function () {
      $uibModalInstance.close();
    });
  };
  
}]);