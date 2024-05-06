import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import c from "@/assets/constants";
import * as format from "@/utils/format";

function History({ user, showAlert }) {
  const [topicHistory, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTopics, setTotalTopics] = useState(false);
  const topicsPerPage = 10;

  useEffect(() => {
    setLoadingHistory(true);
    if (!user?._id) {
      // No User
      return;
    }
    setCurrentPage(1);
    // Get the initial history
    getHistory(1, topicsPerPage)
      .then((newHistory) => {
        setHistory(() => newHistory);
        // Get the current total topics completed stats
        getTopicStats()
          .then((stats) => setTotalTopics((prev) => [...stats]))
          .catch((e) => {
            throw e;
          });
      })
      .catch((e) => {
        //showAlert("error", e?.response?.data || e.message);
        console.log("Use Effect Error:", e.message);
      })
      .finally(() => setLoadingHistory(false));
  }, [user]);

  async function getTopicStats() {
    try {
      const { data } = await axios.get("/api/user/stats/totalTopics");
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function getHistory(page, topicsPerPage) {
    try {
      const { data } = await axios.post("/api/user/getHistory", {
        page,
        topicsPerPage,
      });
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function loadNextPage() {
    try {
      if (currentPage * topicsPerPage > totalTopics?.total) {
        console.log("end of list");
        return;
      }
      setLoadingHistory(true);
      const nextPage = await getHistory(currentPage + 1, topicsPerPage);
      setHistory((p) => [...p, ...nextPage]);
      setCurrentPage((p) => p + 1);
      setLoadingHistory(false);
    } catch (e) {
      console.log(e);
      showAlert("error", e?.response?.data || e.message);
    }
  }
  // Pagination functions:
  // Write API route to get total questions
  // if current question count is less than total questions, fetch next page then update current page var
  const completeTopics = totalTopics
    ? totalTopics.filter((v) => v.speaker === "total")[0].value
    : 0;
  const completeUserTopics = totalTopics
    ? totalTopics.filter((v) => v.speaker === "user")[0].value
    : 0;
  const completeGuestTopics = totalTopics
    ? totalTopics.filter((v) => v.speaker === "guest")[0].value
    : 0;
  return (
    <div className="h-full snap-center snap-always" id="history">
      <div className={`${c.sectionPadding} relative w-screen h-full px-2 overflow-scroll`}>
        <div
          className={`${c.contentContainer} w-full h-min flex-1 flex flex-col py-4 pb-16`}
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
              <div className="flex w-full justify-around mb-4 mt-2">
                <span className="flex flex-col">
                  <span className="countdown text-3xl font-bold mb-2">
                    <span
                      className="mx-auto"
                      style={{
                        "--value": completeTopics,
                      }}
                    ></span>
                  </span>
                  <span>Total Topics</span>
                </span>

                <span className="flex flex-col">
                  <span className="countdown text-3xl font-bold mb-2">
                    <span
                      className="mx-auto"
                      style={{
                        "--value": completeUserTopics,
                      }}
                    ></span>
                  </span>
                  <span>Your Topics</span>
                </span>

                <span className="flex flex-col">
                  <span className="countdown text-3xl font-bold mb-2">
                    <span
                      className="mx-auto"
                      style={{
                        "--value": completeGuestTopics,
                      }}
                    ></span>
                  </span>
                  <span>Guest Topics</span>
                </span>
              </div>

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

              {loadingHistory && (
                <div
                  className={`backdrop-blur-sm rounded-2xl skeleton bg-transparent
                  border border-neutral-800 flex flex-col my-2 p-4 h-44 w-full`}
                >
                  <div className="flex justify-between h-8 w-full gap-4">
                    <div className="bg-neutral-800 skeleton h-8 flex-1 max-w-40 opacity-60" />
                    <div className="bg-neutral-800 skeleton h-6 flex-1 max-w-40 opacity-60" />
                  </div>

                  <div className="bg-neutral-800 skeleton h-6 max-w-80 opacity-60 mt-4" />
                  <div className="bg-neutral-800 skeleton h-6 max-w-96 opacity-60 mt-4" />
                  <div className="bg-neutral-800 skeleton h-6 max-w-80 opacity-60 mt-2" />
                  <div className="bg-neutral-800 skeleton h-6 max-w-72 opacity-60 mt-2" />
                </div>
              )}

              {currentPage * topicsPerPage < completeTopics && (
                <button
                  className="btn btn-primary bg-opacity-25 backdrop-blur-sm rounded-full my-2
                  text-2xl text-white max-w-[450px] self-center w-full border-0"
                  disabled={loadingHistory}
                  onClick={loadNextPage}
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
