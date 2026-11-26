import { useRef, useState } from 'react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, password }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required.';
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address, e.g. name@example.com.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

export default function AccessibleFormToolkit() {
  // Render-driven values live in state.
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submission, setSubmission] = useState(null);

  // DOM refs, one per input.
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Non-visual memory: mutating a ref never schedules a render.
  const previousEmailRef = useRef('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmission(null);
      // Strict focus order: name, email, password. Refs are read in the handler, not in render.
      if (nextErrors.name) nameRef.current.focus();
      else if (nextErrors.email) emailRef.current.focus();
      else passwordRef.current.focus();
      return;
    }

    const email = values.email.trim();
    const previous = previousEmailRef.current; // read in an event handler: allowed
    previousEmailRef.current = email; // write without causing a render
    setSubmission({ email, previous });
    setValues({ name: '', email: '', password: '' });
    nameRef.current.focus();
  };

  return (
    <section aria-labelledby="exam3-title">
      <h2 id="exam3-title">Accessible Form Toolkit</h2>
      <p className="lede">Registration form that focuses the first invalid field.</p>

      <form onSubmit={handleSubmit} noValidate className="stack" style={{ maxWidth: 420 }}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            ref={nameRef}
            value={values.name}
            onChange={handleChange}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <p id="name-error" className="error" role="alert">{errors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            ref={emailRef}
            value={values.email}
            onChange={handleChange}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="error" role="alert">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            ref={passwordRef}
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && <p id="password-error" className="error" role="alert">{errors.password}</p>}
        </div>

        <div>
          <button className="btn" type="submit">Register</button>
        </div>
      </form>

      {submission && (
        <div role="status" className="card" style={{ marginTop: 16 }}>
          <p className="success"><strong>Registered:</strong> {submission.email}</p>
          <p className="muted">
            Previous submitted email: {submission.previous ? submission.previous : 'none yet'}
          </p>
        </div>
      )}

      <details>
        <summary>Debugging case: why <code>clicks.current</code> never updates the screen</summary>
        <p className="muted">
          Writing to <code>ref.current</code> mutates a plain object. React is not told anything
          changed, so it schedules no render and the displayed value stays stale. Data that must
          appear on screen belongs in state (<code>setClicks</code>), which schedules a render. Refs are
          for values that must persist without driving the UI, such as DOM nodes or the previous email.
        </p>
      </details>
    </section>
  );
}
