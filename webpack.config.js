const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: './dist/webpack/breakout-bundle.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_nodules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { 
                            loader: 'css-loader', 
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        }
                    ]
                }) 
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('./dist/webpack/index.css'),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            ui: {
                port: 3001
            },
            proxy: 'http://localhost:8080',
            reload: false
        })
    ],
    devtool: 'source-map',
    devServer: {
        contentBase: './dist/webpack',
        port: 8080
    }
}