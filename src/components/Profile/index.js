import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiContentResponse = {
  initially: 'INITIAL',
  in_progress: 'INPROGRESS',
  isFailed: 'ISFAILED',
  success: 'SUCCESS',
}

class Profile extends Component {
  state = {status: apiContentResponse.initially, updateProfileDetails: []}

  componentDidMount() {
    this.setState({status: apiContentResponse.in_progress})
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      const data = await response.json()
      const updateDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        updateProfileDetails: updateDetails,
        status: apiContentResponse.success,
      })
    } else {
      this.setState({status: apiContentResponse.isFailed})
    }
  }

  loadingView = () => (
    <div className="profile-main-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  isfailureView = () => (
    <div className="profile-main-container">
      <button
        type="button"
        className="home-button"
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {updateProfileDetails} = this.state

    return (
      <div className="Profile-Container">
        <img
          src={updateProfileDetails.profileImageUrl}
          alt="profile"
          className="profile"
        />
        <h1 className="main-headingProfile">{updateProfileDetails.name}</h1>
        <p className="description">{updateProfileDetails.shortBio}</p>
      </div>
    )
  }

  renderResponse = () => {
    const {status} = this.state
    switch (status) {
      case apiContentResponse.in_progress:
        return this.loadingView()
      case apiContentResponse.isFailed:
        return this.isfailureView()
      case apiContentResponse.success:
        return this.successView()
      default:
        return this.loadingView()
    }
  }

  render() {
    return <>{this.renderResponse()}</>
  }
}
export default Profile
