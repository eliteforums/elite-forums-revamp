import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHero } from "@/components/site/Blocks";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Elite Forums" },
      {
        name: "description",
        content: "Learn how Elite Forums collects, uses and protects your personal information.",
      },
      { property: "og:title", content: "Privacy — Elite Forums" },
      { property: "og:description", content: "Privacy at Elite Forums." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Trust and transparency"
        title="Privacy policy"
        intro="How Elite Forums collects, uses and protects information when you use our website, community and events."
      />
      <section className="section-space">
        <Container className="max-w-4xl">
          <p className="eyebrow text-electric">Last updated: 13 October 2026</p>
          <div className="reading-copy mt-8 space-y-10">
            <PolicySection title="1. Who we are">
              <p>
                Elite Forums is a community for aspiring founders, students, builders and partners.
                In this policy, “Elite Forums”, “we”, “us” and “our” refer to the organisation
                operating this website and its programmes.
              </p>
              <p>
                If you have a question about this policy or how your information is handled, contact
                us through the{" "}
                <a href="/contact" className="text-foreground underline">
                  Contact
                </a>{" "}
                page.
              </p>
            </PolicySection>
            <PolicySection title="2. Information we collect">
              <p>Depending on how you interact with us, we may collect:</p>
              <ul>
                <li>
                  <strong>Contact details:</strong> name, email address, phone number and city.
                </li>
                <li>
                  <strong>Education and organisation details:</strong> institution, course or year,
                  designation, E-Cell information and organisation size.
                </li>
                <li>
                  <strong>Participation details:</strong> interests, preferred communication
                  channel, event registrations, availability, motivation and relevant experience.
                </li>
                <li>
                  <strong>Messages:</strong> enquiries, partnership requirements, support requests
                  and other information you choose to submit.
                </li>
                <li>
                  <strong>Technical information:</strong> device, browser, approximate location,
                  pages viewed and diagnostic information needed to keep the website secure and
                  reliable.
                </li>
              </ul>
              <p>
                Please do not submit passwords, payment card details, government identity numbers or
                other sensitive information through a public form.
              </p>
            </PolicySection>
            <PolicySection title="3. How we use information">
              <p>We use information to:</p>
              <ul>
                <li>respond to questions, partnership requests and applications;</li>
                <li>process community and event registrations;</li>
                <li>organise events, workshops, mentorship and community programmes;</li>
                <li>send updates you request or have agreed to receive;</li>
                <li>understand programme interest and improve our content and experiences;</li>
                <li>prevent spam, fraud, abuse and security incidents; and</li>
                <li>meet legal, regulatory and operational requirements.</li>
              </ul>
            </PolicySection>
            <PolicySection title="4. Legal basis and consent">
              <p>
                We process information where it is necessary to provide a service you request, where
                you have given consent, where we have a legitimate operational interest, or where
                processing is required by law. Where a form asks for consent, you may decline;
                however, we may not be able to process that submission without the requested
                information.
              </p>
            </PolicySection>
            <PolicySection title="5. Sharing and service providers">
              <p>
                We do not sell personal information. We may share limited information with trusted
                service providers that help us operate the website, authentication, hosting,
                database, communications and event programmes. They may process information only for
                the services they provide to us and subject to appropriate safeguards.
              </p>
              <p>
                We may also disclose information when required by law, to protect the safety and
                rights of people or the service, or as part of a merger, restructuring or transfer
                of relevant business assets.
              </p>
            </PolicySection>
            <PolicySection title="6. Supabase and authentication">
              <p>
                Form submissions and administrator authentication are supported by Supabase. Data is
                sent to the Supabase project configured for this website. Supabase may process data
                as our service provider under its own terms and policies. Administrator sessions may
                use browser storage so approved administrators can remain signed in.
              </p>
            </PolicySection>
            <PolicySection title="7. Cookies and similar technologies">
              <p>
                The website may use essential storage, session technologies and security mechanisms
                needed for authentication, routing and form operation. We may use limited analytics
                or diagnostic technologies in the future. Where consent is required, we will request
                it before using non-essential technologies.
              </p>
            </PolicySection>
            <PolicySection title="8. Retention and security">
              <p>
                We retain information only for as long as reasonably necessary for the purpose it
                was collected, to maintain programme records, resolve disputes, meet legal
                obligations and protect our legitimate interests. Retention periods depend on the
                type and context of the submission.
              </p>
              <p>
                We use reasonable administrative, technical and organisational safeguards. No
                internet transmission or storage system is guaranteed to be completely secure, so
                please avoid sending sensitive information through public forms.
              </p>
            </PolicySection>
            <PolicySection title="9. Your choices and rights">
              <p>
                Subject to applicable law, you may ask us to access, correct, update or delete
                personal information we hold about you. You may also withdraw marketing consent or
                ask us to stop using your information for direct communications. We may need to
                verify your identity and may retain limited information where required by law.
              </p>
              <p>
                To make a request, contact us with the email address used in your submission and
                describe what you need. We aim to respond within a reasonable period.
              </p>
            </PolicySection>
            <PolicySection title="10. Children">
              <p>
                Our programmes may be available to students, but the website is not intended to
                knowingly collect information from children in violation of applicable law. If you
                believe a child has provided information improperly, contact us so we can review and
                remove it where appropriate.
              </p>
            </PolicySection>
            <PolicySection title="11. Changes to this policy">
              <p>
                We may update this policy as our programmes, technology or legal obligations change.
                The updated date at the top of this page indicates when the latest version took
                effect. Continued use of the website after an update means you acknowledge the
                revised policy.
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
