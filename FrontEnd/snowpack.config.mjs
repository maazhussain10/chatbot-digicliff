import proxy from 'http2-proxy';
/** @type {import("snowpack").SnowpackUserConfig } */

export default {
  mount: {
    public: '/',
    src: '/dist',
  },
  plugins: ['@snowpack/plugin-react-refresh'],
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => {
        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 3000,
        });
      },
    },
    /* Enable an SPA Fallback in development: */
    { "match": "routes", "src": ".*", "dest": "/index.html" },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
    open: "none",
  },
  buildOptions: {
    /* ... */
  },
  env: {
    // API_URL: 'http://49.206.201.140:3000/api/'
    API_URL: '/api/'
  }
};
