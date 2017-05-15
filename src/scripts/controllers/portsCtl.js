angular.module('ancl').controller('portsCtl', ['$scope', '$uibModal', 'Confirm', function ($scope, $uibModal, Confirm) {

  $scope.ngModel = $scope.ngModel || [];

  $scope.addPort = function () {
    var modal = $uibModal.open({
      templateUrl: 'views/port_modal.html',
      controller: 'portModalCtl',
      resolve: {
        port: function () { 
          return {};
        }
      }
    });

    modal.result.then(function (port) {
      $scope.ngModel.push(port);
    });
  };

  $scope.editPort = function (index) {
    var modal = $uibModal.open({
      templateUrl: 'views/port_modal.html',
      controller: 'portModalCtl',
      resolve: {
        port: function () { 
          return angular.copy($scope.ngModel[index]); 
        }
      }
    });

    modal.result.then(function (port) {
      $scope.ngModel[index] = port;
    });
  };

  $scope.deletePort = function (index) {
    Confirm('Are you sure you want to remove this port?').then(function () {
      ngModel.splice(index, 1);
    });
  };

}]);