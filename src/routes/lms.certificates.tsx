import { createFileRoute } from "@tanstack/react-router";
import { Award, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Empty } from "@/components/admin/ui";
import { CertificateArt, SITE_ORIGIN } from "@/components/lms/Certificate";
import { Loading, LoadError, PageHeading } from "@/components/lms/bits";
import { useLmsHome } from "@/components/lms/session";
import { Button } from "@/components/ui/button";
import { certificatePath, formatDate } from "@/lib/lms";

export const Route = createFileRoute("/lms/certificates")({
  component: MyCertificates,
});

function MyCertificates() {
  const home = useLmsHome();
  if (home.isPending) return <Loading />;
  if (home.isError) return <LoadError error={home.error} retry={() => void home.refetch()} />;
  const { certificates } = home.data;

  return (
    <>
      <PageHeading
        eyebrow="Achievements"
        title="My certificates"
        description="Open a certificate to download it as a PDF, share its verification link or add it to your LinkedIn profile."
      />
      {certificates.length === 0 ? (
        <Empty title="No certificates yet">
          Finish your programme and the team will issue your certificate here.
        </Empty>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {certificates.map((cert) => {
            const url = `${SITE_ORIGIN}${certificatePath(cert.serial)}`;
            return (
              <div key={cert.id} className="rounded-2xl border border-border bg-surface p-4">
                <a
                  href={certificatePath(cert.serial)}
                  className="block overflow-hidden rounded-xl ring-1 ring-border transition-transform hover:-translate-y-0.5"
                  aria-label={`Open ${cert.title}`}
                >
                  <CertificateArt certificate={cert} />
                </a>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-medium">
                      <Award className="h-4 w-4 shrink-0 text-electric" />
                      <span className="truncate">{cert.title}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cert.program_title ? `${cert.program_title} · ` : ""}
                      {formatDate(cert.issued_on)} · {cert.serial}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Copy verification link"
                      onClick={() =>
                        void navigator.clipboard
                          .writeText(url)
                          .then(() => toast.success("Link copied."))
                      }
                    >
                      <Copy />
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={certificatePath(cert.serial)}>
                        Open <ExternalLink />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
