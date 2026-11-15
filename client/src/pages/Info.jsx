import { useEffect, useState } from 'react';
import api from '../api';
import { useLang } from '../context/useLang.js';
import Alert from '../components/Alert.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Info() {
  const { t, pick, errMsg } = useLang();
  const [tab, setTab] = useState('sources');
  const [sources, setSources] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/info/sources'), api.get('/info/guides')])
      .then(([s, g]) => {
        setSources(s.data.sources);
        setGuides(g.data.guides);
      })
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [errMsg]);

  return (
    <div className="container page">
      <div className="page-head">
        <h1>{t('info.title')}</h1>
        <p className="muted">{t('info.subtitle')}</p>
      </div>

      <div className="helpline">
        <span>📞</span>
        <div>
          <strong>{t('info.helplineTitle')}</strong>
          <p>{t('info.helplineText')}</p>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {['sources', 'guides'].map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
            {t('info.' + k)}
          </button>
        ))}
      </div>

      <Alert>{error}</Alert>
      {loading ? (
        <Spinner />
      ) : tab === 'sources' ? (
        <div className="grid-3">
          {sources.map((s) => (
            <article className="card source-card" key={s.id}>
              <span className="chip">{t('type.' + s.type)}</span>
              <h3>{pick(s.name)}</h3>
              <p>{pick(s.desc)}</p>
              <a className="btn btn-outline btn-sm" href={s.url} target="_blank" rel="noopener noreferrer">
                {t('info.visit')} ↗
              </a>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="grid-3">
            {guides.map((g) => (
              <article className="card guide-card" key={g.id}>
                <h3>
                  <span className="guide-icon">{g.icon}</span> {pick(g.name)}
                </h3>
                <dl>
                  {['season', 'soil', 'water', 'duration', 'tips'].map((k) => (
                    <div key={k}>
                      <dt>{t('info.' + k)}</dt>
                      <dd>{pick(g[k])}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <p className="muted disclaimer">{t('info.disclaimer')}</p>
        </>
      )}
    </div>
  );
}
