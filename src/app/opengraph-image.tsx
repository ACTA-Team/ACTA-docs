import { ImageResponse } from "next/og";

export const alt = "ACTA Documentation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background:
          "linear-gradient(180deg, #0c0f18 0%, #06070b 55%, #06070b 100%)",
        color: "#f5f5f5",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "56px",
            borderRadius: "9px",
            background: "#ffd21f",
          }}
        />
        <div style={{ fontSize: "44px", fontWeight: 700, letterSpacing: 2 }}>
          ACTA
        </div>
        <div
          style={{
            fontSize: "24px",
            letterSpacing: 6,
            color: "rgba(245,245,245,0.55)",
            textTransform: "uppercase",
          }}
        >
          Docs
        </div>
      </div>
      <div
        style={{
          fontSize: "68px",
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: "900px",
        }}
      >
        Verifiable Credentials Infrastructure on Stellar
      </div>
      <div
        style={{
          marginTop: "28px",
          fontSize: "30px",
          color: "rgba(245,245,245,0.6)",
        }}
      >
        docs.acta.build
      </div>
    </div>,
    size
  );
}
