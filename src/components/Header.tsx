import { FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Header = () => {



  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 shadow-md bg-red-500 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo-black.png" // Remplace par ton chemin réel
          alt="Logo"
          className="h-12 w-auto"
        />
      </div>

      {/* Menu */}
      <ul className="flex items-center space-x-10 font-semibold text-white">
        <li className="text-purple-300 hover:text-white transition">ACCUEIL</li>
        <li className="hover:text-white transition"><Link to="/emissions"> ÉMISSIONS ET CONCOURS </Link></li>
        <li className="hover:text-white transition">ACTUALITÉ</li>
        <li className="hover:text-white transition">A PROPOS</li>
      </ul>

      {/* Bouton Auth */}
      <button className="flex items-center bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-800 transition">
        <FaLock className="mr-2" />   
      </button>
    </nav>
  );
};

export default Header;
