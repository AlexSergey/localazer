const { libraryCompiler } = require('rocket-starter');

libraryCompiler('Localization', {}, config => {
    config.externals = [{
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    }]
});