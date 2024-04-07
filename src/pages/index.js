import React, { useState, useRef, useEffect } from "react";
import { Head } from "next/document";
import Home from "@/tabs/Home";
import Profile from "@/tabs/Profile";
import History from "@/tabs/History";
import TabNavigationBar from "@/components/TabNavigationBar";

import auth from "@/middleware/auth";

export const getServerSideProps = async (context) => {
  let props = {};
  await auth(context.req, context.res);
  props.user_str = JSON.stringify(context.req?.user);

  return {props};
};

function App({ user_str }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const initialUser = user_str ? JSON.parse(user_str) : null;
    setUser(initialUser);
  }, []);
  //console.log(user);
  const scrollRef = useRef(null);
  return (
    <>
      <div
        className="bg-slate-800 h-screen w-screen flex flex-col 
    overflow-hidden"
      >
        <header className="w-screen h-16 flex justify-between items-center px-10">
          <span className="text-slate-300 font-light">Ghub</span>
          <span className="text-green-900 font-light">
            @davidasix / buy me a coffee
          </span>
          <span className="text-slate-300 font-light">theme</span>
        </header>
        <main
          className="relative flex items-start flex-1 pb-10
      overflow-x-scroll snap-mandatory snap-x"
          ref={scrollRef}
        >
          <Home user={user} className="z-10" />
          <Profile
            user={user}
            className="z-10"
            userLoggedIn={(user) => setUser(user)}
          />
          <History user={user} className="z-10" />
        </main>
        <TabNavigationBar className="z-20" scrollElement={scrollRef} />
      </div>
    </>
  );
}

export default App;
