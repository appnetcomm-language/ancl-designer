
angular.module('ancl').factory('Confirm', ['$uibModal', function ($uibModal) {

  return function (msg) {
    var modal = $uibModal.open({
      size: 'sm',
      backdrop: 'static',
      templateUrl: 'views/confirm.html',
      controller: ['$scope', '$uibModalInstance', 'message', function ($modal, $uibModalInstance, message) {
        
        $modal.message = message;

        $modal.yes = function () {
          $uibModalInstance.close();
        };

        $modal.no = function () {
          $uibModalInstance.dismiss();
        };

      }],
      resolve: {
        'message': function () {
          return msg;
        }
      }
    });

    return modal.result;
  };

}]);