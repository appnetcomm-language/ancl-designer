angular.module('ancl').controller('downloadCtl', ['$scope', '$uibModalInstance', 'Elements', function ($modal, $uibModalInstance, Elements) {

  $modal.settings = {
    models: Elements.toModel()
  };

  $modal.hasModels = function () {
    return (Object.keys($modal.settings.models).length > 0);
  };

  $modal.download = function () {

    var a = document.createElement("a");
    var download = {'models': []};

    var models = angular.copy($modal.settings.models);
    Object.keys(models).forEach(function (model) {
      if (models[model].metadata.export) {
        delete models[model].metadata.export;
        download.models.push(models[model]);
      }
    });

    var file = new Blob([jsyaml.dump(download)], {type: 'text/plain'});

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, $modal.settings.name + '.yaml');
    } else {
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = $modal.settings.name + '.yaml';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

    $uibModalInstance.dismiss();

  };

  $modal.cancel = function () {
    $uibModalInstance.dismiss();
  };


}]);