module.exports = {
    env: {
        dev: {
            http: 'http',
            host: 'localhost',
            port: '8080',
            path: 'http://localhost:8080'
        }
    },
    paths: {
        dev: './src/',
        build: './bin/assets/',
        public: '/assets/',
        js: {
            dev: './src/js/',
            build: './bin/assets/'
        },
        style: {
            dev: './src/style/',
            build: './bin/assets/style/'
        },
        fonts: {
            dev: './src/theme/fonts',
            build: './bin/assets/fonts/'
        },
        serverRoot: {
            build: './bin'
        }
    },
    filenames: {
        js: {
            dev: 'app.js',
            build: './js/app.bundle.js'
        }
    }
}