import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/useAuth.js';
import { useLang } from '../context/useLang.js';
import Alert from '../components/Alert.jsx';
import { INDIAN_STATES, dashboardPath } from '../utils';

export default function Register() {
  const { t, errMsg } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: 'farmer',
    name: '',
    email: '',
    password: '',
    phone: '',
    state: 'Karnataka',
    district: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      navigate(dashboardPath(res.data.user.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className="container auth-page">
      <form className="card auth-card wide" onSubmit={submit}>
        <h1>{t('auth.registerTitle')}</h1>
        <Alert>{error}</Alert>
        <div className="role-pick" role="group" aria-label={t('auth.iAm')}>
          {['farmer', 'buyer'].map((r) => (
            <button key={r} type="button" className={'role-btn' + (form.role === r ? ' active' : '')} onClick={() => setForm((f) => ({ ...f, role: r }))}>
              <span>{r === 'farmer' ? '👨‍🌾' : '🛒'}</span>
              {t('auth.' + r)}
            </button>
          ))}
        </div>
        <div className="form-grid">
          <label className="span-2">
            {t('auth.name')}
            <input value={form.name} onChange={set('name')} required maxLength={80} autoComplete="name" />
          </label>
          <label>
            {t('auth.email')}
            <input type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
          </label>
          <label>
            {t('auth.phone')}
            <input type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} value={form.phone} onChange={set('phone')} required autoComplete="tel" />
          </label>
          <label className="span-2">
            {t('auth.password')}
            <input type="password" minLength={6} value={form.password} onChange={set('password')} required autoComplete="new-password" placeholder={t('auth.passHint')} />
          </label>
          <label>
            {t('auth.state')}
            <input list="reg-states" value={form.state} onChange={set('state')} required={form.role === 'farmer'} />
            <datalist id="reg-states">
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <label>
            {t('auth.district')}
            <input value={form.district} onChange={set('district')} required={form.role === 'farmer'} />
          </label>
          <label className="span-2">
            {t('auth.address')}
            <input value={form.address} onChange={set('address')} maxLength={300} autoComplete="street-address" />
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {t('auth.registerBtn')}
        </button>
        <p className="muted center">
          {t('auth.haveAccount')} <Link to="/login">{t('nav.login')}</Link>
        </p>
      </form>
    </div>
  );
}
