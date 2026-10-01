const FOOTER_LINKS = [
  { title: "Founder OS", href: "https://crework-founderos.vercel.app" },
  { title: "Idea to Impact", href: "https://substack.com/@ideatoimpactbysj" },
  { title: "Crework Labs", href: "https://www.creworklabs.com" },
  { title: "Overnight CTO", href: "https://www.creworklabs.com/overnight-cto" },
];

const Footer = () => {
  return (
    <footer className="border-t-2 border-black bg-beige py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
        <nav aria-label="Crework Labs">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.title}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-grotesk text-sm font-semibold text-black underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-neutral-600">
          © {new Date().getFullYear()} Crework Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
