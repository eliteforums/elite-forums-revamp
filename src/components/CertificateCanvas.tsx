import { forwardRef } from "react";
import certificateTemplate from "@/assets/certificate-template.png.asset.json";

export interface CertificateData {
  fullName: string;
  course: string;
  college: string;
  department: string;
  completionDate: string;
  certificateId: string;
}

const formatDate = (value: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

/**
 * Fixed 1358 x 1920 certificate artwork.
 * Rendered at natural size and scaled down with CSS transform by the parent,
 * so html2canvas always captures full print resolution.
 */
const CertificateCanvas = forwardRef<HTMLDivElement, { data: CertificateData }>(
  ({ data }, ref) => {
    const serif = "'EB Garamond', Georgia, 'Times New Roman', serif";

    return (
      <div
        ref={ref}
        style={{
          width: 1358,
          height: 1920,
          position: "relative",
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <img
          src={certificateTemplate.url}
          alt="Elite Forums certificate of completion"
          crossOrigin="anonymous"
          style={{ width: 1358, height: 1920, display: "block" }}
        />

        {/* Recipient name */}
        <div
          style={{
            position: "absolute",
            top: 830,
            left: 120,
            width: 1118,
            textAlign: "center",
            fontFamily: serif,
            fontSize: data.fullName.length > 24 ? 62 : 78,
            fontWeight: 600,
            color: "#1b2a4a",
            letterSpacing: "0.5px",
            lineHeight: 1.1,
          }}
        >
          {data.fullName}
        </div>

        {/* Cover the template's baked-in paragraph, then draw the dynamic one */}
        <div
          style={{
            position: "absolute",
            top: 1085,
            left: 110,
            width: 1138,
            height: 340,
            backgroundColor: "#ffffff",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 1095,
            left: 130,
            width: 1098,
            textAlign: "center",
            fontFamily: serif,
            fontSize: 34,
            lineHeight: 1.5,
            color: "#111111",
          }}
        >
          Successfully completed the {data.course} program at Elite Forums, concluding on{" "}
          {formatDate(data.completionDate)}. During the program, the participant from{" "}
          {data.college} ({data.department}) gained hands-on, industry-relevant experience and
          demonstrated strong technical skills, dedication and excellent performance throughout.
        </div>

        {/* Certificate ID */}
        <div
          style={{
            position: "absolute",
            top: 1432,
            left: 130,
            width: 1098,
            textAlign: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 22,
            letterSpacing: "1.5px",
            color: "#5b6478",
            fontWeight: 700,
          }}
        >
          CERTIFICATE ID: {data.certificateId}
        </div>
      </div>
    );
  }
);

CertificateCanvas.displayName = "CertificateCanvas";

export default CertificateCanvas;
