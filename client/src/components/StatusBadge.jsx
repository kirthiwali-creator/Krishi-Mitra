import { useLang } from '../context/useLang.js';

export default function StatusBadge({ status }) {
  const { t } = useLang();
  return <span className={'badge status-' + status}>{t('status.' + status)}</span>;
}
