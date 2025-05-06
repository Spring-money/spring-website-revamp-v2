"use client";
import { useSearchParams } from "next/navigation";

export default function NseSuccess() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams?.get("PaymentStatus");
  const paymentMsg = searchParams?.get("PaymentMsg");

  const isSuccess = paymentStatus === "SUCCESS";

  return (
    <div className={`flex justify-center items-center min-h-screen ${isSuccess ? "bg-[#108e66]" : "bg-[#d32f2f]"}`}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {isSuccess ? (
          <>
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
            </p>
          </>
        ) : (
          <>
            <svg
              className="mx-auto mb-4"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d32f2f"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#d32f2f"
                strokeWidth="2"
                fill="#ffebee"
              />
              <line x1="9" y1="9" x2="15" y2="15" stroke="#d32f2f" strokeWidth="2" />
              <line x1="15" y1="9" x2="9" y2="15" stroke="#d32f2f" strokeWidth="2" />
            </svg>
            <h2 className="text-2xl font-bold text-[#d32f2f] mb-2">
              Transaction Error
            </h2>
            <p className="text-gray-700 mb-4">
              {paymentMsg ? decodeURIComponent(paymentMsg) : "There was an issue processing your transaction. Please try again or contact support."}
            </p>
          </>
        )}
        <a
          href="/demo/nse"
          className={`inline-block mt-4 px-6 py-2 ${isSuccess ? "bg-[#108e66] hover:bg-[#0c6c4c]" : "bg-[#d32f2f] hover:bg-[#b71c1c]"} text-white rounded transition-colors`}
        >
          Back to NSE Form
        </a>
        <p className="mt-4 text-gray-500 text-sm">Thank you for using SpringMoney.</p>
      </div>
    </div>
  );
}
