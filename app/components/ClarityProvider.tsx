"use client";
import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    console.log("ClarityProvider");
    const projectId = "re9hm0zkl8"; // Replace with your actual project ID
    Clarity.init(projectId);
  }, []);
  return null;
}