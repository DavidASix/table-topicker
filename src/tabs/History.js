import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import c from "@/assets/constants";
import * as format from "@/utils/format";

function History({ user }) {
  const [topicHistory, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    setLoadingHistory(true);
    if (!user?._id) {
      // No User
      return;
    }
    getHistory(1, 10)
      .then((newHistory) =>
        setHistory((prev) => [...newHistory, ...newHistory, ...newHistory])
      )
      .catch((e) => console.log("Use Effect Error:", e))
      .finally(() => setLoadingHistory(false));
  }, [user]);

  async function getHistory(page, topicsPerPage) {
    try {
      const { data } = await axios.post("/api/user/getHistory", {
        page,
        topicsPerPage,
      });
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return (
    <div className="h-full snap-center snap-always" id="history">
      <div className={`${c.sectionPadding} relative w-screen min-h-full px-2`}>
        <div
          className={`${c.contentContainer} w-full h-full flex-1 flex flex-col py-4 pb-20`}
        >
          <h1 className="text-6xl font-bold text-center text-white mb-6">
            History
          </h1>
          {!user && (
            <div className="flex-1 flex flex-col justify-center items-center">
              <span className="text-3xl w-full md:w-1/2 text-center">
                Please log in to start recording your topic history
              </span>
            </div>
          )}
          {user && (
            <>
              {topicHistory.map((t, i) => (
                <div key={i} className="w-100 min-h-20 py-2">
                  <div
                    className={`backdrop-blur-sm rounded-2xl py-4 border border-neutral-800
                flex flex-col px-4`}
                  >
                    <span className="flex justify-between">
                      <span className="font-semibold text-lg">
                        {t.topic.category}
                      </span>
                      <span className="text-sm text-end font-light whitespace-nowrap">
                        {format.dateString(t.date)}
                      </span>
                    </span>
                    <span className="font-normal">{t.topic.question}</span>
                    <span className="mt-2 text-xl">
                      <span className="font-bold">Who Presented: </span>
                      {t.speaker === "user" ? "You" : "Someone else"} did
                    </span>
                    {t.rating && t.rating !== "none" && (
                      <span className="text-xl font-bold">
                        Rating:{" "}
                        {Array.from({ length: parseInt(t.rating) }).map(
                          (_) => "⭐️ "
                        )}
                        {Array.from({ length: 5 - parseInt(t.rating) }).map(
                          (_) => "⚝ "
                        )}
                      </span>
                    )}
                    <span className="text-xl">
                      <span className="font-bold">Time Elapsed: </span>
                      {format.stringElapsedTime(
                        format.timeToSeconds(t.duration.m, t.duration.s)
                      )}
                    </span>
                  </div>
                </div>
              ))}

              <span>{loadingHistory ? "Currently Loading" : ""}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
