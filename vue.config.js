
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/authComponent/'
        : '/',
    devServer: {
        historyApiFallback: true,
        proxy: {
            "/resource": {
                target: "http://127.0.0.1:8181/resource/",
                changeOrigin: true,
                pathRewrite: {
                    "^/resource": "",
                },
            },
        },
    },
}