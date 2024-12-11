import {Component} from 'react'
import './index.css'

class About extends Component {
  state = {
    faqs: [],
    isLoading: true,
  }

  componentDidMount() {
    this.fetchFaqs()
  }

  fetchFaqs = async () => {
    try {
      const response = await fetch('https://apis.ccbp.in/covid19-faqs')
      const data = await response.json()
      this.setState({faqs: data.faq, isLoading: false})
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    }
  }

  renderFaqs = () => {
    const {faqs} = this.state
    return faqs.map(({qno, question, answer}) => (
      <div key={qno} className="faq-item">
        <h3 className="faq-question">{question}</h3>
        <p className="faq-answer">{answer}</p>
      </div>
    ))
  }

  render() {
    const {isLoading} = this.state

    return (
      <div className="about-container">
        <h1 className="about-heading">About</h1>
        <p className="last-update">Last update on March 28th 2021</p>
        <p className="intro-text">
          COVID-19 vaccines be ready for distribution
        </p>

        {isLoading ? (
          <div className="loader-container">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="faqs-container">{this.renderFaqs()}</div>
        )}
      </div>
    )
  }
}

export default About
