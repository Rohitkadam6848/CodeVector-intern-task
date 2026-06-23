import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">ShopSphere</h2>
            <p className="text-gray-400">
              Modern Product Management Platform built with React, Node.js and
              PostgreSQL.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>

            <ul className="space-y-2 text-gray-400">
              <li>Products</li>
              <li>Categories</li>
              <li>Dashboard</li>
              <li>About</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact</h3>

            <p className="text-gray-400">support@shopsphere.com</p>

            <p className="text-gray-400">Pune, Maharashtra</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          © 2026 ShopSphere. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
