import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/useAuth.js';
import { useLang } from '../context/useLang.js';
import Alert from '../components/Alert.jsx';
import { dashboardPath } from '../utils';
import toast from 'react-hot-toast';
export default function Login() {
  const { t, errMsg } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      toast.success('Login successful! Welcome back 🌱');
      const from = location.state && location.state.from;
      const target = from && (from.startsWith('/crop/') || from === dashboardPath(res.data.user.role)) ? from : dashboardPath(res.data.user.role);
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(errMsg(err));
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className="container auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h1>{t('auth.loginTitle')}</h1>
        <Alert>{error}</Alert>
        <label>
          {t('auth.email')}
          <input type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
        </label>
        <label>
          {t('auth.password')}
          <input type="password" value={form.password} onChange={set('password')} required autoComplete="current-password" />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {t('auth.loginBtn')}
        </button>
        <p className="muted center">
          {t('auth.noAccount')} <Link to="/register">{t('nav.register')}</Link>
        </p>
      </form>
    </div>
  );
}
