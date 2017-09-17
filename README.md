# Route Tag

There are a number of great routing solutions for React, however, sometimes you just want a router that works with zero set up or customization.  That's where this library comes in.

## Usage

Install via `npm`:

```shell
npm install --save route-tag
```

### Add a Basic Route

The default export (and main component for this package) is the `<Route>` component.  You can use this component in place of your normal components to only show its contents when the `path` prop matched the current window location.

```jsx
import * as React from "react";
import Route from "route-tag";

function Main () {
  return (
    <Route path="/" component={HomePage} />
  );
}
```

### Add A Route With Parameters

You can use standard routing tokens in your `path` to match and capture unknown segments as `params`.

```jsx
function Greet ({ params }) {
  return (
    <div>Hello, {params.name}!</div>
  );
}

function Main () {
  return (
    <Route path="/greet/:name" component={Greet} />
  );
}
```

### Nesting Routes and Partials

You can nest components as children under your `<Route>` components like you would with your normal components.  This is especially useful with the `partial` prop which allows partial matching of your `path` prop.

```jsx
function Main () {
  return (
    <Route path="/account" partial component={AccountLayout}>
      <Route path="/account/profile" component={ProfilePage} />
      <Route path="/account/settings" component={SettingsPage} />
    </Route>
  );
}
```

### Middleware / Redirects

```jsx
function authOnly (next) {
  var password = prompt("What is the password?");
  if (password !== "secret") {
    next("/");
  }
}

function Main () {
  return (
    <Route path="/secret" before={authOnly}>
  );
}
```