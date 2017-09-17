import * as React from "react";
import omit from "object.omit";
import createHistory from "history/createBrowserHistory";
import { parseParams, parseQuery } from "@helpfulhuman/route-kit";

const history = createHistory();

class Route extends React.PureComponent {

  constructor (props, context) {
    super(props, context);

    this.history = Route.history;
    this.handleChange = this.handleChange.bind(this);
    this.getUpdatedState = this.getUpdatedState.bind(this);

    this.state = this.getUpdatedState(window.location, props);
  }

  componentWillMount () {
    this.history.listen(this.handleChange);
    this.handleChange(window.location);
  }

  componentDidUnmount () {
    this.history.unlisten(this.handleChange);
  }

  handleChange (location) {
    var nextState = this.getUpdatedState(location, this.props);
    this.props.onChange(nextState, function () {
      this.setState(nextState);
    });
  }

  getUpdatedState (location, props) {
    var params  = parseParams(props.path, location.href, !props.partial);
    var matched = (params === null);

    return {
      matched: matched,
      params: (matched ? params : {}),
      query: (matched ? parseQuery(location.search) : {}),
    };
  }

  render () {
    var C = this.props.component;
    var { matched, params, query } = this.state;
    var other = omit(this.props, ["component", "path", "routeGroup"]);

    if (!matched) {
      return null;
    }

    return (
      <C params={params} query={query} {...other}>
        {this.props.children}
      </C>
    );
  }

}

/**
 * The default props for the Route component(s).
 */
Route.defaultProps = {
  path: "",
  partial: false,
  onChange (nextState, next) {
    next();
  },
};

/**
 * The default history object used by the Route component(s).
 */
Route.history = history;

/**
 * Add the history utilities.
 */
Route.to = history.push.bind(history);
Route.redirect = history.replace.bind(history);
Route.back = history.pop.bind(history);

export default Route;