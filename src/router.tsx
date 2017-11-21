import * as React from "react";
import {History, UnregisterCallback} from "history";
import defaultHistory from "./history";
import {copy, parseParams, parseQuery} from "./utils";

export interface RouteProps<SiblingProps = any> {
  route?: string|{(props: SiblingProps): boolean};
  defaultRoute?: boolean;
  partialRoute?: boolean;
  params?: object;
}

export interface RouteChild {
  type: React.ComponentType;
  props: RouteProps;
}

export interface RouterProps extends RouteProps{
  component: React.ComponentType | string;
  history?: History;
  onlyShowFirst?: boolean;
  children?: React.ReactChild|React.ReactChild[];
  className?: string;
  style?: object;
  [key: string]: any;
}

export interface RouterState {
  matchedAny: boolean;
  location: History.LocationState;
  mappedChildren: RouteChild[];
  query?: object;
}

export class Router extends React.PureComponent<RouterProps, RouterState> {

  history: History;
  unlisten?(): void;

  constructor(props, context) {
    super(props, context);

    this.processRoute = this.processRoute.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.history = (props.history || context.history || defaultHistory);
    this.state = this.processRoute(window.location, props, context);
  }

  getChildContext() {
    return { history: this.history };
  }

  componentWillMount() {
    this.unlisten = this.history.listen(this.handleChange);
  }

  componentWillUnmount() {
    if (typeof this.unlisten === "function") {
      this.unlisten();
    }
  }

  handleChange(location: History.LocationState) {
    var nextState = this.processRoute(location, this.props, this.context);
    this.setState(nextState);
  }

  processRoute(location: History.LocationState, props: RouterProps, context: any): RouterState {
    var matchedAny      = false;
    var mappedChildren  = [];
    var matchOne        = (!!this.props.onlyShowFirst || false);

    // Parse the query string parameters into an object
    var query = parseQuery(location.search);

    // Get the route path for this router (if any)
    var ownRoute = (typeof props.route === "string" ? props.route : "");

    // TODO: Move defaultRoute children to the end of the list
    // Mull over each child prop and add it to the list if possible
    mappedChildren = React.Children.map(props.children, (childElement) => {
      var child = childElement as RouteChild;

      // Default route should only fire if we haven't matched anything yet
      if (child.props.defaultRoute === true) {
        return (!matchedAny ? child : null);
      }

      // If the child has a function for the `route` prop, show the child if it returns true
      if (typeof child.props.route === "function") {
        if (matchedAny && matchOne) return null;
        if (child.props.route(location) === true) {
          matchedAny = true;
          return copy(child, { params: {}, query, location });
        }
        return null;
      }

      // If the child has the `route` path prop, then check if the path matches the location pathname
      if (typeof child.props.route === "string") {
        if (matchedAny && matchOne) return null;
        var childRoute = (ownRoute + child.props.route);
        var exact = (child.props.partialRoute !== true);
        var params = parseParams(childRoute, location.pathname, exact);
        if (params !== null) {
          matchedAny = true;
          return copy(child, { params, query, location });
        }
        return null;
      }

      // If this is another <Router /> instance, it counts towards our matched routes
      if (child.type === Router) {
        if (matchedAny && matchOne) return null;
        matchedAny = true;
      }

      // Return the original child as a fallback
      return child;
    });

    return { location, mappedChildren, matchedAny, query };
  }

  render() {
    var {component, route, defaultRoute, onlyShowFirst, params, ...props} = this.props;
    var Component = (component || "div");

    if (typeof Component !== "string") {
      props = Object.assign(props, {
        anyMatched: this.state.matchedAny,
        query: this.state.query,
        params: this.props.params,
      });
    } else {
      props = {
        className: props.className,
        style: props.style,
      };
    }

    return (
      <Component {...props}>
        {this.state.mappedChildren}
      </Component>
    );
  }

  static get history(): History {
    console.warn("WARNING: Use `import {defaultHistory}` as this approach will be deprecated in a future release.");
    return defaultHistory;
  }

  static listen(listener: History.LocationListener): UnregisterCallback {
    console.warn("WARNING: Use `defaultHistory.listen` as this approach will be deprecated in a future release.");
    return defaultHistory.listen(listener);
  }

  static to(path: History.Path, state?: History.LocationState): void;
  static to(location: History.LocationDescriptor): void;
  static to(): void {
    console.warn("WARNING: Use `defaultHistory.push` as this approach will be deprecated in a future release.");
    defaultHistory.push.apply(defaultHistory, arguments);
  }

  static redirect(path: History.Path, state?: History.LocationState): void;
  static redirect(location: History.LocationDescriptor): void;
  static redirect(): void {
    console.warn("WARNING: Use `defaultHistory.replace` as this approach will be deprecated in a future release.");
    defaultHistory.replace.apply(defaultHistory, arguments);
  }

  static back(): void {
    console.warn("WARNING: Use `defaultHistory.goBack` as this approach will be deprecated in a future release.");
    defaultHistory.goBack();
  }

  static forward(): void {
    console.warn("WARNING: Use `defaultHistory.goForward` as this approach will be deprecated in a future release.");
    defaultHistory.goForward();
  }

}