import { Link } from 'react-router-dom';
import { useLang } from '../context/useLang.js';
import { CATEGORY_ICON } from '../utils';

export default function CropCard({ crop }) {
  const { t, money } = useLang();
  return (
    <Link to={'/crop/' + crop._id} className="crop-card">
      <div className="crop-media">
        {crop.imageUrl ? <img src={crop.imageUrl} alt={crop.name} loading="lazy" /> : <span className="crop-emoji">{CATEGORY_ICON[crop.category]}</span>}
        {crop.organic && <span className="badge badge-organic">{t('crop.organic')}</span>}
      </div>
      <div className="crop-body">
        <span className="chip">{t('cat.' + crop.category)}</span>
        <h3>{crop.name}</h3>
        <p className="crop-price">
          {money(crop.pricePerKg)}
          <small>{t('crop.perKg')}</small>
        </p>
        <p className="muted">
          {t('crop.available')}: {crop.quantityKg} {t('crop.kg')}
        </p>
        <p className="muted">
          📍 {crop.district}, {crop.state}
        </p>
        {crop.farmer && crop.farmer.name && <p className="muted">👨‍🌾 {crop.farmer.name}</p>}
      </div>
    </Link>
  );
}
