import { useState } from 'react'

function AuthPage({ onSubmit, isLoading, errorMessage }) {
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Smart Task Manager</p>
        <h1>Welcome back</h1>
        <p className="auth-card__subtitle">
          Log in to organize your work, priorities, and daily goals.
        </p>

        <form className="auth-form" onSubmit={(event) => onSubmit(event, formData)}>
          <label className="field">
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AuthPage
