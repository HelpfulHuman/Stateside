import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Link, withRedirect } from "stateside";



class App extends React.PureComponent {
  constructor (props, context) {
    super(props, context);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.state = { loggedIn: false };
  }

  login () {
    this.setState({ loggedIn: true });
  }

  logout () {
    this.setState({ loggedIn: false });
  }

  render () {
    var loggedIn = this.state.loggedIn;

    return (
      <div>
        <Router
          loggedIn={loggedIn}
          component={GuestOnly}>
          <Login route="/login" onLogin={this.login} />
          <NotFound defaultRoute />
        </Router>
        <Router
          onLogout={this.logout}
          loggedIn={loggedIn}
          component={LoggedInOnly}>
          <Home route="/" />
          <About route="/about" />
          <NotFound defaultRoute />
        </Router>
      </div>
    );
  }
}


const GuestOnly = withRedirect(function (props) {
  return (props.loggedIn ? "/" : null);
})(function (props) {
  return (<div>{props.children}</div>);
});


const LoggedInOnly = withRedirect(function (props) {
  return (!props.loggedIn ? "/login" : null);
})(function (props) {
  return (
    <div>
      <nav>
        <Link to="/" activeClassName="isActive">Home</Link>
        <Link to="/about" activeClassName="isActive">About</Link>
        <a onClick={props.onLogout}>Logout</a>
      </nav>
      {props.children}
    </div>
  );
});


function Login (props) {
  return (
    <div>
      Welcome!  Please log in...
      <a onClick={props.onLogin}>Login</a>
    </div>
  );
}


function Home (props) {
  return (
    <h1>Home Page</h1>
  );
}


function About (props) {
  return (
    <h1>About Page</h1>
  );
}


function NotFound (props) {
  return (
    <h1>Not Found</h1>
  );
}


ReactDOM.render(
  <App />
  , document.getElementById("root")
)