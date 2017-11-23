import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, defaultHistory, Link, withRedirect, RouteProps} from "../../src";


interface AppState {
  loggedIn: boolean;
}

class App extends React.PureComponent<any, AppState> {

  state: AppState = { loggedIn: false };

  constructor (props, context) {
    super(props, context);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleGreeting = this.handleGreeting.bind(this);
  }

  login () {
    this.setState({ loggedIn: true }, function () {
      defaultHistory.push("/");
    });
  }

  logout () {
    this.setState({ loggedIn: false }, function () {
      defaultHistory.push("/login");
    });
  }

  handleGreeting (name) {
    Router.to(`/greet/${name}`);
  }

  render () {
    return (
      <Router onlyShowFirst>
        <Login route="/login"
          loggedIn={this.state.loggedIn}
          onLogin={this.login} />
        <Router
          route="/"
          partialRoute
          onLogout={this.logout}
          loggedIn={this.state.loggedIn}
          component={LoggedInOnly}>
          <Home route="/" />
          <Greet route="/greet/:name" />
          <GreetForm
            route="/greet"
            partialRoute
            onGreet={this.handleGreeting} />
        </Router>
        <NotFound defaultRoute />
      </Router>
    );
  }
}


const isGuestOnly = withRedirect(function (props) {
  console.log("is guest only triggered...", props)
  return (props.loggedIn ? "/" : null);
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


interface LoginProps extends RouteProps {
  onLogin(): void;
}

const Login = isGuestOnly(function (props: LoginProps) {
  return (
    <div>
      Welcome!  Please log in...
      <a onClick={props.onLogin}>Login</a>
    </div>
  );
});


function Home(props: RouteProps) {
  return (
    <h1>Home Page</h1>
  );
}


interface GreetProps extends RouteProps {
  name?: string;
  params?: {name?: string};
}

function Greet({ params }: GreetProps) {
  var name = (params.name || "World");
  return (
    <h1>Hello, {name}!</h1>
  );
}


interface GreetFormProps extends RouteProps {
  onGreet(val: string): void;
}

class GreetForm extends React.PureComponent<GreetFormProps> {

  nameInput: HTMLInputElement;

  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onGreet(this.nameInput.value);
  }

  render() {
    return (
      <div>
        <input type="text" ref={c => this.nameInput = c} placeholder="Enter Your Name" />
        <button onClick={this.handleClick}>Greet</button>
      </div>
    );
  }
}


function NotFound(props: RouteProps) {
  return (
    <h1>Not Found</h1>
  );
}


ReactDOM.render(
  <App />
  , document.getElementById("root")
);