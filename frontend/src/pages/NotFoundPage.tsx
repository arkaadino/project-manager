import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gray-800 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl text-white font-bold mb-4">OOPS!</h1>
      <span className="text-2xl text-gray-300 mb-6">
        You are reaching the Void..
      </span>

      <div className="flex gap-4">        {/* Button Go Back */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-900/20 text-white font-semibold px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-950/30 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
