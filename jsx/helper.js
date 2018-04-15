const CronJob = require('cron').CronJob;
const moment = require('moment');
const axios = require('axios');
const _ = require('lodash');

// Api call
exports.getCronData = function(url) {
  return axios.get(url)
          .then(d => { return d; })
          .catch(e => { throw e; });
};
// Parse cron string to CronJob
exports.cronParse = function(cronExpression, timeZone = "America/Los_Angeles") {
  return new CronJob(cronExpression, function() {}, null, true, timeZone);
};
// Checks status of cron job, returns true if job will run between start and end time
exports.getValidJob = function(cronExpression, startTime, endTime, cronParse) {
  let timeZone;
  let timeCheck;
  if (startTime.format() === moment().format()) {
    timeZone = "America/Los_Angeles";
    timeCheck = endTime;
  } else {
    timeZone = "Pacific/Honolulu";
    timeCheck = startTime;
  }
  const job = cronParse(cronExpression, timeZone);
  if (job !== null && job.nextDate() <= timeCheck) {
    return job;
  } else {
    return null;
  }
};
// Add * to cron expression shorter than 5
exports.makeCronFive = function(cronExpression) {
  const cronArray = cronExpression.split(' ');
  if (cronArray.length < 5) {
    let diff = 5 - cronArray.length;
    while (diff > 0) {
      diff -= 1;
      cronArray.push('*');
    }
  }
  return cronArray.join(' ');
}
// Send notification
exports.sendNotification = function(message) {
  if (Notification.permission === 'granted') {
    let notification = new Notification(message);
  }
}
