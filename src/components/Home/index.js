import {Component} from 'react'
import {Link} from 'react-router-dom'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import {BsSearch} from 'react-icons/bs'
import {API_URL} from '../../constants'
import './index.css'

class Home extends Component {
  state = {
    statesData: [],
    filteredData: [],
    searchTerm: '',
    loading: true,
  }

  componentDidMount() {
    this.fetchStatesData()
  }

  fetchStatesData = async () => {
    const response = await fetch(API_URL)
    const data = await response.json()

    const statesList = Object.keys(data).map(stateCode => ({
      stateCode,
      stateName: stateCode,
      confirmed: data[stateCode]?.total?.confirmed || 0,
      active:
        (data[stateCode]?.total?.confirmed || 0) -
        ((data[stateCode]?.total?.recovered || 0) +
          (data[stateCode]?.total?.deceased || 0)),
      recovered: data[stateCode]?.total?.recovered || 0,
      deceased: data[stateCode]?.total?.deceased || 0,
      population: data[stateCode]?.meta?.population || 0,
    }))

    this.setState({
      statesData: statesList,
      filteredData: statesList,
      loading: false,
    })
  }

  handleSearch = event => {
    const {statesData} = this.state
    const searchTerm = event.target.value.toLowerCase()
    const filteredData = statesData.filter(state =>
      state.stateName.toLowerCase().includes(searchTerm),
    )
    this.setState({searchTerm, filteredData})
  }

  sortStates = order => {
    const {filteredData} = this.state
    const sortedData = [...filteredData].sort((a, b) =>
      order === 'asc'
        ? a.stateName.localeCompare(b.stateName)
        : b.stateName.localeCompare(a.stateName),
    )
    this.setState({filteredData: sortedData})
  }

  render() {
    const {filteredData, searchTerm, loading} = this.state

    return (
      <div className="home-container">
        {loading ? (
          <div data-testid="homeRouteLoader" className="loader">
            Loading...
          </div>
        ) : (
          <>
            <div className="search-and-sort-container">
              <div className="search-box">
                <BsSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter the state"
                  value={searchTerm}
                  onChange={this.handleSearch}
                />
              </div>
            </div>

            {/* Stats container */}
            <div className="stats-container">
              <div className="stat-box">
                <p className="stat-title" style={{color: '#FF073A'}}>
                  Confirmed
                </p>
                <div className="stat-value-with-icon">
                  <img
                    src="https://res.cloudinary.com/dtzems9yl/image/upload/v1734324416/check-mark1_affzqv.png"
                    alt="Check Mark"
                    className="stat-icon"
                  />
                  <p className="stat-value" style={{color: '#FF073A'}}>
                    34285612
                  </p>
                </div>
              </div>
              <div className="stat-box">
                <p className="stat-title" style={{color: '#007BFF'}}>
                  Active
                </p>
                <div className="stat-value-with-icon">
                  <img
                    src="https://res.cloudinary.com/dtzems9yl/image/upload/v1734324397/protection1_o9dnux.png"
                    alt="Protection"
                    className="stat-icon"
                  />
                  <p className="stat-value" style={{color: '#007BFF'}}>
                    165803
                  </p>
                </div>
              </div>
              <div className="stat-box">
                <p className="stat-title" style={{color: '#28A745'}}>
                  Recovered
                </p>
                <div className="stat-value-with-icon">
                  <img
                    src="https://res.cloudinary.com/dtzems9yl/image/upload/v1734324363/recovered1_t7awgo.png"
                    alt="Recovered"
                    className="stat-icon"
                  />
                  <p className="stat-value" style={{color: '#28A745'}}>
                    33661339
                  </p>
                </div>
              </div>
              <div className="stat-box">
                <p className="stat-title" style={{color: '#6C757D'}}>
                  Deceased
                </p>
                <div className="stat-value-with-icon">
                  <img
                    src="https://res.cloudinary.com/dtzems9yl/image/upload/v1734324283/breathing1_q3o3jw.png"
                    alt="breathing"
                    className="stat-icon"
                  />
                  <p className="stat-value" style={{color: '#6C757D'}}>
                    458470
                  </p>
                </div>
              </div>
            </div>

            {/* Table to display state-wise data */}
            <div
              className="state-wise-data"
              data-testid="stateWiseCovidDataTable"
            >
              <table>
                <thead>
                  <tr>
                    <th className="states-column">
                      <div className="header-with-sort">
                        <span>States/UT</span>
                        <div className="sort-icons">
                          <button
                            type="button"
                            data-testid="ascendingSort"
                            onClick={() => this.sortStates('asc')}
                          >
                            <FcGenericSortingAsc />
                          </button>
                          <button
                            type="button"
                            data-testid="descendingSort"
                            onClick={() => this.sortStates('desc')}
                          >
                            <FcGenericSortingDesc />
                          </button>
                        </div>
                      </div>
                    </th>
                    <th>Confirmed</th>
                    <th>Active</th>
                    <th>Recovered</th>
                    <th>Deceased</th>
                    <th>Population</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(state => (
                    <tr key={state.stateCode} data-testid="stateDataListItem">
                      <td>
                        <Link
                          to={`/state/${state.stateCode}`}
                          className="state-link"
                        >
                          {state.stateName}
                        </Link>
                      </td>
                      <td>{state.confirmed}</td>
                      <td>{state.active}</td>
                      <td>{state.recovered}</td>
                      <td>{state.deceased}</td>
                      <td>{state.population}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    )
  }
}

export default Home
