import invariant from 'invariant';
import { formatPattern } from 'react-router/lib/PatternUtils';
import { createRoutes } from 'react-router/lib/RouteUtils';

function makePaths(paths, routeConfigs, route, basePath) {
  const { path, name, indexRoute, childRoutes } = route;

  let fullPath;
  if (!path) {
    fullPath = basePath;
  } else if (path[0] === '/') {
    // TODO: This is getting deprecated.
    fullPath = path;
  } else if (basePath[basePath.length - 1] === '/') {
    fullPath = `${basePath}${path}`;
  } else {
    fullPath = `${basePath}/${path}`;
  }

  if (name) {
    /* eslint-disable no-param-reassign */
    paths[name] = fullPath;
    routeConfigs[name] = route;
    /* eslint-enable no-param-reassign */
  }

  if (indexRoute) {
    makePaths(paths, routeConfigs, indexRoute, fullPath);
  }
  if (childRoutes) {
    childRoutes.forEach(childRoute => makePaths(paths, routeConfigs, childRoute, fullPath));
  }
}

export default function useNamedRoutes(createHistory) {
  return (options = {}) => {
    const history = createHistory(options);

    const { routes } = options;
    const paths = {};
    const routeConfigs = {};
    createRoutes(routes).forEach(route => makePaths(paths, routeConfigs, route, '/'));

    function resolveLocation(location) {
      let name;
      if (typeof location === 'string') {
        if (location[0] !== '/') {
          name = location;
        }
      } else {
        name = location.name;
      }
      if (!name) {
        return location;
      }

      const path = paths[name];
      invariant(path, 'Unknown route: %s', name);

      return {
        ...location,
        pathname: formatPattern(path, location.params),
      };
    }

    function push(location) {
      history.push(resolveLocation(location));
    }

    function replace(location) {
      history.replace(resolveLocation(location));
    }

    function createPath(location) {
      return history.createPath(resolveLocation(location));
    }

    function createHref(location) {
      return history.createHref(resolveLocation(location));
    }

    function createLocation(location, ...args) {
      return history.createLocation(resolveLocation(location), ...args);
    }

    function lookupRouteByName(name) {
      return routeConfigs[name];
    }

    return {
      ...history,
      push,
      replace,
      createPath,
      createHref,
      createLocation,
      lookupRouteByName,
    };
  };
}
