import { createFileRoute, Link } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { Loading, LoadError } from "@/components/lms/bits";
import { MANAGE_TABS, type ManageTab } from "@/components/lms/LmsShell";
import { AnnouncementsPanel } from "@/components/lms/manage/AnnouncementsPanel";
import { CertificatesPanel } from "@/components/lms/manage/CertificatesPanel";
import { CohortsPanel } from "@/components/lms/manage/CohortsPanel";
import { OverviewPanel } from "@/components/lms/manage/OverviewPanel";
import { PeoplePanel } from "@/components/lms/manage/PeoplePanel";
import { ProgrammesPanel } from "@/components/lms/manage/ProgrammesPanel";
import { ReviewsPanel } from "@/components/lms/manage/ReviewsPanel";
import { useLmsAdmin, useLmsMe } from "@/components/lms/session";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lms/manage")({
  validateSearch: (search: Record<string, unknown>): { tab: ManageTab } => ({
    tab: MANAGE_TABS.some((t) => t.id === search["tab"])
      ? (search["tab"] as ManageTab)
      : "overview",
  }),
  component: ManagePage,
});

function ManagePage() {
  const me = useLmsMe();
  const { tab } = Route.useSearch();
  const admin = useLmsAdmin();

  if (!me.isAdmin)
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Admins only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is for the Elite Forums team.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/lms">Back to home</Link>
        </Button>
      </div>
    );
  if (admin.isPending) return <Loading />;
  if (admin.isError) return <LoadError error={admin.error} retry={() => void admin.refetch()} />;
  const data = admin.data;

  return (
    <>
      <div className="mb-2 flex justify-end">
        <button
          onClick={() => void admin.refetch()}
          disabled={admin.isFetching}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-60"
        >
          <RefreshCw className={cn("h-3 w-3", admin.isFetching && "animate-spin")} /> Refresh
        </button>
      </div>
      {tab === "overview" && <OverviewPanel data={data} />}
      {tab === "people" && <PeoplePanel data={data} />}
      {tab === "programmes" && <ProgrammesPanel data={data} />}
      {tab === "cohorts" && <CohortsPanel data={data} />}
      {tab === "reviews" && <ReviewsPanel data={data} />}
      {tab === "certificates" && <CertificatesPanel data={data} />}
      {tab === "announcements" && <AnnouncementsPanel data={data} />}
    </>
  );
}
