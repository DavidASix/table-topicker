import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { domain } from "@/config";

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

  const contentContainer = `
    relative h-full w-screen 
    flex justify-center
    px-2 md:px-4 lg:px-10 xl:px-20 2xl:px-52 py-2`;
  return (
    <div className="h-full snap-center snap-always">
      <div className={`${contentContainer}`}>
        <div className="max-w-[1000px] w-full h-full flex flex-col pt-20">
          <div className="h-full flex flex-col border border-neutral-200
          bg-white bg-opacity-60 backdrop-blur-3xl shadow-xl rounded-[3rem] py-4 px-8" >
            <h1 className="-mt-24 -ms-4 md:ms-0 header-font text-start text-[5rem]
            text-gradient from-neutral-950 to-neutral-600 uppercase">
              Profile
            </h1>
        {user === false && <LoginForm />}
        {user && (
          <>
            <div className="border-b border-neutral-500 px-2 py-4 w-full flex flex-col">
              <span className="text-sm font-bold">Email:</span>
              <span className="text-xl ms-4">
                {user.email}
              </span>
            </div>
            <div className="w-full flex justify-center space-x-4 py-4">
              <button className="min-w-64 px-4 h-10 rounded-3xl
                text-lg font-light text-neutral-900
                bg-white shadow hover:shadow-lg hover:scale-[1.01]
                transition-all duration-300">
                  Purchase Credits
              </button>
              <button className="min-w-64 px-4 h-10 rounded-3xl
                text-lg font-light text-neutral-900
                bg-white shadow hover:shadow-lg hover:scale-[1.01]
                transition-all duration-300">
                  Logout
              </button>
            </div>
          </>
        )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
