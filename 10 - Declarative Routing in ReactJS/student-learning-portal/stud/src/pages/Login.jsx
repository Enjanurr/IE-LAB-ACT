import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, password }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required.';
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
}

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  // Rebuild the full intended URL: pathname + query string + hash.
  const from = location.state?.from;
  const destination = from ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}` : '/dashboard';

  // Already signed in (e.g. opened /login manually): nothing to do here.
  if (user) return <Navigate to={destination} replace />;

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    login({ name: values.name, email: values.email }); // password is never kept
    // replace: true swaps the /login entry, so Back does not return to the form.
    navigate(destination, { replace: true });
  };

  return (
    <section className="panel narrow">
      <h1>Sign in</h1>
      {from && (
        <p className="notice" role="status">
          Please sign in to open <code>{destination}</code>.
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate className="stack">
        {[
          ['name', 'Name', 'text', 'name'],
          ['email', 'Email', 'email', 'email'],
          ['password', 'Password', 'password', 'current-password'],
        ].map(([key, label, type, auto]) => (
          <div className="field" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              name={key}
              type={type}
              autoComplete={auto}
              value={values[key]}
              onChange={handleChange}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? `${key}-error` : undefined}
            />
            {errors[key] && <p id={`${key}-error`} className="error">{errors[key]}</p>}
          </div>
        ))}
        <button type="submit" className="btn">Sign in</button>
      </form>
      <p className="muted small">Demo only: any name, valid-looking email and 6+ character password works.</p>
    </section>
  );
}
