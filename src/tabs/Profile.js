import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import c from "@/assets/constants";
import SmallCoins from '/public/coins/sm_coins.svg';
import MediumCoin from '/public/coins/md_coins.svg';
import LargeCoins from '/public/coins/lg_coins.svg';
import XLCoins from '/public/coins/xl_coins.svg';

const pricePerCreditByQuantity = {
  10: {pricePerCredit: 25, icon: (props) => <SmallCoins {...props} />,},
  25: {pricePerCredit: 20, icon: (props) => <MediumCoin {...props} />,},
  100: {pricePerCredit: 10, icon: (props) => <LargeCoins {...props} />,},
  250: {pricePerCredit: 8, icon: (props) => <XLCoins {...props} />,},
};

let CAD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'CAD',
});

function Profile({ user, showAlert }) {
  const [email, setEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  async function loginSubmit(event) {
    event.preventDefault();
    setLoginLoading(true);
    try {
      await axios.post("/api/auth/sendMagicLink", { email });
      setLoginLoading("sent");
      showAlert("success", "Login Link Sent");

      let loggedIn = false;
      while (!loggedIn) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        loggedIn = await checkForToken();
      }
      // Reload ther page
      window.location.reload();
    } catch (error) {
      // Handle error
      showAlert("Error sending login link, please try again.");
      setLoginLoading(false);

      // Implement your DaisyUI Alert here with error.response.data.message (or a generic error message if that's not available)
      console.error("Error sending magic link:", error);
    }
  }

  async function checkForToken() {
    try {
      await axios.get("/api/auth/checkLogin");
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async function onClickLogout() {
    try {
      await axios.get("/api/auth/logout");
      // Cookie is invalidated server side
      window.location.reload();
    } catch (err) {
      showAlert("Could not logout, please try again.");
      console.log(err);
    }
  }

  return (
    <div className="h-full snap-center snap-always" id="profile">
      <div className={`${c.sectionPadding} relative w-screen h-full px-2 pb-16`}>
        <div
          className={`${c.contentContainer} w-full h-full flex flex-col overflow-scroll
          backdrop-blur-sm rounded-[2.5rem] pt-4 pb-8 border border-neutral-800 justify-between`}
        >
          {!user && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <form
                className="bg-transparent space-y-4 rounded-xl w-full md:w-1/2"
                onSubmit={loginSubmit}
              >
                <h2 className="text-6xl font-bold text-center text-white mb-6">
                  Login
                </h2>
                <p className="text-center text-2xl">
                  Infinite AI Topics? Topic History? Lifetime Stats? <br />
                  Sign up for even more features!
                </p>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-white">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="rounded-lg border border-gray-300 w-full px-3 py-2 focus:outline-none focus:border-blue-500 bg-white/30 text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`relative w-full text-neutral-400 enabled:text-white font-medium py-3 px-8 rounded-full focus:outline-none focus:shadow-outline
                  transition-all duration-300 enabled:hover:bg-orange-700 
                  ${
                    loginLoading === "sent"
                      ? "bg-emerald-700/60"
                      : loginLoading
                      ? "bg-neutral-700/60"
                      : "bg-orange-500/60"
                  }`}
                  disabled={loginLoading}
                >
                  {loginLoading === "sent" ? (
                    <>
                      Waiting for link click
                      <span className="absolute end-4 loading loading-ring loading-md"></span>
                    </>
                  ) : loginLoading ? (
                    "Sending Magic Link..."
                  ) : (
                    "Login"
                  )}
                </button>
                <p className="text-center">
                  {loginLoading === 'sent' && `If you have clicked the link and this page hasn't changed for 10 seconds, please refresh.`}
                  {loginLoading !== 'sent' && `Table Topicker uses Magic Link login, simply enter your email below then click the link in your email!`}
                </p>
                <p className="text-sm text-neutral-500 text-center leading-snug">
                  By creating a Table Topicker account you agree to our{" "}
                  <a href="/legal/privacy-policy" className="link-clean">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/legal/terms-of-service" className="link-clean">
                    Terms of Service
                  </a>
                  .
                </p>
              </form>
            </div>
          )}

          {user && (
            <React.Fragment>
              <div className="flex flex-col space-y-1 pb-8 ">
                <div className="w-100 flex justify-between items-center mt-2">
                  <h2 className="text-5xl font-semibold">Profile</h2>
                  <span className="text-5xl">
                    💬
                  </span>
                </div>
                <div className="px-2 py-4 w-full flex flex-col">
                  <span className="text-white text-sm font-bold">Email:</span>
                  <span className="text-white text-xl ms-4">{user.email}</span>
                </div>

                <div 
                  className="w-100 flex justify-between items-center pt-4">
                  <h2 className="text-5xl font-semibold relative">
                    Credits
                    <span 
                      className="absolute -top-4 -right-4 text-base tooltip tooltip-primary cursor-pointer"
                      data-tip="One credit allows you to generate a single AI Table Topic from a category you choose.">
                    ℹ️
                    </span>
                  </h2>
                  <span className="text-5xl">
                    🪙
                  </span>
                </div>
                <p className="text-2xl pt-4">
                  You currently have <b className="text-primary">{user.credits || 0}</b> credits.
                </p>
                <p className="text-2xl pt-2">
                  Credits allow you to generate a topic for any category using AI. 
                  Purchase more credits to continue practicing your speaking skills!<br />
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 content-start px-2 py-4">
                  {Object.keys(pricePerCreditByQuantity).map((k,i) => {
                    const Icon = (props) => pricePerCreditByQuantity[k].icon(props);
                    return (
                    <div 
                      key={k}
                      className="flex flex-row justify-between items-center lg:px-2">
                      <div className="flex space-x-4 justify-start items-center">
                        <Icon className="h-16 w-auto" />
                        <span className="flex flex-col justify-center">
                          <span className="text-2xl whitespace-nowrap">
                            <b>{k}</b> Credits
                          </span>
                          <span className="text-sm">
                            {pricePerCreditByQuantity[k].pricePerCredit}¢ per credit 
                          </span>
                        </span>
                      </div>
                      <a
                        className="h-12 w-32 sm:w-56 lg:w-32 rounded-3xl 
                          text-lg font-bold text-white
                          btn btn-primary"
                        href={`/api/payment/purchase?q=${k}`}
                      >
                        {CAD.format(pricePerCreditByQuantity[k].pricePerCredit * k / 100).slice(2)}
                      </a>
                    </div>
                    )}
                  )}
                </div>
              </div>
            <button
              className="min-w-64 h-12 btn btn-outline btn-ghost rounded-full text-lg font-light"
              onClick={() => onClickLogout()}
            >
              Logout
            </button>
          </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
