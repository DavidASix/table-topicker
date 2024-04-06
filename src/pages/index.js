import React, { useState, useRef, useEffect  } from "react";
import Home from '@/tabs/Home'
import Profile from '@/tabs/Profile'
import Settings from '@/tabs/Settings'
import TabNavigationBar from '@/components/TabNavigationBar';

function App() {
  const scrollRef = useRef(null)
  return (
    <div className="bg-slate-800 h-screen w-screen flex flex-col 
    overflow-hidden">
      <header className="w-screen h-16 flex justify-between items-center px-10">
        <span className="text-slate-300 font-light">Ghub</span>
        <span className="text-green-900 font-light">
          @davidasix / buy me a coffee
        </span>
        <span className="text-slate-300 font-light">theme</span>
      </header>
      <main className="relative flex items-start flex-1 pb-10
      overflow-x-scroll snap-mandatory snap-x"
      ref={scrollRef}>
        <Home className='z-10' />
        <Profile className='z-10' />
        <Settings className='z-10' />
      </main>
        <TabNavigationBar className='z-20' scrollElement={scrollRef} />
    </div>
  );
}

export default App;
