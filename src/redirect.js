import * as React from "react";
import Router from "./router";
import omit from "object.omit";

export default function createRedirector (redirect, component) {
  var C = (component || "div");

  if (typeof redirect !== "function") {
    throw new Error("Bad Argument: You must supply a function for the redirect.")
  }

  return class extends React.PureComponent {

    checkRedirect (props) {
      var newLocation = redirect(props);
      if (props.anyMatched && typeof newLocation === "string") {
        Router.redirect(newLocation);
      }
    }

    componentDidMount () {
      this.checkRedirect(this.props);
    }

    componentWillReceiveProps (props) {
      this.checkRedirect(props);
    }

    render () {
      var props = omit(this.props, ["anyMatched"]);
      return (props.anyMatched ? <C {...props}>{props.children}</C> : null);
    }

  }
}