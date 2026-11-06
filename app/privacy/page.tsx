import type { Metadata } from 'next'
import LegalLayout, { LegalSection } from '@/components/landing/LegalLayout'
import { CONTACT_EMAIL, SITE_URL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Clipio handles your information. No accounts, no sign-up, and only the minimum data needed to run the service.',
  alternates: { canonical: `${SITE_URL}/privacy` },
}

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro="Clipio doesn’t need an account, and we keep the information we handle to a minimum. This page explains what we collect, why, and the choices you have."
    >
      <LegalSection title="1. Information we collect">
        <p><strong>Links you submit.</strong> When you paste a video link and press download, we receive that link so we can fetch the media for you.</p>
        <p>
          <strong>Request details.</strong> For each download request we may record the link, the
          detected platform, the chosen quality, the result status, the time of the request and your
          IP address. We use this for security, abuse prevention and understanding how the service
          is used.
        </p>
        <p>
          <strong>Technical information.</strong> Like most websites, our hosting providers may
          automatically log technical data such as your IP address, browser type, device type and
          pages requested.
        </p>
        <p>
          <strong>Messages you send us.</strong> If you email us, we keep your message and email
          address so we can reply.
        </p>
        <p>
          We do <strong>not</strong> ask for your name, password or payment details, and Clipio has
          no user accounts.
        </p>
      </LegalSection>

      <LegalSection title="2. Clipboard access">
        <p>
          To save you a step, Clipio may ask your browser for permission to read your clipboard and
          suggest pasting a video link you copied. This check happens on your device. Nothing from
          your clipboard is sent to us unless you paste it and submit it. You can deny or revoke
          this permission in your browser settings at any time.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <ul>
          <li>To provide the service: fetching the video or audio you request.</li>
          <li>To keep Clipio secure and stop abuse, spam and automated misuse.</li>
          <li>To fix problems and improve reliability and performance.</li>
          <li>To respond to your messages and copyright or legal requests.</li>
          <li>To meet legal obligations.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection title="4. Who we share information with">
        <p>We rely on trusted service providers to run Clipio. They only receive what they need:</p>
        <ul>
          <li><strong>Hosting and infrastructure providers</strong> that serve the website and API.</li>
          <li><strong>Our database provider</strong> (Supabase), which stores request records.</li>
          <li><strong>Media-processing services</strong> that receive the link you submit in order to locate and prepare the video or audio.</li>
          <li><strong>The source platform</strong> (for example TikTok or LinkedIn), which receives the request made from our servers to fetch the public media.</li>
        </ul>
        <p>
          We may also disclose information if required by law, or to protect the rights, safety and
          security of Clipio and its users.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies, storage and the installed app">
        <p>
          Clipio does not use advertising or tracking cookies. If you install Clipio as an app or
          use it often, your browser may store files and pages on your device through a service
          worker so the site loads faster. You can clear this at any time from your browser’s site
          settings or by uninstalling the app.
        </p>
      </LegalSection>

      <LegalSection title="6. How long we keep information">
        <p>
          We keep request records only as long as needed for security, abuse prevention and service
          improvement, and then delete or anonymise them. Messages you send us are kept until your
          request is resolved, plus a reasonable period afterwards.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We use reasonable technical measures to protect the information we handle, including
          encrypted connections (HTTPS). No online service is completely secure, so we cannot
          guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>
          Depending on where you live, including under laws such as the Nigeria Data Protection Act
          and the GDPR, you may have the right to access, correct or delete your personal
          information, to object to or restrict certain processing, and to complain to your local
          data protection authority. To make a request, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Because we don’t have accounts,
          we may ask for the link or approximate time of your request to find the relevant records.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          Clipio is not directed at children under 13, and we do not knowingly collect personal
          information from them. If you believe a child has sent us personal information, contact
          us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="10. International processing">
        <p>
          Our providers may process information in countries other than your own. Where this
          happens, we rely on providers that use appropriate safeguards for protecting data.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to this policy">
        <p>
          We may update this policy as Clipio changes. The “last updated” date at the top shows the
          latest version. If we make a significant change, we will make it clear on the site.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions or requests about privacy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          You can also read our <a href="/terms">Terms of Service</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}