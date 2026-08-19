import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Award, Download, FileText, Loader2, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CertificateCanvas, {
  CERTIFICATE_HEIGHT,
  CERTIFICATE_WIDTH,
  CertificateData,
} from "@/components/CertificateCanvas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * The supplied template carries fixed programme wording, so the programme and
 * completion date are constants that are stored with every issued certificate.
 */
const PROGRAM_TITLE = "Web Development & Generative AI Internship";
const PROGRAM_COMPLETION_DATE = "2026-08-14";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(60, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  college: z.string().trim().min(2, "Please enter your college name").max(120),
  department: z.string().trim().min(2, "Please enter your department").max(120),
});

type FormValues = z.infer<typeof schema>;

const emptyForm: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  department: "",
};

const makeCertificateId = () => {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(6);
  crypto.getRandomValues(bytes);
  let suffix = "";
  bytes.forEach((byte) => {
    suffix += chars[byte % chars.length];
  });
  return `EF-${year}-${suffix}`;
};

const CertificatePage = () => {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [previewScale, setPreviewScale] = useState(0.3);
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);

  // Scale the full-resolution artwork down to whatever width the preview box has.
  useEffect(() => {
    const box = previewBoxRef.current;
    if (!box) return;
    const update = () => setPreviewScale(box.clientWidth / CERTIFICATE_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, [certificate]);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      parsed.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof FormValues] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const data = parsed.data;
    const certificateId = makeCertificateId();

    const { error } = await supabase.from("certificates").insert({
      certificate_id: certificateId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      college: data.college,
      department: data.department,
      course: PROGRAM_TITLE,
      completion_date: PROGRAM_COMPLETION_DATE,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Could not generate certificate",
        description: "Something went wrong while saving your details. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setCertificate({ fullName: data.fullName, certificateId });
    toast({
      title: "Certificate generated",
      description: `Your certificate ID is ${certificateId}`,
    });
  };

  const capture = async () => {
    if (!canvasRef.current) return null;
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    return html2canvas(canvasRef.current, {
      scale: 1,
      width: CERTIFICATE_WIDTH,
      height: CERTIFICATE_HEIGHT,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
  };

  const downloadPng = async () => {
    setDownloading(true);
    try {
      const canvas = await capture();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `${certificate?.certificateId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      toast({
        title: "Download failed",
        description: "Please try downloading again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const canvas = await capture();
      if (!canvas) return;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT],
      });
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        0,
        0,
        CERTIFICATE_WIDTH,
        CERTIFICATE_HEIGHT
      );
      pdf.save(`${certificate?.certificateId}.pdf`);
    } catch {
      toast({
        title: "Download failed",
        description: "Please try downloading again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Certificate Portal | Elite Forums</title>
        <meta
          name="description"
          content="Generate your official Elite Forums certificate of completion. Enter your details to instantly create and download a verified certificate with a unique certificate ID."
        />
        <link rel="canonical" href="https://eliteforums.in/certificate" />
      </Helmet>

      <Header />

      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-5 tracking-wide">
              <Award className="h-3.5 w-3.5" /> Certification Portal
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Get Your <span className="text-gradient">Elite Forums Certificate</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Enter your details to instantly generate your official certificate of completion.
              Every certificate carries a unique certificate ID for verification.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Details form */}
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-[1.25rem] border border-border/60 p-6 md:p-8 space-y-5"
              style={{ boxShadow: "0 4px 24px -6px rgba(0,0,0,0.06)" }}
            >
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input
                  className={inputClass}
                  value={form.fullName}
                  maxLength={60}
                  placeholder="As it should appear on the certificate"
                  onChange={(e) => setField("fullName", e.target.value)}
                />
                {errors.fullName && (
                  <p className="text-destructive text-xs mt-1.5">{errors.fullName}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email ID</label>
                  <input
                    className={inputClass}
                    type="email"
                    value={form.email}
                    maxLength={255}
                    placeholder="you@example.com"
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1.5">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    className={inputClass}
                    type="tel"
                    value={form.phone}
                    maxLength={20}
                    placeholder="+91 98765 43210"
                    onChange={(e) => setField("phone", e.target.value)}
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1.5">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    College Name
                  </label>
                  <input
                    className={inputClass}
                    value={form.college}
                    maxLength={120}
                    placeholder="Your college / university"
                    onChange={(e) => setField("college", e.target.value)}
                  />
                  {errors.college && (
                    <p className="text-destructive text-xs mt-1.5">{errors.college}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Department
                  </label>
                  <input
                    className={inputClass}
                    value={form.department}
                    maxLength={120}
                    placeholder="e.g. Computer Engineering"
                    onChange={(e) => setField("department", e.target.value)}
                  />
                  {errors.department && (
                    <p className="text-destructive text-xs mt-1.5">{errors.department}</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Programme: {PROGRAM_TITLE}. Your details are recorded against the generated
                certificate ID for verification.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Award className="h-4 w-4" />
                )}
                {loading ? "Generating..." : "Generate Certificate"}
              </button>
            </form>

            {/* Live preview */}
            <div className="bg-card rounded-[1.25rem] border border-border/60 p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">Preview</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {certificate
                  ? `Certificate ID: ${certificate.certificateId}`
                  : "Your certificate will appear here once generated."}
              </p>

              {certificate ? (
                <>
                  <div
                    ref={previewBoxRef}
                    className="relative mx-auto overflow-hidden rounded-xl border border-border/60"
                    style={{
                      width: "100%",
                      maxWidth: 480,
                      aspectRatio: `${CERTIFICATE_WIDTH} / ${CERTIFICATE_HEIGHT}`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transformOrigin: "top left",
                        transform: `scale(${previewScale})`,
                      }}
                    >
                      <CertificateCanvas ref={canvasRef} data={certificate} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={downloadPdf}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60"
                    >
                      {downloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      Download PDF
                    </button>
                    <button
                      onClick={downloadPng}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-60"
                    >
                      <Download className="h-4 w-4" />
                      Download PNG
                    </button>
                    <button
                      onClick={() => {
                        setCertificate(null);
                        setForm(emptyForm);
                        setErrors({});
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-muted-foreground text-sm font-semibold hover:bg-muted transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      New Certificate
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-10 text-muted-foreground">
                  <Award className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">Fill the form to generate your certificate.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CertificatePage;