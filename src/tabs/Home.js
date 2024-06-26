import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { FaRandom } from "react-icons/fa";
import { LiaRandomSolid } from "react-icons/lia";
import c from "@/assets/constants";
import * as format from "@/utils/format";

const UpgradeModal = ({ user }) => {
  return (
    <dialog id="upgrade_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Get inifnite topics with AI</h3>
        <p className="py-4">
          {!user &&
            "Create an account on the Profile page to get start with infinite topics about any theme you can imagine."}
          {user?.credits === 0 &&
            `You currently have ${user.credits} credits. Purchase credits on the Profile page to generate infinite topics about any theme you can imagine.`}
        </p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const AiOptionModal = ({ options, selectOption }) => {
  return (
    <dialog id="ai_option_modal" className="modal">
      <div className="modal-box space-y-4">
        <h3 className="font-bold text-xl">Select your preferred topic</h3>
        {options.map((o, i) => (
          <button 
            onClick={() => selectOption(o)}
            key={i} 
            className="w-100 p-4 bg-neutral-800 rounded-lg
            transition-colors duration-150 hover:bg-orange-800 text-lg">
              {o}
          </button>
        ))}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const EvaluationModal = ({
  onCompleteEvaluation,
  onDiscardEvaluation,
  time,
  topic,
}) => {
  const [loading, setLoading] = useState(false);
  async function submitEval(e) {
    e.preventDefault();
    setLoading(true);
    // Accessing the speaker radio button
    const speakerRadio = document.querySelector(
      'input[name="radio-10"]:checked'
    );
    const speaker = speakerRadio.value; // "user" or "guest"

    // Accessing the rating radio button
    const ratingRadio = document.querySelector(
      'input[name="rating-9"]:checked'
    );
    const rating = ratingRadio.value; // Integer between 1 and 5 (or "none")
    console.log(speaker, rating);
    await onCompleteEvaluation(speaker, rating);
    setLoading(false);
    document.getElementById("evaluationForm").reset();
  }

  function discardEval(e) {
    e.preventDefault();
    onDiscardEvaluation();
  }
  return (
    <dialog id="evaluation_modal" className="modal">
      <div className="modal-box flex flex-col space-y-2">
        <span className="text-3xl font-bold text-center">Great work!</span>
        <span className="text-center border-b border-neutral-600 pb-4">
          Impromptu speechs are hard, so it's important to evaluate each speech
          so you can track your improvements. Take a moment now to reflect on
          the speech you just gave.
        </span>
        <span className="text-xl">
          <span className="text-2xl font-bold me-1 ">Duration:</span> {time}
        </span>
        <span className="text-xl">
          <span className="text-2xl font-bold me-1 ">Topic:</span> {topic}
        </span>
        <form id="evaluationForm">
          <span className="font-bold text-2xl">Who performed that speech?</span>
          <label className="label cursor-pointer py-0">
            <span className="label-text text-xl">I did</span>
            <input
              type="radio"
              value="user"
              name="radio-10"
              className="radio checked:bg-orange-500"
              defaultChecked
            />
          </label>
          <label className="label cursor-pointer py-0">
            <span className="label-text text-xl">Someone else did</span>
            <input
              type="radio"
              value="guest"
              name="radio-10"
              className="radio checked:bg-orange-500"
            />
          </label>

          <span className="font-bold text-2xl">
            How would you rate that speech?
          </span>
          <div className="rating rating-lg flex justify-center">
            <input
              type="radio"
              name="rating-9"
              className="rating-hidden"
              value="none"
              defaultChecked
            />
            <input
              type="radio"
              value={1}
              name="rating-9"
              className="mask mask-star-2 bg-orange-500"
            />
            <input
              type="radio"
              value={2}
              name="rating-9"
              className="mask mask-star-2 bg-orange-500"
            />
            <input
              type="radio"
              value={3}
              name="rating-9"
              className="mask mask-star-2 bg-orange-500"
            />
            <input
              type="radio"
              value={4}
              name="rating-9"
              className="mask mask-star-2 bg-orange-500"
            />
            <input
              type="radio"
              value={5}
              name="rating-9"
              className="mask mask-star-2 bg-orange-500"
            />
          </div>
          <div className="flex gap-4 pt-8">
            <button
              tag="button"
              type="cancel"
              className="flex-1 h-10 bg-red-500 text-white rounded-full disabled:bg-neutral-600 disabled:text-neutral-400 transition-colors duration-500"
              onClick={discardEval}
              disabled={loading}
            >
              Discard
            </button>
            <button
              tag="button"
              type="submit"
              className="flex-1 h-10 bg-orange-500 text-white rounded-full relative disabled:bg-neutral-600 disabled:text-neutral-400 transition-colors duration-500"
              onClick={submitEval}
              disabled={loading}
            >
              Submit
              {loading && (
                <span className="absolute end-4 loading loading-ring loading-md"></span>
              )}
            </button>
          </div>
        </form>
      </div>
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

function Home({ showAlert, refreshUser, user }) {
  const [category, setCategory] = useState(false);
  const [categories, setCategories] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [aiTopics, setAiTopics] = useState(false);
  const [aiOptions, setAiOptions] = useState([])
  const [randomCatLoading, setRandomCatLoading] = useState(false);
  const [topicLoading, setTopicLoading] = useState(false);
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
  function getBgColor(seconds) {
    const t = format.stringElapsedTime(seconds);
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
    setTimerActive(false);
    clearInterval(interval.current);
    interval.current = null;
    const modal = document.getElementById("evaluation_modal");
    modal.showModal();
  }

  function clearTopic() {
    if (interval.current) {
      clearInterval(interval.current);
    }
    setTimerActive(false);
    setTimer(0);
    setCurrentTopic(null);
  }

  async function onCompleteEvaluation(speaker, rating) {
    const time = format.secondsToTime(timer);
    const historyInsert = {
      date: new Date(),
      topic: currentTopic,
      duration: time,
      speaker,
      rating,
    };
    try {
      console.log({ historyInsert });
      await axios.post("/api/user/storeHistory", historyInsert);
      refreshUser();
      showAlert("info", "Topic Results Saved, Great Work!");
    } catch (err) {
      console.log(err.message);
      console.log(err?.response?.data);
      showAlert(
        "error",
        `Could not save result. ${err?.response?.data || err.message}`
      );
    } finally {
      const modal = document.getElementById("evaluation_modal");
      modal.close();
      clearTopic();
    }
  }

  function onDiscardEvaluation() {
    const modal = document.getElementById("evaluation_modal");
    modal.close();
    clearTopic();
    showAlert("warning", "Evaluation Discarded");
  }

  // OnAction - Topics
  async function onClickRandomCategory() {
    try {
      setRandomCatLoading(true);
      setCategory(() => "")
      const url = aiTopics ? "/api/data/authenticated/getRandomAiCategory" : "/api/data/getRandomCategory";
      const response = await axios.get(url);
      setCategory(() => response.data.category);
    } catch (error) {
      showAlert("error", "Error fetching random category");
      console.error(error);
    } finally {
      setRandomCatLoading(false);
    }
  }

  async function onClickGenerateTopic() {
    if (!category) {
      return alert("Please select a category");
    }
    setCurrentTopic(null)
    setTopicLoading(true);
    if (aiTopics) {
      const difficulty = "Hard"
      try {
        const url = `/api/data/authenticated/generateTopicFromCategory`;
        const { data } = await axios.post(url, { category, difficulty });
        setAiOptions([...data.topics])
        const modal = document.getElementById("ai_option_modal");
        modal.showModal();
      } catch (err) {
        const msg = err?.response?.data?.message || err.message
        console.log(msg)
        showAlert("error", msg)
        setTopicLoading(false);
      }
    } else {
      try {
        const url = `/api/data/getRandomQuestionInCategory`;
        const { data } = await axios.post(url, { category });
        setCurrentTopic(data);
      } catch (err) {
        console.log(err);
      } finally {
        setTopicLoading(false);
      }
    }
  }

  async function onSelectAiOption(option) {
    // Set the AI topic, and close the modal
    const topic = { category, question: option}
    const modal = document.getElementById("ai_option_modal");
    modal.close();
    // Attempt to save the topic to the server
    try {
      const url = `/api/data/authenticated/userSelectedTopic`;
      await axios.post(url, topic);
      refreshUser()
    } catch (err) {
      console.log('Error selecing AI topic')
      const msg = err?.response?.data?.message || err.message;
      console.log(msg)
      showAlert("error", msg)
      setTopicLoading(false);
    } finally {
      setCurrentTopic(topic);
      setTopicLoading(false);
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
      setCurrentTopic(null)
    }
  }

  return (
    <div className="h-full snap-center snap-always" id="home">
      <UpgradeModal user={user} />
      <AiOptionModal 
        options={aiOptions} 
        selectOption={onSelectAiOption} />
      <EvaluationModal
        onCompleteEvaluation={(speaker, rating) =>
          onCompleteEvaluation(speaker, rating)
        }
        onDiscardEvaluation={() => onDiscardEvaluation()}
        time={format.stringElapsedTime(timer)}
        topic={currentTopic?.question}
      />
      <div
        className={`${c.sectionPadding} relative w-screen h-full px-2 pb-16`}
      >
        <div
          className={`${
            c.contentContainer
          } w-full h-full flex flex-col rounded-[2.5rem] py-4
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
            {!category && (
              <span className="text-white font-semibold">Select a Category</span>
            )}
            {topicLoading && (
              <span className="loading loading-lg loading-dots text-white"></span>
            )}
            {category && !topicLoading && !currentTopic?.question && (
              <span className="text-white font-semibold">
                Generate a new topic
              </span>
            )}
            <span className="max-w-[800px] text-center text-2xl md:text-4xl font-normal text-white">
              {currentTopic?.question || ""}
            </span>
          </div>

          <div
            id="control-container"
            className="w-full h-min flex flex-col items-center space-y-2 py-2"
          >
            {/* Timer Readout */}
            <span className={`countdown text-4xl font-semibold text-white`}>
              <span style={{ "--value": format.secondsToTime(timer).m }}></span>
              :
              <span style={{ "--value": format.secondsToTime(timer).s }}></span>
            </span>

            {/* Topic Selector */}
              <div className="flex items-center w-full h-14 gap-2">
            {aiTopics ? (
              <input
                type="text"
                className={`w-full h-full px-4 rounded-full shadow-sm text-neutral-800 placeholder-neutral-600
                bg-white backdrop-blur-sm  ${
                  !timerActive ? "bg-opacity-[0.65]" : "bg-opacity-90"
                }
                focus:ring-black
                text-lg transition-all duration-300 enabled:hover:scale-[1.01] enabled:focus:scale-[1.01] focus:outline-double focus:outline-orange-400`}
                value={category || ""}
                maxLength={65}
                placeholder="Enter a topic..."
                onChange={(e) => setCategory(e.target.value)}
               />

            ) : (
              // Dropdown non-ai selector
                <select
                  className={`w-full h-full px-4 rounded-full shadow-sm text-neutral-800
                  select bg-white backdrop-blur-sm  ${
                    !timerActive ? "bg-opacity-[0.65]" : "bg-opacity-90"
                  }
                  text-lg transition-all duration-300 enabled:hover:scale-[1.01]`}
                  value={category || ""}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Topic Theme
                  </option>
                  {!categories.length ? (
                    <option disabled value="">
                      Loading...
                    </option>
                  ) : (
                    categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))
                  )}
                </select>
            )}

                <button
                  onClick={onClickRandomCategory}
                  className="btn btn-circle btn-primary btn-sm h-14 w-14 backdrop-blur-sm bg-opacity-60 border-0"
                >
                  {randomCatLoading ? (
                    <span className="loading loading-spinner text-white"></span>
                  ) : (
                    <LiaRandomSolid className="fill-white h-8 w-auto" />
                  )}
                </button>
              </div>
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
              disabled={!category || topicLoading}
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
                disabled={
                  !format.secondsToTime(timer).m &&
                  !format.secondsToTime(timer).s
                }
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
