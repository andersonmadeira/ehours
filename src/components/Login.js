import React, { useState } from 'react'
import { useFormik } from 'formik'
import api from '../services/api'
import { login } from '../services/auth'
import { Redirect } from 'react-router-dom'

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const form = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: values => {
      api
        .post('/auth/login', values)
        .then(res => {
          login(res.headers.authorization.substring(7))
          setIsAuthenticated(true)
        })
        .catch(res => {
          if (res.response) {
            alert(res.response.data.message)
          }
        })
    },
  })

  return isAuthenticated ? (
    <Redirect to={'/'} />
  ) : (
    <form onSubmit={form.handleSubmit}>
      <div className="form-control">
        <label htmlFor="username">Username:</label>
        <input
          name="username"
          type="text"
          {...form.getFieldProps('username')}
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password:</label>
        <input
          name="password"
          type="password"
          {...form.getFieldProps('password')}
        />
      </div>
      <button className="button" type="submit">
        Login
      </button>
    </form>
  )
}

export default Login
