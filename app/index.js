var cmd = require('node-cmd');
var commandExists = require('command-exists');
var download = require('download-file');
var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  // Check here the Running Context documentation: http://yeoman.io/authoring/running-context.html
  initializing: {
    intro() {
      console.log('Welcome!');
    },
    checkWPCLI() {
      var done = this.async();
      commandExists('wp').then(function() {
        console.log('It seems you already have the WordPress CLI. So, we are ready to go.');
        done();
      }).catch(function() {
        console.log('You don\'t have installed the WordPress CLI. I\'m going to install it for you.');
        console.log('Downloading the WordPress CLI...')
        download('https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar', {}, function(error) {
          console.log('Done');

          console.log('Make the file executable.');
          cmd.run('chmod +x wp-cli.phar');
          console.log('Done');

          console.log('Move it your PATH.')
          cmd.run('sudo mv wp-cli.phar /usr/local/bin/wp');

          done();
        });
      });
    }
  },
  default: {
    installingWordPress() {
      var done = this.async();
      console.log('Downloading the latest version of WordPress.');
      cmd.get('wp core download', function(err, data, stderr) {
        console.log(data);
        done();
      });
    },
    installingPlugins() {
      var plugins = ['ewww-image-optimizer', 'w3-total-cache', 'wordpress-seo'];

      console.log('Now we are going to install some plugins.');

      plugins.forEach(function(pluginSlug) {
        var downloadOptions, pluginDirectory, zipFileName;

        pluginDirectory = 'wp-content/plugins/'
        zipFileName = pluginSlug + '.latest-stable.zip';

        downloadOptions = {
          directory: './' + pluginDirectory
        }

        download('https://downloads.wordpress.org/plugin/' + zipFileName, downloadOptions, function(error) {
          cmd.get('tar -zxvf ./' + pluginDirectory + zipFileName + ' -C ./' + pluginDirectory, function(error) {
            cmd.run('rm ./' + pluginDirectory + zipFileName);
            console.log(pluginSlug + ' installed.');
          });
        });
      });
    }
  }
});