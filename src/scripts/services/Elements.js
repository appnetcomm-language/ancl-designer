angular.module('ancl').service('Elements', function () {
  var graphs = {};

  var guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  var getNodeByLabel = function (label, elements, graph) {
    var i,
      lookup = elements || list(graph),
      keys = Object.keys(lookup);


    for (i=0; i<keys.length; i += 1) {
      if (label === lookup[keys[i]].data.label) {
        return keys[i];
      }
    }

  };

  var clear = function (graph) {
    Object.keys(list(graph)).forEach(function (key) {
      delete list(graph)[key];
    });
  };

  var rebuild_edges = function (graph) {
    var edges = [];
    var keys = Object.keys(list(graph));

    // Limit our results to only nodes with egresses
    var toCheck = keys.filter(function (key) {
      return (list(graph)[key].group === 'nodes' && list(graph)[key].data.egress && list(graph)[key].data.egress.length > 0);
    });

    // Check each of our nodes
    toCheck.forEach(function (key) {
      var egress = list(graph)[key].data.egress;
      // Check each egress in the node
      egress.forEach(function (eg) {
        //Lookup our node egress target
        var node_guid = getNodeByLabel(eg.model, undefined, graph);

        if (!node_guid) {
          return;
        }

        var node_elem = list(graph)[node_guid];
        var service = node_elem.data.ingress.filter(function (service) {
          return (service.name === eg.service);
        })[0];

        edges.push({
          'group': 'edges',
          'data': {
            'label': eg.service,
            'source': key,
            'target': node_guid,
            'ports': service.ports
          }
        });
      });

    });

    // Get all the values
    var existing = Object.values(list(graph));

    // Limit our results to only edges
    existing = existing.filter(function (node) {
      return (node.group === 'edges');
    });

    edges.forEach(function (edge) {
      var matches = existing.filter(function (node) {
        return (node.data.source === edge.data.source && node.data.target === edge.data.target);
      });

      if (matches.length === 0) {
        // Create a new edge
        list(graph)[guid()] = edge;
      } else {
        // Update the existing edge
        list(graph)[matches[0].data.id] = edge;
      }
    }); 

  };

  var getSourceLinks = function (source, graph) {
    var links = [];
    Object.keys(list(graph)).forEach(function (key) {
      if (list(graph)[key].group === 'edges') {
        if (list(graph)[key].data.source === source) {
          links.push(list(graph)[key]);
        }
      }
    });

    return links;
  };

  var toModel = function (graph) {
    var models = {};
    graph = graph || 'default';

    var nodes = Object.values(list(graph));
    var components = nodes.filter(function (e) {
      return (!e.classes || e.classes.indexOf('model') === -1);
    });

    components.forEach(function (node) {
      var key = node.data.id;

      if (node.group !== 'nodes') {
        return;
      }

      if (!node.data.parent) {
        return;
      }

      var model = list(graph)[node.data.parent];

      if (!model) {
        return;
      }

      if (!models[model.data.label]) {
        var model_obj = graphs[graph].graph.$('#' + model.data.id);
        models[model.data.label] = {
          'name': model.data.label,
          'components': [],
          'metadata': {
            'position': model_obj.position(),
            'classes': model_obj.json().classes,
            'export': true
          }
        };
      }

      var egress = getSourceLinks(key);
      var obj = graphs[graph].graph.$('#' + key);

      if (!obj) {
        return;
      }

      egress = egress.map(function (link) {
        return list(graph)[link.data.target].data.label + '::' + link.data.label;
      });


      models[model.data.label].components.push({
        name: node.data.label,
        ingress: convertService(node.data.ingress) || [],
        egress: egress || [],
        metadata: {
          'position': obj.position(),
          'classes': obj.json().classes
        }
      });
    });

    return models;
  };

  var convertService = function(services) {
    services = services || [];


    return services.map(function (service) {
      return {
        'name': service.name,
        'ports': service.ports.map(function(port) {
          return [port.start, port.end, port.protocol];
        })
      };
    });
  };

  var list = function (graph) {
    graph = graph || 'default';

    if (!graphs[graph]) {
      graphs[graph] = {
        elements: {}
      };
    }

    return graphs[graph].elements;
  };

  var styles = [
    {
      selector: 'edge',
      style: {
        'label': function (el) {
          var obj = el.json();
          var ports = obj.data.ports || [];

          ports = ports.map(function (port) {
            if (port.start === port.end) {
              return port.protocol + '/' + port.start;
            } else {
              return port.protocol + '/' + port.start + '-' + port.end;
            }
          });

          if (ports.length > 2) {
          return obj.data.label + '\n' + ports.splice(0,2).join(',') + '...';
          } else {
            return obj.data.label + '\n' + ports.splice(0,2).join(',');
          }
        },
        'font-size': '.8em',
        'text-wrap': 'wrap',
        'edge-text-rotation': 'autorotate',
        'target-arrow-color': 'black',
        'target-arrow-shape': 'triangle',
        'line-color': '#aaa',
        'text-outline-width': 1,
        'text-outline-color': '#ddd',
        'width': 1
      }
    },
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'height': '4em',
        'width': '4em',
        'shape': 'ellipse',
        'border-width': 1,
        'background-opacity': 0,
        'background-fit': 'contain',
        'font-size': '1em',
        'text-valign': 'center',
        'color': 'white',
        'text-outline-width': 1,
        'text-outline-color': '#444'
      }
    },
    {
      selector: '$node > node, .model',
      style: {
        'label': 'data(label)',
        'shape': 'rectangle',
        'border-width': 1,
        'border-style': 'dashed',
        'border-color': '#ddd',
        'background-opacity': 1,
        'background-color': '#eee',
        'text-valign': 'top',
        'background-image': 'none'

      }
    },
    {
      selector: '$node > node > node',
      style: {
        'border-color': '#ccc',
        'background-color': '#ddd'
      }
    },
    {
      selector: '$node > node > node > node',
      style: {
        'border-color': '#bbb',
        'background-color': '#ccc'
      }
    },
    {
      selector: '.server',
      style: {
        'background-opacity': 0,
        'background-image': 'images/server.png',
        'background-fit': 'contain'
      }
    },
    {
      selector: '.storage',
      style: {
        'background-opacity': 0,
        'background-image': 'images/storage.png',
        'background-fit': 'contain'
      }
    },
    {
      selector: '.database',
      style: {
        'background-opacity': 0,
        'background-image': 'images/database.png',
        'background-fit': 'contain'
      }
    },
    {
      selector: '.router',
      style: {
        'background-opacity': 0,
        'background-image': 'images/router.png',
        'background-fit': 'contain'
      }
    },
    {
      selector: '.switch',
      style: {
        'background-opacity': 0,
        'background-image': 'images/switch.png',
        'background-fit': 'contain'
      }
    },
    {
      selector: '.loadbalancer',
      style: {
        'background-opacity': 0,
        'background-image': 'images/loadbalancer.png',
        'background-fit': 'contain'
      }
    },
    {
      selector: '.f5',
      style: {
        'background-opacity': 0,
        'background-image': 'images/f5.png',
        'background-fit': 'contain'
      }
    },
    {
      selector: '.link-ok',
      style: {
        'line-color': '#2a8422'
      }
    },
    {
      selector: '.link-warning',
      style: {
        'line-color': '#848221'
      }
    },
    {
      selector: '.link-critical',
      style: {
        'line-color': '#842123'
      }
    },
    {
      selector: '.node-ok',
      style: {
        'border-color': '#2a8422',
        'background-color': '#bfeabb',
        'background-opacity': 0.5
      }
    },
    {
      selector: '.node-warning',
      style: {
        'border-color': '#848221',
        'background-color': '#edecc0',
        'background-opacity': 0.5
      }
    },
    {
      selector: '.node-critical',
      style: {
        'border-color': '#842123',
        'background-color': '#e2b5b6',
        'background-opacity': 0.5
      }
    }
  ];

  var parsePorts = function (ports) {
    var results = [];

    ports = ports || [];

    ports.forEach(function (port) {

      results.push({
        'start': port[0],
        'end': port[1],
        'protocol': port[2]
      });

    });

    return results;
  };

  var parseIngress = function (ingress) {
    var result = [];

    ingress = ingress || [];

    ingress.forEach(function (service) {

      result.push({
        'id': guid(),
        'name': service.name,
        'ports': parsePorts(service.ports)
      });

    });

    return result;
  };

  var parseEgress = function (egress) {
    var result = [];

    egress = egress || [];

    egress.forEach(function (connection) {
      var egress_parts = connection.split('::');

      result.push({
        'id': guid(),
        'model': egress_parts[0],
        'service': egress_parts[1]
      });

    });

    return result;
  };

  return {
    list: list,
    clear: clear,
    guid: guid,
    rebuild_edges: rebuild_edges,
    getNodeByLabel: getNodeByLabel,
    parseIngress: parseIngress,
    parseEgress: parseEgress,
    toModel: toModel,
    styles: styles,
    setGraph: function (obj, graph) {
      graph = graph || 'default';
      graphs[graph].graph = obj;
    }
  };

});