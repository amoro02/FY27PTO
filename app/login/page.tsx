export default function LoginPage() {
  return <div className="main"><div className="card"><h2>Login</h2><form method="post" action="/api/auth/login">
    <input name="username" placeholder="username" required />
    <input type="password" name="password" placeholder="password" required />
    <button type="submit">Login</button>
  </form></div></div>;
}
