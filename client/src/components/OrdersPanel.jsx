import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useLang } from '../context/useLang.js';
import Alert from './Alert.jsx';
import Spinner from './Spinner.jsx';
import StatusBadge from './StatusBadge.jsx';
import { STATUSES } from '../utils';

const FARMER_ACTIONS = {
  pending: [
    { status: 'accepted', label: 'orders.accept', style: 'btn-primary' },
    { status: 'rejected', label: 'orders.reject', style: 'btn-danger' }
  ],
  accepted: [{ status: 'shipped', label: 'orders.ship', style: 'btn-primary' }],
  shipped: [{ status: 'delivered', label: 'orders.deliver', style: 'btn-primary' }]
};

const BUYER_ACTIONS = {
  pending: [{ status: 'cancelled', label: 'orders.cancel', style: 'btn-danger' }]
};

export default function OrdersPanel({ role, onChange }) {
  const { t, errMsg, money, date } = useLang();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/mine', { params: filter ? { status: filter } : {} });
      setOrders(res.data.orders);
      setError('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, [filter, errMsg]);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (id, status) => {
    setBusyId(id);
    setNotice('');
    setError('');
    try {
      await api.patch('/orders/' + id + '/status', { status });
      setNotice(t('orders.updated'));
      await load();
      if (onChange) onChange();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusyId('');
    }
  };

  const actions = role === 'farmer' ? FARMER_ACTIONS : BUYER_ACTIONS;

  return (
    <section>
      <div className="chip-row">
        {['', ...STATUSES].map((s) => (
          <button key={s || 'all'} type="button" className={'chip-btn' + (filter === s ? ' active' : '')} onClick={() => setFilter(s)}>
            {s ? t('status.' + s) : t('orders.all')}
          </button>
        ))}
      </div>
      <Alert>{error}</Alert>
      <Alert type="success">{notice}</Alert>
      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <div className="empty">
          <p>{t('orders.empty')}</p>
          {role === 'buyer' && (
            <Link to="/market" className="btn btn-primary">
              {t('orders.browse')}
            </Link>
          )}
        </div>
      ) : (
        <div className="order-list">
          {orders.map((o) => {
            const other = role === 'farmer' ? o.buyer : o.farmer;
            return (
              <article key={o._id} className="order-card">
                <div className="order-head">
                  <h3>{o.cropName}</h3>
                  <StatusBadge status={o.status} />
                </div>
                <p className="order-total">
                  {o.quantityKg} {t('crop.kg')} × {money(o.pricePerKg)} = <strong>{money(o.totalPrice)}</strong>
                </p>
                <dl className="order-meta">
                  <div>
                    <dt>{role === 'farmer' ? t('orders.buyer') : t('orders.farmer')}</dt>
                    <dd>
                      {other ? other.name : '-'}
                      {other && other.district ? ', ' + other.district : ''}
                    </dd>
                  </div>
                  <div>
                    <dt>{t('orders.contact')}</dt>
                    <dd>{role === 'farmer' ? o.contactPhone : (other && other.phone) || '-'}</dd>
                  </div>
                  <div>
                    <dt>{t('orders.deliverTo')}</dt>
                    <dd>{o.deliveryAddress}</dd>
                  </div>
                  <div>
                    <dt>{t('orders.placedOn')}</dt>
                    <dd>{date(o.createdAt)}</dd>
                  </div>
                </dl>
                {o.note && <p className="muted">“{o.note}”</p>}
                {(actions[o.status] || []).length > 0 && (
                  <div className="order-actions">
                    {actions[o.status].map((a) => (
                      <button key={a.status} type="button" className={'btn btn-sm ' + a.style} disabled={busyId === o._id} onClick={() => update(o._id, a.status)}>
                        {t(a.label)}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
