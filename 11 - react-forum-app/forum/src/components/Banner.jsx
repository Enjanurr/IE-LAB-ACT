import { useNotice } from '../context/NoticeContext.jsx';

export default function Banner() {
  const { notice, dismiss } = useNotice();
  if (!notice) return null;
  return (
    <div className={`banner ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
      <span>{notice.message}</span>
      <button type="button" className="icon-btn" onClick={dismiss} aria-label="Dismiss message">×</button>
    </div>
  );
}
