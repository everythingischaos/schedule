//check if browser supports storage
let hasStorage = false;
if (typeof Storage !== 'undefined') {
  hasStorage = true;
} else {
  hasStorage = false;
}

//the default schedule
let defaultAllSchedules = JSON.parse(
  '{"A":[{"name":"1","start":"8:30","end":"9:20"},{"name":"2","start":"9:25","end":"10:20"},{"name":"3","start":"10:25","end":"11:15"},{"name":"Break","start":"11:15","end":"11:30"},{"name":"4","start":"11:35","end":"12:25"},{"name":"5","start":"12:30","end":"13:20"},{"name":"Lunch","start":"13:20","end":"13:50"},{"name":"6","start":"13:55","end":"14:45"},{"name":"7","start":"14:50","end":"15:40"}],"E":[{"name":"1","start":"8:30","end":"9:20"},{"name":"2","start":"9:25","end":"10:55"},{"name":"Break","start":"10:55","end":"11:10"},{"name":"Tutorial","start":"11:15","end":"12:00"},{"name":"4","start":"12:05","end":"13:35"},{"name":"Lunch","start":"13:35","end":"14:05"},{"name":"6","start":"14:10","end":"15:40"}],"O":[{"name":"1","start":"8:30","end":"9:20"},{"name":"3","start":"9:25","end":"10:55"},{"name":"Break","start":"10:55","end":"11:10"},{"name":"5","start":"11:15","end":"12:45"},{"name":"Lunch","start":"12:45","end":"13:15"},{"name":"7","start":"13:20","end":"14:50"}],"SA":[{"name":"1","start":"8:30","end":"9:25"},{"name":"3","start":"9:30","end":"10:45"},{"name":"Rally","start":"10:50","end":"11:25"},{"name":"Break","start":"11:25","end":"11:40"},{"name":"5","start":"11:45","end":"13:00"},{"name":"Lunch","start":"13:00","end":"13:30"},{"name":"7","start":"13:35","end":"14:50"}],"LA":[{"name":"1","start":"8:30","end":"9:15"},{"name":"3","start":"9:20","end":"10:30"},{"name":"Assembly","start":"10:35","end":"11:35"},{"name":"Break","start":"11:35","end":"11:50"},{"name":"5","start":"11:55","end":"13:05"},{"name":"Lunch","start":"13:05","end":"13:35"},{"name":"7","start":"13:40","end":"14:50"}],"NS":"none"}'
);

let days = JSON.parse(
  '["A","E","O","E","O"]'
)

let latestIntervalID;

//used to change the time for debugging
function newDebugDate() {
  let date = new Date();

  let hours = 0;
  let minutes = hours * 60 + 0;
  let seconds = minutes * 60 + 0;
  let ms = seconds * 1000 + 0;
  date.setTime(date.getTime() + ms);
  return date;
}

let override;
let nextTime;

function checkForChanges() {
  //get the schedule json in case it's been updated
  fetch(
    'https://everythingischaos.com/schedule-data/schedules.json?=' +
      Math.floor(Math.random() * 1000),
    { cache: 'no-store' }
  ).then(
    async (data) => {
      const response = await data.json();
      if (JSON.stringify(response) != JSON.stringify(defaultAllSchedules)) {
        defaultAllSchedules = response;
      }
    },
    () => {
      // showAlert('Network error, schedule might not be up to date');
    }
  );

  //do the days of the week i guess
  fetch(
    'https://everythingischaos.com/schedule-data/days.json?=' +
      Math.floor(Math.random() * 1000),
    { cache: 'no-store' }
  ).then(
    async (data) => {
      const response = await data.json();
      if (JSON.stringify(response) != JSON.stringify(days)) {
        days = response;
      }
    },
    () => {
      // showAlert('Network error, schedule might not be up to date');
    }
  );

  //get the override data for rallies and stuff
  fetch(
    'https://everythingischaos.com/schedule-data/overrides.json?=' +
      Math.floor(Math.random() * 1000),
    { cache: 'no-store' }
  ).then(
    async (data) => {
      const response = await data.json();
      if (JSON.stringify(response) != JSON.stringify(override)) {
        override = response;
        console.log("override received");
      }
    },
    () => {
      // showAlert('Network error, schedule might not be up to date');
    }
  );
  console.log("changing code bouta make the schedule");
  generateSchedule(defaultAllSchedules);
}

checkForChanges();
console.log("changes were checked");
setInterval(checkForChanges, 10000);

/**
 * Generate list of time events (start/ends)
 * @param {Object[]} allSchedules - Array of all schedules in the week
 */
