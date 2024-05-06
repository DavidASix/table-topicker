import React, { useState, useRef, useEffect } from "react";
import Home from "@/tabs/Home";
import Profile from "@/tabs/Profile";
import History from "@/tabs/History";
import TabNavigationBar from "@/components/TabNavigationBar";
import Alert from "@/components/Alert";

import auth from "@/middleware/auth";

export const getServerSideProps = async (context) => {
  let props = {};
  try {
    await auth(context.req, context.res);
    props.user_str = JSON.stringify(context.req?.user);
  } catch (err) {
    console.log(err)
    props.user_str = null
  }

  return { props };
};

function App({ user_str }) {
  const scrollRef = useRef(null);
  const [user, setUser] = useState(null);
  const [message, setAlertMessage] = useState("");
  const [visible, setAlertVisible] = useState("");
  const [type, setAlertType] = useState("");

  useEffect(() => {
    const initialUser = user_str ? JSON.parse(user_str) : false;
    setUser(initialUser);
  }, []);

  async function refreshUser() {
    try {
      setUser((p) => ({...p}));
    } catch (err) {
      console.log('error updating user: ', err)
    }
  }

  function showAlert(type, msg) {
    if (!visible) {
      setAlertType(type);
      setAlertMessage(msg);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    }
  }
  
  return (
    <>
      <div
        className="bg-base-100
        relative h-screen w-screen flex flex-col overflow-hidden"
      >
        <Alert type={type} visible={visible} message={message} />
        <div className="-z-0 absolute h-full w-full doodles-light opacity-10" />
        <header className="z-10 w-screen h-16 flex justify-between items-center px-2 md:px-10">
          <span className="header-font text-4xl font-extrabold text-nowrap whitespace-nowrap text-gradient from-neutral-50 to-neutral-200 ">
            Table Topicker
          </span>
          <div>
            <span className="font-light text-xl text-white">
              {user?.credits || 0} Credits
            </span>
          </div>
        </header>
        <main
          className="relative flex items-start flex-1 pb-16
              overflow-x-scroll snap-mandatory snap-x scroll-smooth"
          ref={scrollRef}
        >
          <Home
            user={user}
            refreshUser={() => refreshUser()}
            showAlert={(type, msg) => showAlert(type, msg)}
            className="z-10"
          />
          <Profile
            user={user}
            showAlert={(type, msg) => showAlert(type, msg)}
            userLoggedIn={(user) => setUser(user)}
          />
          <History
            user={user}
            showAlert={(type, msg) => showAlert(type, msg)}
            className="z-10"
          />
        </main>
        <TabNavigationBar className="z-20" scrollElement={scrollRef} />
      </div>
    </>
  );
}

export default App;
