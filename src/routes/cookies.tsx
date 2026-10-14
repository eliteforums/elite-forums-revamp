import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Container, PageHero } from "@/components/site/Blocks";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/cookies")({
  head: () =>
    pageMeta(
      "Cookie Policy",
      "Learn how Elite Forums uses essential browser storage and optional analytics cookies, and how to control your choice.",
      "/cookies",
    ),
  component: Cookies,
});

function Cookies() {
  return (
    <>
      <PageHero
        eyebrow="Privacy choices"
        title="Cookie policy"
        intro="What browser storage we use, why we use it, and how you can control optional technologies."
      />
      <section className="section-space">
        <Container className="max-w-4xl">
          <p className="eyebrow text-electric">Last updated: 13 October 2026</p>
          <div className="reading-copy mt-8 space-y-10">
            <PolicySection title="1. What cookies are">
              <p>
                Cookies are small files or values stored by a website in a browser. Similar
                technologies include local storage, session storage and authentication tokens. They
                can remember a choice, maintain a session or help a service operate securely.
              </p>
            </PolicySection>
            <PolicySection title="2. Technologies currently used">
              <p>
                Elite Forums uses essential browser storage for administrator authentication,
                security, routing, form operation and remembering your cookie-choice preference.
                These technologies are necessary for a requested feature and cannot always be
                disabled without breaking that feature.
              </p>
              <p>
                We do not activate advertising or behavioural tracking cookies. The Google tag
                loads with analytics and advertising storage denied by default. Google Analytics
                measurement and analytics storage are enabled only after you choose “Accept
                optional cookies”; choosing essential-only keeps analytics measurement disabled.
              </p>
            </PolicySection>
            <PolicySection title="3. Consent choices">
              <p>
                The cookie banner allows you to choose optional cookies or essential-only storage.
                “Accept optional cookies” enables Google Analytics measurement, while “Essential
                only” keeps analytics disabled. Your choice is saved locally as
                <code className="mx-1 rounded bg-muted px-1">elite-forums-cookie-consent</code>.
              </p>
              <p>
                You can clear site data in your browser settings to remove that preference. Clearing
                authentication storage may sign you out of an administrator account.
              </p>
            </PolicySection>
            <PolicySection title="4. Third-party services">
              <p>
                Supabase may set or use storage when authentication features are used. Embedded
                third-party pages, payment providers or social media links may have their own
                technologies and policies. Review the relevant provider’s notice before using that
                service.
              </p>
            </PolicySection>
            <PolicySection title="5. Browser controls and contact">
              <p>
                Most browsers allow you to block, delete or receive warnings about cookies. Blocking
                essential storage may prevent sign-in or form functionality. For questions or a
                privacy request, use our{" "}
                <a href="/contact" className="text-foreground underline">
                  Contact
                </a>{" "}
                page or review the{" "}
                <a href="/privacy" className="text-foreground underline">
                  Privacy Policy
                </a>
                .
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
