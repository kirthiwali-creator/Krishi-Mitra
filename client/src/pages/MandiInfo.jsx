import { useLang } from '../context/useLang.js';

export default function MandiInfo() {
  const { t } = useLang();

  return (
    <div className="container page mandi-info-page">
      <div className="page-head">
        <h1>{t('mandi.title')}</h1>
        <p className="muted">{t('mandi.subtitle')}</p>
      </div>

      <section className="mandi-intro">
        <span aria-hidden="true">🌾</span>
        <div>
          <h2>{t('mandi.whatTitle')}</h2>
          <p>{t('mandi.whatText')}</p>
        </div>
      </section>

      <div className="grid-3 mandi-info-grid">
        <article className="card guide-card">
          <h3><span className="guide-icon" aria-hidden="true">🔄</span> {t('mandi.processTitle')}</h3>
          <p>{t('mandi.processText')}</p>
        </article>

        <article className="card guide-card">
          <h3><span className="guide-icon" aria-hidden="true">📖</span> {t('mandi.termsTitle')}</h3>
          <dl className="mandi-terms">
            {['modal', 'minimum', 'maximum', 'arrivals'].map((term) => (
              <div key={term}>
                <dt>{t('mandi.term.' + term)}</dt>
                <dd>{t('mandi.term.' + term + 'Text')}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="card guide-card">
          <h3><span className="guide-icon" aria-hidden="true">✅</span> {t('mandi.prepareTitle')}</h3>
          <ul className="mandi-tips">
            {['opening', 'quality', 'transport', 'payment'].map((tip) => (
              <li key={tip}>{t('mandi.tip.' + tip)}</li>
            ))}
          </ul>
        </article>

        <article className="card guide-card mandi-resource-card">
          <h3><span className="guide-icon" aria-hidden="true">🏛️</span> {t('mandi.resourcesTitle')}</h3>
          <p>{t('mandi.resourcesText')}</p>
          <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer">
            {t('mandi.agmarknet')} ↗
          </a>
          <a href="https://enam.gov.in" target="_blank" rel="noopener noreferrer">
            {t('mandi.enam')} ↗
          </a>
        </article>
      </div>

      <p className="muted disclaimer">{t('mandi.note')}</p>
    </div>
  );
}
