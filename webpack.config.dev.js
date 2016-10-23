var autoprefixer = require('autoprefixer');
var config = require('./app.config');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require("webpack-dev-server");

module.exports = {
    context: path.resolve(config.paths.dev),
    entry: [
        'webpack-dev-server/client?' + config.env.dev.path,
        'webpack/hot/only-dev-server',
        config.filenames.js.dev
    ],
    output: {
        filename: config.filenames.js.build,
        path: path.resolve(config.paths.build),
        publicPath: config.paths.public
    },
    devtool: 'cheap-eval-source-map',
    plugins: [ 
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'Family Fortunes',
            filename: '../index.html',
            template: 'index.ejs',
            minify: {
                collapseWhitespace: true
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                loader: 'style!css-loader!postcss-loader!stylus-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.mp3/,
                exclude: /node_modules/,
                loader: 'file?name=audio/[hash].[ext]',
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
    devServer: {
        host: config.env.dev.host,
        port: config.env.dev.port,
        contentBase: config.paths.serverRoot.build,
        hot: true,
        inline: true,
        progress: true
    }
};