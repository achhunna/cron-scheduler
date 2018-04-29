import React from 'react';
import ReactDOM from 'react-dom';
import Timer from './timer';
import CronTask from './cron-task';
import moment from 'moment';
import { getCronData, cronParse, getValidJob, makeCronFive, sendNotification } from './helper';
import _ from 'lodash';
import cronstrue from 'cronstrue';

class App extends React.Component {

  constructor() {
    super();
    this.generateTasks = this.generateTasks.bind(this);
  }

  componentDidMount() {
    getCronData('https://scheduler-challenge.herokuapp.com/schedule')
      .then(d => { this.setState({
          cronData: d.data.data
        });
      })
      .catch(e => { console.log(e); });
    if(Notification && Notification.permission === 'default') {
      Notification.requestPermission(function(permission) {
        if(!('permission' in Notification)) {
          Notification.permission = permission;
        }
      });
    }
  }

  generateTasks(title, startTime, endTime) {
    const getTasks = (cronData) => {
      return _.reduce(cronData, (results, d) => {
        if (d.type === "task") {
          const job = getValidJob(d.attributes.cron, startTime, endTime, cronParse);
          if (job !== null) {
            if (job.nextDate().format('MMMM Do YYYY, h:mm a') === moment().format('MMMM Do YYYY, h:mm a')) {
              sendNotification(`Task Alert: ${d.attributes.name}`);
            }
            results.push((
              <CronTask name={d.attributes.name}
                        next={job.nextDate().format('MMMM Do YYYY, h:mm a')}
                        key={d.id}
                        firing={false}
              />
          ));
          }
        }
        return results;
      }, []);
    };
    return (this.state && this.state.cronData)
    ? (
        <div className="category">
          <h3 className="center">{title}</h3>
          {_.isEmpty(getTasks(this.state.cronData))
            ? (<div className="no-task">
                <i className="fas fa-check-circle"></i> No tasks
              </div>)
            : getTasks(this.state.cronData)}
        </div>
      )
    : (<div>loading...</div>);
  }

  render() {
    const prevHours = moment().subtract(3, "hours");
    const nextHours = moment().add(24, "hours");
    const allTasks = (this.state && this.state.cronData)
    ? (
        <div className="category">
          <h3 className="center">All Tasks</h3>
          {_.reduce(this.state.cronData, (results, d) => {
            if(d.type === "task") {
              const cronString = cronstrue.toString(makeCronFive(d.attributes.cron));
              results.push((
                <CronTask name={d.attributes.name}
                          cronString={cronString}
                          key={d.id}
                          firing={false}
                />
              ));
            }
            return results;
          }, [])}
        </div>
      )
    : (<div>loading...</div>);
    const prevTasks = this.generateTasks("Last 3 hours", prevHours, moment());
    const nextTasks = this.generateTasks("Next 24 hours", moment(), nextHours);
    return(
      <div>
        <Timer />
        <div className="intro">
          <p>
            Below is a list of tasks generated from <a href="http://www.nncron.ru/help/EN/working/cron-format.htm">cron expression</a>. Tasks which happened 3 hours ago and those occurring in the next 24 hours are calculated based on current Pacific Standard Time.
          </p>
          <table className="table table-bordered table-sm">
            <thead>
              <tr>
                <td>Source</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>API</td>
                <td><a href="https://scheduler-challenge.herokuapp.com/schedule">Cron Scheduler</a></td>
              </tr>
              <tr>
                <td>Libraries used</td>
                <td><a href="https://www.npmjs.com/package/cron">cron</a>, <a href="https://www.npmjs.com/package/cronstrue">cronstrue</a>, <a href="https://momentjs.com/">Moment.js</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="main-container">
          {prevTasks}
          {allTasks}
          {nextTasks}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
