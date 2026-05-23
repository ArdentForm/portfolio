'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface NavLink {
  label: string;
  url: string;
}

interface NavigationProps {
  links: NavLink[];
}

function AndersonLogo() {
  return (
    <svg
      width="32" height="29"
      viewBox="0 0 64 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-black dark:text-gray-50 transition-colors duration-500"
    >
      <path d="M9.73607 37.7901C15.1132 37.7901 19.4721 42.0903 19.4721 47.395C19.4721 52.6997 15.1132 57 9.73607 57C4.35899 57 0 52.6997 0 47.395C0 42.0903 4.35899 37.7901 9.73607 37.7901Z" fill="currentColor"/>
      <path d="M31.0049 0C32.162 0 33.2285 0.61775 33.7924 1.61457L63.7954 54.6581C64.389 55.7076 63.6199 57 62.4016 57H47.2029C46.0458 57 44.9792 56.3822 44.4154 55.3854L14.4124 2.34189C13.8187 1.29235 14.5879 4.4568e-05 15.8062 0H31.0049Z" fill="currentColor"/>
    </svg>
  );
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

export function Navigation({ links }: NavigationProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (url: string) => pathname === url || (url !== '/' && pathname.startsWith(url));

  return (
    <>
      <header className={`sticky top-0 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 transition-colors duration-500 ${isMenuOpen ? 'z-[60]' : 'z-40'}`}>
        <nav className="pt-6">
          <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-stretch justify-between">

            {/* Left: Anderson logo mark */}
            <a href="/" className="flex items-center pb-6 shrink-0 mr-8" aria-label="Home">
              <AndersonLogo />
            </a>

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
