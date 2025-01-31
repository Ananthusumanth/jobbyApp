import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', isError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailed = errorMsg => {
    this.setState({isError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const updatedLoginDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(updatedLoginDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailed(data.error_msg)
    }
  }

  render() {
    const {username, password, isError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="form-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="form-logo"
          />
          <form className="form" onSubmit={this.onSubmitForm}>
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              value={username}
              className="input"
              placeholder="Username"
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              className="input"
              placeholder="Password"
              onChange={this.onChangePassword}
            />
            <button type="submit" className="button">
              Login
            </button>
            {isError && <p className="para-error">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default LoginRoute
