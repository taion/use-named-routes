import invariant from 'invariant';
import { formatPattern } from 'rrtr/lib/PatternUtils';
import { createRoutes } from 'rrtr/lib/RouteUtils';

function makePaths(paths, route, basePath) {
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
    /* eslint-enable no-param-reassign */
  }

  if (indexRoute) {
    makePaths(paths, indexRoute, fullPath);
  }
  if (childRoutes) {
    childRoutes.forEach(childRoute => makePaths(paths, childRoute, fullPath));
  }
}

export default function useNamedRoutes(createHistory) {
  return (options = {}) => {
    const history = createHistory(options);

    const { routes } = options;
    const paths = {};
    createRoutes(routes).forEach(route => makePaths(paths, route, '/'));

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

    function createLocation(location) {
      return history.createLocation(resolveLocation(location));
    }

    return {
      ...history,
      push,
      replace,
      createPath,
      createHref,
      createLocation,
    };
  };
}
