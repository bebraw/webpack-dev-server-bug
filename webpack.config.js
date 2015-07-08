var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');

var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);

/*
    - path.resolve is used for absolute paths, which is preferred with webpack
    - Loaders are evaluated from right to left. In this case it will pass a possible CSS file to css-loader first and to style-loader after that.
      css-loader will resolve @import and url statements of our CSS files. style-loader deals with require statements in our JavaScript.
*/

var common = {
    entry: [path.resolve(ROOT_PATH, 'app/main')],
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    output: {
        path: path.resolve(ROOT_PATH, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack with React app'
        })
    ]
};

if (TARGET === 'build') {
    module.exports = merge(common, {
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel?stage=1',
                    include: path.resolve(ROOT_PATH, 'app'),
                },
            ],
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    // This has effect on the react lib size
                    'NODE_ENV': JSON.stringify('production'),
                }
            }),
        ],
    });
}

if (TARGET === 'dev') {
    module.exports = merge(common, {
        entry: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/dev-server'
        ],
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['react-hot', 'babel?stage=1'],
                    include: path.resolve(ROOT_PATH, 'app'),
                },
            ],
        },
    });
}