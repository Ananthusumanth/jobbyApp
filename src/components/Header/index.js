import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onClickedLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <li>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>
      </li>
      <ul className="ul-header">
        <li>
          <Link to="/" className="homelink">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="homelink">
            Jobs
          </Link>
        </li>
      </ul>
      <button
        type="button"
        className="headerLogoutButton"
        onClick={onClickedLogout}
      >
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
