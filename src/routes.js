import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import App from './App'
import { isAuthenticated, logout } from './services/auth'
import Login from './components/Login'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/logout">
          <p>Logout</p>
        </Route>
        <PrivateRoute path="/">
          <App />
        </PrivateRoute>
        <Route path="*" component={() => <h1>Not Found</h1>} />
      </Switch>
    </BrowserRouter>
  )
}

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

export default Routes
