import React, { useState, useRef, useEffect } from "react";
import Home from "@/tabs/Home";
import Profile from "@/tabs/Profile";
import History from "@/tabs/History";
import TabNavigationBar from "@/components/TabNavigationBar";

import auth from "@/middleware/auth";

export const getServerSideProps = async (context) => {
  let props = {};
  await auth(context.req, context.res);
  props.user_str = JSON.stringify(context.req?.user);

  return { props };
};

function App({ user_str }) {
  const scrollRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initialUser = user_str ? JSON.parse(user_str) : false;
    setUser(initialUser);
  }, []);

  return (
    <>
      <div
        className=" bg-gradient-to-br from-slate-200 to-orange-300 
        h-screen w-screen flex flex-col overflow-hidden"
      >
        <header className="w-screen h-16 flex justify-between items-center px-10">
          <span className="header-font text-4xl text-nowrap whitespace-nowrap text-gradient from-orange-950 to-orange-700 ">
            Table Topicker
          </span>
          <div>
            <span className="header-font text-2xl">Credits{` `}</span>
            <span className="header-font text-2xl">Logout</span>
          </div>
        </header>
        <main
          className="relative flex items-start flex-1 pb-10
              overflow-x-scroll snap-mandatory snap-x"
          ref={scrollRef}
        >
          <Home user={user} className="z-10" />
          <Profile user={user} userLoggedIn={(user) => setUser(user)} />
          <History user={user} className="z-10" />
        </main>
        <TabNavigationBar className="z-20" scrollElement={scrollRef} />
      </div>
    </>
  );
}

export default App;
