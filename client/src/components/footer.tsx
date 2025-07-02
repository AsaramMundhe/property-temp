import { Link } from "wouter";
import { Building, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Building className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">PropertyHub</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted partner in finding the perfect property. We connect dreams with reality.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?type=buy" className="text-gray-300 hover:text-white transition-colors">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/properties?type=rent" className="text-gray-300 hover:text-white transition-colors">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/properties?status=new" className="text-gray-300 hover:text-white transition-colors">
                  New Projects
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="text-gray-300 hover:text-white transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/valuation" className="text-gray-300 hover:text-white transition-colors">
                  Property Valuation
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?city=Mumbai" className="text-gray-300 hover:text-white transition-colors">
                  Mumbai Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Delhi" className="text-gray-300 hover:text-white transition-colors">
                  Delhi Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Bangalore" className="text-gray-300 hover:text-white transition-colors">
                  Bangalore Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Chennai" className="text-gray-300 hover:text-white transition-colors">
                  Chennai Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Pune" className="text-gray-300 hover:text-white transition-colors">
                  Pune Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-300">123 Business Tower, Mumbai, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-300">+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-300">info@propertyhub.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 PropertyHub. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
