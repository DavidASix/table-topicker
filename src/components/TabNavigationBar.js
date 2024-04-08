import React, { useState, useEffect } from "react";
import {
  MdOutlineGeneratingTokens,
  MdPersonOutline,
  MdOutlineHistory,
} from "react-icons/md";

const links = [
  { title: "home", icon: (props) => <MdOutlineGeneratingTokens {...props} /> },
  { title: "profile", icon: (props) => <MdPersonOutline {...props} /> },
  { title: "history", icon: (props) => <MdOutlineHistory {...props} /> },
];
const Link = ({
  index,
  scrollElement,
  scrollWidth,
  icon,
  title,
  currentIndex,
}) => {
  const scrollDistance = scrollWidth * index;
  const containerStyle = index === currentIndex ? "bg-orange-300" : "bg-slate-50 md:hover:bg-slate-200 scale-90";
  const iconStyle = index === currentIndex ? "fill-orange-950" : "fill-slate-700";
  return (
    <button
      title={title}
      aria-label={title}
      onClick={() => {
        scrollElement.current.scrollTo({
          left: scrollDistance,
          behavior: "smooth",
        });
      }}
      className={`${containerStyle} h-14 w-14 flex justify-center items-center
      rounded-full group transition-all duration-300`}
    >
      {icon({
        size: 35,
        className: `${iconStyle} animate-all duration-500`,
      })}
    </button>
  );
};
export default function Button({ className, scrollElement }) {
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  // This scroll event is used to control the indicator position of tab bar
  useEffect(() => {
    const updateScrollPosition = (event) => {
      const { scrollLeft, offsetWidth } = scrollElement.current;
      const activeIndex = Math.round(scrollLeft / offsetWidth);
      setCurrentIndex(activeIndex);
    };
    // event should only be triggered when the element exists
    if (scrollElement.current) {
      const pageWidth = scrollElement.current.offsetWidth;
      setScrollContainerWidth(pageWidth);
      // add scroll event listener
      scrollElement.current.addEventListener("scroll", updateScrollPosition);
      return () => {
        scrollElement.current.removeEventListener(
          "scroll",
          updateScrollPosition
        );
      };
    }
  }, [scrollElement]);

  return (
    <nav
      className={`${className || ""} absolute bottom-2 left-0 right-0 mx-auto
        flex justify-around items-center w-min space-x-10 md:space-x-6 px-2 md:px-1 py-2 md:py-1
        bg-slate-50 shadow border rounded-full`}
    >
      {links.map((link, i) => (
        <Link
          {...link}
          scrollElement={scrollElement}
          scrollWidth={scrollContainerWidth}
          currentIndex={currentIndex}
          index={i}
          key={i}
        />
      ))}
    </nav>
  );
}
