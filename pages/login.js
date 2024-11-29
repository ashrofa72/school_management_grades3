import { useState } from 'react';
import styles from '../styles/login2.module.css';
import { useLogin } from '../hooks/useLogin';
import { useRouter } from 'next/router';
import { useAuthContext } from '../hooks/useAuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, login } = useLogin();
  const router = useRouter();
  const { user } = useAuthContext();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send email and password to server for authentication
    // Here you can add your own code to make an API request to your server

    login(email, password);
    if (user) {
      router.push('/Login');
    } else {
      router.push('/students/page');
    }
  };

  return (
    <div className={styles.container}>
      <h1>نموذج الدخول</h1>
      <form onSubmit={handleSubmit}>
        <label className={styles.label}>
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={styles.input}
          />
        </label>
        <br />
        <label className={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className={styles.input}
          />
        </label>
        <br />
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
