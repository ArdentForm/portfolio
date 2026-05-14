'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface NavLink {
  label: string;
  url: string;
}

interface Logo {
  image?: string | null;
  alt?: string | null;
  url?: string | null;
}

interface NavigationProps {
  links: NavLink[];
  logo?: Logo;
  siteName?: string;
}

function SunIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  );
}

export function Navigation({ links, logo, siteName }: NavigationProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (url: string) => pathname === url;

  const logoHref = logo?.url || '/';
  const hasLogo = !!logo?.image;
  const hasBrand = hasLogo || !!siteName;

  return (
    <>
      <header className={`sticky top-0 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 transition-colors duration-500 ${isMenuOpen ? 'z-[60]' : 'z-40'}`}>
        <nav className="px-6 pt-6">
          <div className="flex items-stretch justify-between">

            {/* Left: Logo or site name */}
            {hasBrand && (
              <a
                href={logoHref}
                className="flex items-center pb-6 shrink-0 mr-8"
                aria-label={logo?.alt || siteName || 'Home'}
              >
                {hasLogo ? (
                  <Image
                    src={logo!.image!}
                    alt={logo?.alt || siteName || 'Logo'}
                    width={120}
                    height={32}
                    className="h-7 w-auto object-contain"
                    priority
                  />
                ) : (
                  <span className="text-gray-900 dark:text-white font-mono font-light text-base transition-colors duration-500">
                    {siteName}
                  </span>
                )}
              </a>
            )}

            {/* Right: nav links (desktop) + theme toggle + hamburger (mobile) */}
            <div className="flex items-stretch gap-6 ml-auto">

              {/* Desktop nav links */}
              <ul className="hidden sm:flex sm:flex-row sm:items-stretch sm:gap-8">
                {links.map((link) => {
                  const active = isActive(link.url);
                  return (
                    <li key={link.url} className="flex">
                      <a
                        href={link.url}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center text-gray-900 dark:text-white transition-colors duration-500 text-base font-normal pb-6 border-b-2 ${
                          active
                            ? 'border-brand'
                            : 'border-transparent hover:border-gray-900 dark:hover:border-white'
                        }`}
                        onClick={closeMenu}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Divider between links and icon controls (desktop only) */}
              <div className="hidden sm:block self-center mb-6 w-px h-4 bg-gray-200 dark:bg-gray-700 transition-colors duration-500" />

              {/* Theme toggle */}
              <button
                type="button"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="relative z-[60] self-center pb-6 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
              >
                {mounted ? (theme === 'dark' ? <SunIcon /> : <MoonIcon />) : <span className="w-[18px] h-[18px] block" />}
              </button>

              {/* Hamburger / close (mobile only) */}
              <button
                type="button"
                className="pb-6 relative z-[60] self-center text-gray-900 dark:text-white transition-colors duration-500 active:scale-95 sm:hidden"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col gap-10 px-6 pt-24 bg-gray-100 dark:bg-black transition-colors duration-500 sm:hidden">
          <ul className="flex flex-col gap-10">
            {links.map((link) => {
              const active = isActive(link.url);
              return (
                <li key={link.url}>
                  <a
                    href={link.url}
                    aria-current={active ? 'page' : undefined}
                    className={`text-gray-900 dark:text-white transition-colors duration-500 text-3xl font-medium pb-2 border-b-2 ${
                      active
                        ? 'border-brand'
                        : 'border-transparent hover:border-gray-900 dark:hover:border-white'
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
