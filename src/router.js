import * as React from "react";
import omit from "object.omit";
import createHistory from "history/createBrowserHistory";
import { createState, copy, parseParams, parseQuery } from "./utils";

/**
 * Create a default history object.
 */
const history = createHistory();

class Router extends React.PureComponent {

  constructor (props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.mapChild = this.mapChild.bind(this);

    this.history = (props.history || history);
    this.state = createState(window.location);
    this.matchedAny = false;
  }

  handleChange (location) {
    this.matchedAny = false;
    this.setState(createState(location));
  }

  componentWillMount () {
    this.history.listen(this.handleChange);
  }

  componentWillUnmount () {
    this.history.unlisten(this.handleChange);
  }

  mapChild (child) {
    var { uri, query } = this.state;
    var route = (this.props.route || "");

    if (child.props.defaultRoute === true) {
      if (!this.matchedAny) {
        this.matchedAny = true;
        return child;
      } else {
        return null;
      }
    }

    if (!!child.props.route) {
      var childRoute = (route + child.props.route);
      var exact = (child.props.partialRoute !== true);
      var params = parseParams(childRoute, uri, exact);
      if (params === null) return null;
      this.matchedAny = true;
      return copy(child, { params, query });
    }

    return child;
  }

  render () {
    var Component = (this.props.component || "div");
    var props = omit(this.props, ["component", "history"]);
    var children = this.props.children.map(this.mapChild);

    return (
      <Component anyMatched={this.matchedAny} {...props}>
        {children}
      </Component>
    );
  }

}

/**
 * The default history object used by the Route component(s).
 */
Route.history = history;

/**
 * Add the history utilities.
 */
Route.listen = history.listen.bind(history);
Router.to = history.push.bind(history);
Router.redirect = history.replace.bind(history);
Router.back = history.goBack.bind(history);
Router.forward = history.goForward.bind(history);

export default Router;