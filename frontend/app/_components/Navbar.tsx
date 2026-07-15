"use client";

import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = ["Dummy", "Dummy", "Dummy"];

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="bg-[#F0F0F0] p-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/">
          <div className="relative h-9 w-24 sm:h-11 sm:w-32 shrink-0">
            <Image src={Logo} alt="Logo" fill className="object-contain" />
          </div>
        </Link>

        {/* Desktop nav links + search */}
        <ul className="hidden lg:flex text-[#000000] items-center gap-5">
          {navLinks.map((link, i) => (
            <li key={i} className="whitespace-nowrap cursor-pointer">
              {link}
            </li>
          ))}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="bg-[#FFFFFF] pl-10 w-72 xl:w-96 h-10 rounded-full border-gray-300 focus-visible:ring-0"
            />
          </div>
        </ul>

        {/* Right icons */}
        <div className="text-black flex items-center gap-3 sm:gap-4">
          <Button
            className="lg:hidden"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
          </Link>
          <Link href="/profile">
            <User className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
          </Link>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-6 px-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search for products..."
                    className="bg-[#FFFFFF] pl-10 w-full h-10 rounded-full border-gray-300 focus-visible:ring-0"
                  />
                </div>
                <ul className="flex flex-col gap-4 text-black text-base">
                  {navLinks.map((link, i) => (
                    <li key={i} className="cursor-pointer">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Expandable search bar for tablet (sm–lg), toggled by the search icon */}
      {searchOpen && (
        <div className="lg:hidden container mx-auto mt-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="bg-[#FFFFFF] pl-10 w-full h-10 rounded-full border-gray-300 focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
