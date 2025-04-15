"use client";
import { useState } from "react";

declare global {
  interface Window {
    scDK: any;
  }
}

export default function EquityPage() {
  const [form, setForm] = useState({
    ticker: "",
    quantity: "",
    type: "",
    orderType: "",
    price: "",
  });

  const isFormValid =
    form.ticker !== "" &&
    form.quantity !== "" &&
    form.type !== "" &&
    form.orderType !== "" &&
    form.price !== "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/demo/equity/execute-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_advise_details_id: Math.floor(Math.random() * 10000),
          investor_name: "demo_purpose",
          investor_id: `demo_purpose_${Math.floor(Math.random() * 10000)}`,
          securities: [
            {
              ticker: form.ticker,
              quantity: Number(form.quantity),
              type: form.type,
              order_type: form.orderType,
              price: Number(form.price),
              trigger_price: null,
            },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      getAuthToken(data?.data?.sp_transaction_id);
    } catch (error) {
      console.error("Error calling SDK:", error);
    }
  };

  const getAuthToken = async (spTxnId: string) => {
    try {
      const response = await fetch("/api/demo/equity/auth-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      initiateTransaction(spTxnId, data?.data?.token);
    } catch (error) {
      console.error("Error calling SDK:", error);
    }
  };

  const initiateTransaction = async (spTxnId: string, authToken: string) => {
    try {
      const response = await fetch("/api/demo/equity/initiate-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sp_transaction_id: spTxnId,
          gateway_auth_token: authToken,
        }),
      });
      const data = await response.json();
      smallCaseSdkTrigger(authToken, data?.data?.transaction_id);
    } catch (error) {
      console.error("Error calling SDK:", error);
    }
  };

  const smallCaseSdkTrigger = async (
    JwtToken: any,
    TransactionIdApiResponse: any
  ) => {
    const gatewayInstance = new window.scDK({
      gateway: "plan360degree",
      smallcaseAuthToken: `${JwtToken}`,
      config: {
        amo: false,
      },
    });

    gatewayInstance.init({ smallcaseAuthToken: JwtToken });

    gatewayInstance
      .triggerTransaction({
        transactionId: `${TransactionIdApiResponse}`,
        // brokers: ["kite", "angelbroking", "icici", "hdfc", "kotak", "motilal"],
      })
      .then((txnResponse: any) => {
        // SmallCaseResponseSend(txnResponse);
        // DeleteNotification(smallCaseNotificationDetails.id);
      })
      .catch((err: any) => {
        console.error("Error in triggering transaction:", err);
        // DeleteNotification(smallCaseNotificationDetails.id);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#108e66]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-[#108e66] mb-6 text-center">
          SDK Call Form
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">Ticker</label>
          <select
            name="ticker"
            value={form.ticker}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          >
            <option value="">Select a ticker</option>
            <option value="M&M">Mahindra & Mahindra</option>
            <option value="TATATECH">Tata Technologies Ltd</option>
            <option value="NATCOPHARM">Natco Pharma</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          >
            <option value="">Select type</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">Order Type</label>
          <select
            name="orderType"
            value={form.orderType}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          >
            <option value="">Select order type</option>
            <option value="MARKET">MARKET</option>
            <option value="LIMIT">LIMIT</option>
            <option value="SL">SL</option>
            <option value="SLM">SLM</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-[#108e66]">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full p-2 rounded text-white font-semibold transition-colors duration-300 ${
            isFormValid
              ? "bg-[#108e66] hover:bg-teal-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Call SDK
        </button>
      </div>
    </div>
  );
}
