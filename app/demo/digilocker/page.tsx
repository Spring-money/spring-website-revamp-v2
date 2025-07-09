"use client";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import BackToDemoButton from "../../components/BackToDemoButton";

export default function DigilockerDemoPage() {
  const [mobile, setMobile] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [digilockerData, setDigilockerData] = useState<any | null>(null);
  const [lastProcessedMobile, setLastProcessedMobile] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isMobileValid = /^\d{10}$/.test(mobile);

  const tryParseJSON = (val: string) => {
    try {
      const parsed = JSON.parse(val);
      return parsed;
    } catch {
      return val;
    }
  };

  const renderUserProfile = (userData: any) => {
    if (!userData) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-[#108e66] mb-3">Personal Information</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {userData.given_name && (
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{userData.given_name}</span>
            </div>
          )}
          {userData.email && (
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{userData.email}</span>
            </div>
          )}
          {userData.phone_number && (
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{userData.phone_number}</span>
            </div>
          )}
          {userData.birthdate && (
            <div className="flex justify-between">
              <span className="font-medium">Date of Birth:</span>
              <span>{userData.birthdate}</span>
            </div>
          )}
          {userData.gender && (
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{userData.gender === 'M' ? 'Male' : userData.gender === 'F' ? 'Female' : userData.gender}</span>
            </div>
          )}
          {userData.masked_aadhaar && (
            <div className="flex justify-between">
              <span className="font-medium">Masked Aadhaar:</span>
              <span>{userData.masked_aadhaar}</span>
            </div>
          )}
          {userData.pan_number && (
            <div className="flex justify-between">
              <span className="font-medium">PAN:</span>
              <span>{userData.pan_number}</span>
            </div>
          )}
          {userData.driving_licence && (
            <div className="flex justify-between">
              <span className="font-medium">Driving License:</span>
              <span>{userData.driving_licence}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAuthenticationDetails = (userData: any, tokenData: any) => {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-[#108e66] mb-3">Authentication Details</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {userData?.auth_mode && (
            <div className="flex justify-between">
              <span className="font-medium">Authentication Method:</span>
              <span>{userData.auth_mode.replace('DL_', '').replace('_', ' ')}</span>
            </div>
          )}
          {userData?.auth_time && (
            <div className="flex justify-between">
              <span className="font-medium">Login Time:</span>
              <span>{new Date(userData.auth_time * 1000).toLocaleString()}</span>
            </div>
          )}
          {tokenData?.token_type && (
            <div className="flex justify-between">
              <span className="font-medium">Token Type:</span>
              <span>{tokenData.token_type}</span>
            </div>
          )}
          {tokenData?.expires_in && (
            <div className="flex justify-between">
              <span className="font-medium">Session Duration:</span>
              <span>{Math.floor(tokenData.expires_in / 60)} minutes</span>
            </div>
          )}
          {tokenData?.consent_valid_till && (
            <div className="flex justify-between">
              <span className="font-medium">Consent Valid Till:</span>
              <span>{new Date(tokenData.consent_valid_till * 1000).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleRedirect = async (forceRefresh = false) => {
    if (!isMobileValid) return;
    
    // Clear any previous errors
    setError("");
    
    // If this is a different mobile number, ensure we start fresh
    if (lastProcessedMobile !== mobile) {
      setDigilockerData(null);
      setLastProcessedMobile(mobile);
    }
    
    setIsLoading(true);

    try {
      console.log(`Fetching Digilocker link for mobile: ${mobile}`);
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const res = await fetch(`/api/demo/digilocker/authorize-link?mobile=${mobile}&_t=${timestamp}${forceRefresh ? '&force=true' : ''}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch Digilocker link: ${res.status} - ${errorText}`);
      }
      
      const json = await res.json();
      console.log("API Response:", json);
      
      if (json.success && json.data) {
        const authWindow = window.open(json.data, "_blank");
        if (!authWindow) {
          throw new Error("Popup blocked. Please allow pop-ups and try again.");
        }
        
        console.log("Digilocker window opened, waiting for completion...");
        
        // Poll until window is closed
        const poll = setInterval(async () => {
          if (authWindow.closed) {
            clearInterval(poll);
            console.log("Digilocker window closed, fetching data...");
            try {
              const dataRes = await fetch(`/api/demo/digilocker/data?mobile=${mobile}`);
              const dataJson = await dataRes.json();
              if (dataJson.success) {
                setDigilockerData(dataJson.data);
                console.log("Data fetched successfully");
              } else {
                setError(dataJson.message || "No data returned from Digilocker");
              }
            } catch (e) {
              console.error(e);
              setError("Failed to fetch Digilocker data");
            } finally {
              setIsLoading(false);
            }
          }
        }, 1000);
      } else {
        setError(json.message || "Unable to get Digilocker link");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#108e66] py-4">
      <BackToDemoButton />
      <div className="flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold text-[#108e66] mb-6 text-center">
            Digilocker Demo
          </h2>

          {/* Mobile Number Input */}
          <div className="mb-4">
            <label className="block mb-1 text-[#108e66]">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                // Clear previous data when mobile number changes
                setDigilockerData(null);
              }}
              placeholder="Enter 10-digit mobile number"
              className="w-full p-2 border rounded border-[#108e66]"
              // Mobile number remains editable
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
              <div className="flex space-x-2 mt-2">
                <button 
                  onClick={() => setError("")}
                  className="text-red-600 text-xs underline"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => handleRedirect(true)}
                  className="text-blue-600 text-xs underline"
                >
                  Try Again (Force Refresh)
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => handleRedirect(false)}
            disabled={!isMobileValid || isLoading}
            className={`w-full p-2 rounded text-white font-semibold transition-colors duration-300 ${
              isMobileValid && !isLoading
                ? "text-teal-700 bg-teal-400"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <ClipLoader color="#108e66" />
            ) : (
              "Fetch Details from Digilocker"
            )}
          </button>

          {/* Display Digilocker data if available */}
          {digilockerData && (
            <div className="mt-6 max-h-96 overflow-y-auto border-t pt-4">
              <h3 className="text-lg font-semibold text-[#108e66] mb-4">
                Digilocker Information
              </h3>
              {Array.isArray(digilockerData?.data) && digilockerData.data.length > 0 ? (
                (() => {
                  const record = digilockerData.data[0];
                  const responseJson = typeof record.response_json === "string" 
                    ? tryParseJSON(record.response_json) 
                    : record.response_json;
                  
                  const digilockerDetails = responseJson?.digilockerDetails;
                  const tokenDetails = responseJson?.tokenDetails;

                  return (
                    <div className="space-y-4">
                      {renderUserProfile(digilockerDetails)}
                      {renderAuthenticationDetails(digilockerDetails, tokenDetails)}
                      
                      {/* System Information */}
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-[#108e66] mb-3">System Information</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Mobile Number:</span>
                            <span>{record.mobile_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Record Created:</span>
                            <span>{new Date(record.creation).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Last Modified:</span>
                            <span>{new Date(record.modified).toLocaleString()}</span>
                          </div>
                          {digilockerDetails?.user_sso_id && (
                            <div className="flex justify-between">
                              <span className="font-medium">User ID:</span>
                              <span className="text-xs break-all">{digilockerDetails.user_sso_id}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-gray-500">No data found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 