import * as React from "react";
import {History} from "history";
import defaultHistory from "./history";

export interface LinkProps {
  to: string;
  style?: object;
  className?: string;
  activeClassName?: string;
  component?: React.ComponentClass|React.StatelessComponent;
}

export interface Context {
  history?: History;
}

export class Link extends React.PureComponent<LinkProps> {

  context: Context;

  static defaultProps = {
    style: null,
    className: null,
    activeClassName: null,
    component: "div",
  };

  constructor(props: LinkProps, context: Context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ev: {preventDefault(): void}): void {
    ev.preventDefault();
    var to = this.props.to;
    if (this.context.history) {
      this.context.history.push(to);
    } else {
      defaultHistory.push(to);
    }
  }

  render() {
    var Component = this.props.component as any;
    var classes = this.props.className;

    if (window.location.pathname === this.props.to) {
      classes += ` ${this.props.activeClassName}`;
    }

    return (
      <Component
        href={this.props.to}
        className={classes}
        style={this.props.style}
        onClick={this.handleClick}>
        {this.props.children}
      </Component>
    );
  }

}