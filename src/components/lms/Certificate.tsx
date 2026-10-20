import { Logo, LogoMark } from "@/components/site/Logo";
import { useContent } from "@/lib/content-context";
import { formatDate, type PublicCertificate } from "@/lib/lms";

export const SITE_ORIGIN = "https://eliteforums.in";

function Signature({ name, title, image }: { name: string; title: string; image: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className="flex h-[5cqw] items-end justify-center">
        {image && <img src={image} alt="" className="max-h-full max-w-[16cqw] object-contain" />}
      </div>
      <div className="mt-[0.4cqw] h-px w-[17cqw] bg-ink/40" />
      <p className="mt-[0.6cqw] text-[1.25cqw] font-semibold leading-tight">{name}</p>
      {title && <p className="mt-[0.2cqw] text-[1cqw] leading-tight text-ink-muted">{title}</p>}
    </div>
  );
}

/**
 * The certificate as printed: an A4 landscape sheet whose sizes scale with its
 * width, so it looks the same in a phone preview and on paper.
 */
export function CertificateArt({ certificate }: { certificate: PublicCertificate }) {
  const c = useContent("lms");
  const signatures = [
    {
      name: c.t("cert.signatory"),
      title: c.t("cert.signatoryTitle"),
      image: c.t("cert.signature"),
    },
    {
      name: c.t("cert.secondSignatory"),
      title: c.t("cert.secondSignatoryTitle"),
      image: c.t("cert.secondSignature"),
    },
  ].filter((signature) => signature.name.trim());

  return (
    <div className="@container w-full">
      <div
        className="relative aspect-[297/210] w-full overflow-hidden bg-paper text-ink print:aspect-auto print:h-[209mm]"
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      >
        <div className="absolute inset-x-0 top-0 h-[1.1cqw] bg-brand" />
        <div className="absolute inset-x-0 bottom-0 h-[1.1cqw] bg-brand" />
        <div className="pointer-events-none absolute inset-[2.4cqw] rounded-[0.6cqw] border border-ink/15" />
        <div className="pointer-events-none absolute -right-[9cqw] -top-[13cqw] h-[24cqw] w-[24cqw] rounded-full bg-brand opacity-[0.1]" />
        <div className="pointer-events-none absolute -bottom-[8cqw] -left-[8cqw] h-[24cqw] w-[24cqw] rounded-full bg-brand opacity-[0.08]" />
        <LogoMark
          variant="ink"
          className="pointer-events-none absolute bottom-[6cqw] right-[5cqw] h-[16cqw] opacity-[0.05]"
        />

        <div className="relative flex h-full flex-col px-[7cqw] pb-[5.5cqw] pt-[5cqw]">
          <div className="flex items-start justify-between gap-[2cqw]">
            <Logo variant="ink" className="h-[3.6cqw]" />
            <div className="text-right text-[0.95cqw] leading-snug text-ink-muted">
              <p className="font-semibold uppercase tracking-[0.12em] text-ink">Certificate ID</p>
              <p className="font-mono">{certificate.serial}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-[1.1cqw] font-semibold uppercase tracking-[0.3em] text-ink-muted">
              {c.t("cert.issuer")}
            </p>
            <h2 className="display-xl mt-[1cqw] text-[4.2cqw] leading-none">{certificate.title}</h2>
            <p className="mt-[2.4cqw] text-[1.45cqw] text-ink-muted">{c.t("cert.intro")}</p>
            <p className="mt-[1cqw] max-w-[80cqw] font-display text-[5cqw] font-semibold leading-tight">
              {certificate.recipient_name}
            </p>
            <div className="mt-[1cqw] h-[0.35cqw] w-[22cqw] rounded-full bg-brand" />
            {certificate.program_title && (
              <>
                <p className="mt-[2cqw] text-[1.45cqw] text-ink-muted">{c.t("cert.body")}</p>
                <p className="mt-[0.6cqw] max-w-[70cqw] text-[2.3cqw] font-semibold leading-snug">
                  {certificate.program_title}
                </p>
              </>
            )}
            {certificate.description && (
              <p className="mt-[1.2cqw] max-w-[62cqw] text-[1.2cqw] leading-relaxed text-ink-muted">
                {certificate.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-[3cqw]">
            <div className="text-[1cqw] leading-snug">
              <p className="font-semibold uppercase tracking-[0.12em]">Date of issue</p>
              <p className="mt-[0.3cqw] text-[1.3cqw] text-ink-muted">
                {formatDate(certificate.issued_on)}
              </p>
            </div>
            <div className="flex items-end gap-[4cqw]">
              {signatures.map((signature) => (
                <Signature key={signature.name} {...signature} />
              ))}
            </div>
            <div className="text-right text-[1cqw] leading-snug">
              <p className="font-semibold uppercase tracking-[0.12em]">Verify at</p>
              <p className="mt-[0.3cqw] break-all text-ink-muted">
                eliteforums.in/certificates/{certificate.serial}
              </p>
            </div>
          </div>
          {c.t("cert.footer") && (
            <p className="mt-[1.6cqw] text-center text-[0.9cqw] text-ink-muted">
              {c.t("cert.footer")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
