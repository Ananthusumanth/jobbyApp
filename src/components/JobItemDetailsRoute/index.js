import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoLocationOutline} from 'react-icons/io5'
import {BsBag} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import './index.css'

const apiContentResponse = {
  initially: 'INITIAL',
  in_progress: 'INPROGRESS',
  isFailed: 'ISFAILED',
  success: 'SUCCESS',
}

class JobItemDetailsRoute extends Component {
  state = {
    fillteredJobDataItem: [],
    status: apiContentResponse.initially,
  }

  componentDidMount() {
    this.setState({status: apiContentResponse.in_progress})
    this.getJobIdDetails()
  }

  getJobIdDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const upi = 'https://apis.ccbp.in/jobs'
    const response = await fetch(`${upi}/${id}`, options)
    // console.log(response)
    if (response.ok) {
      const data = await response.json()
      const gotDataFromApi = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,

        lifeOfCompanyDescription: data.job_details.life_at_company.description,
        lifeOfCompanyImageUrl: data.job_details.life_at_company.image_url,

        similarDetails: data.similar_jobs,

        skills: data.job_details.skills,
      }
      this.setState({
        fillteredJobDataItem: gotDataFromApi,
        status: apiContentResponse.success,
      })
    } else {
      this.setState({status: apiContentResponse.isFailed})
    }
  }

  loadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  isfailureView = () => (
    <div className="failedDiv">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failed"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="home-button"
        onClick={this.getJobIdDetails}
      >
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {fillteredJobDataItem} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeOfCompanyDescription,
      lifeOfCompanyImageUrl,
      similarDetails,
      skills,
    } = fillteredJobDataItem

    return (
      <div className="jobItem-container">
        <div className="jobItemCard" key={id}>
          <div className="headtext">
            <div className="headtextImage">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="similarlogo"
              />
              <div className="headtextrightDiv">
                <h1>{title}</h1>
                <div className="headrating">
                  <FaStar color="yellow" />
                  <p>{rating}</p>
                </div>
              </div>
            </div>
            <div className="headlocationDiv">
              <div className="locationimgDiv">
                <IoLocationOutline />
                <p>{location}</p>
                <div className="locationimgDivbag">
                  <BsBag />
                  <p>{employmentType}</p>
                </div>
              </div>
              <div>
                <p>{packagePerAnnum}</p>
              </div>
            </div>
          </div>
          <div className="bodyDescription">
            <div className="visit">
              <h1>Description</h1>
              <a href={companyWebsiteUrl} alt={title}>
                <div className="visited">
                  Visit
                  <FiExternalLink size="20px" />
                </div>
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <h1>Skills</h1>
          <ul className="ul-container">
            {skills.map(eachSkill => (
              <li key={eachSkill.name}>
                <img src={eachSkill.image_url} alt={eachSkill.name} />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <div className="lifeOfCompany">
            <h1>Life at Company</h1>
            <div className="lifeOfCompanyDiv">
              <p className="p">{lifeOfCompanyDescription}</p>
              <img
                src={lifeOfCompanyImageUrl}
                alt="life at company"
                className="lifeUrl"
              />
            </div>
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="ul-similar-container">
          {similarDetails.map(eachjob => (
            <li className="li-similar-container" key={eachjob.id}>
              <div className="similarCard">
                <div className="similatHead">
                  <img
                    className="similarlogo"
                    src={eachjob.company_logo_url}
                    alt="similar job company logo"
                  />
                  <div className="titleDiv">
                    <h1>{eachjob.title}</h1>
                    <div className="ratingDiv">
                      <FaStar color="yellow" />
                      <p>{eachjob.rating}</p>
                    </div>
                  </div>
                </div>
                <h1>Description</h1>
                <p>{eachjob.job_description}</p>
                <div className="locatioAndemploy">
                  <IoLocationOutline />
                  <p>{eachjob.location}</p>
                  <BsBag />
                  <p>{eachjob.employment_type}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
    return (
      <>
        <Header />
        {this.renderResponse()}
      </>
    )
  }
}
export default JobItemDetailsRoute
