import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';

export default function PublicLayout({ children }) {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isAccountPage = ['/login', '/create-account'].includes(location.pathname);

  useLayoutEffect(() => {
    if (location.hash) {
      const target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />


      <main
        key={location.pathname}
        className={
          isHome
            ? 'page-transition w-full flex-1'
            : isAccountPage
              ? 'page-transition mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-6 md:px-6'
              : 'page-transition mx-auto w-full max-w-7xl flex-1 p-6 md:p-12'
        }
      >
        {children}
      </main>

      <footer className={`border-t border-border bg-white px-4 text-center text-sm text-gray-500 ${isAccountPage ? 'py-4' : 'py-8'}`}>
        <p>
          &copy; {new Date().getFullYear()} Auckland Council - Hospo Hub
          Prototype
        </p>
      </footer>
    </div>
  );
}
