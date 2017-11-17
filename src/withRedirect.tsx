import * as React from "react";
import {History} from "history";
import defaultHistory from "./history";

interface State {
  show: boolean;
}

export interface GetRedirectURL<Props> {
  (props: Props): string;
}

export interface RedirectHOCProps {
  anyMatched?: boolean;
}

export interface RedirectHOC<Props> {
  (Component: (React.ComponentType<any>|string)): React.ComponentClass<Props>;
}

export function withRedirect<Props = any>(redirectTo: GetRedirectURL<Props>): RedirectHOC<Props> {
  if (typeof redirectTo !== "function") {
    throw new Error("Bad Argument: The redirectTo argument must be a function that returns a URL to redirect to or null.")
  }

  return function (Component: any) {
    var componentName = (Component.displayName || Component.name);

    if (typeof Component === "string") {
      var C = Component as any;
      Component = function (props) {
        return (<C>{props.children}</C>);
      };
    }

    return class extends React.PureComponent<Props & RedirectHOCProps, State> {

      displayName = `Redirector(${componentName})`;

      constructor(props, context) {
        super(props, context);
        this.checkRedirect = this.checkRedirect.bind(this);
        this.state = { show: true };
      }

      checkRedirect(props) {
        var newLocation: string = redirectTo(props);
        var history: History = (this.context.history || defaultHistory);
        if (props.anyMatched && typeof newLocation === "string") {
          this.setState({ show: false });
          if (newLocation !== location.pathname) {
            history.replace(newLocation);
          }
        } else {
          this.setState({ show: true });
        }
      }

      componentWillMount() {
        this.checkRedirect(this.props);
      }

      componentWillReceiveProps(props) {
        this.checkRedirect(props);
      }

      render() {
        if (this.state.show) {
          var {anyMatched, ...props} = this.props as any;
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

export function createRedirector (redirectTo) {
  console.warn("OBSOLETE: It's recommended that you use the new withRedirect() HOC function instead.");
  return withRedirect(redirectTo)("div");
}