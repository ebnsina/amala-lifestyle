const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite on web (browser preview only): .wasm assets, and isolation headers on Metro-served files.
// HTML pages get the same headers from the expo-router plugin in app.json.
config.resolver.assetExts.push('wasm');
const enhance = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const next = enhance ? enhance(middleware, server) : middleware;
  return (req, res, done) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return next(req, res, done);
  };
};

module.exports = config;
