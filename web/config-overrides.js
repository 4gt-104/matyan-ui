const path = require('path'); // For resolving file paths
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackDynamicPublicPathPlugin = require('webpack-dynamic-public-path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin'); // For copying remaining files
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack: function (config, webpackEnv) {
    const isEnvProduction = true; // Force production mode

    // 1. Set build output directory to Python package's static folder
    // if (isEnvProduction) {
    //   config.output.path = path.resolve(__dirname, '../src/aim_s_ui/static');
    // }

    // 2. Handle .mjs files (modern JavaScript modules)
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // 3. Optimization Overrides
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };
    config.optimization.runtimeChunk = true;

    // 3b. Terser: parallel + cache for faster production builds
    if (isEnvProduction && config.optimization.minimizer) {
      const terserIndex = config.optimization.minimizer.findIndex(
        (m) => m.constructor.name === 'TerserPlugin'
      );
      if (terserIndex !== -1) {
        config.optimization.minimizer[terserIndex] = new TerserPlugin({
          parallel: true,
          cache: true,
          terserOptions: {
            parse: { ecma: 8 },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: { safari10: true },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          sourceMap: false,
        });
      }
    }

    // 4. Output Overrides (cache-busting filenames)
    if (isEnvProduction) {
      config.output.filename = 'static/js/[name].js?version=[contenthash]';
      config.output.chunkFilename = 'static/js/[name].js?version=[contenthash]';
    }

    // 5. CSS Filename Overrides
    if (isEnvProduction) {
      config.plugins.forEach((plugin, index) => {
        if (plugin instanceof MiniCssExtractPlugin) {
          config.plugins.splice(
            index,
            1,
            new MiniCssExtractPlugin({
              filename: 'static/css/[name].css?version=[contenthash]',
              chunkFilename: 'static/css/[name].css?version=[contenthash]',
            }),
          );
        }
      });
    }

    // 6. Add Dynamic Public Path Support
    config.plugins.push(
      new WebpackDynamicPublicPathPlugin({
        externalPublicPath: 'window.externalPublicPath',
      }),
    );

    // config.plugins.forEach(plugin => {
    //   if (plugin instanceof HtmlWebpackPlugin) {
    //     plugin.userOptions = {
    //       ...plugin.userOptions,
    //       templateContent: ({ htmlWebpackPlugin }) => `
    //         <!DOCTYPE html>
    //         <html>
    //           <head>
    //             <meta charset="utf-8">
    //             <title>My App</title>
    //             <!-- CONFIG_PLACEHOLDER -->
    //             ${htmlWebpackPlugin.tags.headTags}
    //           </head>
    //           <body>
    //             <div id="root"></div>
    //             ${htmlWebpackPlugin.tags.bodyTags}
    //           </body>
    //         </html>
    //       `
    //     };
    //   }
    // });


    // 7. Define Environment Variables
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: !isEnvProduction,
      }),
    );

    // // 8. CopyPlugin configuration for version 5.x
    // if (isEnvProduction) {
    //   config.plugins.push(
    //     new CopyPlugin([ // Pass patterns array directly (no "patterns" key)
    //       {
    //         from: path.resolve(__dirname, './build'),
    //         to: path.resolve(__dirname, '../src/aim_s_ui/static'),
    //         // ignore: ['index.html'], // Simple ignore syntax for v5
    //       },
    //     ]),
    //   );
    // }

    // 9. Log Output Path for Debugging
    console.log('Webpack output path:', config.output.path);

    return config;
  },
};