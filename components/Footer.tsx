const Footer = () => {
  return (
    <footer className="border-t border-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} CreworkAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;