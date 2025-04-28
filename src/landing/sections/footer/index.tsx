import { Section } from "@/landing/components/styledSection";

export default function Footer() {
  return (
    <footer className="">
      <Section className="!py-6" variant="secondary">
        <ul className="flex items-center text-sm font-medium">
          <li>
            <a className="me-4 hover:underline md:me-6" href="/privacy">
              Privacy Policy
            </a>
          </li>
          <li>
            <a className="me-4 hover:underline md:me-6" href="/terms">
              Terms and Conditions
            </a>
          </li>
          <li>
            <a className="hover:underline" href="mailto:support@feedfrenzy.co">
              Contact Us
            </a>
          </li>
        </ul>
      </Section>
    </footer>
  );
}
