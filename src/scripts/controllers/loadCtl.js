
angular.module('ancl').controller('loadCtl', ['$scope', '$uibModalInstance', 'cytoData', 'Confirm', 'Elements', function ($modal, $uibModalInstance, cytoData, Confirm, Elements) {

    $modal.elements = Elements.list('loading');

    $modal.layouts = [
      {'label': 'Breadth First', 'value': 'breadthfirst'},
      {'label': 'Circle', 'value': 'circle'},
      {'label': 'Concentric', 'value': 'concentric'},
      {'label': 'Cose', 'value': 'cose'},
      {'label': 'Grid', 'value': 'grid'},
      {'label': 'Preset', 'value': 'preset'}
    ];

    $modal.load = {};

    $modal.layout = {
      name: 'preset'
    };

    $modal.style = Elements.styles;
    cytoData.getGraph('load_graph').then(function(graph) {
      graph.remove(graph.elements());
      $modal.graph = graph;
    });


    $modal.parseModel = function (data) {
      var elements = {};

      Elements.clear('loading');

      data.models = data.models || [];
      data.models.forEach(function (model) {
        var model_guid = Elements.guid();

        // Build our node objet
        elements[model_guid] = {
          'group': 'nodes',
          'classes': 'model',
          'data': {
            'label': model.name,
            'classes': 'model'
          }
        };

        model.components = model.components || [];
        model.components.forEach(function (component) {
          var component_guid = Elements.guid();
          elements[component_guid] = {
            'group': 'nodes',
            'data': {
              'label': component.name,
              'parent': model_guid,
              'ingress': Elements.parseIngress(component.ingress),
              'egress': Elements.parseEgress(component.egress)
            }
          };

          if (component.metadata) {
            elements[component_guid].classes = component.metadata.classes;
            elements[component_guid].data.classes = component.metadata.classes;

            if (component.metadata.position) {
              elements[component_guid].position = component.metadata.position;
            }
          }
        });
      });

      /*
      //Generate nodes
      Object.keys(data).forEach(function (key) {
        var node_guid = Elements.guid();

        // Build our node objet
        elements[node_guid] = {
          'group': 'nodes',
          'data': {
            'label': key,
            'ingress': Elements.parseIngress(data[key].ingress),
            'egress': Elements.parseEgress(data[key].egress)
          }
        };

        // If a parent is defined in the metadata, check for it
        if (data[key].metadata) {
          elements[node_guid].classes = data[key].metadata.classes;
          elements[node_guid].data.classes = data[key].metadata.classes;

          if (data[key].metadata.position) {
            elements[node_guid].position = data[key].metadata.position;
          }

          if (data[key].metadata.parent) {
            // Lookup the parent id
            var parent = Elements.getNodeByLabel(data[key].metadata.parent, elements);

            // If no parent exists, create one
            if (!parent) {
              parent = Elements.guid();
              elements[parent] = {
                'group': 'nodes',
                'data': {
                  'label': data[key].metadata.parent,
                  'ingress': [],
                  'egress': []
                }
              };
            }

            // Set the parent id on our node
            elements[node_guid].data.parent = parent;
          }
        }

      });
      */
      $modal.load.elements = elements;
      angular.merge(Elements.list('loading'), elements);
      Elements.rebuild_edges('loading');
      
      // See if we have a name and create a node for it
      if ($modal.load.filename) {
        $modal.load.name = $modal.load.filename.split('.')[0];
      }

      $modal.load.nodes = Object.values($modal.load.elements);
      $modal.$digest();
    };

    $modal.done = function () {

      Object.keys($modal.load.elements).forEach(function (key) {
        var obj = $modal.graph.$('#' + key);
        $modal.load.elements[key].position = obj.position();
      });

      if ($modal.load.name) {
        var parent_guid = Elements.guid();

        Object.values($modal.load.elements).forEach(function (node) {
          if (!node.data.parent) {
            node.data.parent = parent_guid;
          }
        });
        
        $modal.load.elements[parent_guid] = {
          'group': 'nodes',
          'data': {
            'label': $modal.load.name,
            'ingress': [],
            'egress': [],
            'weight': 20
          }
        };
      }

      $uibModalInstance.close($modal.load.elements);
    };
    $modal.cancel = function () {
      $uibModalInstance.dismiss();
    };

}]);