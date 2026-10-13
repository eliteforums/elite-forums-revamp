import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero } from "@/components/site/Blocks";
import { ContactForm } from "@/components/forms/Forms";

export const Route = createFileRoute("/data-deletion")({
  head: () => ({
    meta: [
      { title: "Delete My Data — Elite Forums" },
      {
        name: "description",
        content: "Request access, correction or deletion of your Elite Forums personal data.",
      },
    ],
  }),
  component: DataDeletion,
});

function DataDeletion() {
  return (
    <>
      <PageHero
        eyebrow="Your privacy rights"
        title="Request data deletion"
        intro="Tell us which personal data you want us to review, correct or delete."
      />
      <section className="section-space">
        <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reading-copy">
            <h2 className="text-2xl text-foreground">What happens next</h2>
            <ol className="mt-5 list-decimal space-y-4 pl-5">
              <li>We verify the request and identify records associated with your details.</li>
              <li>We assess legal, safety, fraud-prevention and record-keeping exceptions.</li>
              <li>We delete, anonymise or explain why specific records must be retained.</li>
              <li>We confirm the outcome using the contact details you provide.</li>
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              Do not include passwords, payment details, government identity numbers or other
              sensitive information. Requests are handled under applicable law and our{" "}
              <a href="/privacy" className="text-foreground underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <ContactForm defaultTopic="data_deletion" />
        </Container>
      </section>
    </>
  );
}
