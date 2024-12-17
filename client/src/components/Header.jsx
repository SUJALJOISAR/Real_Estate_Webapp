import { FaSearch, FaHome, FaInfoCircle, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import PropertyBazzarlogo from '../assets/propertybazzarlogo.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // State for toggling menu visibility

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <img
            src={PropertyBazzarlogo}
            alt="PropertyBazaar Logo"
            className="h-10 w-10"
          />
          <h1 className="font-bold text-lg sm:text-2xl flex items-center">
            <span className="text-slate-500">Property</span>
            <span className="text-slate-700 ml-1">Bazaar</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form
          className={`bg-white border border-slate-300 rounded-full flex items-center overflow-hidden shadow-sm ${
            menuOpen ? 'hidden sm:flex' : 'hidden md:flex'
          }`}
        >
          <input
            type="text"
            placeholder="Search properties..."
            className="px-4 py-2 text-sm sm:text-base focus:outline-none w-28 sm:w-64"
          />
          <button className="bg-slate-700 text-white px-4 py-2 flex items-center">
            <FaSearch className="text-lg" />
          </button>
        </form>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm sm:text-base">
            <li className="text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer">
              <FaHome className="text-lg" /> <span>Home</span>
            </li>
            <li className="text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer">
              <FaInfoCircle className="text-lg" /> <span>About</span>
            </li>
            <li className="text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer">
              <FaUser className="text-lg" /> <span>Sign In</span>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-slate-700 hover:text-slate-900 text-2xl"
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {menuOpen && (
        <div className="bg-white border-t border-slate-300 md:hidden">
          <form
            className="bg-white border border-slate-300 rounded-full flex items-center overflow-hidden shadow-sm mx-4 mt-4"
          >
            <input
              type="text"
              placeholder="Search properties..."
              className="px-4 py-2 text-sm sm:text-base focus:outline-none w-full"
            />
            <button className="bg-slate-700 text-white px-4 py-2 flex items-center">
              <FaSearch className="text-lg" />
            </button>
          </form>

          <nav className="mt-4">
            <ul className="flex flex-col gap-4 text-sm sm:text-base px-4 py-2">
              <li className="text-slate-700 hover:text-slate-900 flex items-center gap-2 cursor-pointer">
                <FaHome className="text-lg" /> <span>Home</span>
              </li>
              <li className="text-slate-700 hover:text-slate-900 flex items-center gap-2 cursor-pointer">
                <FaInfoCircle className="text-lg" /> <span>About</span>
              </li>
              <li className="text-slate-700 hover:text-slate-900 flex items-center gap-2 cursor-pointer">
                <FaUser className="text-lg" /> <span>Sign In</span>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
