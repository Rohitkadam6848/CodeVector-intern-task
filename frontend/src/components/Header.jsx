import React from "react";

const Header = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">ShopSphere</h1>

        <nav className="flex gap-8 text-lg">
          <a href="#" className="hover:text-blue-400 transition">
            Home
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Products
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Categories
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
