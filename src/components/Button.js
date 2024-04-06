import React from "react";

export default function Button({ disabled, className, text, onClick }) {
  const style = className ? className : "";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`text-slate-200 px-5 py-1 rounded-full 
      text-2xl font-semibold appearance-none ${style}
      transition-all duration-300`}
    >
      {text}
    </button>
  );
}
