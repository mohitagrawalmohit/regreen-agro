// app/privacy/page.tsx
'use client';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 px-6 md:px-20 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-green-700">
          Privacy Policy
        </h1>

        <div className="prose prose-gray max-w-none text-justify">
          <p>
            This Privacy Policy (&quot;Policy&quot;) explains how <strong>Regreen Agro</strong>{' '}
            (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects,
            uses, discloses, and safeguards your information when you use our website{' '}
            <a
              href="https://www.regreenagro.in"
              className="text-green-600 underline"
            >
              https://www.regreenagro.in
            </a>{' '}
            and related services (collectively, the &quot;Platform&quot;).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>We may collect the following information when you interact with our Platform:</p>
          <ul>
            <li>
              Personal details such as name, email address, phone number, billing and shipping
              addresses.
            </li>
            <li>Payment details when purchasing products through our Platform.</li>
            <li>
              Technical information such as IP address, browser type, device type, operating system,
              and access logs.
            </li>
            <li>Any content you voluntarily provide such as inquiries, reviews, or feedback.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>Your information is used for purposes such as:</p>
          <ul>
            <li>Processing and fulfilling orders placed through the Platform.</li>
            <li>Communicating with you regarding your orders, queries, or support requests.</li>
            <li>
              Sending you updates, promotional offers, and marketing communications (only if you
              opt-in).
            </li>
            <li>Improving our Platform, services, and user experience.</li>
            <li>Ensuring compliance with applicable laws and regulations.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal information to third parties. However, we may share
            your data with:
          </p>
          <ul>
            <li>
              Trusted service providers and logistics partners who help us deliver products or
              provide services.
            </li>
            <li>Payment gateway providers to process your payments securely.</li>
            <li>Government authorities or regulators when required by law.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p>
            We use appropriate technical and organizational measures to protect your information
            from unauthorized access, alteration, disclosure, or destruction. However, please
            understand that no online transmission or storage system is completely secure.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies and Tracking</h2>
          <p>
            Our Platform may use cookies and similar technologies to enhance your browsing
            experience, analyze trends, and gather demographic information. You can disable cookies
            via your browser settings, but this may limit certain functionalities of the Platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the right to access, correct, or delete
            your personal data. You may also opt out of receiving promotional communications by
            contacting us.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Links</h2>
          <p>
            Our Platform may contain links to third-party websites. We are not responsible for the
            privacy practices or content of such third-party sites.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
          <p>
            We reserve the right to update this Privacy Policy from time to time. Any changes will
            be posted on this page with the updated effective date. Continued use of the Platform
            after changes means you accept the revised Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at:</p>
          <p>
            Email:{' '}
            <a href="mailto:support@regreenagro.in" className="text-green-600 underline">
              support@regreenagro.in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
