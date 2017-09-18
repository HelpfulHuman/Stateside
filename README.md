# Stateside: A React Router

There are a number of great routing solutions for React, however, sometimes you just want a router that works without a bunch of set up or special rules.  That's where this library comes in.

## Usage

Install via `npm`:

```shell
npm install --save stateside
```

### Add Some Routes

This library exposes a special `<Router>` component that allows you to quickly hook up your existing components to the window's location.

Let's demonstrate how routing works by adding a home and about page.  Just create the components you want to use for each page and add a `route` prop with the desired pattern you want the URI to match.

```jsx
import * as React from "react";
import { render } from "react-dom";
import { Router } from "stateside";

function Home () {
  return <h1>Home</h1>
}

function About () {
  return <h1>About</h1>
}

render(
  <Router>
    <Home route="/" />
    <About route="/about" />
  </Router>
  , document.getElementById("app")
);
```

### Add a Default Route

Often times, you need a fallback route as a handler for handling missing routes.  You can add a default route by adding a `defaultRoute` prop instead of the `route` prop.

```jsx
function PageNotFound () {
  return <h1>Page Not Found</h1>
}

render(
  <Router>
    <Home route="/" />
    <About route="/about" />
    <PageNotFound defaultRoute />
  </Router>
  , document.getElementById("app")
);
```

### Add A Route With Parameters

You can use [path-to-regexp](https://npmjs.com/package/path-to-regexp) tokens in your `route` path to capture unknown segments as parameters.  These will be made available as a `params` object in the `props` of the routed component.

```jsx
function Greet ({ params }) {
  return (
    <div>Hello, {params.name}!</div>
  );
}

render(
  <Router>
    <Greet route="/greet/:name" />
  </Router>
  , document.getElementById("app")
);
```

### Add a Function-Based Route

You may need more control over routing beyond a simple path string.  For this, you can use a function which returns a `boolean` value for the `route` prop instead of a string.

```jsx
var user = { role: "admin" };

function isAdmin (location) {
  return (user.role === "admin");
}

render(
  <Router>
    <Admin route={isAdmin} />
  </Router>
  , document.getElementById("app")
);
```

### Nesting Routers & the `partialRoute` Prop

You can nest `<Router>` components with their own `route` props to create a hierarchy for routing.  On top of that, you can use the `partialRoute` prop to match the first part of the window location to the `route`.  It's important to note that nested routes will inherit the parent component's `route` as a prefix.  So in the example below, the `<Profile>` component will be available at `/account/profile`.

```jsx
render(
  <Router>
    <Home route="/" />
    <Router route="/account" partialRoute component={Account}>
      <Profile route="/profile" />
      <Settings route="/settings" />
    </Router>
  </Router>
  , document.getElementById("app")
);
```

### Route Redirects

Sometimes you may need to redirect users to other routes when certain conditions take place.  This is where the `createRedirector()` utility can be helpful.  For example, let's say you have a group of routes that require the user to be logged in... We can use the `createRedirector()` function to create a new component that will redirect the user to the returned pathname from the given function.

> **Note:**  You can use the `createRedirector()` function as a higher-order component by passing the base component as the second parameter.

```jsx
import * as React from "react";
import { render } from "react-dom";
import { Router, createRedirector } from "stateside";

var state = { userLoggedIn: true };

const LoggedIn = createRedirector(function (props) {
  return (!state.userLoggedIn ? "/login" : null);
});

render(
  <Router>
    <Login route="/login" />
    <Router component={LoggedIn}>
      <SecretPage route="/" />
    </Router>
  </Router>
  , document.getElementById("app")
);
```

### Add a Link

You can quickly link to routes using the provided `<Link>` component.  The `<Link>` element takes a `to` prop which the URI you'd like to link to.  If the `to` prop matches the current location, then you can have a class added to the element by passing the desired class name via the `activeClassName` prop.

> **Note:** You can add your own `style` and `className` props like you normally would with an HTML element.

```jsx
function Nav () {
  return (
    <nav>
      <Link to="/" className="Home">Home</Link>
      <Link to="/about" activeClassName="isActive">About</Link>
    </nav>
  );
}