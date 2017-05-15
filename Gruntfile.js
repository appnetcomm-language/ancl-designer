
module.exports = function(grunt) {
  'use strict';

  var scripts = [
    'src/vendor/angular/angular.min.js',
    'src/vendor/cytoscape/dist/cytoscape.min.js',
    'src/vendor/ngCytoscape/dist/ngCytoscape.min.js',
    'src/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'src/vendor/js-yaml/dist/js-yaml.min.js',
    'src/scripts/**/*.js'
  ];

  var jsScriptTags = function (srcPatterns) {
    if (srcPatterns === undefined) {
        throw new Error("srcPattern undefined");
    }
    return grunt.util._.reduce(
        grunt.file.expand({
            filter: 'isFile',
            flatten: false,
            expand: true
        }, srcPatterns),
        function (sum, file) {
            return sum + '    <script src="' + file.substr(4) + '" type="text/javascript"></script>\n';
        },
        ''
    );
  };

  grunt.initConfig({
    connect: {
      server: {
        options: {
          open: true,
          base: 'dist',
          keepalive: true,
          useAvailablePort: true
        }
      }
    },
    watch: {
      html: {
        files: ['src/index.html'],
        tasks: ['includereplace']
      },
      templates: {
        files: ['src/views/**/*.html'],
        tasks: ['ngtemplates']
      },
      scripts: {
        files: ['src/scripts/**/*.js'],
        tasks: ['concat:scripts', 'includereplace']
      },
      css: {
        files: ['src/css/**/*.css'],
        tasks: ['concat:css']
      }
    },
    ngtemplates: {
      'ancl': {
        src: 'views/**.html',
        dest: 'src/scripts/templates.js',
        cwd: 'src',
        options:    {
          htmlmin:  {
            collapseWhitespace: true,
            collapseBooleanAttributes: true
          }
        }
      }
    },
    concat: {
      options: {
        separator: '\n\n'
      },
      scripts: {
        src: scripts,
        dest: 'dist/lib/main.js'
      },
      css: {
        src: [
          'src/vendor/bootstrap/dist/css/bootstrap.min.css',
          'src/css/**/*.css'
        ],
        dest: 'dist/lib/styles.css'
      }
    },
    includereplace: {
      dev: {
        options : {
          globals: {
            scripts: jsScriptTags(scripts)
          }
        },
        suffix: 'dev',
        src: 'src/index.html',
        dest: 'src/index.debug.html',
        cwd: '.'
      },
      prod: {
        options : {
          globals: {
            scripts: '    <script src="./lib/main.js" type="text/javascript"></script>'
          }
        },
        src: 'src/index.html',
        dest: 'dist/index.html',
        cwd: '.'
      }

    },
    concurrent: {
      'default': {
        tasks: ['watch', 'connect:server'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-include-replace');

  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('gen', ['ngtemplates', 'concat', 'includereplace']);
};
