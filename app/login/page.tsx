export default function LoginPage() {
  return (
    <div className="login-wrap">
      <div className="login-box">
        <h2>Welcome back</h2>
        <p>Sign in to PTO Manager</p>
        <form method="post" action="/api/auth/login">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" placeholder="first.last" required autoComplete="username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" placeholder="••••••••" required autoComplete="current-password" />
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '8px', padding: '10px' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}
