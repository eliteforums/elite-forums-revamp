import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Copy, Download, Linkedin, ShieldX } from "lucide-react";
import { toast } from "sonner";
import { CertificateArt, SITE_ORIGIN } from "@/components/lms/Certificate";
import { Button } from "@/components/ui/button";
import { certificatePath, formatDate, type PublicCertificate } from "@/lib/lms";
import { getPublicCertificate } from "@/lib/lms.functions";

export const Route = createFileRoute("/certificates/$serial")({
  loader: async ({ params }) => {
    const serial = params.serial.toUpperCase();
    if (!/^[A-Z0-9-]{6,40}$/.test(serial)) return { certificate: null };
    return { certificate: await getPublicCertificate({ data: { serial } }) };
  },
  head: ({ loaderData, params }) => {
    const cert = loaderData?.certificate;
    const title = cert
      ? `${cert.recipient_name} — ${cert.title} | Elite Forums`
      : "Certificate not found — Elite Forums";
    const description = cert
      ? `${cert.title}${cert.program_title ? ` for ${cert.program_title}` : ""}, issued by Elite Forums on ${formatDate(cert.issued_on)}. Certificate ID ${cert.serial}.`
      : "We couldn't find a certificate with this ID.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${SITE_ORIGIN}${certificatePath(params.serial)}` },
      ],
    };
  },
  component: CertificatePage,
});

function linkedInUrl(cert: PublicCertificate, url: string) {
  const issued = new Date(`${cert.issued_on}T12:00:00`);
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: cert.program_title ? `${cert.title} — ${cert.program_title}` : cert.title,
    organizationName: "Elite Forums",
    issueYear: String(issued.getFullYear()),
    issueMonth: String(issued.getMonth() + 1),
    certUrl: url,
    certId: cert.serial,
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}

function CertificatePage() {
  const { certificate } = Route.useLoaderData();

  if (!certificate)
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 py-24 text-center">
        <ShieldX className="h-10 w-10 text-muted-foreground" />
        <h1 className="mt-5 font-display text-3xl font-semibold">Certificate not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          There's no Elite Forums certificate with this ID. Check the link or the ID printed on the
          certificate, or write to admin@eliteforums.in to verify it.
        </p>
      </section>
    );

  const url = `${SITE_ORIGIN}${certificatePath(certificate.serial)}`;
  return (
    <section className="print-certificate mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 md:pt-32 print:m-0 print:max-w-none print:p-0">
      <div
        className={`mb-6 flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 print:hidden ${
          certificate.revoked
            ? "border-destructive/40 bg-destructive/10"
            : "border-electric/30 bg-electric/5"
        }`}
        role="status"
      >
        {certificate.revoked ? (
          <ShieldX className="h-5 w-5 shrink-0 text-destructive" />
        ) : (
          <BadgeCheck className="h-5 w-5 shrink-0 text-electric" />
        )}
        <p className="text-sm">
          {certificate.revoked ? (
            <>
              <strong className="font-semibold">This certificate has been revoked.</strong> It is no
              longer valid.
            </>
          ) : (
            <>
              <strong className="font-semibold">Verified.</strong> Issued by Elite Forums to{" "}
              {certificate.recipient_name} on {formatDate(certificate.issued_on)} · ID{" "}
              {certificate.serial}
            </>
          )}
        </p>
      </div>

      <div className={certificate.revoked ? "opacity-50 grayscale" : ""}>
        <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border print:rounded-none print:shadow-none print:ring-0">
          <CertificateArt certificate={certificate} />
        </div>
      </div>

      {!certificate.revoked && (
        <div className="mt-6 flex flex-wrap gap-2 print:hidden">
          <Button variant="brand" onClick={() => window.print()}>
            <Download /> Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              void navigator.clipboard
                .writeText(url)
                .then(() => toast.success("Link copied."))
                .catch(() => toast.error("Copy the address from your browser instead."))
            }
          >
            <Copy /> Copy link
          </Button>
          <Button asChild variant="outline">
            <a href={linkedInUrl(certificate, url)} target="_blank" rel="noopener noreferrer">
              <Linkedin /> Add to LinkedIn
            </a>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/lms">Open the learning platform</Link>
          </Button>
        </div>
      )}
      <p className="mt-4 text-xs text-muted-foreground print:hidden">
        To save a PDF, choose "Save as PDF" as the printer. Set the layout to landscape and turn on
        background graphics if your browser asks.
      </p>
    </section>
  );
}
