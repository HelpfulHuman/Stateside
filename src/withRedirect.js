import * as React from "react";
import Router from "./router";
import omit from "object.omit";

export default function withRedirect (redirectTo) {
  if (typeof redirectTo !== "function") {
    throw new Error("Bad Argument: The redirectTo argument must be a function that returns a URL to redirect to or null.")
  }

  return function (Component) {
    var componentName = (Component.displayName || Component.name);

    return class extends React.PureComponent {

      constructor (props, context) {
        super(props, context);
        this.displayName = `Redirector(${componentName})`;
        this.state = { show: true };
      }

      checkRedirect (props) {
        var newLocation = redirectTo(props);
        if (props.anyMatched && typeof newLocation === "string") {
          this.setState({ show: false });
          if (newLocation !== window.location) {
            Router.redirect(newLocation);
          }
        } else {
          this.setState({ show: true });
        }
      }

      componentDidMount () {
        this.checkRedirect(this.props);
      }

      componentWillReceiveProps (props) {
        this.checkRedirect(props);
      }

      render () {
        if (this.props.anyMatched && this.state.show) {
          var props = omit(this.props, ["anyMatched"]);
          return (
            <Component {...props}>
              {props.children}
            </Component>
          );
        }
        return null;
      }

    }
  };
}