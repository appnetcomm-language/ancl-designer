angular.module('ancl').controller('servicesCtl', ['$scope', '$uibModal', 'Confirm', function ($scope, $uibModal, Confirm) {

  $scope.ngModel = $scope.ngModel || [];

  $scope.hasServices = function (services) {
    return (Object.keys(services).length > 0);
  };

  $scope.editService = function (index) {
    var modal = $uibModal.open({
      templateUrl: 'views/service_modal.html',
      controller: 'serviceModalCtl',
      resolve: {
        service: function () { 
          return angular.copy($scope.ngModel[index]); 
        }
      }
    });

    modal.result.then(function (service) {
      if (service !== key) {
        delete $scope.ngModel[key];
      }
      
      $scope.ngModel[index] = service;
    });
  };

  $scope.addService = function () {
    var modal = $uibModal.open({
      templateUrl: 'views/service_modal.html',
      controller: 'serviceModalCtl',
      resolve: {
        service: function () { }
      }
    });

    modal.result.then(function (service) {
      $scope.ngModel.push(service);
    });
  };

  $scope.deleteService = function (key) {

    Confirm('Are you sure you want to delete this service?').then(function () {
      delete $scope.ngModel[key];
    });

  };

}]);