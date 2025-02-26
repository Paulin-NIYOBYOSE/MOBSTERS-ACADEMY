import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#001a12] text-white pt-16 md:px-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#00DC82] rounded-full"></div>
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
            <p className="text-gray-400 mb-4">
            Forex Mobsters Academy offers expert training in forex trading, covering market analysis, risk management, trading psychology, and live trading sessions. We equip traders with the skills and strategies needed to navigate the markets profitably and confidently.
            </p>
            <div className="flex space-x-4">
              <Link href={siteConfig.links.twitter} className="text-gray-400 hover:text-[#00DC82]">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-[#00DC82]">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#00DC82]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest news and offers.</p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#002419] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00DC82]"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

