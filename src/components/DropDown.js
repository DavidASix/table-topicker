import React, { useState } from "react";
import { FaChevronCircleDown } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

export default function DropDown({
  className,
  options,
  selectedOption,
  onOptionChange,
  defaultText,
  loading=false
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      role='button'
      onClick={() => setIsOpen(!isOpen)}
      className={` px-5 py-1
      text-xl flex justify-between items-center relative  
      ${className ? className : ""}
      transition-all duration-300`}
    >
      <span>{selectedOption || defaultText || "Click to select"}</span>
      {!loading && (
        <FaChevronCircleDown
          size={20}
          className={`ms-2 
          transform transition ease-in-out duration-200
          ${isOpen ? "rotate-[180deg]" : "rotate-0"}`}
        />
      )}
      {loading && (
        <FaSpinner
          size={20}
          className={`ms-2 animate-spin`}
        />
      )}
      <div
        className={`
          absolute z-10 min-w-32 flex flex-col top-[100%] mt-1
          rounded-2xl shadow-sm bg-white
          transition-all ease-in-out duration-300
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
      >
        <div
          className="py-1 overflow-scroll max-h-96"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onOptionChange(option);
                setIsOpen(false);
              }}
              className="w-full py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-2xl"
              role="menuitem"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
