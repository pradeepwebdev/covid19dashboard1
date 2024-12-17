import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {API_URL} from '../../constants'
import './index.css'

class StateSpecific extends Component {
  state = {
    stateDetails: {},
    districtsData: [],
    lastUpdated: '',
    tested: 0,
    isLoading: true,
  }

  componentDidMount() {
    this.fetchStateData()
  }

  fetchStateData = async () => {
    const {match} = this.props
    const {stateId} = match.params

    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      const stateData = data[stateId]

      if (!stateData) return

      const {
        meta: {last_updated: lastUpdated},
        total: {confirmed = 0, deceased = 0, recovered = 0, tested = 0},
        districts,
      } = stateData

      const activeCases = confirmed - (recovered + deceased)
      const districtsList = Object.entries(districts || {}).map(
        ([districtName, districtDetails]) => ({
          name: districtName,
          count: districtDetails?.total?.confirmed || 0,
        }),
      )

      this.setState({
        stateDetails: {
          confirmed,
          deceased,
          recovered,
          active: activeCases,
        },
        districtsData: districtsList,
        lastUpdated,
        tested,
        isLoading: false,
      })
    } catch (error) {
      console.error('Error fetching state data:', error)
    }
  }

  renderStatsCard = (label, count, color, iconAlt, iconSrc, testId) => (
    <div
      className='stats-card'
      style={{borderColor: color}}
      data-testid={testId}
    >
      <p className='stats-label' style={{color}}>
        {label}
      </p>
      <img src={iconSrc} alt={iconAlt} className='stats-icon' />
      <p className='stats-count' style={{color}}>
        {count}
      </p>
    </div>
  )

  renderDistrictGroup = (districts, groupIndex) => (
    <div key={groupIndex} className='district-group'>
      {districts.map((district, index) => (
        <div key={index} className='district-card'>
          <p className='district-count'>{district.count}</p>
          <p className='district-name'>{district.name}</p>
        </div>
      ))}
    </div>
  )

  render() {
    const {stateDetails, districtsData, lastUpdated, tested, isLoading} =
      this.state

    if (isLoading) {
      return (
        <div className='loader-container' data-testid='stateDetailsLoader'>
          <Loader type='ThreeDots' color='#007BFF' height={80} width={80} />
        </div>
      )
    }

    const {confirmed, active, recovered, deceased} = stateDetails

    // Group districts into chunks of 4
    const districtGroups = []
    for (let i = 0; i < districtsData.length; i += 4) {
      districtGroups.push(districtsData.slice(i, i + 4))
    }

    return (
      <div className='state-specific-container'>
        <div className='state-header'>
          <h1 className='state-title'>Covid-19 Cases</h1>
          <p className='last-updated'>
            Last update on {new Date(lastUpdated).toLocaleDateString()}
          </p>
          <p className='tested' data-testid='testedCount'>
            Tested: {tested.toLocaleString()}
          </p>
        </div>
        <div className='stats-container'>
          {this.renderStatsCard(
            'Confirmed',
            confirmed,
            '#FF073A',
            'state specific confirmed cases pic',
            'https://res.cloudinary.com/dtzems9yl/image/upload/v1734324416/check-mark1_affzqv.png',
            'stateSpecificConfirmedCasesContainer',
          )}
          {this.renderStatsCard(
            'Active',
            active,
            '#007BFF',
            'state specific active cases pic',
            'https://res.cloudinary.com/dtzems9yl/image/upload/v1734324397/protection1_o9dnux.png',
            'stateSpecificActiveCasesContainer',
          )}
          {this.renderStatsCard(
            'Recovered',
            recovered,
            '#28A745',
            'state specific recovered cases pic',
            'https://res.cloudinary.com/dtzems9yl/image/upload/v1734324363/recovered1_t7awgo.png',
            'stateSpecificRecoveredCasesContainer',
          )}
          {this.renderStatsCard(
            'Deceased',
            deceased,
            '#6C757D',
            'state specific deceased cases pic',
            'https://res.cloudinary.com/dtzems9yl/image/upload/v1734324283/breathing1_q3o3jw.png',
            'stateSpecificDeceasedCasesContainer',
          )}
        </div>
        <div className='districts-container'>
          <h2 className='districts-title'>Top Districts</h2>
          <div className='districts-grid'>
            {districtGroups.map((group, index) =>
              this.renderDistrictGroup(group, index),
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(StateSpecific)