function generateSchedule(allSchedules) {
  let dayNum = newDebugDate().getDay();
  let currentSchedule = allSchedules[days[dayNum - 1]];
  if (override) {
    console.log("there's an override yay!");
    const curDate = newDebugDate();
    const dateString = `${curDate.getDate()}-${
      curDate.getMonth() + 1
    }-${curDate.getFullYear()}`;

    if (override[dateString]) {
      currentSchedule = allSchedules[override[dateString]];
      console.log(currentSchedule);
    }
  }
  if (dayNum == 0 || dayNum == 6 || currentSchedule == "none") {
    document.querySelector('#timer').textContent = 'No school today!';
    console.log('no school and whatnot');
    return;
  } else {
    console.log("school?????");
    document.querySelector('#periods').innerHTML = '<tr><th>Period</th><th>Start</th><th>End</th></tr>';

    //will have the time events pushed to it
    let times = [];
    if (latestIntervalID) {
      clearInterval(latestIntervalID);
    }

    //for each period
    for (let i = 0; i < currentSchedule.length; i++) {
      let currentP = currentSchedule[i];

      //converts the 00:00 format to an actual date object, then turn it into a ms timestamp
      let start = timeStringToDate(currentP.start);
      let end = timeStringToDate(currentP.end);

      //push the start and end timestamps to times
      times.push({
        time: start.getTime(),
        name: 'Start of ' + currentP.name,
      });
      times.push({
        time: end.getTime(),
        name: 'End of ' + currentP.name,
      });

      let startAPM = start.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      let endAPM = end.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      //Add period to schedule in the DOM
      //Set user-define period title if it exists
      let pTitle;
      if (
        currentP.name != 'Break' &&
        currentP.name != 'Lunch' &&
        !currentP.name.includes('walkout') /**Temporary for protest */ &&
        getClassName(currentP.name)
      ) {
        pTitle = currentP.name + ': ' + getClassName(currentP.name);
      } else {
        //set it to default if there is no user-defined title
        pTitle = currentP.name;
      }

      //Create table row
      let tr = '<tr';
      if (currentP.name.includes('walkout')) {
        tr += ' class="walkout"';
      } else if (currentP.name == 'Break' || currentP.name == 'Lunch') {
        tr += ' class="break"';
      } else {
        tr += ' value=' + currentP.name;
      }
      tr += `>
      <td>${pTitle}</td>
      <td>${startAPM}</td>
      <td>${currentP.name.includes('walkout') ? '~' : ''}${endAPM}</td>
    </tr>`;
      document.getElementById('periods').innerHTML += tr;
    }

    // $('.pinput').each(function (i) {
    //   $(this).val(getClassName(String(i + 1)));
    // });
    document.querySelectorAll('.pinput').forEach((el, i) => {
      const name = getClassName(String(i + 1));
      el.value = name ? name : '';
    })

    //Render timer every 1 ms
    latestIntervalID = setInterval(renderTimer, 1, times, dayNum);
  }
}

/**
 * Get the user-defined title of a period from the system-defined one (dependent on date)
 * @param {string} period - The system-defined title for a period ('1', '5', 'Break', etc.)
 * @returns {(string|undefined)} The user-defined title if storage is supported and there is one
 */
function getClassName(period) {
  //If the period isn't Lunch or Break, and the browser allows appStorage
  if (hasStorage) {
    //if it does, get the name of the period if it exists
    return localStorage.getItem(period)
      ? localStorage.getItem(period)
      : undefined;
  } else {
    return undefined;
  }
}

//Create original schedule
generateSchedule(defaultAllSchedules);

/**
 * Converts 00:00 to date object (dependent on date)
 * @param {string} timeString - The time in HH:SS format
 * @returns {Date} The parsed time in the current day at the given time
 */
function timeStringToDate(timeString) {
  //create a new date object for current time
  let output = newDebugDate();

  //create array of x:y [x, y]
  let numbers = timeString.split(':');

  //set the time of the date object to the numbers with curent date and 0 ms
  output.setHours(numbers[0], numbers[1], 0);
  return output;
}

/**
 * Find the next event (start/end of period/break)
 * @param {Object[]} timesList - Array of all the time events with timestamp
 * @param {number} timesList[].time - Unix timestamp of the event
 * @param {string} timesList[].name - System-defined name for the event
 * @returns Returns object with the next event's timestamp and name
 */
