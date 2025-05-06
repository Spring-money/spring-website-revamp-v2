"use client";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

// These values would typically come from user/session/context
const DEFAULT_IIN = "5014886384";
const DEFAULT_BANK = "HDF";
const DEFAULT_AC_NO = "50100169676321";
const DEFAULT_IFSC = "HDFC0000007";
const DEFAULT_HOLDER = "Omkar Vitthalrao Jadhav";

const TRANSACTION_TYPES = [
  { value: "lum_sum", label: "Lump sum" },
  { value: "sip", label: "SIP from today" },
  { value: "sip_scheduled", label: "SIP scheduled" },
  { value: "redeem", label: "Redeem" },
  { value: "switch", label: "Switch" },
  { value: "stp", label: "STP" },
  { value: "swp", label: "SWP" },
];

const PAYMENT_MODES = [
  { value: "UPI", label: "UPI" },
  { value: "OL", label: "Online" },
  { value: "M", label: "Debit Mandate" },
  { value: "CH", label: "Cheque" },
  { value: "DD", label: "Demand Draft" },
];

const PRODUCTS = [
  {
    value: "INF179K01LA9",
    label: "HDFC BSE SENSEX Index Fund",
  },
  {
    value: "INF179K01AS4",
    label: "HDFC Hybrid Equity Fund - Regular Plan - Growth",
  },
];

