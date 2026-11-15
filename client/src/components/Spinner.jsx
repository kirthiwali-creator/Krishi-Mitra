import { useLang } from '../context/useLang.js';

export default function Spinner() {
  const { t } = useLang();
  return (
    <div className="spinner-wrap" role="status">
      <div className="spinner" />
      <span>{t('common.loading')}</span>
    </div>
  );
}
