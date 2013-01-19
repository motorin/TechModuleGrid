module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Project configuration.
  grunt.initConfig({
    pkg: require('./package.json'),

    jade: {
      html: {
        src: ['index.jade'],
        dest: './',
        options: {
          client: false
        }
      }
    },
    coffee: {
      options: {
        bare: true
      },
      app: {
        files: {
          'app/*.js': ['src/*.coffee']
        }
      }
    },

    stylus: {
      compile: {
        options: {
        },
        files: {
          "app/techModuleGrid.css": "src/techModuleGrid.styl",
        }
      }
    },
    min: {
      app: {
          src:  [
              'app/techModuleGrid.js'
          ],
          dest: 'app/techModuleGrid.min.js'
      },
    },

    watch: {
      jade: {
        files: [
          'index.jade',
        ],
        tasks: "jade"
      },
      coffee: {
        files: [
          'src/*.coffee',
        ],
        tasks: "coffee:app min:app"
      },
      stylus: {
        files: [
          'src/*.styl',
        ],
        tasks: "stylus"
      }
    }
  });

  grunt.registerTask('build', 'jade coffee stylus min');

  // Default task.
  grunt.registerTask('default', 'build');

};
