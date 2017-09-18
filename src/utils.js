import pathToRegexp from "path-to-regexp";

/**
 * Create the state update for the given location.
 *
 * @param  {Object} location
 * @return {Object}
 */
export function createState (location) {
  return {
    uri: location.pathname,
    query: parseQuery(location.search),
  };
}

/**
 * Copy the given child and add the new props.
 *
 * @param  {Element} child
 * @param  {Object} props
 * @return {Element}
 */
export function copy (child, props) {
  var key = child.props.route;
  return React.cloneElement(child, Object.assign({ key }, child.props, props));
}

/**
 * Returns a params object containing the parsed tokens from the path if the
 * URI matches the path's pattern.  Otherwise, null is returned.
 *
 * @param  {String} path
 * @param  {String} uri
 * @param  {Bool} exact
 * @return {Object}
 */
export function parseParams (path, uri, exact) {
  var arg, key, keys = [], params = {};
  var args = pathToRegexp(path, keys, { end: exact }).exec(uri);
  if (args) {
    args = args.slice(1);
    for (var i = 0; i < args.length; i++) {
      key = keys[i].name;
      arg = args[i];
      params[key] = (arg ? decodeURIComponent(arg) : null);
    }
    return params;
  }
  return null;
}

/**
 * Parses a query string into an object.
 *
 * @param  {String} query
 * @return {Object}
 */
export function parseQuery (query) {
  var output = {};
  if (query) {
    var pieces = (query[0] === '?' ? query.substr(1) : query).split('&');
    for (var i = 0; i < pieces.length; i++) {
      var kv = pieces[i].split('=');
      output[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    }
  }
  return output;
}