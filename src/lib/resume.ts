import { readFileSync } from "node:fs";
import path from "node:path";
import { profile } from "@/data/profile";

export function getResumeAsset(): string | null {
  if (!profile.resumePath) return null;
  if (profile.resumePath !== "/resume.pdf")
    throw new Error("The approved resume must use public/resume.pdf");
  const pdf = readFileSync(path.join(process.cwd(), "public/resume.pdf"));
  if (pdf.subarray(0, 5).toString() !== "%PDF-")
    throw new Error("public/resume.pdf must be a PDF document");
  return profile.resumePath;
}
