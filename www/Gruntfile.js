/*global module:false*/
module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jst');

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! App ARPAV Aria - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' + '\tThis program is free software: you can redistribute it and/or modify \n' + '\tit under the terms of the GNU General Public License as published by \n' + '\tthe Free Software Foundation, either version 3 of the License, or \n' + '\t(at your option) any later version. \n \n' + '\tThis program is distributed in the hope that it will be useful, \n' + '\tbut WITHOUT ANY WARRANTY; without even the implied warranty of \n' + '\tMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the \n' + '\tGNU General Public License for more details. \n  \n' + '\tYou should have received a copy of the GNU General Public License \n' + '\talong with this program.  If not, see <http://www.gnu.org/licenses/>. */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            views: {
                src: ['dev/views/**/*.js'],
                dest: 'js/views.js'
            },
            controllers: {
                src: ['dev/controllers/**/*.js'],
                dest: 'js/controllers.js'
            },
            main: {
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: 'dev/', // Src matches are relative to this path.
                    src: ['/*.js'], // Actual pattern(s) to match.
                    dest: 'js/', // Destination path prefix.
                }, ],
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            views: {
                src: '<%= concat.views.dest %>',
                dest: 'js/views.min.js'
            },
            controllers: {
                src: '<%= concat.controllers.dest %>',
                dest: 'js/controllers.min.js'
            }
        },
        jshint: {
            options: {
                scripturl: true,
                smarttabs: true,
                "-W099": true,
            },
            all: ['Gruntfile.js', 'dev/**/*.js']
        },
        jsbeautifier: {
            files: ["dev/**/*.js", 'Gruntfile.js', 'sampledata.json', 'samplestats.json', 'coordinate.json']
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'dev',
                    outdir: 'doc'
                }
            }
        },
        jst: {
            compile: {
                processName: function(filename) {
                    return filename.slice(filename.indexOf('template'), filename.lenght);
                }
            },
            files: {
                "js/templates.js": ["dev/templates/**/*.html"]
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jsbeautifier', 'jshint', 'concat', 'jst', 'uglify', 'yuidoc']);

};
