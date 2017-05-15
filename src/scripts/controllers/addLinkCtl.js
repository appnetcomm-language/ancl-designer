angular.module('ancl').controller('addLinkCtl', ['$scope', '$uibModalInstance', 'Elements', 'FocusForm', 'link', function ($modal, $uibModalInstance, Elements, focusForm, link) {

  $modal.link = link;
  $modal.target = Elements.list()[Elements.getNodeByLabel($modal.link.target)];
  $modal.elements = Object.values(Elements.list()).map(function (e) {
    return e.data.label;
  });

  if (!$modal.link.source) {
    focusForm('sourceInput');
  }else if (!$modal.link.target) {
    focusForm('targetInput');
  } else if (!$modal.link.label) {
    focusForm('portInput');
  }

  $modal.hasServices = function (services) {
    return (services && Object.keys(services).length > 0);
  };

  $modal.loadTarget = function (target) {

    $modal.target = Elements.list()[Elements.getNodeByLabel(target)];
  };

  $modal.select = function (type) {
    $uibModalInstance.close(type);
  };

  $modal.done = function () {
    $uibModalInstance.close();
  };
  $modal.cancel = function () {
    $uibModalInstance.dismiss();
  };

}]);