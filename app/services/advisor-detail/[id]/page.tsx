"use client";

import { use } from "react";
import { redirect } from "next/navigation";
import { getAdvisorUrl } from "@/services/lib/advisorData";
import { advisors } from "@/services/data/advisors";

/* --------------------------------------------------------------------
   Helpers
-------------------------------------------------------------------- */
function getAdvisor(id: string) {
  const found = advisors.find((a) => a.id === id);
  if (!found) return null;
  return found;
}

/* --------------------------------------------------------------------
   Page Component
-------------------------------------------------------------------- */
export default function AdvisorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const advisor = getAdvisor(id);
  
  if (!advisor) {
    redirect('/services');
  }
  
  // Redirect to new URL structure
  const newUrl = getAdvisorUrl(advisor.advisorName, advisor.firmName, id);
  redirect(newUrl);
}
