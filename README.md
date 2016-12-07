# No Maintenance Intended

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

# use-named-routes [![npm][npm-badge]][npm]

Drop-in named route support for [React Router](https://github.com/reactjs/react-router).

[![Discord][discord-badge]][discord]

## Usage

Enhance your history with `useNamedRoutes` and pass in your routes:

```js
import createHistory from 'history/lib/createBrowserHistory';
import { Route, Router, useRouterHistory } from 'react-router';
import useNamedRoutes from 'use-named-routes';

/* ... */

const routes = (
  <Route path="/">
    <Route name="widgets" path="widgets" component={WidgetsPage}>
      <Route name="widget" path=":widgetId" component={WidgetPage} />
    </Route>
  </Route>
);

// The order of history enhancers matters here.
const history = useNamedRoutes(useRouterHistory(createHistory))({ routes });

ReactDOM.render(
  <Router history={history} routes={routes} />,
  container
);
```

You can then use either route names or objects with `name` and optionally `params`:

```js
history.push('widgets');
history.replace({ name: 'widgets', query: { color: 'blue' } });

this.context.router.push({ name: 'widget', params: { widgetId: 'foo' } });
```

This also works with `<Link>`:

```js
<Link to="widgets">

<Link
  to={{ name: 'widget', params: { widgetId: 'bar' } }}
  activeClassName="active"
>
```

Normal paths will also still work:

```js
history.push('/widgets/baz');

this.context.router.replace({ pathname: '/widgets', query: { color: 'red' } });

<Link to="/widgets/qux">
```

If you need to look up a route by name, there is an additional method on `history`/`router`, `lookupRouteByName`

```js
<Route path="users/:id" component={ViewUser} name="viewUser" customData="foo" />

this.context.router.lookupRouteByName('viewUser').customData;
```

## Guide

### Installation

```shell
$ npm i -S react-router history@2 use-named-routes
```

### Route configuration

use-named-routes works with both JSX and plain route definitions. Define `name` on the route element or object to assign it a name.

use-named-routes ignores dynamic routes under `getChildRoutes` or `getIndexRoute`. You probably shouldn't be using those anyway – use `getComponent` or `getComponents` if you want code splitting.

### Location descriptors

Location descriptor strings are treated as route names, except when the location descriptor begins with a `/`, in which case the location descriptor is passed to the base history as-is.

Location descriptor objects are treated as describing a named route if they have a `name` value. Any parameters in the path for the named route are populated from the `params` value. If no `name` value is present, the location descriptor is passed to the base history as-is.

In either case, if a name is present, the formatted pattern is passed to the base history as `pathname` on a location descriptor object. Other properties on the location descriptor are passed through as-is.


[npm-badge]: https://img.shields.io/npm/v/use-named-routes.svg
[npm]: https://www.npmjs.com/package/use-named-routes

[discord-badge]: https://img.shields.io/badge/Discord-join%20chat%20%E2%86%92-738bd7.svg
[discord]: https://discord.gg/0ZcbPKXt5bYaNQ46
