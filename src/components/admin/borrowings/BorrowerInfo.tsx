
import React from "react";
import type { BorrowRow } from "./types";

interface BorrowerInfoProps {
  profile: BorrowRow['profiles'];
}

const BorrowerInfo = ({ profile }: BorrowerInfoProps) => {
  const getBorrowerName = (profile: BorrowRow['profiles']) => {
    if (!profile || 'error' in profile) return "Unknown User";
    return profile.full_name || "Unknown User";
  };

  const getBorrowerID = (profile: BorrowRow['profiles']) => {
    if (!profile || 'error' in profile) return "";
    return profile.college_id ? `(${profile.college_id})` : "";
  };

  return (
    <span>
      {getBorrowerName(profile)} {getBorrowerID(profile)}
    </span>
  );
};

export default BorrowerInfo;
