"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import Link from "next/link";

import { FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";

const footerLinks = {
  company: ["About", "Features", "Works", "Career"],
  help: [
    "Customer Support",
    "Delivery Details",
    "Terms & Conditions",
    "Privacy Policy",
  ],
  faq: ["Account", "Manage Deliveries", "Orders", "Payments"],
  resources: [
    "Free eBooks",
    "Development Tutorial",
    "How to - Blog",
    "Youtube Playlist",
  ],
};

const socials = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaGithub, href: "#", label: "Github" },
];

const paymentIcons = [
  "Visa",
  "Mastercard",
  "Paypal",
  "Apple Pay",
  "Google Pay",
];

function Footer() {
  return (
    <footer className="w-full">
      <div className="container mx-auto px-4">
        {/* Newsletter banner */}
        <div className="bg-black text-white rounded-3xl px-6 sm:px-10 md:px-14 py-8 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-6 -mb-10 sm:-mb-12 relative z-10">
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-center lg:text-left leading-snug max-w-md">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>

          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/60" />
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white text-black pl-10 rounded-full h-11 w-full lg:w-72 border-0"
              />
            </div>
            <Button className="bg-white text-black hover:bg-white/90 rounded-full h-11 w-full lg:w-72 cursor-pointer">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>

        {/* Main footer content */}
        <div className="bg-muted rounded-3xl pt-16 sm:pt-20 pb-8 px-6 sm:px-10 md:px-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
              <h3 className="font-extrabold text-2xl tracking-wide">SHOP.CO</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                We have clothes that suit your style and which you&apos;re proud
                to wear. From women to men.
              </p>
              <div className="flex items-center gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="h-8 w-8 flex items-center justify-center rounded-full border border-border hover:bg-background transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm tracking-widest text-muted-foreground">
                COMPANY
              </h4>
              {footerLinks.company.map((link) => (
                <Link
                  key={link}
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm tracking-widest text-muted-foreground">
                HELP
              </h4>
              {footerLinks.help.map((link) => (
                <Link
                  key={link}
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm tracking-widest text-muted-foreground">
                FAQ
              </h4>
              {footerLinks.faq.map((link) => (
                <Link
                  key={link}
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm tracking-widest text-muted-foreground">
                RESOURCES
              </h4>
              {footerLinks.resources.map((link) => (
                <Link
                  key={link}
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-border">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Shop.co © 2000-2023, All Rights Reserved
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {paymentIcons.map((name) => (
                <span
                  key={name}
                  className="h-7 px-2.5 flex items-center justify-center rounded-md bg-background border border-border text-[10px] font-medium text-muted-foreground"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
