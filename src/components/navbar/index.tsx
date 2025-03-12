import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/logo.svg';
import menu from '../../assets/icons/menu.svg';
import close from '../../assets/icons/close.svg';
import NAV_LINKS from './navlinks';
import type { JSX } from 'react';
import SecondaryButton from '../buttons/SecondaryButton';
import PrimaryButton from '../buttons/PrimaryButton';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

const Navbar = ({ onClick }: { onClick?: () => void }): JSX.Element => {
  const asideBarRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.userSlice
  );

  const closeSidebar = () => {
    asideBarRef?.current?.classList.remove('translate-x-0');
    asideBarRef?.current?.classList.add('translate-x-full');
  };

  return (
    <>
      <header className="absolute inset-0 w-full bg-background py-4 h-fit z-40 ">
        <nav className="flex justify-between items-center padding-x m-auto ">
          {/* logo */}
          <Link to="/" className="2xl:w-[250px]">
            <img src={logo} className="w-[100px]" alt="Logo" />
          </Link>
          {/* links */}
          <ul className="gap-8 text-neutral-10 hidden xl:flex pb-24">
            {NAV_LINKS.map((link, index) => (
              <li key={index} className="text-[18px]">
                <a href={link.url}>{link.label}</a>
              </li>
            ))}
          </ul>
          {/* cta buttons for large screens */}
          <div className="gap-6 flex xl:flex items-center"> 
  <PrimaryButton
    onClick={() => {
      if (isAuthenticated) {
        navigate('/dashboard/myCourse');
      } else {
        if (onClick) {
          onClick();
        }
      }
    }}
    className="w-[193px]"
  >
    {isAuthenticated ? user?.name : 'Login / Sign Up'}
  </PrimaryButton>
</div>

          <button
            onClick={() => {
              asideBarRef?.current?.classList.add('translate-x-0');
              asideBarRef?.current?.classList.remove('translate-x-full');
            }}
            className="xl:hidden"
          >
            <img src={menu} alt="Menu" className="h-8 w-8" />
          </button>
        </nav>
      </header>
      {/* for mobile devices */}
      <aside
        ref={asideBarRef}
        className="fixed top-0 left-0 right-0 bottom-0 z-50 w-screen h-dvh bg-background px-6 sm:px-12 py-9 xl:hidden translate-x-full transition-all"
      >
        <nav className="flex justify-between flex-col h-full">
          {/* logo */}
          <div className="flex justify-between items-center w-full gap-4">
            <Link to="/" className="2xl:w-[250px]">
              <img src={logo} className="w-[100px]" alt="Logo" />
            </Link>
            <button onClick={closeSidebar}>
              <img src={close} alt="Close" className="h-8 w-8" />
            </button>
          </div>

          {/* links */}
          <ul className="gap-8 text-neutral-10 flex flex-col pb-24 min-h-screen justify-center items-center">
          {NAV_LINKS.map((link, index) => (
              <li key={index} className="text-[18px]">
                <a href={link.url} onClick={closeSidebar}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* cta buttons for small screens */}
        
        </nav>
      </aside>
    </>
  );
};

Navbar.propTypes = {
  // onClick: PropTypes.func,
};

export default Navbar;