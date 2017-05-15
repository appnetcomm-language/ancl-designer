
angular.module('ancl').controller('anclCtl', ['$scope', '$q', '$uibModal', 'cytoData', 'Confirm', 'Elements', function($scope, $q, $uibModal, cytoData, Confirm, Elements) {
  $scope.options = {
  };

  $scope.layout = {
    name: 'preset',
    fit: true, // whether to fit the viewport to the graph
    directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
    padding: 30, // padding on fit
    circle: false, // put depths in concentric circles if true, put depths top down if false
    spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    roots: undefined, // the roots of the trees
    maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    ready: undefined, // callback on layoutready
    stop: undefined // callback on layoutstop
  };

  cytoData.getGraph('main_graph').then(function(graph){
    $scope.graph = graph;

    Elements.setGraph(graph);
  });

  $scope.elements = Elements.list();

  /*
  $scope.elements = {
    test1: {
      group: 'nodes',
      data:{
        label: 'test1',
        weight: 20
      }
    },
    test2: {
      group: 'nodes',
      data:{
        label: 'test2',
        weight: 20
      }
    },
    test3: {
      group: 'nodes',
      data:{
        label: 'test3',
        weight: 20,
        parent: 'test2'
      }
    },
    test4: {
      group: 'nodes',
      data:{
        label: 'test4',
        weight: 20,
        parent: 'test3'
      }
    },
    test5: {
      group: 'nodes',
      data:{
        label: 'test5',
        weight: 20,
        parent: 'test4'
      }
    },
    test6: {
      group: 'nodes',
      data:{
        label: 'test6',
        weight: 20,
        parent: 'test3'
      }
    },
    test7: {
      group: 'nodes',
      data:{
        label: 'test7',
        weight: 20,
        parent: 'test4'
      }
    },
    e1: {
      group:'edges',
      data:{
        source: 'test1',
        target: 'test2',
        label: 'test'
      }
    }
  };
  */

  $scope.style = Elements.styles;

  $scope.linking = false;
  $scope.adding = false;
  $scope.editing = false;
  $scope.loading = false;

  $scope.node_listener = $scope.$on('cy:node:tap', function (ng, cy) {

    if ($scope.linking || $scope.adding || $scope.editing) {
      return;
    }

    if (cy.cyTarget.hasClass('model')) {
      $scope.openEditModel(cy.cyTarget.data().id, cy.cyTarget);
    } else {
      $scope.openEditComponent(cy.cyTarget.data().id, cy.cyTarget);
    }

  });

  $scope.edge_listener = $scope.$on('cy:edge:tap', function (ng, cy) {

    if ($scope.linking || $scope.adding || $scope.editing) {
      return;
    }

    $scope.openEditLink(cy.cyTarget.data().id, cy.cyTarget.data());

  });

  $scope.openAddModel = function () {
    if ($scope.adding) {
      $scope.listener();
      $scope.adding = false;
      return;
    }

    var node = {'weight': 20, 'guid': Elements.guid()};

    $scope.adding = true;

    var open = function () {

      var modal = $uibModal.open({
        templateUrl: 'views/model_modal_add.html',
        controller: 'addModelCtl',
        resolve: {
          node: node
        }
      });

      modal.result.then(function (type) {
        $scope.adding = false;
        Elements.list()[node.guid] = {
          group: 'nodes',
          classes: 'model',
          data: {
            label: node.label,
            weight: node.weight
          }
        };
      }, function () {
        $scope.adding = false;
      });

    };

    open();
  };

  $scope.openEditModel = function (id) {
    if (!$scope.elements[id]) {
      return;
    }

    if ($scope.editing) {
      $scope.listener();
      $scope.editing = false;
      return;
    }

    var node = angular.copy(Elements.list()[id].data);
    $scope.editing = true;

    var open = function () {
      var modal = $uibModal.open({
        templateUrl: 'views/model_modal_edit.html',
        controller: 'editModelCtl',
        resolve: {
          node: function () {
            return node;
          }
        }
      });

      modal.result.then(function (node) {
        if (!node) {
          delete Elements.list()[id];
          $scope.editing = false;
        } else {
          var obj = $scope.graph.$('#' + id);

          if (Elements.list()[id].data.classes !== node.classes) {
            obj.classes(node.classes);
          }

          //Merge the new data
          Elements.list()[id].data = node;
          Elements.rebuild_edges();
          //angular.merge(Elements.list()[id].data, node);

          setTimeout(function () {
            $scope.$digest();
          }, 2000);
          $scope.editing = false;
        }
      }, function () {
        $scope.editing = false;
      });
    };

    open();
  };

  $scope.openEditComponent = function (id) {
    if (!$scope.elements[id]) {
      return;
    }

    if ($scope.editing) {
      $scope.listener();
      $scope.editing = false;
      return;
    }

    var node = angular.copy(Elements.list()[id].data);
    if (Elements.list()[node.parent]) {
      node.parent = Elements.list()[node.parent].data.label;
    }

    $scope.editing = true;

    var listen_for = function () {
      $scope.listener = $scope.$on('cy:node:tap', function (ng, cy) {

        var selected = cy.cyTarget.data();
        if (selected.id === id || !cy.cyTarget.hasClass('model')) {
          return;
        }

        $scope.listener();

        node.parent = selected.label;

        open();
      });
    };

    var open = function () {
      var modal = $uibModal.open({
        templateUrl: 'views/component_modal_edit.html',
        controller: 'editComponentCtl',
        resolve: {
          node: function () { 
            return node; 
          }
        }
      });

      modal.result.then(function (node) {
        if (node === 'parent') {
          listen_for('parent');
        } else if (!node) {
          delete Elements.list()[id];
          $scope.editing = false;
        } else {
          var obj = $scope.graph.$('#' + id);
          node.parent = Elements.getNodeByLabel(node.parent);
          // If changing an elements parent, need to call the raw objects move method
          if (Elements.list()[id].data.parent !== node.parent) {
            obj.move({'parent': node.parent || null});
          }

          if (Elements.list()[id].data.classes !== node.classes) {
            obj.classes(node.classes);
          }

          //Merge the new data
          Elements.list()[id].data = node;
          Elements.rebuild_edges();
          //angular.merge(Elements.list()[id].data, node);

          setTimeout(function () {
            $scope.$digest();
          }, 2000);
          $scope.editing = false;
        }
      }, function () {
        $scope.editing = false;
      });
    };

    open();
  };

  $scope.openAddComponent = function () {
    if ($scope.adding) {
      $scope.listener();
      $scope.adding = false;
      return;
    }

    var node = {'weight': 20, 'guid': Elements.guid()};

    $scope.adding = true;

    var listen_for = function () {
      $scope.listener = $scope.$on('cy:node:tap', function (ng, cy) {
        $scope.listener();

        node.parent = cy.cyTarget.data().label;

        open();
      });
    };

    var open = function () {

      var modal = $uibModal.open({
        templateUrl: 'views/component_modal_add.html',
        controller: 'addComponentCtl',
        resolve: {
          node: node
        }
      });

      modal.result.then(function (type) {
        if (type !== undefined && type === 'parent') {
          listen_for('parent');
        } else {
          $scope.adding = false;
          Elements.list()[node.guid] = {
            group: 'nodes',
            classes: node.classes,
            data: {
              label: node.label,
              weight: node.weight,
              parent: Elements.getNodeByLabel(node.parent),
              ingress: node.ingress
            }
          };
          
        }
      }, function () {
        $scope.adding = false;
      });

    };

    open();
  };

  $scope.openEditLink = function (id) {
    if ($scope.loading) {
      $scope.loading = false;
      return;
    }

    var modal = $uibModal.open({
      templateUrl: 'views/link_modal_edit.html',
      controller: 'editLinkCtl',
      resolve: {
        link: function () { 
          return angular.copy(Elements.list()[id].data); 
        }
      }
    });

    modal.result.then(function (link) {
      if (!link) {
        delete Elements.list()[id];
      } else {
        var obj = $scope.graph.$('#' + id);
        angular.merge(Elements.list()[id].data, link);

        if (obj.data.classes !== link.classes) {
          obj.classes(link.classes);
        }
      }
    });
  };

  $scope.openAddLink = function () {
    if ($scope.linking) {
      $scope.listener();
      $scope.linking = false;
      return; 
    }

    var link = {};

    $scope.linking = true;

    var listen_for = function (type) {
      $scope.listener = $scope.$on('cy:node:tap', function (ng, cy) {
        $scope.listener();

        link[type] = cy.cyTarget.data().label;

        open();
      });
    };

    var open = function () {
      var modal = $uibModal.open({
        keyboard: false,
        backdrop: 'static',
        templateUrl: 'views/link_modal_add.html',
        controller: 'addLinkCtl',
        resolve: {
          link: link
        }
      });

      modal.result.then(function (type) {
        if (type !== undefined) {
          listen_for(type);
        } else {
          $scope.linking = false;
          var source = Elements.getNodeByLabel(link.source);
          var target = Elements.getNodeByLabel(link.target);
          Elements.list()[Elements.guid()] = {
            group: 'edges',
            data: {
              source: source,
              target: target,
              ports: link.service.ports,
              label: link.service.name
            }
          };
        }
      }, function () {
        $scope.linking = false;
        if ($scope.listener) {
          $scope.listener();
        }
      });

    };


    open();

  };

  $scope.openLoad = function () {
    $scope.loading = true;

    Elements.clear('loading');

    var modal = $uibModal.open({
      templateUrl: 'views/load_modal.html',
      controller: 'loadCtl'
    });

    modal.result.then(function (elements) {
      angular.merge(Elements.list(), elements);
      Elements.rebuild_edges();
      $scope.loading = false;
    }, function () {
      $scope.loading = false;
    });
  };

  $scope.downloadModel = function () {
    $scope.loading = true;

    var modal = $uibModal.open({
      templateUrl: 'views/download_modal.html',
      controller: 'downloadCtl'
    });

    modal.result.then(function () {
      $scope.loading = false;
    }, function () {
      $scope.loading = false;
    });

  };

  $scope.clearElements = function () {
    Confirm('Are you sure you want to clear everything?').then(function () {
      Elements.clear();
    });
  };

}]); 