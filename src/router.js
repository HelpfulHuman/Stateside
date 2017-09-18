import * as React from "react";
import omit from "object.omit";
import createHistory from "history/createBrowserHistory";
import { copy, parseParams, parseQuery } from "./utils";

/**
 * Create a default history object.
 */
const history = createHistory();

class Router extends React.PureComponent {

  constructor (props, context) {
    super(props, context);

    this.processRoute = this.processRoute.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.history = (props.history || history);
    this.state = this.processRoute(window.location, props, context);
  }

  componentWillMount () {
    this.history.listen(this.handleChange);
  }

  componentWillUnmount () {
    this.history.unlisten(this.handleChange);
  }

  handleChange (location) {
    this.matchedAny = false;
    if (this.isAllowed(this.props, this.context)) {}
    this.setState(createState(location));
  }

  processRoute (location, props, context) {
    var matchedAny      = false;
    var mappedChildren  = [];

    // Parse the query string parameters into an object
    var query = parseQuery(location.search);

    // Get the route path for this router (if any)
    var ownRoute = (props.route || "");

    // TODO: Move defaultRoute children to the end of the list
    // Mull over each child prop and add it to the list if possible
    mappedChildren = props.children.map(child => {
      // Default route should only fire if we haven't matched anything yet
      if (child.props.defaultRoute === true) {
        return (!matchedAny ? child : null);
      }

      // If this is another <Router /> instance, it counts towards our matched routes
      if (child.type === Router) {
        matchedAny = true;
      }

      // If the child has a function for the `route` prop, show the child if it returns true
      if (typeof child.props.route === "function") {
        if (child.props.route(location)) {
          matchedAny = true;
          return copy(child, { params: {}, query });
        } else {
          return null;
        }
      }

      // If the child has the `route` path prop, then check if the path matches the location pathname
      if (typeof child.props.route === "string") {
        var childRoute = (ownRoute + child.props.route);
        var exact = (child.props.partialRoute !== true);
        var params = parseParams(childRoute, location.pathname, exact);
        if (params === null) return null;
        matchedAny = true;
        return copy(child, { params, query });
      }

      // Return the original child as a fallback
      return child;
    });

    return { location, mappedChildren, matchedAny, query };
  }

  render () {
    var Component = (this.props.component || "div");
    var props = omit(this.props, ["component", "history", "route", "defaultRoute", "query", "params"]);

    if (typeof Component !== "string") {
      props = Object.assign(props, {
        anyMatched: this.state.matchedAny,
        query: this.props.query,
        params: this.props.params,
      });
    }

    return (
      <Component {...props}>
        {this.state.mappedChildren}
      </Component>
    );
  }

}

/**
 * The default history object used by the Route component(s).
 */
Router.history = history;

/**
 * Add the history utilities.
 */
Router.listen = history.listen.bind(history);
Router.to = history.push.bind(history);
Router.redirect = history.replace.bind(history);
Router.back = history.goBack.bind(history);
Router.forward = history.goForward.bind(history);

export default Router;