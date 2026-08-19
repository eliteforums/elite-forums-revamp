import { forwardRef } from "react";

export interface CertificateData {
  fullName: string;
  certificateId: string;
}

/**
 * The artwork is the exact certificate template supplied by Elite Forums,
 * rendered at 1358 x 1921 px. All overlay coordinates below were measured
 * directly from the source template, so the printed layout matches 1:1.
 */
export const CERTIFICATE_WIDTH = 1358;
export const CERTIFICATE_HEIGHT = 1921;
export const CERTIFICATE_TEMPLATE_SRC = "/assets/certificate-template.png";

const nameFontSize = (name: string) => {
  const length = name.trim().length;
  if (length > 34) return 52;
  if (length > 26) return 62;
  if (length > 18) return 72;
  return 82;
};

/**
 * Fixed-size certificate artwork.
 * Rendered at natural resolution and scaled down with a CSS transform by the
 * parent, so html2canvas always captures full print resolution.
 */
const CertificateCanvas = forwardRef<HTMLDivElement, { data: CertificateData }>(({ data }, ref) => {
  const serif = "'Cardo', Georgia, 'Times New Roman', serif";

  return (
    <div
      ref={ref}
      style={{
        width: CERTIFICATE_WIDTH,
        height: CERTIFICATE_HEIGHT,
        position: "relative",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      <img
        src={CERTIFICATE_TEMPLATE_SRC}
        alt="Elite Forums certificate of completion"
        width={CERTIFICATE_WIDTH}
        height={CERTIFICATE_HEIGHT}
        style={{ width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT, display: "block" }}
      />

      {/* Recipient name — sits in the blank band under "This certificate is presented to" */}
      <div
        style={{
          position: "absolute",
          top: 845,
          left: 130,
          width: 1098,
          textAlign: "center",
          fontFamily: serif,
          fontSize: nameFontSize(data.fullName),
          fontWeight: 700,
          color: "#12233f",
          lineHeight: 1.15,
          letterSpacing: "0.5px",
        }}
      >
        {data.fullName}
      </div>

      {/* Unique certificate ID — blank area between the signature and the company seal */}
      <div
        style={{
          position: "absolute",
          top: 1436,
          left: 434,
          width: 490,
          textAlign: "center",
          fontFamily: "'Open Sans', Arial, Helvetica, sans-serif",
          fontSize: 23,
          fontWeight: 700,
          letterSpacing: "1.4px",
          color: "#1b2a4a",
          lineHeight: 1.5,
        }}
      >
        CERTIFICATE ID
        <div style={{ fontSize: 26, letterSpacing: "2px", color: "#8a6a2f" }}>
          {data.certificateId}
        </div>
      </div>
    </div>
  );
});

CertificateCanvas.displayName = "CertificateCanvas";

export default CertificateCanvas;