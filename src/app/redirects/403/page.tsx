export default function AccessDenied() {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Access Denied</h1>
        <p>You do not have the necessary permissions to access this page.</p>
        <a href="/furniture" style={{ color: 'blue', textDecoration: 'underline' }}>Return to Home</a>
      </div>
    );
  }
  