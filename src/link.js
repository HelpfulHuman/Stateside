import * as React from "react";
import Router from "./router";

export default function Link (props) {
  var Component = (props.component || "a");
  var classes = (props.className || "");

  if (window.location.pathname === props.to) {
    classes += ` ${props.activeClassName}`;
  }

  var onClick = function (ev) {
    ev.preventDefault();
    Router.to(props.to);
  }

  return (
    <Component
      href={props.to}
      className={classes}
      style={props.style || {}}
      onClick={onClick}>
      {props.children}
    </Component>
  );
}