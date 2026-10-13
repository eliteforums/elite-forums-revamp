import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
          <div className="mt-6 border border-electric/30 bg-electric/5 p-5 text-sm text-muted-foreground">
            This India-focused draft is provided for website implementation and general information.
            It is not legal advice and cannot guarantee compliance with every law, licence, venue
            rule or programme-specific requirement. Complete the marked legal-entity details and
            have qualified Indian counsel review it before relying on it.
          </div>
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
            <PolicySection title="4. Legal compliance and consumer information">
              <p>
                We will describe material programme terms, eligibility, fees (if any), dates,
                locations, cancellation conditions and support channels in the relevant event or
                registration information. Nothing in these terms removes rights that cannot be
                excluded under the Consumer Protection Act, 2019 or another applicable law.
              </p>
              <p>
                You must comply with laws relating to online conduct, privacy, intellectual
                property, cyber security, anti-fraud, advertising, taxation and venue safety. You
                must not use our service to facilitate unlawful activity or publish deceptive
                claims.
              </p>
            </PolicySection>
            <PolicySection title="5. Community standards and reporting">
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
              <p>
                Report abuse, illegal content, impersonation, security concerns or urgent safety
                issues through our{" "}
                <a href="/contact" className="text-foreground underline">
                  Contact
                </a>{" "}
                page. Include the relevant URL, event, account or message and supporting details. We
                may preserve evidence, restrict access, cooperate with lawful requests and notify
                affected people or authorities where required.
              </p>
            </PolicySection>
            <PolicySection title="6. Your submissions and publicity consent">
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
              <p>
                We will not use your name, photograph, recording, testimonial or identifiable story
                for promotional publication unless you provide separate permission where required.
                Event photography or recording will be disclosed through the event notice and
                reasonable opt-out or alternative arrangements will be provided where practicable.
              </p>
            </PolicySection>
            <PolicySection title="7. Intellectual property">
              <p>
                The Elite Forums name, logo, visual identity, website design, original copy and
                other materials we provide belong to Elite Forums or our licensors. You may view and
                use the website for personal, educational or legitimate programme purposes. You may
                not copy, modify, sell, distribute, scrape or commercially exploit our materials
                without written permission.
              </p>
            </PolicySection>
            <PolicySection title="8. Payments, cancellations and refunds">
              <p>
                If an event or service has a fee, the applicable page or checkout will state the
                price, taxes, payment provider, cancellation window and refund conditions. A payment
                may be processed by a third-party provider under its terms. We will not request card
                numbers, one-time passwords or banking credentials through an ordinary website form.
              </p>
              <p>
                Where an event is cancelled or materially changed by us, the event-specific notice
                will explain available alternatives or refunds, subject to applicable consumer law
                and the terms shown at purchase.
              </p>
            </PolicySection>
            <PolicySection title="9. Third-party services and links">
              <p>
                The website may link to third-party services, social platforms, event venues or
                resources. Those services are controlled by their own providers and terms. We are
                not responsible for their content, availability, security or privacy practices.
              </p>
            </PolicySection>
            <PolicySection title="10. Event safety and assumption of risk">
              <p>
                You must follow organiser, venue and emergency instructions. You are responsible for
                providing accurate accessibility, dietary or health information relevant to a safe
                participation decision. We do not ask you to disclose unnecessary medical
                information through public forms.
              </p>
              <p>
                Events can involve travel, crowds, equipment, public venues and interactions with
                other participants. We take reasonable precautions but cannot eliminate every risk.
                Nothing in these terms excludes liability that cannot be excluded under applicable
                law, including liability for death or personal injury caused by negligence where
                such exclusion is unlawful.
              </p>
            </PolicySection>
            <PolicySection title="11. Disclaimers">
              <p>
                The website and programme information are provided on an “as available” basis. To
                the extent permitted by law, we do not guarantee that the website will always be
                uninterrupted, error-free, secure, current or suitable for a particular purpose.
                Community content and founder perspectives are informational and do not constitute
                legal, financial, investment, employment or professional advice.
              </p>
            </PolicySection>
            <PolicySection title="12. Limitation of liability">
              <p>
                To the extent permitted by applicable law, Elite Forums and its organisers will not
                be liable for indirect, incidental, special or consequential loss arising from your
                use of the website, participation in a programme, reliance on content or
                interactions with other participants. Nothing in these terms limits liability that
                cannot legally be limited.
              </p>
            </PolicySection>
            <PolicySection title="13. Indemnity">
              <p>
                To the extent permitted by law, you agree to indemnify and hold harmless Elite
                Forums, its organisers and service providers from claims, losses and reasonable
                costs arising from your unlawful use of the website, breach of these terms,
                infringement of another person’s rights, or material you submit. This does not apply
                to the extent a claim is caused by our own unlawful conduct or negligence.
              </p>
            </PolicySection>
            <PolicySection title="14. Changes, suspension and termination">
              <p>
                We may update these terms, change a programme or discontinue website features from
                time to time. We may suspend or end access where necessary for security, legal,
                operational or community reasons. The latest version will be posted on this page.
              </p>
            </PolicySection>
            <PolicySection title="15. Complaints, governing law and disputes">
              <p>
                Please first contact us so we can try to resolve a complaint. These terms are
                governed by the laws of India, without limiting mandatory consumer or other rights
                available to you. Subject to applicable law, disputes will be subject to the courts
                having jurisdiction over <strong>[insert registered office city and state]</strong>.
              </p>
              <p>
                Questions about these terms, a takedown request or a grievance can be sent through
                our{" "}
                <a href="/contact" className="text-foreground underline">
                  Contact
                </a>{" "}
                page or to <strong>[insert official legal/grievance email]</strong>.
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
