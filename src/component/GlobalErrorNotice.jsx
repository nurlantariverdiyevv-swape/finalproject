import { useEffect, useState } from "react";

function GlobalErrorNotice() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      console.error("Uncaught error:", event.error || event.message);
      setMessage("Something went wrong. Please try that again.");
    };
    const handleRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      setMessage("Something went wrong. Please try that again.");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[300] bg-black text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl flex items-center gap-3">
      <span>{message}</span>
      <button type="button" onClick={() => setMessage(null)} className="text-white/70 hover:text-white cursor-pointer font-bold" aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
}

export default GlobalErrorNotice;