import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Foretrack AI - Smart Expense Tracking & Budget Management";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "sans-serif",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
          }}
        >
          🐷
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "72px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        Foretrack AI
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: "32px",
          color: "rgba(255,255,255,0.9)",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        Smart Expense Tracking & Budget Management
      </div>

      {/* Features */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "20px",
        }}
      >
        {["AI-Powered", "Smart Budgets", "Financial Insights"].map(
          (feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.15)",
                padding: "12px 24px",
                borderRadius: "100px",
                color: "white",
                fontSize: "20px",
              }}
            >
              ✓ {feature}
            </div>
          ),
        )}
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: "24px",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        foretrackai.in
      </div>
    </div>,
    {
      ...size,
    },
  );
}
