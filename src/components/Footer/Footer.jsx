import './style.sass';
import { FooterContacts } from './FooterContacts';
import { FooterSubscription } from './FooterSubscription';
import { Logo } from 'components/Logo';
import { ReactComponent as UpArrowIcon } from 'assets/icons/up_arrow.svg';

export const Footer = () => {
  const handleScrollUpBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="contacts">
      <div className="footer__contacts">
        <FooterContacts />
        <FooterSubscription />
      </div>
      <div className="footer__logo_section_wrapper">
        <div className="footer__logo_section">
          <Logo />
          <button className="button_scroll-up" onClick={handleScrollUpBtn}>
            <UpArrowIcon />
          </button>
          <div className="footer__copyright">© 2018 WEB</div>
        </div>
      </div>
    </footer>
  );
};
