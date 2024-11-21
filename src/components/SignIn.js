import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import styles from './SignIn.module.css';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SignIn() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async data => {
    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: data }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        const serverErrors = result.errors;
        for (const key in serverErrors) {
          if (Object.prototype.hasOwnProperty.call(serverErrors, key)) {
            setError(key, { type: 'server', message: serverErrors[key] });
          }
        }
      } else {
        setUser(result.user);
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.signInForm}>
      <div className={styles.signInFormInfo}>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email address
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              placeholder="Email address"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </label>

          <label>
            Password
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
              })}
              placeholder="Password"
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </label>

          <button type="submit">Login</button>
        </form>
        <p className={styles.signUpText}>
          Don’t have an account?{' '}
          <Link to="/sign-up" className={styles.signUpLink}>
            Sign Up.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
