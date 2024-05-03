import React, { useEffect } from "react";
import Link from "next/link";

export default function LoginSuccess() {
  useEffect(() => {
    // Remove the token from the URL
    // Applicable if this is the first load after clicking a magic link.
    const url = new URL(window.location);
    if (url.searchParams.get("t")) {
      url.searchParams.delete("t");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center p-8 bg-base-100">
      <div className="-z-0 absolute h-full w-full doodles-light opacity-10" />
      <p className="text-6xl font-bold mb-8 text-center">Login Successful!</p>
      <p className="text-4xl font-regular text-center max-w-[600px]">
        You're logged in! Please close this page and return to the other tab.
      </p>
      {/* This must be an anchor as to create a new session instance
          so subsequent requests get cookies */}
      {/* Added refresher to profile page, so now people will just close this page. */}
      {/* <a href="/">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Home
        </button>
      </a> */}
    </div>
  );
}
