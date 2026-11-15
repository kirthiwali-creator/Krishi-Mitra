import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/useAuth.js';
import { useLang } from '../context/useLang.js';
import Alert from '../components/Alert.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import Spinner from '../components/Spinner.jsx';
import StatCard from '../components/StatCard.jsx';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { t, errMsg, money } = useLang();
  const location = useLocation();
  const [tab, setTab] = useState((location.state && location.state.tab) || 'overview');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const flash = location.state && location.state.flash;

  const loadStats = useCallback(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(errMsg(err)));
  }, [errMsg]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="container page">
      <div className="page-head row">
        <div>
          <h1>{t('dash.buyerTitle')}</h1>
          <p className="muted">{t('dash.welcome', { name: user.name })}</p>
        </div>
        <Link to="/market" className="btn btn-primary">
          {t('orders.browse')}
        </Link>
      </div>

      <div className="tabs" role="tablist">
        {['overview', 'orders'].map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
            {t('tab.' + k)}
          </button>
        ))}
      </div>

      <Alert>{error}</Alert>
      {flash && <Alert type="success">{t(flash)}</Alert>}

      {tab === 'overview' &&
        (stats ? (
          <div className="stat-grid">
            <StatCard label={t('stat.totalOrders')} value={stats.totalOrders} />
            <StatCard label={t('stat.pending')} value={stats.byStatus.pending} tone="amber" />
            <StatCard label={t('stat.inProgress')} value={stats.byStatus.accepted + stats.byStatus.shipped} tone="blue" />
            <StatCard label={t('stat.delivered')} value={stats.byStatus.delivered} />
            <StatCard label={t('stat.spent')} value={money(stats.spent)} tone="blue" />
          </div>
        ) : (
          <Spinner />
        ))}

      {tab === 'orders' && <OrdersPanel role="buyer" onChange={loadStats} />}
    </div>
  );
}
