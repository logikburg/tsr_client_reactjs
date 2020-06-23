import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';

// Containers
import { DefaultLayout } from './containers';
// Pages
import { SagaLogin, Login, TempLogin, Page404, Page500, Register } from './views/Pages';

// import { renderRoutes } from 'react-router-config';
const isProduction = process.env.REACT_APP_SYS_ENV;
console.log(process.env);
console.log('isProduction:', isProduction)

class App extends Component {

  render() {
    var user = localStorage.getItem('user');
    var isLogged = false;
    if (user) {
      isLogged = true;
    }
    console.log('isLogged=', isLogged)
    console.log('user=', user)


    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => (
        (isLogged) ? (
          <Component {...props} />
        ) : (
            <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }} />
          )
      )} />
    );

    return (
      < HashRouter >
        <Switch>
          {/* <Route exact path="/login" name="Login Page" component={TempLogin} /> */}
          {
            (process.env.REACT_APP_SYS_ENV === 'production') ? (
              <Route exact path="/login" name="Login Page" component={Login} />
            ) : (
                <Route exact path="/login" name="Login Page" component={TempLogin} />
              )
          }

          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          {/* <Route path="/" name="Home" component={DefaultLayout} /> */}

          <PrivateRoute path="/" component={DefaultLayout} />
        </Switch>
      </HashRouter >
    );
  }
}

export default App;
