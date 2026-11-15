import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/useAuth.js';
import { useLang } from '../context/useLang.js';
import Alert from '../components/Alert.jsx';
import CropForm from '../components/CropForm.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import Spinner from '../components/Spinner.jsx';
import StatCard from '../components/StatCard.jsx';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t, errMsg, money } = useLang();
  const location = useLocation();
  const [tab, setTab] = useState((location.state && location.state.tab) || 'overview');
  const [stats, setStats] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadStats = useCallback(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(errMsg(err)));
  }, [errMsg]);

  const loadCrops = useCallback(() => {
    setLoadingCrops(true);
    api
      .get('/crops/mine')
      .then((res) => setCrops(res.data.crops))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoadingCrops(false));
  }, [errMsg]);

  useEffect(() => {
    loadStats();
    loadCrops();
  }, [loadStats, loadCrops]);

  const saved = () => {
    setEditing(null);
    setNotice(t('farmer.saved'));
    loadCrops();
    loadStats();
  };

  const toggle = async (crop) => {
    setError('');
    try {
      await api.put('/crops/' + crop._id, { isActive: !crop.isActive });
      loadCrops();
      loadStats();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const remove = async (crop) => {
    if (!window.confirm(t('farmer.confirmDelete'))) return;
    setError('');
    try {
      await api.delete('/crops/' + crop._id);
      setNotice(t('farmer.deleted'));
      loadCrops();
      loadStats();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="container page">
      <div className="page-head row">
        <div>
          <h1>{t('dash.farmerTitle')}</h1>
          <p className="muted">{t('dash.welcome', { name: user.name })}</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setTab('crops');
            setEditing({});
          }}
        >
          + {t('farmer.addCrop')}
        </button>
      </div>

      <div className="tabs" role="tablist">
        {['overview', 'crops', 'orders'].map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
            {t('tab.' + k)}
          </button>
        ))}
      </div>

      <Alert>{error}</Alert>
      <Alert type="success">{notice}</Alert>

      {tab === 'overview' &&
        (stats ? (
          <div className="stat-grid">
            <StatCard label={t('stat.crops')} value={stats.crops} />
            <StatCard label={t('stat.active')} value={stats.activeCrops} />
            <StatCard label={t('stat.stock')} value={stats.stockKg} tone="blue" />
            <StatCard label={t('stat.pending')} value={stats.byStatus.pending} tone="amber" />
            <StatCard label={t('stat.totalOrders')} value={stats.totalOrders} tone="blue" />
            <StatCard label={t('stat.revenue')} value={money(stats.revenue)} />
          </div>
        ) : (
          <Spinner />
        ))}

      {tab === 'crops' &&
        (loadingCrops ? (
          <Spinner />
        ) : crops.length === 0 ? (
          <div className="empty">
            <p>{t('farmer.noCrops')}</p>
          </div>
        ) : (
          <div className="table-wrap card">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('farmer.cropName')}</th>
                  <th>{t('farmer.category')}</th>
                  <th>{t('farmer.price')}</th>
                  <th>{t('farmer.quantity')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {crops.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <Link to={'/crop/' + c._id}>{c.name}</Link>
                      {!c.isActive && <span className="badge status-cancelled inline">{t('farmer.hidden')}</span>}
                      {c.quantityKg === 0 && <span className="badge status-rejected inline">{t('crop.soldOut')}</span>}
                    </td>
                    <td>{t('cat.' + c.category)}</td>
                    <td>{money(c.pricePerKg)}</td>
                    <td>{c.quantityKg}</td>
                    <td className="row-actions">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(c)}>
                        {t('farmer.edit')}
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => toggle(c)}>
                        {c.isActive ? '🙈' : '👁'}
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(c)}>
                        {t('farmer.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {tab === 'orders' && <OrdersPanel role="farmer" onChange={loadStats} />}

      {editing && <CropForm crop={editing._id ? editing : null} defaults={{ state: user.state, district: user.district }} onClose={() => setEditing(null)} onSaved={saved} />}
    </div>
  );
}
