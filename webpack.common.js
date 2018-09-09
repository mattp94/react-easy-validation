const path = require('path')

const { name } = require('./package.json')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: name,
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            include: [
                path.resolve(__dirname, 'src')
            ]
        }]
    },
    externals: /^(react|prop-types|shallowequal)$/
}
