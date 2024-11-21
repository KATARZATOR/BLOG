import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import styles from './SignUp.module.css';
import { UserContext } from '../UserContext';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async data => {
    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users',
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
    <div className={styles.signUpForm}>
      <h2>Create new account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username */}
        <label>
          Username
          <input
            type="text"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Minimum 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Maximum 20 characters',
              },
            })}
            placeholder="Username"
            className={errors.username ? styles.inputError : ''}
          />
          {errors.username && (
            <p className={styles.errorMessage}>{errors.username.message}</p>
          )}
        </label>

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
            className={errors.email ? styles.inputError : ''}
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email.message}</p>
          )}
        </label>

        <label>
          Password
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.',
              },
              maxLength: {
                value: 40,
                message: 'Maximum 40 characters',
              },
            })}
            placeholder="Password"
            className={errors.password ? styles.inputError : ''}
          />
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          )}
        </label>

        <label>
          Repeat Password
          <input
            type="password"
            {...register('repeatPassword', {
              required: 'Please repeat your password',
              validate: value => value === password || 'Passwords must match',
            })}
            placeholder="Repeat Password"
            className={errors.repeatPassword ? styles.inputError : ''}
          />
          {errors.repeatPassword && (
            <p className={styles.errorMessage}>
              {errors.repeatPassword.message}
            </p>
          )}
        </label>

        <label className={styles.agreement}>
          <input
            type="checkbox"
            {...register('agreement', {
              required: 'You must agree to the terms',
            })}
          />
          I agree to the processing of my personal information
        </label>
        {errors.agreement && (
          <p className={styles.errorMessage}>{errors.agreement.message}</p>
        )}

        <button type="submit">Create</button>
      </form>
      <p className={styles.signInText}>
        Already have an account?{' '}
        <Link to="/sign-in" className={styles.signInLink}>
          Sign In.
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
