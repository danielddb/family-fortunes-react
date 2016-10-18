var config = require('./app.config');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");

module.exports = {
    context: path.resolve(config.paths.dev),
    entry: config.filenames.js.dev,
    output: {
        filename: config.filenames.js.build,
        path: path.resolve(config.paths.build),
        publicPath: config.paths.public
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=react&presets[]=es2015'
            },
            {
                test: /\.(jpg|png)$/,
                exclude: /node_modules/,
                loader: 'url?limit=25000&name=img/[hash].[ext]',
            },
            {
                test: /\.svg/,
                exclude: /node_modules/,
                loader: 'babel?presets[]=es2015,presets[]=react!svg-react'
            },
            {
                test: /\.(woff|woff2)$/,
                exclude: /node_modules/,
                // Inline small woff files and output them below font/.
                // Set mimetype just in case.
                loader: 'url',
                query: {
                    name: 'fonts/[hash].[ext]',
                    limit: 50000,
                    mimetype: 'application/font-woff'
                }
            },
            {
                test: /\.ttf$|\.eot$/,
                exclude: /node_modules/,
                loader: 'file',
                query: {
                    name: 'fonts/[hash].[ext]'
                }
            }
        ]
    },
    postcss: function () {
        return [autoprefixer];
    },
    resolve: {
        root: [
            path.resolve(config.paths.dev)
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            },
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin("css/styles.css")
    ]
};