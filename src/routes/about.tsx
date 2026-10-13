import { createFileRoute } from "@tanstack/react-router";
import { Container, FinalCTA, PageHero, SectionHead } from "@/components/site/Blocks";
import { JoinPaths, Mission } from "@/components/site/EcosystemSections";
import { pageMeta } from "@/lib/metadata";
import students from "@/assets/students.jpg";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("About", "Our mission is to build the next generation of entrepreneurial communities by connecting students, colleges and founders."),
  component: About,
});

function About() {
  return <><PageHero eyebrow="About Elite Forums" title={<>Built for the<br /><span className="text-brand">next generation.</span></>} intro="Building the next generation of entrepreneurial communities." /><section className="section-space"><Container className="grid items-center gap-12 md:grid-cols-2"><img src={students} alt="Students collaborating around a table" className="panel aspect-[4/3] w-full object-cover" /><div><SectionHead eyebrow="Our story" title="Ambition needs a community." /><p className="mt-7 reading-copy">Elite Forums brings together students, E-Cells, founders and startup communities around a simple belief: entrepreneurship becomes more accessible when people build together.</p><p className="mt-5 reading-copy">We help colleges develop active entrepreneurship communities, create meaningful learning experiences, and connect student ideas with the people and opportunities that can help them grow.</p></div></Container></section><Mission /><JoinPaths /><FinalCTA /></>;
}
