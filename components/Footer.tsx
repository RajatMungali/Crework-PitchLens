const Footer = () => {
  return (
    <footer className="border-t-2 border-black bg-beige py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-neutral-600">
          © {new Date().getFullYear()} Crework Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
