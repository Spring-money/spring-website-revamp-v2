"use client";
import AdvisorDetail from "../../spring-advisor-spotlight/src/pages/AdvisorDetail";
import { useParams } from "next/navigation";

export default function Page() {
  // Next.js provides params via props in server components, but for client components, use useParams
  // If AdvisorDetail needs the id, you may need to pass it down
  return <AdvisorDetail />;
}
