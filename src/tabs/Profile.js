import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { domain } from "@/config";
import c from "@/assets/constants";

function Profile({ className, user, userLoggedIn }) {
  //const user = JSON.parse(user_str);
  //console.log({user, className})
  async function loginSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const url = `${domain}/api/auth/sendMagicLink`;
      const { data } = await axios.post(url, { email });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  const LoginForm = () => (
    <form
      className="bg-white rounded-lg p-8 max-w-sm mx-auto"
      onSubmit={loginSubmit}
    >
      <h1 className="text-3xl font-light">Login</h1>
      <input
        className="w-full px-3 py-2 mt-4 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg placeholder-gray-900"
        placeholder="youremail@example.com"
        name="email"
        type="text"
      />
      <button
        className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
    console.log({user})
  return (
    <div className="h-full snap-center snap-always">
      <div className={`${c.sectionPadding} relative w-screen h-full px-2`}>
        <div
          className={`${c.contentContainer} w-full h-full flex flex-col 
          backdrop-blur-sm rounded-[2.5rem] py-4 border border-neutral-800`}
        >
          {user === null && <LoginForm />}
          {user && (
            <>
              <div className="px-2 py-4 w-full flex flex-col">
                <span className="text-white text-sm font-bold">Email:</span>
                <span className="text-white text-xl ms-4">{user.email}</span>
              </div>
              <div className="w-full grid grid-cols-2 space-y-4 md:space-y-0">
                <div className="flex justify-center items-center col-span-2 md:col-span-1">
                <button
                  className="min-w-64 px-4 h-10 rounded-3xl
                text-lg font-light text-neutral-900
                bg-white shadow hover:shadow-lg hover:scale-[1.01]
                transition-all duration-300"
                onClick={() => alert('Functionality not implemented, sorry!')}
                >
                  Purchase Credits
                </button>
                </div>

                <div className="flex justify-center items-center col-span-2 md:col-span-1">
                <button
                  className="min-w-64 px-4 h-10 rounded-3xl
                text-lg font-light text-neutral-900
                bg-white shadow hover:shadow-lg hover:scale-[1.01]
                transition-all duration-300"
                onClick={() => alert('Functionality not implemented, sorry!')}
                >
                  Logout
                </button>
              </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
