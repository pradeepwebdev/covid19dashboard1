import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { API_URL, API_URL_STATE } from '../../constants';
import './index.css';

class StateSpecific extends Component {
  state = {
    stateDetails: {},
    districtsData: [],
    lastUpdated: '',
    tested: 0,
    isLoading: true,
    chartData: [],
    timelineData: [],
  };

  componentDidMount() {
    this.fetchStateData();
    this.fetchStateTimelineData();
  }

  fetchStateData = async () => {
    const { match } = this.props;
    const { stateId } = match.params;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const stateData = data[stateId];

      if (!stateData) return;

      const {
        meta: { last_updated: lastUpdated },
        total: { confirmed = 0, deceased = 0, recovered = 0, tested = 0 },
        districts,
      } = stateData;

      const activeCases = confirmed - (recovered + deceased);
      const districtsList = Object.entries(districts || {}).map(
        ([districtName, districtDetails]) => ({
          name: districtName,
          count: districtDetails?.total?.confirmed || 0,
        })
      );

      const chartData = [
        { name: 'Day 1', confirmed, active: activeCases, recovered, deceased },
        {
          name: 'Day 2',
          confirmed: confirmed + 1000,
          active: activeCases + 500,
          recovered: recovered + 800,
          deceased: deceased + 100,
        },
        {
          name: 'Day 3',
          confirmed: confirmed + 2000,
          active: activeCases + 1000,
          recovered: recovered + 1500,
          deceased: deceased + 200,
        },
      ];

      this.setState({
        stateDetails: {
          confirmed,
          active: activeCases,
          recovered,
          deceased,
          tested,
          lastUpdated,
        },
        districtsData: districtsList,
        lastUpdated,
        tested,
        chartData,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };

  fetchStateTimelineData = async () => {
    const { match } = this.props;
    const { stateId } = match.params;

    try {
      const response = await fetch(`${API_URL_STATE}/${stateId}`);
      const data = await response.json();
      const stateTimeline = data[stateId]?.dates || {};

      const formattedData = Object.keys(stateTimeline).map(date => {
        const { confirmed = 0, deceased = 0, recovered = 0 } = stateTimeline[date]?.total || {};
        return {
          date,
          confirmed,
          deceased,
          recovered,
          active: confirmed - (recovered + deceased),
        };
      });

      this.setState({ timelineData: formattedData });
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    }
  };

  renderStatsCard = (label, count, color, iconAlt, iconSrc, testId) => (
    <div className="stats-card" style={{ borderColor: color }} data-testid={testId}>
      <p className="stats-label" style={{ color }}>
        {label}
      </p>
      <img src={iconSrc} alt={iconAlt} className="stats-icon" />
      <p className="stats-count" style={{ color }}>
        {count}
      </p>
    </div>
  );

  renderDistrictGroup = (districts, groupIndex) => (
    <div key={groupIndex} className="district-group">
      {districts.map(district => (
        <div key={district.name} className="district-card">
          <p className="district-count">{district.count}</p>
          <p className="district-name">{district.name}</p>
        </div>
      ))}
    </div>
  );

  renderLineChart = () => {
    const { timelineData } = this.state;
    return (
      <div className="line-charts-wrapper">
        <h2 className="chart-title left-aligned">Daily Spread Trends</h2>
        <div className="line-charts-container">
          <LineChart
            width={730}
            height={250}
            data={timelineData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="date" stroke="#007BFF" axisLine={{ stroke: '#007BFF' }} />
            <YAxis axisLine={{ stroke: '#007BFF' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="active" stroke="#007BFF" />
          </LineChart>
        </div>
      </div>
    );
  };

  renderBarChart = () => {
    const { chartData } = this.state;
    return (
      <div className="bar-charts-container" data-testid="barChartsContainer">
        <BarChart width={1032} height={431} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="confirmed" fill="#FF073A" />
          <Bar dataKey="active" fill="#007BFF" />
          <Bar dataKey="recovered" fill="#28A745" />
          <Bar dataKey="deceased" fill="#6C757D" />
        </BarChart>
      </div>
    );
  };

  render() {
    const { stateDetails, districtsData, lastUpdated, tested, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="loader-container" data-testid="stateDetailsLoader">
          <Loader type="ThreeDots" color="#007BFF" height={80} width={80} />
        </div>
      );
    }

    const { confirmed, active, recovered, deceased } = stateDetails;

    const districtGroups = [];
    for (let i = 0; i < districtsData.length; i += 4) {
      districtGroups.push(districtsData.slice(i, i + 4));
    }

    return (
      <div className="state-specific-container">
        <div className="state-header">
          <h1 className="state-title">Covid-19 Cases</h1>
          <p className="last-updated">
            Last update on {new Date(lastUpdated).toLocaleDateString()}
          </p>
          <p className="tested" data-testid="testedCount">
            Tested: {tested.toLocaleString()}
          </p>
        </div>
        <div className="stats-container">
          {this.renderStatsCard(
            'Confirmed',
            confirmed,
            '#FF073A',
            'state specific confirmed cases pic',
            'https://res.cloudinary.com/dtzems9yl/image/upload/v1734324416/check-mark1_affzqv.png',
            'stateSpecificConfirmedCasesContainer'
          )}
          {this.renderStatsCard(
            'Active',
            active,
            '#007BFF',
            'state specific active cases pic',
            'https://res.cloudinary.com/dtzems9yl/image/upload/v1734324397/protection1_o9dnux.png',
            'stateSpecificActiveCasesContainer'
          )}
          {this.renderStatsCard(
            'Recovered',
            recovered,
            '#28A745',
            'state specific recovered cases pic',
            'https://res.cloudinary.com/dtzems9yl/image/upload/v1734324363/recovered1_t7awgo.png',
            'stateSpecificRecoveredCasesContainer'
          )}
          {this.renderStatsCard(
            'Deceased',
            deceased,
            '#6C757D',
            'state specific deceased cases pic',
            'https://res.cloudinary.com/dtzems9yl/image/upload/v1734324283/breathing1_q3o3jw.png',
            'stateSpecificDeceasedCasesContainer'
          )}
        </div>
        <div className="districts-container">
          <h2 className="districts-title">Top Districts</h2>
          <div className="districts-grid">
            {districtGroups.map((group, index) => this.renderDistrictGroup(group, index))}
          </div>
        </div>
        {this.renderBarChart()}
        {this.renderLineChart()}
      </div>
    );
  }
}

export default withRouter(StateSpecific);
