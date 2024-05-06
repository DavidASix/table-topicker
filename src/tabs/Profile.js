import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import c from "@/assets/constants";

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
      <div className={`${c.sectionPadding} relative w-screen h-full px-2`}>
        <div
          className={`${c.contentContainer} w-full h-full flex flex-col 
          backdrop-blur-sm rounded-[2.5rem] py-4 border border-neutral-800`}
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
                  Sign up for even more features! email!
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
                    onClick={() =>
                      alert("Functionality not implemented, sorry!")
                    }
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
                    onClick={() => onClickLogout()}
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
