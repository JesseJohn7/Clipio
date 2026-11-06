import type { Metadata } from 'next'
import LegalLayout, { LegalSection } from '@/components/landing/LegalLayout'
import { CONTACT_EMAIL, GOVERNING_LAW, SITE_URL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The rules for using Clipio, the free video downloader for TikTok, Instagram, Facebook, X and LinkedIn.',
  alternates: { canonical: `${SITE_URL}/terms` },
}

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      intro="These terms explain the rules for using Clipio. By using the website or the installed app, you agree to them. If you don’t agree, please don’t use Clipio."
    >
      <LegalSection title="1. What Clipio does">
        <p>
          Clipio is a free tool that helps you save publicly available videos, or the audio from
          them, from platforms such as TikTok, Instagram, Facebook, X (Twitter) and LinkedIn. You
          paste a link, and Clipio fetches the media so you can save it to your device.
        </p>
        <p>
          Clipio does not host, store or own the videos. Files are fetched on request from the
          original platform and are not kept as a library on our servers.
        </p>
      </LegalSection>

      <LegalSection title="2. Using Clipio responsibly">
        <p>You agree to use Clipio only for lawful purposes. In particular, you agree that you will:</p>
        <ul>
          <li>Only download content that you own, that is in the public domain, or that you have permission or a legal right to save.</li>
          <li>Respect the rights of creators, including copyright, trademark and privacy rights.</li>
          <li>Not use Clipio to download private, restricted or paid content, or to get around any access control.</li>
          <li>Not re-upload, sell or redistribute downloaded content in a way that infringes someone else’s rights.</li>
          <li>Not abuse the service, for example with bots, scrapers, automated bulk requests, or attempts to overload, probe or break it.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Third-party content and platforms">
        <p>
          All videos, names, logos and trademarks belong to their respective owners. Clipio is not
          affiliated with, endorsed by or sponsored by TikTok, Instagram, Facebook, Meta, X,
          LinkedIn or any other platform.
        </p>
        <p>
          Downloading content may be restricted by a platform’s own terms of service. You are
          responsible for following those terms and for how you use anything you download.
        </p>
      </LegalSection>

      <LegalSection title="4. Copyright complaints">
        <p>
          We respect intellectual property rights. If you believe content was fetched through
          Clipio in a way that infringes your rights, email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the link in question, a
          description of the work, and your contact details. We will review the request and take
          appropriate action, which may include blocking the link.
        </p>
      </LegalSection>

      <LegalSection title="5. Availability and changes">
        <p>
          Clipio depends on third-party platforms and services, so it may not work for every link,
          at every quality, or at all times. We may change, limit, suspend or discontinue any part
          of the service at any time, with or without notice, including to prevent abuse.
        </p>
      </LegalSection>

      <LegalSection title="6. No warranty">
        <p>
          Clipio is provided “as is” and “as available”, without warranties of any kind, whether
          express or implied. We do not guarantee that the service will be uninterrupted, error-free
          or secure, or that any download will be accurate, complete or suitable for your purpose.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Clipio and its owner will not be liable for any
          indirect, incidental, special or consequential damages, or for any loss of data, profits
          or goodwill, arising from your use of, or inability to use, the service, or from content
          you download or share. Nothing in these terms limits liability that cannot be limited by
          law.
        </p>
      </LegalSection>

      <LegalSection title="8. Your responsibility for claims">
        <p>
          You are solely responsible for your use of Clipio and for any content you download. You
          agree to cover any claims, losses or costs that result from your breach of these terms or
          your violation of any law or third-party right.
        </p>
      </LegalSection>

      <LegalSection title="9. Privacy">
        <p>
          How we handle information is described in our <a href="/privacy">Privacy Policy</a>,
          which forms part of these terms.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to these terms">
        <p>
          We may update these terms from time to time. The “last updated” date at the top shows
          when they last changed. If you keep using Clipio after an update, you accept the new
          terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing law">
        <p>
          These terms are governed by the laws of {GOVERNING_LAW}, without regard to conflict-of-law
          rules. Any dispute will be handled by the courts of that jurisdiction, unless the law
          where you live gives you the right to bring a claim elsewhere.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}