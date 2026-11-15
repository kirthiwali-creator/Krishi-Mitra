import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/useAuth.js';
import { useLang } from '../context/useLang.js';
import CropCard from '../components/CropCard.jsx';
import { dashboardPath } from '../utils';

export default function Home() {
  const { t } = useLang();
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    api
      .get('/crops', { params: { limit: 4 } })
      .then((res) => setCrops(res.data.crops))
      .catch(() => setCrops([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <span className="hero-badge">🌾 {t('hero.badge')}</span>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <div className="hero-actions">
            <Link to="/market" className="btn btn-light btn-lg">
              {t('hero.cta1')}
            </Link>
            <Link to={user ? dashboardPath(user.role) : '/register'} className="btn btn-ghost btn-lg">
              {t('hero.cta2')}
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">{t('how.title')}</h2>
        <div className="grid-3">
          {[1, 2, 3].map((n) => (
            <div className="feature" key={n}>
              <span className="step-no">{n}</span>
              <h3>{t('how.' + n + '.t')}</h3>
              <p>{t('how.' + n + '.d')}</p>
            </div>
          ))}
        </div>
      </section>

      {crops.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2 className="section-title">{t('home.latest')}</h2>
            <Link to="/market" className="link">
              {t('home.viewAll')} →
            </Link>
          </div>
          <div className="crop-grid">
            {crops.map((c) => (
              <CropCard key={c._id} crop={c} />
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <h2 className="section-title">{t('why.title')}</h2>
        <div className="grid-4">
          {[1, 2, 3, 4].map((n) => (
            <div className="feature" key={n}>
              <h3>{t('why.' + n + '.t')}</h3>
              <p>{t('why.' + n + '.d')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="cta-band">
          <div>
            <h2>{t('home.infoTitle')}</h2>
            <p>{t('home.infoText')}</p>
          </div>
          <Link to="/info" className="btn btn-light">
            {t('home.infoBtn')}
          </Link>
        </div>
      </section>
    </>
  );
}
