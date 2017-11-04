/**
 * Created by adamyoungers on 10/31/17.
 */

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mocha: {
            test: {
                options: {
                    urls: ['test/index.html'],
                    dest: 'test/index.out',
                    run: true,
                    log: true,
                    reporter: 'Spec',
                    timeout: 10000
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            test: ['src/js/**/*.js']
        },
        clean: {
            assets: ['app/assets/**/*'],
            js:     ['app/assets/js/**/*'],
            css:    ['app/assets/css/**/*'],
            img:    ['app/assets/img/**/*'],
            test:   [
                'test/mocha.js',
                'test/mocha.css',
                'test/chai.js',
                'test/index.js',
                'test/index.js.map'
            ]
        },
        concat: {
            options: {
                separator: ';\n',
                sourceMap: true
            },
            js: {
                src: [
                    'src/js/_init.js',
                    'src/js/**/_*.js',
                    '!src/js/**/*.test.js'
                ],
                dest: 'app/assets/js/global.js'
            },
            test: {
                src: [
                    'src/js/**/*.test.js'
                ],
                dest: 'test/index.js'
            }
        },
        connect: {
           server: {
               options: {
                   port: 9000,
                   base: 'app',
                   livereload: true,
                   open: {
                       target: 'http://localhost:9000'
                   }
               }
           }
        },
        copy: {
            mocha: {
                files: [{
                    expand: true,
                    cwd: 'node_modules/mocha/',
                    src: [
                        'mocha.js',
                        'mocha.css'
                    ],
                    dest: 'test/'
                }]
            },
            chai: {
                files: [{
                    expand: true,
                    cwd: 'node_modules/chai/',
                    src: [
                        'chai.js'
                    ],
                    dest: 'test/'
                }]
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'auto',
                    precision: 5
                },
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['*.scss', '!_*.scss'],
                    dest: 'app/assets/css',
                    ext: '.css'
                }]
            },
            prod: {
                options: {
                    style: 'compressed',
                    sourcemap: 'auto',
                    precision: 5
                },
                files: [{
                    expand: true,
                    cwd: '<%= sass.dev.files[0].cwd %>',
                    src: ['*.scss', '!_*.scss'],
                    dest: '<%= sass.dev.files[0].dest %>',
                    ext: '.css'
                }]
            }
        },
        scsslint: {
            options: {
                colorizeOutput: true,
                config: null
            },
            src: ['src/scss/**/*.scss']
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'})
                ]
            },
            dist: {
                src: 'app/assets/css/global.css'
            }
        },
        uglify: {
            js: {
                options: {
                    mangle: true,
                    sourceMap: true,
                    compress: {
                        drop_debugger: false
                    }
                },
                files: [
                    {
                        src: '<%= concat.js.src %>',
                        dest: '<%= concat.js.dest %>'
                    }
                ]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['src/js/**/*.js', '!src/js/**/*.test.js'],
                tasks: ['build_js']
            },
            css: {
                files: ['src/scss/**/*.scss'],
                tasks: ['build_css']
            },
            grunt_file: {
                files: ['Gruntfile.js'],
                tasks: ['default']
            },
            test_js: {
                files: [
                    'src/js/**/*.test.js'
                ],
                tasks: ['test_js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-scss-lint');

    grunt.registerTask('lint_js', [
        'jshint:test'
    ]);

    grunt.registerTask('test_js', [
        'clean:test',
        'copy:mocha',
        'copy:chai',
        'concat:test',
        'mocha:test'
    ]);

    grunt.registerTask('lint_scss', [
        'scsslint'
    ]);

    grunt.registerTask('build_js', [
        'clean:js',
        'concat:js',
        'lint_js',
        'test_js'
    ]);

    grunt.registerTask('build_css', [
        'lint_scss',
        'clean:css',
        'sass:dev',
        'postcss'
    ]);

    grunt.registerTask('development', [
        'clean',
        'build_js',
        'build_css'
    ]);

    grunt.registerTask('production', [
        'development',
        'uglify:js',
        'sass:prod',
        'postcss'
    ]);

    grunt.registerTask('default', [
        'development',
        'connect',
        'watch'
    ]);

};
