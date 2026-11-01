import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#0b1118",
        color: "#e9edf2",
        padding: "64px 72px",
        borderTop: "6px solid #9adbdc",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28 }}>
        <span style={{ color: "#9adbdc", fontSize: 36 }}>{"{ }"}</span>
        <span>{profile.name ?? profile.brand}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{ color: "#9adbdc", fontSize: 22, letterSpacing: 3, textTransform: "uppercase" }}
        >
          {profile.role}
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.13, letterSpacing: -3, maxWidth: 1000 }}>
          Engineering reliable systems at scale.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: "1px solid #2a3745",
          fontSize: 22,
          color: "#a4b0bd",
        }}
      >
        <span>Java · Distributed systems · Cloud</span>
        <span>{profile.location}</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
