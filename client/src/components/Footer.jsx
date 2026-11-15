import { Link } from 'react-router-dom';
import { useLang } from '../context/useLang.js';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>🌱 {t('brand')}</strong>
          <p>{t('footer.text')}</p>
        </div>
        <div className="footer-links">
          <Link to="/market">{t('nav.market')}</Link>
          <Link to="/info">{t('nav.info')}</Link>
        </div>
        <small>
          © {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}
        </small>
      </div>
    </footer>
  );
}
