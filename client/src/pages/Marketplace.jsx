import { useEffect, useState } from 'react';
import api from '../api';
import { useLang } from '../context/useLang.js';
import Alert from '../components/Alert.jsx';
import CropCard from '../components/CropCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { CATEGORIES } from '../utils';

const EMPTY = { q: '', category: '', state: '', organic: false, minPrice: '', maxPrice: '', sort: 'newest' };

export default function Marketplace() {
  const { t, errMsg } = useLang();
  const [filters, setFilters] = useState(EMPTY);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ crops: [], total: 0, pages: 1 });
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api
      .get('/crops/filters')
      .then((res) => setStates(res.data.states))
      .catch(() => setStates([]));
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(filters.q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [filters.q]);

  const { category, state, organic, minPrice, maxPrice, sort } = filters;

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (query) params.q = query;
    if (category) params.category = category;
    if (state) params.state = state;
    if (organic) params.organic = 'true';
    if (minPrice !== '') params.minPrice = minPrice;
    if (maxPrice !== '') params.maxPrice = maxPrice;
    api
      .get('/crops', { params })
      .then((res) => {
        if (!active) return;
        setData(res.data);
        setError('');
      })
      .catch((err) => active && setError(errMsg(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [query, category, state, organic, minPrice, maxPrice, sort, page, errMsg]);

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFilters((f) => ({ ...f, [key]: value }));
    if (key !== 'q') setPage(1);
  };

  const clear = () => {
    setFilters(EMPTY);
    setQuery('');
    setPage(1);
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h1>{t('market.title')}</h1>
        <p className="muted">{t('market.subtitle')}</p>
      </div>

      <div className="search-row">
        <input className="search-input" type="search" placeholder={t('market.search')} value={filters.q} onChange={update('q')} />
        <button type="button" className="btn btn-outline filter-toggle" onClick={() => setShowFilters((s) => !s)}>
          {t('market.filters')}
        </button>
      </div>

      <div className="market-layout">
        <aside className={'filters card' + (showFilters ? ' open' : '')}>
          <label>
            {t('market.category')}
            <select value={filters.category} onChange={update('category')}>
              <option value="">{t('market.allCategories')}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t('cat.' + c)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('market.state')}
            <select value={filters.state} onChange={update('state')}>
              <option value="">{t('market.allStates')}</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="two-col">
            <label>
              {t('market.minPrice')}
              <input type="number" min="0" value={filters.minPrice} onChange={update('minPrice')} />
            </label>
            <label>
              {t('market.maxPrice')}
              <input type="number" min="0" value={filters.maxPrice} onChange={update('maxPrice')} />
            </label>
          </div>
          <label>
            {t('market.sort')}
            <select value={filters.sort} onChange={update('sort')}>
              {['newest', 'priceLow', 'priceHigh', 'quantity'].map((s) => (
                <option key={s} value={s}>
                  {t('sort.' + s)}
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={filters.organic} onChange={update('organic')} />
            {t('market.organic')}
          </label>
          <button type="button" className="btn btn-outline btn-block" onClick={clear}>
            {t('market.clear')}
          </button>
        </aside>

        <section>
          <Alert>{error}</Alert>
          {!loading && !error && <p className="muted result-count">{t('market.results', { n: data.total })}</p>}
          {loading ? (
            <Spinner />
          ) : data.crops.length === 0 ? (
            <div className="empty">
              <p>{t('market.noResults')}</p>
            </div>
          ) : (
            <div className="crop-grid">
              {data.crops.map((c) => (
                <CropCard key={c._id} crop={c} />
              ))}
            </div>
          )}
          {data.pages > 1 && (
            <div className="pagination">
              <button type="button" className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                {t('market.prev')}
              </button>
              <span>{t('market.pageOf', { p: page, n: data.pages })}</span>
              <button type="button" className="btn btn-outline btn-sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
                {t('market.next')}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
