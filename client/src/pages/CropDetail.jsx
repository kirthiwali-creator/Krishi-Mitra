import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/useAuth.js';
import { useLang } from '../context/useLang.js';
import Alert from '../components/Alert.jsx';
import Spinner from '../components/Spinner.jsx';
import { CATEGORY_ICON } from '../utils';

export default function CropDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, errMsg, money, date } = useLang();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ quantityKg: '', deliveryAddress: '', contactPhone: '', note: '' });

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get('/crops/' + id)
      .then((res) => {
        if (!active) return;
        setCrop(res.data.crop);
        setForm((f) => ({ ...f, quantityKg: res.data.crop.minOrderKg }));
      })
      .catch(() => active && setMissing(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (user && user.role === 'buyer') {
      setForm((f) => ({ ...f, deliveryAddress: f.deliveryAddress || user.address || '', contactPhone: f.contactPhone || user.phone || '' }));
    }
  }, [user]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/orders', { ...form, cropId: crop._id, quantityKg: Number(form.quantityKg) });
      navigate('/buyer', { state: { tab: 'orders', flash: 'order.success' } });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;
  if (missing || !crop) {
    return (
      <div className="container page empty">
        <p>{t('crop.notFound')}</p>
        <Link to="/market" className="btn btn-primary">
          {t('crop.back')}
        </Link>
      </div>
    );
  }

  const total = (Number(form.quantityKg) || 0) * crop.pricePerKg;
  const soldOut = crop.quantityKg <= 0;

  return (
    <div className="container page">
      <Link to="/market" className="link">
        ← {t('crop.back')}
      </Link>
      <div className="detail-layout">
        <div className="card detail-main">
          <div className="detail-media">
            {crop.imageUrl ? <img src={crop.imageUrl} alt={crop.name} /> : <span className="crop-emoji big">{CATEGORY_ICON[crop.category]}</span>}
          </div>
          <div className="chip-row">
            <span className="chip">{t('cat.' + crop.category)}</span>
            {crop.organic && <span className="badge badge-organic static">{t('crop.organic')}</span>}
            {soldOut && <span className="badge status-rejected">{t('crop.soldOut')}</span>}
          </div>
          <h1>{crop.name}</h1>
          <p className="crop-price large">
            {money(crop.pricePerKg)}
            <small>{t('crop.perKg')}</small>
          </p>
          <dl className="detail-meta">
            <div>
              <dt>{t('crop.available')}</dt>
              <dd>
                {crop.quantityKg} {t('crop.kg')}
              </dd>
            </div>
            <div>
              <dt>{t('crop.minOrder')}</dt>
              <dd>
                {crop.minOrderKg} {t('crop.kg')}
              </dd>
            </div>
            <div>
              <dt>{t('crop.location')}</dt>
              <dd>
                {crop.district}, {crop.state}
              </dd>
            </div>
            <div>
              <dt>{t('crop.farmer')}</dt>
              <dd>{crop.farmer ? crop.farmer.name : '-'}</dd>
            </div>
            {crop.harvestDate && (
              <div>
                <dt>{t('crop.harvest')}</dt>
                <dd>{date(crop.harvestDate)}</dd>
              </div>
            )}
          </dl>
          {crop.description && (
            <>
              <h3>{t('crop.about')}</h3>
              <p>{crop.description}</p>
            </>
          )}
        </div>

        <aside className="card order-box">
          <h2>{t('order.title')}</h2>
          {!user && (
            <>
              <p className="muted">{t('order.loginFirst')}</p>
              <Link to="/login" state={{ from: '/crop/' + crop._id }} className="btn btn-primary btn-block">
                {t('nav.login')}
              </Link>
            </>
          )}
          {user && user.role === 'farmer' && <p className="muted">{t('order.farmerNotice')}</p>}
          {user && user.role === 'buyer' && (
            <form onSubmit={submit}>
              <Alert>{error}</Alert>
              <label>
                {t('order.qty')}
                <input type="number" min={crop.minOrderKg} max={crop.quantityKg} step="1" value={form.quantityKg} onChange={set('quantityKg')} required disabled={soldOut} />
                <small className="muted">{t('order.minHint', { n: crop.minOrderKg })}</small>
              </label>
              <label>
                {t('order.address')}
                <textarea rows="2" value={form.deliveryAddress} onChange={set('deliveryAddress')} required maxLength={300} />
              </label>
              <label>
                {t('order.phone')}
                <input type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} value={form.contactPhone} onChange={set('contactPhone')} required />
              </label>
              <label>
                {t('order.note')}
                <input value={form.note} onChange={set('note')} maxLength={300} />
              </label>
              <p className="order-sum">
                {t('order.total')}: <strong>{money(total)}</strong>
              </p>
              <button type="submit" className="btn btn-primary btn-block" disabled={busy || soldOut}>
                {t('order.place')}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
