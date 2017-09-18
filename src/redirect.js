import * as React from "react";
import Router from "./router";

export default function createRedirector (redirect, component) {
  var C = (component || "div");

  if (typeof redirect !== "function") {
    throw new Error("Bad Argument: You must supply a function for the redirect.")
  }

  return class extends React.PureComponent {

    componentWillReceiveProps (props) {
      var newLocation = redirect(props);
      if (props.anyMatched && typeof newLocation === "string") {
        Router.redirect(newLocation);
      }
    }

    render () {
      var props = this.props;
      return (props.anyMatched ? <C {...props}>{props.children}</C> : null);
    }

  }
}