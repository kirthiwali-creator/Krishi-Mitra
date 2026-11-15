import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { useLang } from '../context/useLang.js';
import { languages } from '../i18n/translations';
import { dashboardPath } from '../utils';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-mark">🌱</span>
          <span>{t('brand')}</span>
        </Link>
        <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? '✕' : '☰'}
        </button>
        <nav className={'nav-links' + (open ? ' open' : '')}>
          <NavLink to="/" end onClick={close}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/market" onClick={close}>
            {t('nav.market')}
          </NavLink>
          <NavLink to="/mandi-info" onClick={close}>
            {t('nav.mandi')}
          </NavLink>
          <NavLink to="/info" onClick={close}>
            {t('nav.info')}
          </NavLink>
          {user && (
            <NavLink to={dashboardPath(user.role)} onClick={close}>
              {t('nav.dashboard')}
            </NavLink>
          )}
          <div className="lang-switch" role="group" aria-label="Language">
            {languages.map((l) => (
              <button key={l.code} type="button" className={lang === l.code ? 'active' : ''} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
          {user ? (
            <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          ) : (
            <div className="nav-auth">
              <Link className="btn btn-outline btn-sm" to="/login" onClick={close}>
                {t('nav.login')}
              </Link>
              <Link className="btn btn-primary btn-sm" to="/register" onClick={close}>
                {t('nav.register')}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
