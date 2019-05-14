import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = DefaultRouter;

let routes = [
  {
    "path": "/redirect",
    "redirect": "/users/guanguan",
    "exact": true
  },
  {
    "path": "/",
    "exact": true,
    "component": require('../a').default
  },
  {
    "path": "/list",
    "component": require('../b').default,
    "Routes": [require('../../routes/PrivateRoute.js').default],
    "exact": true
  },
  {
    "path": "/users/:name",
    "exact": true,
    "component": require('../c').default
  },
  {
    "component": require('../d').default,
    "exact": true
  },
  {
    "component": () => React.createElement(require('E:/dav-umi/umi-example/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
