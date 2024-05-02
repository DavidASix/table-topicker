import React from "react";

function AlertMessage({ visible, message, type }) {
  // Helper function to get the correct classes and icon
  const getAlertDetails = (type) => {
    switch (type) {
      case "warning":
        return {
          className: "alert alert-warning",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ),
        };
      case "info":
        return {
          className: "alert alert-info",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "success":
        return {
          className: "alert alert-success",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      default: // Error case
        return {
          className: "alert alert-error",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const { className, icon } = getAlertDetails(type);

  return (
    <div
      className={`w-full p-4 absolute z-50 top-0 transition-all duration-400 ${
        visible ? "translate-y-0" : "-translate-y-full opacity-0"
      }`}
    >
      <div role="alert" className={`flex items-start gap-4 ${className}`}>
        {icon}
        <span className="flex-grow">{message}</span>
      </div>
    </div>
  );
}

export default AlertMessage;
