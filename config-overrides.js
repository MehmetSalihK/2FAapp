const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "util": require.resolve("util/"),
        "assert": require.resolve("assert/"),
        "vm": require.resolve("vm-browserify"),
        "fs": false
    };

    config.resolve = {
        ...config.resolve,
        fallback: {
            ...config.resolve.fallback,
            ...fallback
        }
    };

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ];

    return config;
};