function findNext(timesList) {
  //create current date
  let curDate = newDebugDate();

  //for every event, check to see if it's passed
  for (let i = 0; i < timesList.length; i++) {
    //if the current time is before the event time, break the loop and return it
    if (timesList[i].time >= curDate.getTime()) {
      return timesList[i];
    }
  }

  //if all events have passed, return undefined
  return undefined;
}

//set the next event
let prevSec = 0;
let prevNext = 0;

/**
 * Render the timer till next event
 * @param {Object} nextEvent - Object containing the next event's info
 * @param {number} nextEvent.time - Unix timestamp of the event
 * @param {string} nextEvent.name - System-defined name for the event
 */
function renderTimer(times, dayNum) {
  if (dayNum != newDebugDate().getDay()) {
    generateSchedule(defaultAllSchedules);
  }

  nextTime = findNext(times);

  //Set current date
  let curDate = newDebugDate();

  //define timer element
  let timerDOM = document.getElementById('timer');

  //if there is an event coming up
  if (nextTime) {
    //check if the event is still ahead and not past
    let difference = nextTime.time - curDate.getTime();

    //Set text to set the timer to, parsed with the msToTime thing
    let text = msToTime(difference);
    if (document.visibilityState == 'visible') {
      //Set timer object to the data returned

      timerDOM.innerHTML =
        text.minutes + ':' + text.seconds + '.' + text.milliseconds;
      if (prevNext != nextTime) {
        document.querySelector('#next').textContent = (
          'Until ' +
            nextTime.name +
            (getClassName(nextTime.name.slice(-1))
              ? ': ' + getClassName(nextTime.name.slice(-1))
              : '')
        );
        prevNext = nextTime;
      }
    }

    if (prevSec != text.seconds) {
      //set the title to the time
      // if (document.visibilityState == "visible") {
      document.title = text.minutes + ':' + text.seconds;
      // } else {
      //   document.title = text.minutes + ":" + String(parseInt(text.seconds)-1);
      // }

      //set the prev seconds to the latest second
      prevSec = text.seconds;
    }
  } else {
    //if there is no event coming up, display text
    timerDOM.innerText = 'School\'s Out!';
    document.title = 'School\'s Out!';
  }
}

/**
 * Converts MS to Minutes, Seconds, and Milliseconds
 * @param {number} duration - The time in MS to convert to m, s, and ms
 * @returns Object containing the minutes, seconds, and ms
 */
function msToTime(duration) {
  //find the ms, seconds, and minutes
  var milliseconds = Math.floor(duration % 1000),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor(duration / (1000 * 60));

  //add 0 to beginning of numbers if it's only one digit
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  milliseconds =
    milliseconds < 100
      ? milliseconds < 10
        ? '00' + milliseconds
        : '0' + milliseconds
      : milliseconds;

  return {
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds,
  };
}

//show the naming menu to change names of periods
document.querySelector('#shownaming').addEventListener('click', () => {
  const naming = document.querySelector('#naming');
  if(naming.classList.contains('hidden')) {
    document.querySelector('#naming').classList.add('shown');
    document.querySelector('#naming').classList.remove('hidden');
  } else if(naming.classList.contains('shown')) {
    document.querySelector('#naming').classList.add('hidden');
    document.querySelector('#naming').classList.remove('shown');
  }
});

//change period name on input
document.querySelectorAll('.pinput').forEach(el => {
  el.addEventListener('input', (e) => {
    let input = e.target;
    setClassName(input.attributes.id.value[1], input.value);
  });
})

/**
 * Change a class name
 * @param {string} period - The system-defined period name to change
 * @param {string} className - The user-defined name to change it to
 */
function setClassName(period, className) {
  //only changes if there is local storage enabled
  if (hasStorage) {
    const el = document.querySelector(`tr[value="${period}"] td:nth-child(1)`)
    //if there is an actual class name, set the name
    if (className && className != '') {
      localStorage.setItem(period, className);
      if(el) {
        el.textContent = period + ': ' + className;
      }
    } else {
      //if not, remove it and reset the schedule
      localStorage.removeItem(period);
      if(el) {
        el.textContent = period;
      }
    }
  }
}

// let alertHidden = false;
// function showAlert(text) {
//   if (!alertHidden) {
//     const alert = document.querySelector('.alert')
//     document.querySelector('#alert-text').textContent = text;
//     if(!alert.classList.contains('alert-visible')) {
//       alert.classList.add('alert-visible');
//     }
//   }
// }

// document.querySelector('#alert-close').addEventListener('click', () => {
//   document.querySelector('.alert').classList.remove('alert-visible')
//   alertHidden = true;
// })