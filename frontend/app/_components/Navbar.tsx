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
import { useDebounce } from "@/hooks/useDebounce";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = ["Home", "New Arrivals", "Top Selling", "Contact"];

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const debouncedSearch = useDebounce(search, 500);

  // Tracks whether the search box has ever held real (non-whitespace) content.
  // Only once this is true do we treat clearing the box as "the user cleared
  // a real search" and redirect to a bare /filter. Typing just a space never
  // flips this, so a stray spacebar press does nothing.
  const hadRealContent = useRef(false);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();

    if (trimmed !== "") {
      hadRealContent.current = true;
      const query = new URLSearchParams();
      query.append("search", trimmed);
      router.replace(`/filter?${query.toString()}`);
      return;
    }

    // trimmed is empty here — only redirect to bare /filter if the box
    // previously had real content (i.e. this is an actual "clear", not
    // someone just tapping spacebar with nothing else typed).
    if (hadRealContent.current) {
      router.replace("/filter");
    }
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="bg-[#F0F0F0] p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/">
          <div className="relative h-9 w-24 sm:h-11 sm:w-32 shrink-0">
            <Image src={Logo} alt="Logo" fill className="object-contain" />
          </div>
        </Link>

        {/* Desktop nav links + search */}
        <ul className="hidden lg:flex text-[#000000] items-center gap-7 flex-1 justify-center">
          {navLinks.map((link, i) => (
            <Link
              href={`#${link}`}
              key={i}
              className="whitespace-nowrap cursor-pointer"
            >
              {link}
            </Link>
          ))}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="bg-[#FFFFFF] pl-10 w-72 xl:w-96 h-10 rounded-full border-gray-300 focus-visible:ring-0"
              value={search}
              onChange={handleSearchChange}
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
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                <ul className="flex flex-col gap-4 text-black text-base">
                  {navLinks.map((link, i) => (
                    <Link href={`#${link}`} key={i} className="cursor-pointer">
                      {link}
                    </Link>
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
              value={search}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
