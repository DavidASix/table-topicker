import React, { useState, useEffect } from "react";
import {
  MdOutlineGeneratingTokens,
  MdPersonOutline,
  MdOutlineSettings,
} from "react-icons/md";

const links = [
  { title: "home", icon: (props) => <MdOutlineGeneratingTokens {...props} /> },
  { title: "profile", icon: (props) => <MdPersonOutline {...props} /> },
  { title: "settings", icon: (props) => <MdOutlineSettings {...props} /> },
];
const Link = ({ index, scrollElement, scrollWidth, icon, title }) => {
  const scrollDistance = scrollWidth * index;
  console.log({ scrollDistance });
  return (
    <button
    title={title}
    aria-label={title}
      onClick={() => {
        console.log(scrollDistance);
        scrollElement.current.scrollTo({
          left: scrollDistance,
          behavior: "smooth",
        });
      }}
      className="h-14 w-14 flex justify-center items-center
      hover:bg-slate-200 rounded-full group hover:scale-105 transition-all duration-200"
    >
      {icon({
        size: 35,
        className:
          "fill-slate-800 group-hover:fill-red-500 animate-all duration-300",
      })}
    </button>
  );
};
export default function Button({ className, scrollElement }) {
  const [scrollContainerWidth, setScrollContainerWidth] = useState(null);
  useEffect(() => {
    if (scrollElement.current) {
      const pageWidth = scrollElement.current.offsetWidth;
      setScrollContainerWidth(pageWidth);
      // Use pageWidth here
    }
  }, [scrollElement]);
  console.log({ scrollContainerWidth });
  return (
    <nav
      className={`${className || ""} absolute bottom-2 left-0 right-0 mx-auto
        flex justify-around items-center w-min space-x-6 md:space-x-3 px-2 md:px-1 py-1
        bg-slate-100 shadow border rounded-2xl`}
    >
      {links.map((link, i) => (
        <Link
          {...link}
          scrollElement={scrollElement}
          scrollWidth={scrollContainerWidth}
          index={i}
          key={i}
        />
      ))}
    </nav>
  );
}
