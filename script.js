window.onload = (e) => {
  const caasppView = document.getElementById("caaspp_view");
  const editView = document.getElementById("edit_view");
  const periodInputs = document.getElementsByClassName("pinput");

  caasppView.onclick = () => handleCaasppLabel();
  editView.onclick = () => handleEditLabel();
  for (let i = 0; i < periodInputs.length; i++) {
    periodInputs.item(i).oninput = (e) =>
      setClassName(
        parseInt(
          e.target.parentElement.previousElementSibling.textContent.slice(-1)
        ),
        e.target.value
      );

    periodInputs.item(i).onfocus = (e) => {
      e.target.parentElement.animate(
        {
          backgroundColor: "#313244",
        },
        { duration: 100, fill: "forwards" }
      );
      e.target.parentElement.style.border = "solid 1px #cba6f7";
    };

    periodInputs.item(i).addEventListener("focusout", (e) => {
      e.target.parentElement.animate(
        {
          backgroundColor: "#45475a",
        },
        { duration: 100, fill: "forwards" }
      );
      e.target.parentElement.style.border = "";
    });
  }

  //check if browser supports storage
  let hasStorage = typeof Storage !== "undefined";

  //the default schedule
  let allSchedules = JSON.parse(
    '{"A":[{"name":"1","start":"8:30","end":"9:20"},{"name":"2","start":"9:25","end":"10:20"},{"name":"3","start":"10:25","end":"11:15"},{"name":"Break","start":"11:15","end":"11:30"},{"name":"4","start":"11:35","end":"12:25"},{"name":"5","start":"12:30","end":"13:20"},{"name":"Lunch","start":"13:20","end":"13:50"},{"name":"6","start":"13:55","end":"14:45"},{"name":"7","start":"14:50","end":"15:40"}],"E":[{"name":"1","start":"8:30","end":"9:20"},{"name":"2","start":"9:25","end":"10:55"},{"name":"Break","start":"10:55","end":"11:10"},{"name":"Tutorial","start":"11:15","end":"12:00"},{"name":"4","start":"12:05","end":"13:35"},{"name":"Lunch","start":"13:35","end":"14:05"},{"name":"6","start":"14:10","end":"15:40"}],"O":[{"name":"1","start":"8:30","end":"9:20"},{"name":"3","start":"9:25","end":"10:55"},{"name":"Break","start":"10:55","end":"11:10"},{"name":"5","start":"11:15","end":"12:45"},{"name":"Lunch","start":"12:45","end":"13:15"},{"name":"7","start":"13:20","end":"14:50"}],"SA":[{"name":"1","start":"8:30","end":"9:25"},{"name":"3","start":"9:30","end":"10:45"},{"name":"Rally","start":"10:50","end":"11:25"},{"name":"Break","start":"11:25","end":"11:40"},{"name":"5","start":"11:45","end":"13:00"},{"name":"Lunch","start":"13:00","end":"13:30"},{"name":"7","start":"13:35","end":"14:50"}],"LA":[{"name":"1","start":"8:30","end":"9:15"},{"name":"3","start":"9:20","end":"10:30"},{"name":"Assembly","start":"10:35","end":"11:35"},{"name":"Break","start":"11:35","end":"11:50"},{"name":"5","start":"11:55","end":"13:05"},{"name":"Lunch","start":"13:05","end":"13:35"},{"name":"7","start":"13:40","end":"14:50"}],"NS":"none"}'
  );
  let days = JSON.parse('["A","E","O","E","O"]');

  let latestIntervalID;
  let overrideSchedules;
  let nextItem;
  let caasppScheduleIsEnabled = false;
  let editViewIsHidden = true;
  if (hasStorage)
    if (eval(localStorage.getItem("showCaaspp"))) handleCaasppLabel();
  if (caasppScheduleIsEnabled == null) caasppScheduleIsEnabled = false;

  //used to change the time for debugging
  function newDebugDate() {
    /*
    let date = new Date();
    let hours = 0;
    let minutes = hours * 60 + 0;
    let seconds = minutes * 60 + 0;
    let ms = seconds * 1000 + 0;
    date.setTime(date.getTime() + ms);
    */
    return new Date();
  }

  function checkForChanges() {
    //get the override data for rallies and stuff
    fetch(
      "https://everythingischaos.com/schedule-data/overrides.json?=" +
        Math.floor(Math.random() * 1000),
      { cache: "no-store" }
    ).then(
      async (data) => {
        const response = await data.json();
        if (JSON.stringify(response) != JSON.stringify(overrideSchedules)) {
          overrideSchedules = response;
          updateTable();
        }
      },
      () => {
        showAlert("Connection Lost");
      }
    );

    //get the schedule json in case it's been updated
    fetch(
      "https://everythingischaos.com/schedule-data/schedules.json?=" +
        Math.floor(Math.random() * 1000),
      { cache: "no-store" }
    ).then(
      async (data) => {
        const response = await data.json();
        if (JSON.stringify(response) != JSON.stringify(allSchedules)) {
          allSchedules = response;
          updateTable();
        }
      },
      () => {
        showAlert("Connection Lost");
      }
    );
  }

  checkForChanges();
  setInterval(checkForChanges, 10000);

  /**
   * Generate list of time events (start/ends)
   * @param {Object[]} allSchedules - Array of all schedules in the week
   */
  async function updateTable() {
    let date = new Date();
    let currentSchedule = allSchedules[days[date.getDay() - 1]];
    let caasppLoaded = false;
    if (caasppScheduleIsEnabled) {
      const scheduleId = `CAASPP_${date.getDate()}-${date.getMonth() + 1}`;

      if (scheduleId in allSchedules) {
        currentSchedule = allSchedules[scheduleId];
        caasppLoaded = true;
      }
    }
    if (overrideSchedules && !caasppLoaded) {
      const dateString = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;

      if (overrideSchedules[dateString]) {
        currentSchedule = allSchedules[overrideSchedules[dateString]];
        console.log(currentSchedule);
      }
    }
    if (date.getDay() == 0 || date.getDay() == 6 || currentSchedule == "none") {
      document.querySelector("#timer").textContent = "No school today!";
      return;
    }
    document
      .getElementById("periods")
      .parentElement.animate(
        {
          opacity: 0,
        },
        { duration: 300, fill: "forwards" }
      )
      .finished.then(() => {
        document.querySelector("#periods").innerHTML =
          "<tr><th>Period</th><th>Start</th><th>End</th></tr>";

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
            name: "Start of " + currentP.name,
          });
          times.push({
            time: end.getTime(),
            name: "End of " + currentP.name,
          });

          let startAPM = start.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          let endAPM = end.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          //Add period to schedule in the DOM
          //Set user-define period title if it exists
          let pTitle;
          if (
            parseInt(currentP.name.charAt(0)) != null &&
            getClassName(currentP.name)
          ) {
            console.log(parseInt(currentP.name.charAt(0)));
            console.log(currentP.name);
            pTitle = currentP.name + ": " + getClassName(currentP.name);
          } else {
            //set it to default if there is no user-defined title
            pTitle = currentP.name;
          }

          //Create table row
          let tr = "<tr";
          if (currentP.name == "Break" || currentP.name == "Lunch") {
            tr += ' class="break"';
          } else {
            tr += " value=" + currentP.name;
          }
          tr += `>
      <td>${pTitle}</td>
      <td>${startAPM}</td>
      <td>${endAPM}</td>
      </tr>`;
          document.getElementById("periods").innerHTML += tr;
        }

        // $('.pinput').each(function (i) {
        //   $(this).val(getClassName(String(i + 1)));
        // });
        for (let i = 0; i < periodInputs.length; i++) {
          periodInputs.item(i).value = getClassName(i + 1)
            ? getClassName(i + 1)
            : "";
        }

        //Render timer at 30 fps lol
        latestIntervalID = setInterval(renderTimer, 3.33, times, date.getDay());

        document.getElementById("periods").parentElement.animate(
          {
            opacity: 1,
          },
          { duration: 200, fill: "forwards" }
        );
      });
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

  /**
   * Converts 00:00 to date object (dependent on date)
   * @param {string} timeString - The time in HH:SS format
   * @returns {Date} The parsed time in the current day at the given time
   */
  function timeStringToDate(timeString) {
    //create a new date object for current time
    let output = newDebugDate();

    //create array of x:y [x, y]
    let numbers = timeString.split(":");

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
      updateTable();
    }

    nextItem = findNext(times);

    //Set current date
    let curDate = newDebugDate();

    //define timer element
    let timerDOM = document.getElementById("timer");

    //if there is an event coming up
    if (nextItem) {
      //check if the event is still ahead and not past
      let difference = nextItem.time - curDate.getTime();

      //Set text to set the timer to, parsed with the msToTime thing
      let text = msToTime(difference);
      if (document.visibilityState == "visible") {
        //Set timer object to the data returned
        /*
        if (msChecked)
          timerDOM.innerHTML =
            text.minutes + ":" + text.seconds + "." + text.milliseconds;
        else */
        timerDOM.innerHTML = text.minutes + ":" + text.seconds + "." + text.millisconds;
        if (prevNext != nextItem) {
          document.querySelector("#next").textContent =
            "Until " +
            nextItem.name +
            (getClassName(nextItem.name.charAt(0))
              ? ": " + getClassName(nextItem.name.charAt(0))
              : "");
          prevNext = nextItem;
        }
      }

      if (prevSec != text.seconds) {
        //set the title to the time
        // if (document.visibilityState == "visible") {
        document.title = text.minutes + ":" + text.seconds;
        // } else {
        //   document.title = text.minutes + ":" + String(parseInt(text.seconds)-1);
        // }

        //set the prev seconds to the latest second
        prevSec = text.seconds;
      }
    } else {
      //if there is no event coming up, display text
      timerDOM.innerText = "School's Out!";
      document.title = "School's Out!";
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
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds =
      milliseconds < 100
        ? milliseconds < 10
          ? "00" + milliseconds
          : "0" + milliseconds
        : milliseconds;

    /*
    if (msChecked)
      return {
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds,
      };
    */

    return {
      minutes: minutes,
      seconds: seconds,
      millisconds: milliseconds
    };
  }

  function handleCaasppLabel() {
    caasppScheduleIsEnabled = !caasppScheduleIsEnabled;
    localStorage.setItem("showCaaspp", caasppScheduleIsEnabled);
    console.log(caasppScheduleIsEnabled);
    caasppView.previousElementSibling.textContent = caasppScheduleIsEnabled
      ? "Hide CAASPP Schedule"
      : "Show CAASPP Schedule";
    caasppScheduleIsEnabled
      ? caasppView.previousElementSibling.classList.add("selected")
      : caasppView.previousElementSibling.classList.remove("selected");
    updateTable();
  }

  function handleEditLabel() {
    editViewIsHidden = !editViewIsHidden;
    console.log(editViewIsHidden);
    editView.previousElementSibling.textContent = editViewIsHidden
      ? "Edit Schedule"
      : "Close";
    editViewIsHidden
      ? editView.previousElementSibling.classList.remove("selected")
      : editView.previousElementSibling.classList.add("selected");

    const editingTable = document.querySelector("#edit");

    editingTable.animate(
      {
        opacity: editViewIsHidden ? 0 : 1
      },
      { duration: 100, fill: "forwards" }
    );
    editingTable.style.visibility = editViewIsHidden ? "hidden" : "visible"
  }

  /*
  //change period name on input
  document.querySelectorAll(".pinput").forEach((el) => {
    el.addEventListener("input", (e) => {
      let input = e.target;
      setClassName(input.attributes.id.value[1], input.value);
    });
  });
  */

  /**
   * Change a class name
   * @param {string} period - The system-defined period name to change
   * @param {string} className - The user-defined name to change it to
   */
  function setClassName(period, className) {
    //only changes if there is local storage enabled
    if (hasStorage) {
      const el = document.querySelector(
        `tr[value="${period}"] td:nth-child(1)`
      );
      //if there is an actual class name, set the name
      if (className && className != "") {
        localStorage.setItem(period, className);
        if (el) {
          el.textContent = period + ": " + className;
        }
      } else {
        //if not, remove it and reset the schedule
        localStorage.removeItem(period);
        if (el) {
          el.textContent = period;
        }
      }
    }
  }

  let alertHidden = false;
  function showAlert(text) {
    if (!alertHidden) {
      const alert = document.querySelector(".alert");
      document.querySelector("#alert-text").textContent = text;
      if (!alert.classList.contains("alert-visible")) {
        alert.classList.add("alert-visible");
      }
    }
  }

  document.querySelector("#alert-close").addEventListener("click", () => {
    document.querySelector(".alert").classList.remove("alert-visible");
    alertHidden = true;
  });
};
