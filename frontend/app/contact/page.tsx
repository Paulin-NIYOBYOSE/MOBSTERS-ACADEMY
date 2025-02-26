"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="container mx-auto md:px-28 py-12">
      {/* Header Section */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-5xl font-bold text-white mb-6">Get in Touch</h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Whether you have a question, need support, or want to collaborate, our team is here to help. Reach out to us, and we’ll get back to you as soon as possible.
        </p>
      </section>

      {/* Contact Details */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
        <div className="bg-[#003626] p-6 rounded-xl shadow-lg flex flex-col items-center">
          <Mail className="text-[#28c193]" size={40} />
          <h3 className="text-xl font-semibold text-white mt-4">Email Us</h3>
          <p className="text-gray-300 text-lg">support@forexmobsters.com</p>
        </div>
        <div className="bg-[#003626] p-6 rounded-xl shadow-lg flex flex-col items-center">
          <Phone className="text-[#28c193]" size={40} />
          <h3 className="text-xl font-semibold text-white mt-4">Call Us</h3>
          <p className="text-gray-300 text-lg">+250 788 123 456</p>
        </div>
        <div className="bg-[#003626] p-6 rounded-xl shadow-lg flex flex-col items-center">
          <MapPin className="text-[#28c193]" size={40} />
          <h3 className="text-xl font-semibold text-white mt-4">Visit Us</h3>
          <p className="text-gray-300 text-lg">Kigali, Rwanda</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="mt-16 max-w-2xl mx-auto bg-[#003626] p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Send Us a Message</h2>
        <form className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="text-white block mb-2 text-lg">Your Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-md bg-[#002419] text-white focus:outline-none focus:ring-2 focus:ring-[#28c193]"
              placeholder="John Doe"
              required
            />
          </div>
          {/* Email Field */}
          <div>
            <label className="text-white block mb-2 text-lg">Your Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-md bg-[#002419] text-white focus:outline-none focus:ring-2 focus:ring-[#28c193]"
              placeholder="johndoe@example.com"
              required
            />
          </div>
          {/* Subject Field */}
          <div>
            <label className="text-white block mb-2 text-lg">Subject</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-md bg-[#002419] text-white focus:outline-none focus:ring-2 focus:ring-[#28c193]"
              placeholder="Enter the subject"
              required
            />
          </div>
          {/* Message Field */}
          <div>
            <label className="text-white block mb-2 text-lg">Your Message</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 rounded-md bg-[#002419] text-white focus:outline-none focus:ring-2 focus:ring-[#28c193]"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>
          {/* Submit Button */}
          <Button size="lg" className="bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90 text-lg">
           Send message
            </Button>
        </form>
      </section>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold text-white mb-4">Connect With Us</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Follow us on social media for real-time updates, trading insights, and exclusive offers.
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <a href="#" className="text-gray-400 hover:text-[#00DC82]">
            <i className="fab fa-instagram text-2xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-[#00DC82]">
            <i className="fab fa-linkedin text-2xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-[#00DC82]">
            <i className="fab fa-twitter text-2xl"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
