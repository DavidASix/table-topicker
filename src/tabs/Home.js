import React, { useState, useRef, useEffect  } from "react";
import axios from 'axios';

import { domain } from '@/config'
import DropDown from "@/components/DropDown";
import Button from "@/components/Button";

function Home({className, id}) {
  const [category, setCategory] = useState(false);
  const [categories, setCategories] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [topicHistory, setTopicHistory] = useState([])
  // Topic load counter serves the purpose of counting how many attempts to find a unique
  // question have been completed, as well as being a loading new topic indicator (!!topicLoadCounter)
  const [topicLoadCounter, setTopicLoadCounter] = useState(null);
  const [green, setGreen] = useState("1:00");
  const [yellow, setYellow] = useState("1:30");
  const [red, setRed] = useState("2:00");
  const [timer, setTimer] = useState(0);
  // This could be ascertained by observing the interval ref, but that causes
  // a delay in re-renders while the ref updates the state
  const [timerActive, setTimerActive] = useState(false);
  const interval = useRef(null);

  useEffect(() => {
    const catURL = `${domain}/api/data/getCategories`
    axios.get(catURL)
      .then(({ data }) => setCategories(data))
      .catch((err) => console.log(err))
  }, [])


  //const categories = ["Life", "Work", "School", "Family"];
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
  // I had considered just updating the value of the color and using it as a variable within class names,
  // But that method does not trigger tailwinds to generate the required classes, so they are named explicitly here
  const timerColorScheme = {
    zinc: {
      text: "text-zinc-700",
      ring: "ring-zinc-400",
      bg: "bg-zinc-300",
    },
    active: {
      text: "text-sky-700",
      ring: "ring-sky-200",
      bg: "bg-sky-100",
    },
    green: {
      text: "text-green-700",
      ring: "ring-green-400",
      bg: "bg-green-300",
    },
    yellow: {
      text: "text-yellow-700",
      ring: "ring-yellow-300",
      bg: "bg-yellow-200",
    },
    red: {
      text: "text-red-800",
      ring: "ring-red-500",
      bg: "bg-red-400",
    },
  };

  function formatTime(seconds) {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    while (String(s).length < 2) {
      s = "0" + s;
    }
    return `${m}:${s}`;
  }

  function getTimerColor(seconds) {
    const t = formatTime(seconds);
    let color = "";
    if (t < green) {
      if (timerActive) {
        color = "active"
      } else {
        color = "zinc";
      }
    } else if (t < yellow) {
      color = "green";
    } else if (t < red) {
      color = "yellow";
    } else {
      color = "red";
    }
    return color;
  }

  async function onClickGenerateTopic() {
    if (!category) {
      return alert('Please select a category');
    }
    // if (currentTopic) {
    //   setTopicHistory([...topicHistory, {...currentTopic, timer}])
    // }
    // setTopicLoadCounter(topicLoadCounter+1)
    // // TODO: Improve alert system with custom component
    // if (topicLoadCounter > 10) {
    //   return alert('Could not find more topics for this category, please select a new one!')
    // }
    try {
      const url = `${domain}/api/data/getRandomQuestionInCategory`
      const { data } = await axios.post(url, {category})
      setCurrentTopic(data);
    } catch (err) {
      console.log(err)
    } finally {
      setTopicLoadCounter(null)
    }
  }

  function onStartStopClick() {
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

  function onResetClick() {
    if (interval.current) {
      clearInterval(interval.current);
    }
    setTimerActive(false);
    setTimer(0);
  }

  const timerColor = timerColorScheme[getTimerColor(timer)];

  return (
    <div className={`${className || ''} bg-slate-800
    h-full w-screen flex flex-col border snap-center`}
    id={id || ''}>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-screen min-h-40 flex flex-col justify-center items-center px-5 md:px-40">
          <h1 className="text-5xl text-slate-300 font-bold mb-3">
            Table Topicker
          </h1>
          <p className=" text-slate-300 text-center font-light">
            Table Topics is a spontaneous speaking activity. Practice thinking
            on your feet and having fun with words.
            <br />
            Ready to become a better speaker?
          </p>
        </div>
        <div
          className="flex-1 w-11/12 max-w-3xl flex flex-col items-center
          bg-slate-200 rounded-t-[4rem] shadow-2xl"
        >
          <div className="w-full min-h-16 py-3 flex justify-center items-center">
            <span className="hidden md:block font-light text-xl me-2">
              Category:
            </span>
            <DropDown
              className={"bg-slate-800 hover:bg-slate-700"}
              options={categories || []}
              selectedOption={category}
              defaultText='Select a category'
              loading={!categories}
              onOptionChange={(category) => setCategory(category)}
            />
          </div>

          <div className="w-full flex-1 flex flex-col">
            <div className="w-full min-h-16 flex flex-row justify-center items-center">
              <span className="hidden md:block font-light text-xl me-2">
                Times:
              </span>
              <DropDown
                className={"mb-3 md:mb-0 bg-green-900 hover:bg-green-800"}
                text="Green"
                options={timingOptions}
                selectedOption={green}
                onOptionChange={(value) => setGreen(value)}
              />
              <DropDown
                className={"mb-3 md:mb-0 mx-1 md:mx-3 bg-yellow-800 hover:bg-yellow-700"}
                text="Yellow"
                options={timingOptions.filter((val, i) => val > green)}
                selectedOption={yellow}
                onOptionChange={(value) => setYellow(value)}
              />
              <DropDown
                className={"mb-3 md:mb-0 bg-red-800 hover:bg-red-700"}
                text="Red"
                options={timingOptions.filter((val, i) => val > yellow)}
                selectedOption={red}
                onOptionChange={(value) => setRed(value)}
              />
            </div>

            <div className="w-full min-h-16 flex flex-col md:flex-row justify-center items-center">
              <Button
                disabled={!category || topicLoadCounter}
                text="Generate New Topic"
                className={`me-1 mb-1 md:mb-0 ${!category || topicLoadCounter ? "bg-gray-400 text-gray-300" : "bg-teal-700 hover:bg-teal-600"}`}
                onClick={() => onClickGenerateTopic()}
              />

              <div className="flex">
                <Button
                  className="bg-zinc-600 hover:bg-zinc-500  mx-1 mb-1 md:mb-0"
                  text={
                    timerActive
                      ? "Pause"
                      : timer
                      ? "Resume"
                      : "Start"
                  }
                  onClick={() => onStartStopClick()}
                />

                <Button
                  text={"Reset"}
                  className="bg-red-800 hover:bg-red-700 ms-1 mb-1 md:mb-0"
                  onClick={() => onResetClick()}
                />
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col justify-center items-center mx-3 my-3 mb-6
              transition-all duration-500
              rounded-3xl shadow-lg ring-1 ${timerColor.ring} ${timerColor.bg}`}
            >
              <span>
                {!category ? "Select a category" :
                !currentTopic?.question ? "Generate a new topic" : 
                "Give a speech about..."}
              </span>
              <span className="text-center text-3xl font-semibold mt-2 mb-4 mx-4">
                {currentTopic?.question || ""}
              </span>
              <span
                className={`text-3xl font-semibold transition-colors duration-500 ${timerColor.text}`}
              >
                {formatTime(timer)}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
