/* eslint-disable @typescript-eslint/no-explicit-any */

export type TApplication = {
  _id: string;
  jobId: string;
  userId: string;
  status?: "applied" | "withdrawn" | "shortlisted" | "hired" | "rejected";
  selectedCandidate?: string;
  resume: string;
  noteFromApplicant?: string;
  applicant : any;
  createdAt: string;
  updatedAt: string;
};