import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="panel">
      <h1>Student profile</h1>
      <dl className="details">
        <dt>Name</dt><dd>{user.name}</dd>
        <dt>Email</dt><dd>{user.email}</dd>
        <dt>Signed in at</dt><dd>{user.signedInAt.toLocaleTimeString()}</dd>
      </dl>
      <p className="muted small">Mock data held in memory only. Nothing is saved in the browser.</p>
    </div>
  );
}
