// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 backdrop-blur-md text-white py-12 border-gray-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Briefly
          </h3>
          <p className="text-gray-400 mb-4">
            Streamline your creative projects with our comprehensive project management platform.
          </p>
          <p className="text-gray-500 text-sm">© 2025 Briefly. All rights reserved.</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-white">Product</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">API</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-white">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-white">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  );

export default Footer;