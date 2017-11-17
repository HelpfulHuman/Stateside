import * as React from "react";
import * as pathToRegexp from "path-to-regexp";

/**
 * Copy the given child and add the new props.
 */
export function copy (child, props) {
  var key = child.props.route;
  return React.cloneElement(child, Object.assign({ key }, child.props, props));
}

/**
 * Returns a params object containing the parsed tokens from the path if the
 * URI matches the path's pattern.  Otherwise, null is returned.
 */
export function parseParams<T = object>(path: string, uri: string, exact: boolean): T {
  path = normalizePath(path);
  uri  = normalizePath(uri);
  var arg, key, keys = [], params = {};
  var args = pathToRegexp(path, keys, { end: exact }).exec(uri);
  if (args) {
    args = args.slice(1) as RegExpExecArray;
    for (var i = 0; i < args.length; i++) {
      key = keys[i].name;
      arg = args[i];
      params[key] = (arg ? decodeURIComponent(arg) : null);
    }
    return params as T;
  }
  return null;
}

/**
 * Parses a query string into an object.
 */
export function parseQuery<T = object>(query: string): T {
  var output = {};
  if (query) {
    var pieces = (query[0] === '?' ? query.substr(1) : query).split('&');
    for (var i = 0; i < pieces.length; i++) {
      var kv = pieces[i].split('=');
      output[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    }
  }
  return output as T;
}

/**
 * Normalize a path to end with a single, trailing "/".
 */
export function normalizePath(path: string): string {
  return path.replace(/\/*$/, "");
}