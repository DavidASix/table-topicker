import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import DropDown from "@/components/DropDown";
import c from "@/assets/constants";

const UpgradeModal = ({ user }) => {
  return (
    <dialog id="upgrade_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Get inifnite topics with AI</h3>
        <p class="py-4">
          {!user &&
            "Create an account on the Profile page to get start with infinite topics about any theme you can imagine."}
          {user?.credits === 0 &&
            `You currently have ${user.credits} credits. Purchase credits on the Profile page to generate infinite topics about any theme you can imagine.`}
        </p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const timingOptions = [
  "0:15",
  "0:30",
  "0:45",
  "1:00",
  "1:15",
  "1:30",
  "1:45",
  "2:00",
];

function Home({ showAlert, user }) {
  const [category, setCategory] = useState(false);
  const [categories, setCategories] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [aiTopics, setAiTopics] = useState(false);
  // Topic load counter serves the purpose of counting how many attempts to find a unique
  // question have been completed, as well as being a loading new topic indicator (!!topicLoadCounter)
  const [topicLoadCounter, setTopicLoadCounter] = useState(null);
  const [green, setGreen] = useState("0:30");
  const [yellow, setYellow] = useState("0:45");
  const [red, setRed] = useState("1:00");
  const [timer, setTimer] = useState(0);
  // This could be ascertained by observing the interval ref, but that causes
  // a delay in re-renders while the ref updates the state
  const [timerActive, setTimerActive] = useState(false);
  const interval = useRef(null);

  useEffect(() => {
    const catURL = `/api/data/getCategories`;
    axios
      .get(catURL)
      .then(({ data }) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  // Get Functions
  function getTime(seconds) {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    return { m, s };
  }

  function getBgColor(seconds) {
    const { m, s } = getTime(seconds);
    // String format seconds to match the options from dropdowns for compare.
    let sec = s;
    while (String(sec).length < 2) {
      sec = "0" + sec;
    }

    const t = `${m}:${sec}`;
    let status = "";

    if (!timerActive) {
      status = "inactive";
    } else if (t < green) {
      status = "active";
    } else if (t < yellow) {
      status = "green";
    } else if (t < red) {
      status = "yellow";
    } else {
      status = "red";
    }

    const timerColorScheme = {
      inactive: "transparent",
      active: "bg-neutral-500",
      green: "bg-emerald-600",
      yellow: "bg-yellow-600",
      red: "bg-red-600",
    };

    return timerColorScheme[status];
  }

  // OnAction - Timer Controls
  function onChangeTimeDropdown(color, time) {
    if (color === "green") {
      setGreen(time);
      if (yellow <= time) {
        setYellow(timingOptions.filter((t) => t > time)[0]);
        setRed(timingOptions.filter((t) => t > time)[1]);
      }
    } else if (color === "yellow") {
      setYellow(time);
      if (red <= time) {
        setRed(timingOptions.filter((t) => t > time)[0]);
      }
    } else if (color === "red") {
      setRed(time);
    }
  }

  function onClickStartPause() {
    if (interval.current) {
      setTimerActive(false);
      clearInterval(interval.current);
      interval.current = null;
    } else {
      setTimerActive(true);
      interval.current = setInterval(
        () => setTimer((timer) => timer + 1),
        1000
      );
    }
  }

  function onClickSave() {
    showAlert('info', 'Topic Results Saved, Great Work!')
    if (interval.current) {
      clearInterval(interval.current);
    }
    setTimerActive(false);
    setTimer(0);
  }

  // OnAction - Topics
  async function onClickGenerateTopic() {
    if (!category) {
      return alert("Please select a category");
    }
    try {
      const url = `/api/data/getRandomQuestionInCategory`;
      const { data } = await axios.post(url, { category });
      setCurrentTopic(data);
    } catch (err) {
      console.log(err);
    } finally {
      setTopicLoadCounter(null);
    }
  }

  // OnAction - AI Topics
  function onClickAITopics() {
    const modal = document.getElementById("upgrade_modal");
    if (!user) {
      modal.showModal();
    } else {
      // Check if tokens available, or show upgrade modal
      setAiTopics((prev) => !prev);
    }
  }

  return (
    <div className="h-full snap-center snap-always" id="home">
      <UpgradeModal user={user} />
      <div className={`${c.sectionPadding} relative w-screen h-full px-2`}>
        <div
          className={`${c.contentContainer} w-full h-full flex flex-col rounded-[2.5rem] py-4
          transition-all duration-500 ${getBgColor(timer)} bg-opacity-45`}
        >
          <div className="h-16 w-full flex justify-end items-center">
            <div className="relative flex me-4">
              <span className="text-3xl md:text-4xl font-bold z-10 text-white">
                AI Topics
              </span>
              <img
                src="/stars.png"
                className="h-16 md:h-20 w-auto absolute -ml-12 md:-ml-16 -mt-5 md:-mt-7 start-0 top-0 z-0"
              />
            </div>
            <input
              type="checkbox"
              checked={aiTopics}
              onChange={onClickAITopics}
              className="toggle toggle-lg toggle-primary"
            />
          </div>
          <div
            id="topic-container"
            className={`flex-1 flex flex-col justify-center items-center mx-3 my-3 mb-6 transition-all duration-500`}
          >
            <span className="text-white font-semibold">
              {!category
                ? "Select a category"
                : !currentTopic?.question
                ? "Generate a new topic"
                : "Your Topic"}
            </span>
            <span className="max-w-[800px] text-center text-4xl md:text-7xl font-normal text-white">
              {currentTopic?.question || ""}
            </span>
          </div>

          <div
            id="control-container"
            className="w-full h-min flex flex-col items-center space-y-2 py-2"
          >
            {/* Timer Readout */}
            <span className={`countdown text-4xl font-semibold text-white`}>
              <span style={{ "--value": getTime(timer).m }}></span>:
              <span style={{ "--value": getTime(timer).s }}></span>
            </span>

            {/* Topic Selector */}
            {aiTopics ? (
              <input type="text" />
            ) : (
              <DropDown
                className={
                  "bg-white shadow-sm text-neutral-600 h-14 w-full rounded-full"
                }
                options={categories || []}
                selectedOption={category}
                defaultText="Topic Theme"
                loading={!categories}
                onOptionChange={(category) => setCategory(category)}
              />
            )}
            {/* Timer dropdowns. Options available are defined by the next lowest timer */}
            <div className="w-full h-min py-1 flex flex-row justify-center items-center space-x-2">
              <select
                value={green}
                onChange={(e) => onChangeTimeDropdown("green", e.target.value)}
                className="select flex-1 rounded-full
                text-white text-lg bg-green-900 hover:bg-green-800 "
              >
                {timingOptions.slice(0, -2).map((t, i) => (
                  <option key={i}>{t}</option>
                ))}
              </select>
              <select
                value={yellow}
                onChange={(e) => onChangeTimeDropdown("yellow", e.target.value)}
                className="select flex-1 rounded-full
                text-white text-lg bg-yellow-800 hover:bg-yellow-700 "
              >
                {timingOptions
                  .filter((val) => val > green)
                  .slice(0, -1)
                  .map((t, i) => (
                    <option key={i}>{t}</option>
                  ))}
              </select>
              <select
                value={red}
                onChange={(e) => onChangeTimeDropdown("red", e.target.value)}
                className="select flex-1 rounded-full
                text-white text-lg bg-red-800 hover:bg-red-700 "
              >
                {timingOptions
                  .filter((val) => val > yellow)
                  .map((t, i) => (
                    <option key={i}>{t}</option>
                  ))}
              </select>
            </div>
            {/* Control Buttons */}
            <button
              disabled={!category || topicLoadCounter}
              className={`h-14 w-full rounded-full backdrop-blur-sm bg-neutral-800 bg-opacity-80
                text-2xl font-semibold text-white transition-all duration-300 enabled:hover:scale-[1.01]`}
              onClick={() => onClickGenerateTopic()}
            >
              Generate Topic
            </button>
            <div className="w-full h-14 space-x-2 flex justify-center items-center">
              <button
                className={`h-full w-full rounded-full backdrop-blur-sm  ${
                  !timerActive
                    ? "bg-opacity-[0.25] bg-green-400"
                    : "bg-green-700 bg-opacity-80"
                }
                text-2xl font-semibold text-white transition-all duration-300 enabled:hover:scale-[1.01]`}
                onClick={() => onClickStartPause()}
              >
                {timerActive ? "Pause" : timer ? "Resume" : "Start"}
              </button>

              <button
                className={`h-full w-full rounded-full backdrop-blur-sm 
                disabled:bg-neutral-600 disabled:text-neutral-400 ${
                  !timerActive
                    ? "bg-opacity-[0.25] bg-orange-500"
                    : "bg-orange-700 bg-opacity-80"
                }
                text-2xl font-semibold text-white transition-all duration-300 enabled:hover:scale-[1.01]`}
                onClick={() => onClickSave()}
                disabled={!getTime(timer).m && !getTime(timer).s}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
