import React from "react";

export default function Button({ disabled, className, text, onClick }) {
  const style = className ? className : "";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-5 py-1 
      text-2xl appearance-none ${style}
      transition-all duration-300`}
    >
      {text}
    </button>
  );
}
