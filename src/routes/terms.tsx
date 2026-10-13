import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Elite Forums" },
      {
        name: "description",
        content: "The terms that apply when you use the Elite Forums website and programmes.",
      },
      { property: "og:title", content: "Terms — Elite Forums" },
      { property: "og:description", content: "Terms at Elite Forums." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Using Elite Forums"
        title="Terms of use"
        intro="The rules and expectations that apply when you browse our website, join our community or attend our programmes."
      />
      <section className="section-space">
        <Container className="max-w-4xl">
          <p className="eyebrow text-electric">Last updated: 13 October 2026</p>
          <div className="reading-copy mt-8 space-y-10">
            <PolicySection title="1. Acceptance of these terms">
              <p>
                By accessing this website or participating in an Elite Forums programme, you agree
                to these Terms of Use and our{" "}
                <a href="/privacy" className="text-foreground underline">
                  Privacy Policy
                </a>
                . If you do not agree, please do not use the website or submit a registration.
              </p>
            </PolicySection>
            <PolicySection title="2. Our services and content">
              <p>
                Elite Forums provides community activities, events, workshops, founder sessions,
                resources and partnership opportunities. Programme details, dates, locations,
                speakers and availability may change. A listing or expression of interest does not
                guarantee admission, attendance, a partnership or any particular outcome.
              </p>
              <p>
                Some pages may contain illustrative or sample concepts. Where content is marked as
                sample, it is not a confirmed programme or promise of delivery.
              </p>
            </PolicySection>
            <PolicySection title="3. Eligibility and registration">
              <p>
                You must provide accurate, current and complete information when submitting a form.
                You are responsible for keeping your contact details up to date and for ensuring you
                have permission to submit information about any organisation or other person.
              </p>
              <p>
                We may accept, decline or cancel registrations at our discretion, including where
                capacity, safety, eligibility, programme fit or inaccurate information is involved.
                If an event changes or is cancelled, we will make reasonable efforts to notify
                registered participants using the contact details provided.
              </p>
            </PolicySection>
            <PolicySection title="4. Community standards">
              <p>When interacting with Elite Forums or other participants, you agree to:</p>
              <ul>
                <li>
                  treat people respectfully and avoid harassment, discrimination, threats or abuse;
                </li>
                <li>avoid spam, impersonation, fraud, malicious code and unauthorised access;</li>
                <li>
                  respect confidentiality and intellectual property shared by other participants;
                </li>
                <li>not use the community to solicit unlawfully or exploit other members; and</li>
                <li>follow reasonable instructions from event organisers and venue staff.</li>
              </ul>
              <p>
                We may remove content, restrict participation or suspend access where these
                standards are breached or where necessary to protect the community.
              </p>
            </PolicySection>
            <PolicySection title="5. Your submissions">
              <p>
                You retain ownership of information and materials you submit. You grant Elite Forums
                a non-exclusive, worldwide, royalty-free permission to use, store and reproduce
                those materials as necessary to review your request, operate a programme and
                communicate with you.
              </p>
              <p>
                Do not submit material that is unlawful, infringing, confidential without
                permission, malicious or unsafe. You are responsible for having the rights and
                permissions needed for anything you provide.
              </p>
            </PolicySection>
            <PolicySection title="6. Intellectual property">
              <p>
                The Elite Forums name, logo, visual identity, website design, original copy and
                other materials we provide belong to Elite Forums or our licensors. You may view and
                use the website for personal, educational or legitimate programme purposes. You may
                not copy, modify, sell, distribute, scrape or commercially exploit our materials
                without written permission.
              </p>
            </PolicySection>
            <PolicySection title="7. Third-party services and links">
              <p>
                The website may link to third-party services, social platforms, event venues or
                resources. Those services are controlled by their own providers and terms. We are
                not responsible for their content, availability, security or privacy practices.
              </p>
            </PolicySection>
            <PolicySection title="8. Disclaimers">
              <p>
                The website and programme information are provided on an “as available” basis. To
                the extent permitted by law, we do not guarantee that the website will always be
                uninterrupted, error-free, secure, current or suitable for a particular purpose.
                Community content and founder perspectives are informational and do not constitute
                legal, financial, investment, employment or professional advice.
              </p>
            </PolicySection>
            <PolicySection title="9. Limitation of liability">
              <p>
                To the extent permitted by applicable law, Elite Forums and its organisers will not
                be liable for indirect, incidental, special or consequential loss arising from your
                use of the website, participation in a programme, reliance on content or
                interactions with other participants. Nothing in these terms limits liability that
                cannot legally be limited.
              </p>
            </PolicySection>
            <PolicySection title="10. Changes and termination">
              <p>
                We may update these terms, change a programme or discontinue website features from
                time to time. We may suspend or end access where necessary for security, legal,
                operational or community reasons. The latest version will be posted on this page.
              </p>
            </PolicySection>
            <PolicySection title="11. Governing law and contact">
              <p>
                These terms are governed by the laws applicable in India, without limiting any
                mandatory rights available to you under the laws of your place of residence.
                Questions about these terms can be sent through our{" "}
                <a href="/contact" className="text-foreground underline">
                  Contact
                </a>{" "}
                page.
              </p>
            </PolicySection>
          </div>
        </Container>
      </section>
    </>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8 first:border-0 first:pt-0">
      <h2 className="mb-4 text-2xl text-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
