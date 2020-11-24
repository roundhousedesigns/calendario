module.exports = function(grunt) {
	var npmDependencies = require('./package.json').devDependencies;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: [
				'Gruntfile.js',
				'src/js/*.js',
				'!src/js/**/*.min.js',
				'!src/js/vendor/**/*.js'
			],
			options: {
				esversion: 6,
				asi: true
			}
		},

		watch: {
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['jshint','copy:dev']
			},
			stylus: {
				files: ['src/stylus/**/*.styl'],
				tasks: ['stylus:build']
			},
			php: {
				files: ['**/*.php']
			},
			css: {
				files: ['**/*.css']
			},
			// livereload: {
			// 	options: {
			// 		livereload: {
			// 			port: 9999
			// 		}
			// 	},
			// 	files: ['dist/css/**/*.css', 'dist/js/**/*.js', '**/*.php']
			// }
		},

		stylus: {
			build: {
				files: [
					{
						src: ['**/*.styl', '!**/_*.styl'],
						cwd: 'src/stylus',
						dest: 'dist/css',
						ext: '.css',
						expand: true
					}
				],
				options: {
					compress: true,
					banner:
						'/**\n' +
						'* RHDWP Base Styles \n' +
						'* \n' +
						'* Generated <%= grunt.template.today("mm-dd-yyyy h:MM:ss TT") %>\n' +
						'* \n' +
						'* @package rhdwp\n' +
						'*/'
				}
			}
		},

		copy: {
			dev: {
				files: [
					{
						expand: true,
						cwd: 'src/js',
						src: ['*.js'],
						dest: 'dist/js/'
					},
				]
			},
			vendor: {
				files: [
					{
						expand: true,
						cwd: 'node_modules',
						src: ['vex-js/dist/**', 'fullcalendar/dist/**', 'moment/dist/**'],
						dest: 'dist/js/vendor'
					}
				]
			},
			build: {
				files: [
					{
						expand: true,
						cwd: 'src/js',
						src: ['vendor/**/*.js','vendor/**/*.css'],
						dest: 'dist/js/vendor'
					},
					{
						expand: true,
						cwd: 'node_modules',
						src: ['vex-js/dist/**', 'fullcalendar/dist/**', 'moment/dist/**'],
						dest: 'dist/js/vendor'
					}
				]
			}
		},

		terser: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src/js',
						src: ['**/*.js', '!vendor/**/*.js'],
						dest: 'dist/js'
					}
				]
			}
		},

		prettier: {
			options: {
				semi: true,
				singleQuote: true,
				useTabs: true,
				trailingComma: 'es5'
			},
			files: {
				src: ['src/js/**/**.js', 'src/js/**/**.css', '!src/js/vendor/**']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-prettier');
	grunt.loadNpmTasks('grunt-terser');

	grunt.registerTask('setup',[
		'copy:vendor',
		'stylus:build',
	]);
	grunt.registerTask('build', [
		'copy:vendor',
		'copy:build',
		'stylus:build',
		'prettier',
		'terser'
	]);
	grunt.registerTask('default', [
		'copy:vendor',
		'jshint',
		'watch'
	]);
};
