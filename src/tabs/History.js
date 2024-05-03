import React, { useState, useRef, useEffect } from "react";

function History({ className, id }) {
  return (
    <div
      className={`${className || ""}
      h-full w-screen flex flex-col snap-center snap-always`}
      id="history"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-screen">
        <h1 className="text-5xl text-white">History</h1>
      </div>
    </div>
  );
}

export default History;
