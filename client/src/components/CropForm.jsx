import { useState } from 'react';
import api from '../api';
import { useLang } from '../context/useLang.js';
import Alert from './Alert.jsx';
import { CATEGORIES, INDIAN_STATES } from '../utils';

export default function CropForm({ crop, defaults, onClose, onSaved }) {
  const { t, errMsg } = useLang();
  const [form, setForm] = useState({
    name: crop ? crop.name : '',
    category: crop ? crop.category : 'grain',
    pricePerKg: crop ? crop.pricePerKg : '',
    quantityKg: crop ? crop.quantityKg : '',
    minOrderKg: crop ? crop.minOrderKg : 1,
    harvestDate: crop && crop.harvestDate ? crop.harvestDate.slice(0, 10) : '',
    imageUrl: crop ? crop.imageUrl || '' : '',
    description: crop ? crop.description || '' : '',
    organic: crop ? crop.organic : false,
    isActive: crop ? crop.isActive : true,
    state: crop ? crop.state : defaults.state || '',
    district: crop ? crop.district : defaults.district || ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      ...form,
      pricePerKg: Number(form.pricePerKg),
      quantityKg: Number(form.quantityKg),
      minOrderKg: Number(form.minOrderKg)
    };
    try {
      if (crop) await api.put('/crops/' + crop._id, payload);
      else await api.post('/crops', payload);
      onSaved();
    } catch (err) {
      setError(errMsg(err));
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-head">
          <h2>{crop ? t('farmer.editCrop') : t('farmer.addCrop')}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('common.close')}>
            ✕
          </button>
        </div>
        <form onSubmit={submit} className="form-grid">
          <Alert>{error}</Alert>
          <label className="span-2">
            {t('farmer.cropName')}
            <input value={form.name} onChange={set('name')} required maxLength={80} />
          </label>
          <label>
            {t('farmer.category')}
            <select value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t('cat.' + c)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('farmer.harvestDate')}
            <input type="date" value={form.harvestDate} onChange={set('harvestDate')} />
          </label>
          <label>
            {t('farmer.price')}
            <input type="number" min="0.01" step="0.01" value={form.pricePerKg} onChange={set('pricePerKg')} required />
          </label>
          <label>
            {t('farmer.quantity')}
            <input type="number" min="0" step="1" value={form.quantityKg} onChange={set('quantityKg')} required />
          </label>
          <label>
            {t('farmer.minOrder')}
            <input type="number" min="1" step="1" value={form.minOrderKg} onChange={set('minOrderKg')} required />
          </label>
          <label>
            {t('auth.state')}
            <input list="state-list" value={form.state} onChange={set('state')} required />
            <datalist id="state-list">
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <label>
            {t('auth.district')}
            <input value={form.district} onChange={set('district')} required />
          </label>
          <label className="span-2">
            {t('farmer.imageUrl')}
            <input type="url" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://" />
          </label>
          <label className="span-2">
            {t('farmer.description')}
            <textarea rows="3" maxLength={600} value={form.description} onChange={set('description')} />
          </label>
          <label className="check">
            <input type="checkbox" checked={form.organic} onChange={set('organic')} />
            {t('farmer.organic')}
          </label>
          <label className="check">
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} />
            {t('farmer.listed')}
          </label>
          <div className="form-actions span-2">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              {t('farmer.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {t('farmer.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
