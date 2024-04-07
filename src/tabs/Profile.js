import React, { useState, useRef, useEffect  } from "react";
import axios from 'axios';

import { domain } from '@/config'

function Profile({className, user, userLoggedIn}) {
  //const user = JSON.parse(user_str);
  //console.log({user, className})
  async function loginSubmit(e) {
    e.preventDefault()
    const email = e.target.email.value;
    try {
      const url = `${domain}/api/auth/sendMagicLink`
      const { data } = await axios.post(url, {email})
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className={`${className || ''} bg-slate-800
    h-full w-screen flex flex-col border snap-center snap-always`}>
      <div className="flex-1 flex flex-col items-center w-screen">

        <form className="bg-white rounded-lg p-8 max-w-sm mx-auto" 
        onSubmit={loginSubmit}>
          <h1 className="text-3xl font-light">Login</h1>
          <input className="w-full px-3 py-2 mt-4 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg placeholder-gray-900"
          placeholder="youremail@example.com" name="email" type="text" />
          <button className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mt-4" type="submit">Submit</button>
        </form>

        <h1 className="text-5xl text-white">Profile</h1>
      </div>
    </div>
  );
}

export default Profile;
