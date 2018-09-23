const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    mangle: {
                        reserved: [
                            'ValidationIn',
                            'ValidationOut'
                        ]
                    }
                }
            })
        ]
    }
})
