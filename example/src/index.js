import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Link, withRedirect } from "stateside";


class App extends React.PureComponent {
  constructor (props, context) {
    super(props, context);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleGreeting = this.handleGreeting.bind(this);
    this.state = { loggedIn: false };
  }

  login () {
    this.setState({ loggedIn: true });
  }

  logout () {
    this.setState({ loggedIn: false });
  }

  handleGreeting (name) {
    Router.to(`/greet/${name}`);
  }

  render () {
    return (
      <div>
        <Router
          loggedIn={this.state.loggedIn}
          component={GuestOnly}>
          <Login route="/login" onLogin={this.login} />
          <NotFound defaultRoute />
        </Router>
        <Router
          onLogout={this.logout}
          loggedIn={this.state.loggedIn}
          component={LoggedInOnly}>
          <Home route="/" />
          <Greet route="/greet/:name" />
          <GreetForm
            route="/greet"
            partialRoute
            onGreet={this.handleGreeting} />
          <NotFound defaultRoute />
        </Router>
      </div>
    );
  }
}


const GuestOnly = withRedirect(function (props) {
  return (props.loggedIn ? "/" : null);
})(function ({ children }) {
  return (<div>{children}</div>);
});


const LoggedInOnly = withRedirect(function (props) {
  return (!props.loggedIn ? "/login" : null);
})(function ({ onLogout, children }) {
  return (
    <div>
      <nav>
        <Link to="/" activeClassName="isActive">Home</Link>
        <Link to="/greet" activeClassName="isActive">Greet</Link>
        <a onClick={onLogout}>Logout</a>
      </nav>
      {children}
    </div>
  );
});


function Login ({ onLogin }) {
  return (
    <div>
      Welcome!  Please log in...
      <a onClick={onLogin}>Login</a>
    </div>
  );
}


function Home (props) {
  return (
    <h1>Home Page</h1>
  );
}


function Greet ({ params }) {
  var name = (params.name || "World");
  return (
    <h1>Hello, {name}!</h1>
  );
}


class GreetForm extends React.PureComponent {
  constructor (props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    this.props.onGreet(this.nameInput.value);
  }

  render () {
    return (
      <div>
        <input type="text" ref={c => this.nameInput = c} placeholder="Enter Your Name" />
        <button onClick={this.handleClick}>Greet</button>
      </div>
    );
  }
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