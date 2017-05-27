var cmd = require('node-cmd');
var download = require('download-file');
var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  // Check here the Running Context documentation: http://yeoman.io/authoring/running-context.html
  initializing: {
    intro() {
      console.log('Welcome!');
    }
  },
  default: {
    installingWordPress() {
      var done = this.async();
      console.log('Downloading the latest version of WordPress.');
      download('https://wordpress.org/latest.tar.gz', {}, function(error) {
        cmd.get('tar -zxvf latest.tar.gz', function(error) {
          cmd.run('rm latest.tar.gz');
          cmd.get('mv wordpress/* ./', function(error) {
            cmd.run('rm -r wordpress');
            console.log('WordPress installed.');
            done();
          });
        });
      });
    },
    installingPlugins() {
      var pluginDirectory, plugins;

      plugins = ['ewww-image-optimizer', 'w3-total-cache', 'wordpress-seo'];

      console.log('Now we are going to install some plugins.');
      pluginDirectory = 'wp-content/plugins/';

      plugins.forEach(function(pluginSlug) {
        var downloadOptions, zipFileName;

        console.log('Installing ' + pluginSlug);

        zipFileName = pluginSlug + '.latest-stable.zip';

        downloadOptions = {
          directory: './' + pluginDirectory
        }

        console.log('Downloading install package from https://downloads.wordpress.org/plugin/' + zipFileName + '...');
        download('https://downloads.wordpress.org/plugin/' + zipFileName, downloadOptions, function(error) {
          cmd.get('tar -zxvf ./' + pluginDirectory + zipFileName + ' -C ./' + pluginDirectory, function(error) {
            cmd.run('rm ./' + pluginDirectory + zipFileName);
            console.log(pluginSlug + ' installed successfully.');
          });
        });
      });
    }
  }
});