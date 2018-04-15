import React from 'react';
import PropTypes from 'prop-types';

class CronTask extends React.Component {
  render() {
    const iconClass = !this.props.firing ? "icon" : "icon red";
    return (
      <div className="cron-task">
        <div>
          <div className={iconClass}>
            <i className="fas fa-tasks"></i>
          </div>
        </div>
        <div>
          <div className="name">
            {this.props.name}
          </div>
          <div className="details">
            {this.props.next
              && (<span>
                    <i className="far fa-clock"></i>{' '}
                  </span>)
            }
            {this.props.next || this.props.cronString}
          </div>
        </div>
      </div>
    )
  }
}

CronTask.propTypes = {
  name: PropTypes.string,
  cronString: PropTypes.string,
  next: PropTypes.string,
  firing: PropTypes.bool
}

export default CronTask;
