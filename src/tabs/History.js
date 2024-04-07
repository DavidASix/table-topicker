import React, { useState, useRef, useEffect  } from "react";

function History({className, id}) {
  return (
    <div className={`${className || ''} bg-slate-800
    h-full w-screen flex flex-col border snap-center snap-always`}
    id={id || ''}>
      <div className="flex-1 flex flex-col items-center w-screen">
        <h1 className="text-5xl text-white">History</h1>
      </div>
    </div>
  );
}

export default History;
