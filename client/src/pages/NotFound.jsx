import { Link } from 'react-router-dom';
import { useLang } from '../context/useLang.js';

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="container page empty">
      <h1>{t('notfound.title')}</h1>
      <p>{t('notfound.text')}</p>
      <Link to="/" className="btn btn-primary">
        {t('nav.home')}
      </Link>
    </div>
  );
}