export default function NsePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    iin: DEFAULT_IIN,
    bank: DEFAULT_BANK,
    transaction_type: TRANSACTION_TYPES[0].value,
    payment_mode: PAYMENT_MODES[0].value,
    product: PRODUCTS[0].value,
    lum_sum_amount: "100",
    // SIP fields
    start_date: "",
    end_date: "",
    sip_amount: "",
  });

  // Validation
  const isLumSum = form.transaction_type === "lum_sum";
  const isSIP = form.transaction_type === "sip";
  const isFormValid =
    form.iin &&
    form.bank &&
    form.product &&
    form.payment_mode &&
    ((isLumSum && form.lum_sum_amount && Number(form.lum_sum_amount) > 0) ||
      (isSIP &&
        form.start_date &&
        form.end_date &&
        form.sip_amount &&
        Number(form.sip_amount) > 0));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to format date as DD-MMM-YYYY
  function formatDateToDDMMMYYYY(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mmm = date.toLocaleString("en-US", { month: "short" });
    const yyyy = date.getFullYear();
    return `${dd}-${mmm}-${yyyy}`;
  }
  // Helper to get day as two digits
  function getDayOfMonth(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return String(date.getDate()).padStart(2, "0");
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Map transaction type to sub_trxn_type
      const sub_trxn_type = isLumSum ? "N" : "S";
      const payload = {
        service_request: {
          appln_id: "MFS104917",
          password: "COMUS0GJ4JTJ3019",
          broker_code: "ARN-104917",
          iin: form.iin,
          sub_trxn_type,
          poa: "N",
          poa_bank_trxn_type: "",
          trxn_acceptance: "ALL",
          demat_user: "N",
          dp_id: "",
          bank: form.bank,
          ac_no: DEFAULT_AC_NO,
          ifsc_code: DEFAULT_IFSC,
          sub_broker_arn_code: "",
          sub_broker_code: "",
          euin_opted: "N",
          euin: "",
          trxn_execution: "",
          remarks: "",
          payment_mode: form.payment_mode,
          billdesk_bank: form.bank,
          instrm_bank: "",
          instrm_ac_no: "",
          instrm_no: "",
          instrm_amount: form.lum_sum_amount,
          instrm_date: "",
          instrm_branch: "",
          instrm_charges: "",
          micr: "",
          rtgs_code: "",
          neft_ifsc: "",
          advisory_charge: "",
          dd_charge: "",
          cheque_deposit_mode: "",
          debit_amount_type: "",
          sip_micr_no: "",
          sip_bank: "",
          sip_branch: "",
          sip_acc_no: "",
          sip_ac_type: "",
          sip_ifsc_code: "",
          sip_paymech: "",
          umrn: isSIP ? "HDFC7030605252021906" : "",
          ach_amt: isSIP ? "500" : "",
          ach_fromdate: isSIP ? "06-MAY-2025" : "",
          ach_enddate: isSIP ? "07-MAY-2026" : "",
          until_cancelled: "",
          Return_paymnt_flag: "Y",
          Client_callback_url: "https://www.springmoney.in/demo/nse/success",
          Bank_holder_name: DEFAULT_HOLDER,
          Bank_holder_name1: "",
          Bank_holder_name2: "",
          trxn_initiator: "I",
          trans_count: "1",
          utr_no: "",
          transfer_date: "",
          investor_auth_log: "",
          ach_exist: isSIP ? "Y" : "N",
          process_mode: "",
          channel_type: "",
        },
        childtrans: [
          {
            isin: form.product,
            folio: "",
            ft_acc_no: "",
            amount: form.lum_sum_amount,
            sip_from_date: isSIP ? formatDateToDDMMMYYYY(form.start_date) : "",
            sip_end_date: isSIP ? formatDateToDDMMMYYYY(form.end_date) : "",
            sip_freq: "OM",
            sip_amount: isSIP ? form.sip_amount : "",
            sip_period_day: isSIP ? getDayOfMonth(form.start_date) : "",
            input_ref_no: "",
            perpetual_flag: "",
            insurance_enabled: "",
            GOAL_BASED_SIP: "",
            GOAL_TYPE: "",
            GOAL_AMOUNT: "",
            FREEDOM_SIP: "",
            FREEDOM_TARGET_SCHEME: "",
            FREEDOM_TENURE: "",
            FREEDOM_SWP_AMOUNT: "",
            FREEDOM_SCHEME_OPTION: "",
          },
        ],
      };
      // Replace with your actual API endpoint
      const response = await fetch("/api/demo/nse/lum-sump-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Extract Paymentlink from response (service_response or service_status)
      const paymentLinkHtml =
        data?.data?.service_response?.Paymentlink ||
        data?.data?.service_status?.Paymentlink;
      if (paymentLinkHtml) {
        // Extract href from anchor tag
        const match = paymentLinkHtml.match(/href=['"]([^'"]+)['"]/);
        if (match && match[1]) {
          let url = match[1];
          // Add protocol if missing
          if (url.startsWith("//")) {
            url = "https:" + url;
          } else if (!url.startsWith("http")) {
            url = "https://" + url;
          }
          window.open(url, "_blank");
        }
      } else {
        console.log("data", data);
      }
    } catch (error) {
      console.error("Error submitting NSE transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#108e66]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-[#108e66] mb-6 text-center">
          NSE NMF Transaction 
        </h2>
        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">IIN</label>
          <input
            type="text"
            name="iin"
            value={form.iin}
            readOnly
            className="w-full p-2 border rounded border-[#108e66] bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">Bank</label>
          <input
            type="text"
            name="bank"
            value={form.bank}
            readOnly
            className="w-full p-2 border rounded border-[#108e66] bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">Transaction Type</label>
          <select
            name="transaction_type"
            value={form.transaction_type}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          >
            {TRANSACTION_TYPES.map((type) => (
              <option
                key={type.value}
                value={type.value}
                disabled={[
                  "sip_scheduled",
                  "redeem",
                  "switch",
                  "stp",
                  "swp"
                ].includes(type.value)}
              >
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">Payment Mode</label>
          <select
            name="payment_mode"
            value={form.payment_mode}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          >
            {PAYMENT_MODES.map((mode) => (
              <option
                key={mode.value}
                value={mode.value}
                disabled={[
                  "OL",
                  "M",
                  "CH",
                  "DD"
                ].includes(mode.value)}
              >
                {mode.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[#108e66]">Product</label>
          <select
            name="product"
            value={form.product}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          >
            {PRODUCTS.map((product) => (
              <option key={product.value} value={product.value}>
                {product.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-[#108e66]">Lump sum Amount</label>
          <input
            type="number"
            name="lum_sum_amount"
            value={form.lum_sum_amount}
            onChange={handleChange}
            className="w-full p-2 border rounded border-[#108e66]"
          />
        </div>
        {isSIP && (() => {
          // Calculate min date for sip_from_date (today + 21 days)
          const today = new Date();
          const minSipFromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 21);
          const minSipFromDateStr = minSipFromDate.toISOString().slice(0, 10);

          // Calculate min date for sip_end_date (sip_from_date + 6 months)
          let minSipEndDateStr = "";
          if (form.start_date) {
            const sipFrom = new Date(form.start_date);
            const minSipEndDate = new Date(sipFrom.getFullYear(), sipFrom.getMonth() + 6, sipFrom.getDate());
            minSipEndDateStr = minSipEndDate.toISOString().slice(0, 10);
          }

          return (
            <>
              <div className="mb-4">
                <label className="block mb-1 text-[#108e66]">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  min={minSipFromDateStr}
                  onChange={handleChange}
                  className="w-full p-2 border rounded border-[#108e66]"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-[#108e66]">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  min={minSipEndDateStr}
                  onChange={handleChange}
                  className="w-full p-2 border rounded border-[#108e66]"
                  disabled={!form.start_date}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 text-[#108e66]">SIP Amount</label>
                <input
                  type="number"
                  name="sip_amount"
                  value={form.sip_amount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded border-[#108e66]"
                />
              </div>
            </>
          );
        })()}


        <button
          type="button"
          onClick={handleSubmit}
          //   disabled={!isFormValid || isLoading}
          className={`w-full p-2 rounded text-white font-semibold transition-colors duration-300 ${
            isFormValid && !isLoading
              ? "text-teal-700 bg-teal-400"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? <ClipLoader color="#108e66" /> : "Submit"}
        </button>
      </div>
    </div>
  );
}
