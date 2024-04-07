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
    <div className="h-screen flex flex-col items-center justify-center p-8 bg-gray-200">
      <p className="text-4xl font-bold">Login Successful!</p>
      <p className="text-xl font-bold">Welcome, Table Topicker!</p>
      {/* This must be an anchor as to create a new session instance
          so subsequent requests get cookies */}
      <a href="/">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Home
        </button>
      </a>
    </div>
  );
}

