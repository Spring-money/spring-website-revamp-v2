"use client";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import BackToDemoButton from "../../components/BackToDemoButton";

export default function BsePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    folioNo: "",
    pan: "",
    schemeCode: "HDFC123",
    amount: "1000",
    investmentType: "LUMPSUM"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("BSE Star MF integration coming soon!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#108e66] py-4">
      <BackToDemoButton />
      <div className="flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold text-[#108e66] mb-6 text-center">
            BSE Star MF Demo
          </h2>

          <div className="mb-4">
            <label className="block mb-1 text-[#108e66]">Folio Number (Optional)</label>
            <input
              type="text"
              name="folioNo"
              value={form.folioNo}
              onChange={handleChange}
              placeholder="Enter folio number for existing investor"
              className="w-full p-2 border rounded border-[#108e66]"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-[#108e66]">PAN</label>
            <input
              type="text"
              name="pan"
              value={form.pan}
              onChange={handleChange}
              placeholder="Enter PAN number"
              className="w-full p-2 border rounded border-[#108e66]"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-[#108e66]">Scheme</label>
            <select
              name="schemeCode"
              value={form.schemeCode}
              onChange={handleChange}
              className="w-full p-2 border rounded border-[#108e66]"
            >
              <option value="HDFC123">HDFC Top 100 Fund</option>
              <option value="ICICI456">ICICI Prudential Bluechip Fund</option>
              <option value="SBI789">SBI Small Cap Fund</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-[#108e66]">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded border-[#108e66]"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-[#108e66]">Investment Type</label>
            <select
              name="investmentType"
              value={form.investmentType}
              onChange={handleChange}
              className="w-full p-2 border rounded border-[#108e66]"
            >
              <option value="LUMPSUM">Lumpsum</option>
              <option value="SIP">SIP</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.pan || !form.amount || isLoading}
            className={`w-full p-2 rounded text-white font-semibold transition-colors duration-300 ${
              form.pan && form.amount && !isLoading
                ? "text-teal-700 bg-teal-400"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? <ClipLoader color="#108e66" /> : "Invest Now"}
          </button>
          
          <p className="mt-4 text-sm text-gray-500 text-center">
            BSE Star MF integration is coming soon. This is a demo interface.
          </p>
        </div>
      </div>
    </div>
  );
} 