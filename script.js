window.onload = () => {
  const themeSwitch = document.getElementById("theme_switch");
  const colorView = document.getElementById("color_view");
  const millisecondView = document.getElementById("millisecond_view");
  const editView = document.getElementById("edit_view");
  const periodInputs = document.getElementsByClassName("pinput");
  const colorViewLabel = document.getElementById("color_view_label");
  const colorMenu = document.getElementById("color_menu");
  const lightDarkLabel = document.getElementById("light_dark_label");
  const lightDarkIcons = lightDarkLabel.children;

  colorView.onclick = (ev) => handleColorViewClick(ev);
  themeSwitch.onclick = () => handleThemeClick();
  colorViewLabel.onmouseenter = () => {
    if (!colorViewLabel.classList.contains("selected"))
      rotateChildren(colorViewLabel, -15);
  };
  colorViewLabel.onmouseleave = () => {
    if (!colorViewLabel.classList.contains("selected"))
      rotateChildren(colorViewLabel, 15);
  };
  lightDarkLabel.onmouseenter = () => rotateChildren(lightDarkLabel, -15);
  lightDarkLabel.onmouseleave = () => rotateChildren(lightDarkLabel, 15);
  millisecondView.onclick = () => handleMillisecondClick();
  editView.onclick = () => handleEditClick();
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
          backgroundColor:
            document.documentElement.style.getPropertyValue("--surface0-hex"),
        },
        { duration: 100, fill: "forwards" }
      );
      e.target.parentElement.style.border = `solid 1px ${document.documentElement.style.getPropertyValue(
        "--accent-hex"
      )}`;
    };

    periodInputs.item(i).addEventListener("focusout", (e) => {
      e.target.parentElement.animate(
        {
          backgroundColor:
            document.documentElement.style.getPropertyValue("--surface1-hex"),
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
  let days = JSON.parse('["LA","TE","O","TE","O"]');

  // a bunch of random variables i should be sorting why haven't i done this yet
  let latestIntervalID;
  let overrideSchedules;
  let nextItem;
  let palette;
  let themeIDs = [];
  let accentColors = [];
  let recursiveAnimationInProgress = false;
  let colorViewIsHidden = true;
  let editViewIsHidden = true;
  let millisecondsAreEnabled = false;
  if (
    hasStorage &&
    localStorage.getItem("showMs") != null &&
    localStorage.getItem("showMs") != undefined
  )
    if (eval(localStorage.getItem("showMs"))) handleMillisecondClick();
  let accentColor = "mauve";
  if (
    hasStorage &&
    localStorage.getItem("accentColor") != null &&
    localStorage.getItem("accentColor") != undefined
  )
    accentColor = localStorage.getItem("accentColor");
  let themeID = "mocha";
  if (
    hasStorage &&
    localStorage.getItem("themeID") != null &&
    localStorage.getItem("themeID") != undefined
  )
    themeID = localStorage.getItem("themeID");

  function loadTheme() {
    if (palette == null) return;
    themeIDs = [];
    for (var key in palette) {
      themeIDs.push(key);
    }
    console.log(themeID);
    const selectedPalette = palette[themeID]["colors"];

    for (var key in selectedPalette) {
      document.documentElement.style.setProperty(
        `--${key}-hex`,
        selectedPalette[key]["hex"]
      );
    }

    document.documentElement.style.setProperty(
      "--accent-hex",
      selectedPalette[accentColor]["hex"]
    );
    document.documentElement.style.setProperty(
      "--accent-h",
      selectedPalette[accentColor]["hsl"]["h"]
    );
    document.documentElement.style.setProperty(
      "--accent-s",
      `${selectedPalette[accentColor]["hsl"]["s"] * 100}%`
    );
    document.documentElement.style.setProperty(
      "--accent-l",
      `${selectedPalette[accentColor]["hsl"]["l"] * 100}%`
    );

    for (let i = 0; i < lightDarkIcons.length; i++) {
      lightDarkIcons
        .item(i)
        .style.setProperty(
          "opacity",
          lightDarkIcons.item(i).id == themeID ? "100%" : "0%"
        );
    }
  }

  function populateColorMenu() {
    if (palette == null) return;

    colorMenu.innerHTML = "";

    accentColors = [];
    const selectedPalette = palette[themeID]["colors"];

    for (var key in selectedPalette) {
      if (!selectedPalette[key]["accent"]) continue;

      accentColors.push(key);

      let div = document.createElement("div");
      div.classList.add("color_option_container");
      if (key == accentColor) div.classList.add("selected");

      let label = document.createElement("label");
      label.classList.add("color_option_label");
      label.id = `${key}_label`;
      label.htmlFor = key;
      label.style.backgroundColor = `var(--${key}-hex)`;

      let input = document.createElement("input");
      input.id = key;
      input.type = "button";
      input.hidden = true;
      input.onclick = (ev) => handleColorOptionClick(ev);

      div.appendChild(label);
      div.appendChild(input);

      colorMenu.appendChild(div);
    }
  }

  function receivePalette() {
    fetch(
      "https://raw.githubusercontent.com/catppuccin/palette/main/palette.json"
    ).then(
      async (data) => {
        palette = await data.json();
        loadTheme();
        populateColorMenu();
      },
      () => {
        // load default theme or something
      }
    );
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
        // showError("Connection Lost");
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
        // showError("Connection Lost");
      }
    );
  }

  receivePalette();
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
    /*
    if (caasppScheduleIsEnabled) {
      const scheduleId = `CAASPP_${date.getDate()}-${date.getMonth() + 1}`;

      if (scheduleId in allSchedules) {
        currentSchedule = allSchedules[scheduleId];
        caasppLoaded = true;
      }
    }
    */
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
    let output = new Date();

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
    //for every event, check to see if it's passed
    for (let i = 0; i < timesList.length; i++) {
      //if the current time is before the event time, break the loop and return it
      if (timesList[i].time >= new Date().getTime()) {
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
    if (dayNum != new Date().getDay()) {
      updateTable();
    }

    nextItem = findNext(times);

    //define timer element
    let timerDOM = document.getElementById("timer");

    //if there is an event coming up
    if (nextItem) {
      //check if the event is still ahead and not past
      let difference = nextItem.time - new Date().getTime();

      //Set text to set the timer to, parsed with the msToTime thing
      let text = msToTime(difference);
      if (document.visibilityState == "visible") {
        //Set timer object to the data returned
        /*
        if (msChecked)
          timerDOM.innerHTML =
            text.minutes + ":" + text.seconds + "." + text.milliseconds;
        else */
        timerDOM.innerHTML = `${text.minutes}:${text.seconds}${
          millisecondsAreEnabled ? "." + text.millisconds : ""
        }`;
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

    return {
      minutes: minutes,
      seconds: seconds,
      millisconds: milliseconds,
    };
  }

  function handleColorViewClick() {
    if (recursiveAnimationInProgress) return;
    colorViewIsHidden = !colorViewIsHidden;
    colorMenu.style.height = colorViewIsHidden
      ? "0"
      : `${accentColors.length * 2.3 + accentColors.length * 0.3}rem`;
    colorMenu.style.padding = colorViewIsHidden ? "0" : "0.3rem";
    colorViewIsHidden
      ? colorViewLabel.classList.remove("selected")
      : colorViewLabel.classList.add("selected");
    document.documentElement.style.setProperty(
      "--current-easing",
      colorViewIsHidden
        ? "cubic-bezier(0.36, 0, 0.66, -0.56)"
        : "cubic-bezier(0.34, 1.56, 0.64, 1)"
    );
    recursiveAnimateOpacity(
      document.getElementsByClassName("color_option_container"),
      0,
      500,
      colorViewIsHidden ? true : false,
      colorViewIsHidden ? "0%" : "100%"
    );
    rotateChildren(colorViewLabel, 360);
  }

  function handleColorOptionClick(event) {
    if (
      event.target.id == accentColor ||
      !colorViewIsHidden ||
      recursiveAnimationInProgress
    )
      return;

    document
      .getElementById(`${accentColor}_label`)
      .parentElement.classList.remove("selected");
    accentColor = event.target.id;
    localStorage.setItem("accentColor", accentColor);
    event.target.parentElement.classList.add("selected");

    loadTheme();
  }

  function recursiveAnimateOpacity(
    elements,
    curIndex,
    duration,
    reverse,
    opacity
  ) {
    recursiveAnimationInProgress = true;
    if (curIndex >= elements.length || curIndex < 0) {
      recursiveAnimationInProgress = false;
      return;
    }

    elements.item(
      reverse ? elements.length - (curIndex + 1) : curIndex
    ).style.opacity = opacity;

    let interval =
      (duration / elements.length) *
      funnyEaseOutBackBecauseWhyNot((curIndex + 1) / elements.length);

    setTimeout(() => {
      recursiveAnimateOpacity(
        elements,
        curIndex + 1,
        duration,
        reverse,
        opacity
      );
    }, (0.5 * duration) / elements.length);
  }

  function handleThemeClick() {
    themeID = themeIDs[(themeIDs.indexOf(themeID) + 1) % themeIDs.length];
    localStorage.setItem("themeID", themeID);

    rotateChildren(lightDarkLabel, 360);
    loadTheme();
  }

  function handleMillisecondClick() {
    millisecondsAreEnabled = !millisecondsAreEnabled;
    localStorage.setItem("showMs", millisecondsAreEnabled);
    millisecondView.previousElementSibling.textContent = millisecondsAreEnabled
      ? "Hide Milliseconds"
      : "Show Milliseconds";
    millisecondsAreEnabled
      ? millisecondView.previousElementSibling.classList.add("selected")
      : millisecondView.previousElementSibling.classList.remove("selected");
  }

  function handleEditClick() {
    editViewIsHidden = !editViewIsHidden;
    editView.previousElementSibling.textContent = editViewIsHidden
      ? "Edit Schedule"
      : "Close";
    editViewIsHidden
      ? editView.previousElementSibling.classList.remove("selected")
      : editView.previousElementSibling.classList.add("selected");

    const editingTable = document.querySelector("#edit");

    editingTable.animate(
      {
        opacity: editViewIsHidden ? 0 : 1,
      },
      { duration: 100, fill: "forwards" }
    );
    editingTable.style.visibility = editViewIsHidden ? "hidden" : "visible";
  }

  function rotateChildren(element, degrees) {
    for (let i = 0; i < element.children.length; i++) {
      const targetTransform = element.children
        .item(i)
        .style.getPropertyValue("transform");
      let origDegrees = 0;
      if (targetTransform.includes("rotate")) {
        origDegrees += parseInt(
          targetTransform.substring(
            targetTransform.lastIndexOf("rotate") + 7,
            targetTransform.lastIndexOf("deg)")
          )
        );
      }
      element.children
        .item(0)
        .style.setProperty("transform", `rotate(${origDegrees + degrees}deg)`);
      element.children
        .item(i)
        .style.setProperty(
          "-webkit-transform",
          `rotate(${origDegrees + degrees}deg)`
        );
    }
  }

  function funnyEaseOutBackBecauseWhyNot(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
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

  function showError(text) {
    const error = document.getElementById("error");
  }

  function hideError() {
    const error = document.getElementById("error");
  }
};
