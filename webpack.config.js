const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            include: [path.resolve(__dirname, 'src')]
        }]
    },
    externals: /^(react|prop-types|shallowequal)$/
}

if (process.env.NODE_ENV === 'development')
    config.devtool = 'eval-source-map'
else if (process.env.NODE_ENV === 'production')
    config.plugins = [
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['ValidationIn', 'ValidationOut', 'rule']
            }
        })
    ]

module.exports = config
