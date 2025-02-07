import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch, BsBag} from 'react-icons/bs'
import {IoLocationOutline} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import Headers from '../Header'
import Profile from '../Profile'
import './index.css'

const apiContentResponse = {
  initially: 'INITIAL',
  in_progress: 'INPROGRESS',
  isFailed: 'ISFAILED',
  success: 'SUCCESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationRangeList = [
  {
    locationRangeId: 'HYDERABAD',
    label: 'Hyderabad',
  },
  {
    locationRangeId: 'CHENNAI',
    label: 'Chennai',
  },
  {
    locationRangeId: 'BANGALORE',
    label: 'Bangalore',
  },
  {
    locationRangeId: 'DELHI',
    label: 'Delhi',
  },
  {
    locationRangeId: 'MUMBAI',
    label: 'Mumbai',
  },
]

class JobsRoute extends Component {
  state = {
    search: '',
    filterDate: [],
    salaryRanges: '1000000',
    searchValue: '',
    status: apiContentResponse.initially,
    employmentType: [],
    activeLocations: [],
  }

  componentDidMount() {
    this.setState({status: apiContentResponse.in_progress})
    this.getjobsData()
  }

  getjobsData = async () => {
    const {employmentType, activeLocations, salaryRanges, search} = this.state
    const url = 'https://apis.ccbp.in/jobs'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(
      `${url}?employment_type=${employmentType}&minimum_package=${salaryRanges}&search=${search}`,
      options,
    )
    if (response.ok) {
      const data = await response.json()
      const updatesJobDetails = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      let filteredDataList = updatesJobDetails
      if (activeLocations.length !== 0) {
        filteredDataList = updatesJobDetails.filter(job => {
          let isLocationIncluded = false
          activeLocations.forEach(location => {
            if (job.location === location) {
              isLocationIncluded = true
            }
            return isLocationIncluded
          })
          return isLocationIncluded
        })
      }
      this.setState({
        filterDate: filteredDataList,
        status: apiContentResponse.success,
      })
    } else {
      this.setState({status: apiContentResponse.isFailed})
    }
  }

  onChangeSearch = event => {
    this.setState({searchValue: event.target.value})
  }

  onClickedSearchIcon = () => {
    const {searchValue} = this.state
    this.setState({search: searchValue}, this.getjobsData)
  }

  onClickCheckBoxSalary = event => {
    this.setState({salaryRanges: event.target.value}, this.getjobsData)
  }

  onClickCheckBoxEmployment = id => {
    const {employmentType} = this.state
    const listOfBox = employmentType.includes(id)
    if (listOfBox) {
      const index = employmentType.indexOf(id)
      employmentType.splice(index, 1)
      this.setState(({employmentType}, this.getjobsData))
    } else {
      employmentType.push(id)
      this.setState(({employmentType}, this.getjobsData))
    }
  }

  onClickCheckBoxlocation = id => {
    const {activeLocations} = this.state
    const listOfBox = activeLocations.includes(id)
    if (listOfBox) {
      const index = activeLocations.indexOf(id)
      console.log(index)
      activeLocations.splice(index, 1)
      this.setState(({activeLocations}, this.getjobsData))
    } else {
      activeLocations.push(id)
      this.setState(({activeLocations}, this.getjobsData))
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
      <button type="button" className="home-button" onClick={this.getjobsData}>
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {filterDate} = this.state

    return (
      <ul>
        {filterDate.length === 0 ? (
          <div className="failedDiv">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="notjobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        ) : (
          filterDate.map(eachJob => (
            <li className="joblist-container" key={eachJob.id}>
              <Link to={`/jobs/${eachJob.id}`}>
                <div className="joblist-head">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="company logo"
                    className="Companylogo"
                  />
                  <div className="textAndRating">
                    <h1>{eachJob.title}</h1>
                    <div className="rating">
                      <FaStar color="yellow" />
                      <p>{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="locationAndBudget">
                  <div className="locationANDemploytype">
                    <div className="locationDiv">
                      <IoLocationOutline />
                      <p>{eachJob.location}</p>
                    </div>
                    <BsBag />
                    <p>{eachJob.employmentType}</p>
                  </div>
                  <div>
                    <p>{eachJob.packagePerAnnum}</p>
                  </div>
                </div>
                <div className="description">
                  <h1>Description</h1>
                  <p>{eachJob.jobDescription}</p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
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
    const {searchValue} = this.state
    return (
      <>
        <Headers />
        <div className="Jobs-container">
          <div className="sidebar-container">
            <Profile />
            <hr className="hr" />
            <ul className="employmentTypesList-row">
              <h1 className="main-headingEmployees">Type of Employment</h1>
              {employmentTypesList.map(eachItem => (
                <li className="checkBoxDiv" key={eachItem.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={eachItem.label}
                    value={eachItem.label}
                    className="input"
                    onClick={() =>
                      this.onClickCheckBoxEmployment(eachItem.employmentTypeId)
                    }
                  />
                  <label htmlFor={eachItem.label}>{eachItem.label}</label>
                </li>
              ))}
            </ul>
            <hr className="hr" />
            <ul className="salaryRangesList-row">
              <h1 className="main-headingEmployees">Salary Range</h1>
              {salaryRangesList.map(each => (
                <li className="checkBoxDiv" key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.label}
                    name="money"
                    className="input"
                    value={each.salaryRangeId}
                    onClick={this.onClickCheckBoxSalary}
                  />
                  <label htmlFor={each.label}>{each.label}</label>
                </li>
              ))}
            </ul>
            <hr className="hr" />
            <ul className="locationList-row">
              <h1 className="main-headingEmployees">Location</h1>
              {locationRangeList.map(eachItem => (
                <li className="checkBoxDiv" key={eachItem.locationRangeId}>
                  <input
                    type="checkbox"
                    id={eachItem.label}
                    value={eachItem.label}
                    className="input"
                    onClick={() => this.onClickCheckBoxlocation(eachItem.label)}
                  />
                  <label htmlFor={eachItem.label}>{eachItem.label}</label>
                </li>
              ))}
            </ul>
            <hr className="hr" />
          </div>
          <div className="jobsSearch-container">
            <div className="SearchinputDiv">
              <input
                type="search"
                placeholder="Search"
                className="Searchinput"
                value={searchValue}
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="searchButton"
                onClick={this.onClickedSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="responseOutput">{this.renderResponse()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default JobsRoute
