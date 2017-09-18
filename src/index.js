import Router from "./router";
import Link from "./link";
import withRedirect from "./withRedirect";

export function createRedirector (redirectTo) {
  console.warn("OBSOLETE: It's recommended that you use the new withRedirect() HOC function instead.");
  return withRedirect(redirectTo)("div");
}

export { Router, Link, withRedirect }