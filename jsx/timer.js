import React from 'react';
import moment from 'moment';

class Timer extends React.Component {

  constructor() {
    super();
    this.state = {
      currTime: moment()
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        currTime: moment()
      });
    }, 1000);
  }

  render() {
    return (
      <div className="timer">
        Current <i className="far fa-clock"></i> {this.state && this.state.currTime.format('MMMM Do YYYY, h:mm:ss a')}
      </div>
    );
  }
}

export default Timer;
