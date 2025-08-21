import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, toggleMenu }) => (
  <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Tinggi navbar diperbesar untuk accommodating logo besar */}
      <div className="flex justify-between items-center h-16"> {/* h-16 → h-20 */}
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {/* Logo lebih besar dengan hover effect */}
            <img 
              src="/Briefly.svg" 
              alt="Briefly Logo" 
              className="h-12 w-auto hover:scale-105 transition-transform duration-200" 
            />
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-8">
            <a href="#why" className="text-gray-300 hover:text-blue-400 transition-colors">Why</a>
            <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-blue-400 transition-colors">Pricing</a>
            <a href="#get-started" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </a>
          </div>
        </div>
        
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-blue-400">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-800">
            <a href="#why" className="block px-3 py-2 text-gray-300 hover:text-blue-400">Why</a>
            <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-blue-400">Features</a>
            <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-blue-400">Pricing</a>
            <a href="#get-started" className="block px-3 py-2 bg-blue-600 text-white rounded-lg mt-2">Get Started</a>
          </div>
        </div>
      )}
    </div>
  </nav>
);

export default Navbar;