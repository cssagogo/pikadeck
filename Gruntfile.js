/**
 * Created by adamyoungers on 10/31/17.
 */
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mocha: {
            test: {
                urls: ['test/index.html'],
                dest: 'test/index.out',
                run: true,
                log: true,
                reporter: 'Spec',
                timeout: 10000
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
            test: {
                files: ['src/js/**/*.js']
            }
        },
        clean: {
            assets: ['app/assets/**/*'],
            js:     ['app/assets/js/**/*'],
            css:    ['app/assets/css/**/*'],
            img:    ['app/assets/img/**/*'],
            test:   ['test/index.js', 'test/index.js.map']
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
        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded',
                    sourceMap: true,
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
                    outputStyle: 'compressed',
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
                tasks: ['test']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    //grunt.loadNpmTasks('grunt-sass-lint');
    //grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha');

    grunt.registerTask('build_js', [
        'clean:js',
        'concat:js'
    ]);

    grunt.registerTask('lint_js', [
        'jshint:test'
    ]);

    grunt.registerTask('test_js', [
        'clean:test',
        'concat:test',
        'mocha:test'
    ]);

    grunt.registerTask('build_css', [
        'clean:css',
        'sass:dev'
    ]);

    grunt.registerTask('default', [
        'clean',
        'build_js',
        'lint_js',
        //'test_js',
        'build_css'
        //'lint_css',
        //'copy_img'
    ]);

    grunt.registerTask('production', [
        'default',
        'uglify:js',
        'sass:prod'
    ]);

};