import { Separator } from "@/components/ui/separator";

export function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p>Last updated September 17, 2024</p>

      <Separator />

      <section>
        <HeaderText>1. Introduction</HeaderText>
        <p>
          Feed Frenzy (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, and disclose information when you use our service. By
          accessing or using Feed Frenzy, you agree to the terms of this Privacy
          Policy.
        </p>
      </section>

      <section>
        <HeaderText>2. Information We Collect</HeaderText>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>Account Information:</strong> We collect basic information
            like your name, email address, and payment details via third-party
            payment processors like Stripe.
          </li>
          <li>
            <strong>Content Information:</strong> We collect content you upload,
            post, or share via your connected social media accounts. However, we
            do not take ownership of your content, as stated in our Terms and
            Conditions.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect information about how
            you interact with our services, such as your activity, pages viewed,
            and interactions with features.
          </li>
        </ul>
      </section>

      <section>
        <HeaderText>3. How We Use Your Information</HeaderText>
        <p>We use your information to:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Provide, operate, and maintain our services.</li>
          <li>
            Process transactions and manage billing through third-party payment
            services (e.g., Stripe).
          </li>
          <li>Improve our services and customer support.</li>
          <li>
            Communicate with you regarding your account and service updates.
          </li>
        </ul>
      </section>

      <section>
        <HeaderText>4. Third-Party Services</HeaderText>
        <p>
          Feed Frenzy utilizes third-party services for payments (Stripe) and
          social media integrations. These services may collect and process your
          information based on their own privacy policies. Feed Frenzy is not
          responsible for the data handling practices of third-party services.
        </p>
      </section>

      <section>
        <HeaderText>5. Cookies and Tracking Technologies</HeaderText>
        <p>
          Feed Frenzy does not directly collect cookies or use tracking
          technologies on its website. Any tracking or cookies implemented by
          third-party services (e.g., Stripe, social media platforms) are
          governed by their respective policies.
        </p>
      </section>

      <section>
        <HeaderText>6. Data Sharing</HeaderText>
        <p>
          We do not sell, trade, or otherwise share your personal information
          with third parties, except:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>When required by law or to comply with a legal process.</li>
          <li>To protect our rights or safety, or the rights of others.</li>
          <li>
            With third-party service providers who assist in delivering our
            services (e.g., payment processors).
          </li>
        </ul>
      </section>

      <section>
        <HeaderText>7. Data Storage and Security</HeaderText>
        <p>
          We take reasonable measures to ensure that your information is stored
          securely and protected from unauthorized access or disclosure.
          However, Feed Frenzy does not store sensitive data like payment
          details. All such data is handled by third-party providers (e.g.,
          Stripe).
        </p>
      </section>

      <section>
        <HeaderText>8. Data Retention</HeaderText>
        <p>
          We retain user account data for as long as necessary to provide
          services, comply with legal obligations, resolve disputes, or enforce
          agreements.
        </p>
      </section>

      <section>
        <HeaderText>9. Your Rights</HeaderText>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            <strong>Access:</strong> You can access the personal information we
            hold about you by contacting us at{" "}
            <a
              className="text-blue-500 hover:underline"
              href="mailto:support@feedfrenzy.co"
            >
              support@feedfrenzy.co
            </a>
            .
          </li>
          <li>
            <strong>Correction:</strong> You have the right to correct or update
            your personal information.
          </li>
          <li>
            <strong>Deletion:</strong> You may request that we delete your
            account and personal information. However, some data may be retained
            for legal or business purposes.
          </li>
        </ul>
      </section>

      <section>
        <HeaderText>10. Children&apos;s Privacy</HeaderText>
        <p>
          Feed Frenzy&apos;s services are not intended for children under the
          age of 13. We do not knowingly collect personal information from
          children under 13. If we discover that a child under 13 has provided
          us with personal information, we will take steps to delete such
          information.
        </p>
      </section>

      <section>
        <HeaderText>11. International Users</HeaderText>
        <p>
          Feed Frenzy operates in the United States. If you are accessing our
          services from outside the United States, your information may be
          transferred to, stored, and processed in the U.S. By using our
          services, you consent to this transfer and processing.
        </p>
      </section>

      <section>
        <HeaderText>12. Changes to the Privacy Policy</HeaderText>
        <p>
          We may update this Privacy Policy from time to time. If significant
          changes are made, we will notify users via email or an announcement on
          our platform. Continued use of the services after changes implies
          acceptance of the updated policy.
        </p>
      </section>

      <section>
        <HeaderText>13. Contact Information</HeaderText>
        <p>
          If you have any questions or concerns regarding this Privacy Policy,
          please contact us at{" "}
          <a
            className="text-blue-500 hover:underline"
            href="mailto:support@feedfrenzy.co"
          >
            support@feedfrenzy.co
          </a>
          .
        </p>
      </section>
    </div>
  );
}

function HeaderText({ children, id }: any) {
  return (
    <h2 className="mb-2 text-lg font-semibold uppercase" id={id}>
      {children}
    </h2>
  );
}
