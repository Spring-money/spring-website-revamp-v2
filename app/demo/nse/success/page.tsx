"use client";

export default function NseSuccess() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#108e66]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <svg
          className="mx-auto mb-4"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#108e66"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#108e66"
            strokeWidth="2"
            fill="#e6f7f1"
          />
          <path
            d="M8 12l2 2l4-4"
            stroke="#108e66"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <h2 className="text-2xl font-bold text-[#108e66] mb-2">
          Transaction Successful!
        </h2>
        <p className="text-gray-700 mb-4">
          Your NSE transaction has been completed successfully.
          <br />
          Thank you for using SpringMoney.
        </p>
        <a
          href="/demo/nse"
          className="inline-block mt-4 px-6 py-2 bg-[#108e66] text-white rounded hover:bg-[#0c6c4c] transition-colors"
        >
          Back to NSE Form
        </a>
      </div>
    </div>
  );
}
