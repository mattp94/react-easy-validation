const path = require('path')
const webpack = require('webpack')

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'react-easy-validation',
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

if (process.env.NODE_ENV === 'production')
    config.plugins = [new webpack.optimize.UglifyJsPlugin()]

module.exports = config
