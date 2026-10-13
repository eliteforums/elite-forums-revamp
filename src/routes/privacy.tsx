import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
          <div className="mt-6 border border-electric/30 bg-electric/5 p-5 text-sm text-muted-foreground">
            This India-focused notice explains our current practices in plain language. It is not
            legal advice. Before publication, the organisation operating Elite Forums should
            complete the marked legal-entity details and have this policy reviewed by qualified
            Indian counsel.
          </div>
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
            <PolicySection title="5. Indian data-protection framework">
              <p>
                We aim to handle digital personal data in accordance with applicable Indian law,
                including the Digital Personal Data Protection Act, 2023 and rules or notifications
                made under it, as they come into force and apply to our processing. Depending on the
                activity, Elite Forums may act as a data fiduciary, and a hosting, authentication,
                communications or event provider may act as a data processor.
              </p>
              <p>
                We will provide notice about the purpose of collection, seek consent where required,
                use data for permitted purposes, maintain reasonable security safeguards, and
                provide legally required methods to exercise rights or raise grievances.
              </p>
            </PolicySection>
            <PolicySection title="6. Sharing and service providers">
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
            <PolicySection title="7. Supabase, hosting and cross-border processing">
              <p>
                Form submissions and administrator authentication are supported by Supabase. Data is
                sent to the Supabase project configured for this website. Supabase may process data
                as our service provider under its own terms and policies. Administrator sessions may
                use browser storage so approved administrators can remain signed in.
              </p>
              <p>
                Service providers may process or store information outside your state or outside
                India. Where cross-border transfers are permitted, we will use appropriate
                safeguards and follow restrictions prescribed by applicable law. A current list of
                processors and transfer details may be requested through our grievance contact.
              </p>
            </PolicySection>
            <PolicySection title="8. Cookies and similar technologies">
              <p>
                The website may use essential storage, session technologies and security mechanisms
                needed for authentication, routing and form operation. We may use limited analytics
                or diagnostic technologies in the future. Where consent is required, we will request
                it before using non-essential technologies.
              </p>
            </PolicySection>
            <PolicySection title="9. Retention and security">
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
            <PolicySection title="10. Security incidents and breach response">
              <p>
                We maintain access controls, authentication controls, least-privilege
                administration, backups and other safeguards appropriate to the information. If we
                become aware of a personal-data breach, we will assess and contain it, investigate
                the cause, preserve relevant records, and notify affected persons or the relevant
                authority where required by applicable law.
              </p>
            </PolicySection>
            <PolicySection title="11. Your rights and requests">
              <p>
                Subject to applicable law, you may ask us to provide access to, correct, update or
                erase personal data, withdraw consent, obtain information about processing, or
                nominate another person to exercise rights where the law permits. You may also ask
                us to stop marketing communications.
              </p>
              <p>
                Send requests to <strong>[insert official privacy/grievance email]</strong> or
                through our{" "}
                <a href="/contact" className="text-foreground underline">
                  Contact
                </a>{" "}
                page. Include the email address used in your submission, the request type and enough
                detail to locate your record. We may verify identity, apply lawful exemptions and
                retain a record of the request.
              </p>
            </PolicySection>
            <PolicySection title="12. Grievance redressal">
              <p>
                For privacy complaints or unresolved requests, contact our designated grievance
                officer at <strong>[insert grievance officer name and official email]</strong>.
                Include your name, contact details, relevant submission or event, and the resolution
                you seek. We will handle the complaint under the timelines prescribed by applicable
                law. You may have a right to approach the appropriate statutory authority if you are
                not satisfied.
              </p>
            </PolicySection>
            <PolicySection title="13. Children and consent">
              <p>
                Our programmes may be available to students, but the website is not intended to
                knowingly process a child’s personal data in a manner prohibited by applicable law,
                including restrictions on tracking, behavioural monitoring, targeted advertising or
                processing likely to cause detrimental effects. Where verifiable parental or
                guardian consent is required, we will use the process provided for that programme.
                If you believe a child has submitted information improperly, contact us.
              </p>
            </PolicySection>
            <PolicySection title="14. Policy changes and official contact">
              <p>
                We may update this policy as our programmes, technology or legal obligations change.
                The updated date at the top of this page indicates when the latest version took
                effect. Continued use of the website after an update means you acknowledge the
                revised policy.
              </p>
              <p>
                <strong>Data fiduciary / organisation:</strong> [insert registered legal name and
                address]. <strong>Official contact:</strong> [insert privacy email and postal
                address]. These details must be completed before this policy is used as the formal
                legal notice.
              </p>
            </PolicySection>
          </div>
        </Container>
      </section>
    </>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-8 first:border-0 first:pt-0">
      <h2 className="mb-4 text-2xl text-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
