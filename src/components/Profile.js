import React, { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import styles from './Profile.module.css';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('email', user.email);
      setValue('avatar', user.image);
    }
  }, [user, setValue]);

  const onSubmit = async data => {
    try {
      const updatedData = {
        username: data.username,
        email: data.email,
        image: data.avatar,
      };

      if (data.password) {
        updatedData.password = data.password;
      }

      const response = await fetch(
        'https://blog-platform.kata.academy/api/user',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${user.token}`,
          },
          body: JSON.stringify({ user: updatedData }),
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

  if (!user) {
    return <div className={styles.profileForm}>Загрузка...</div>;
  }

  return (
    <div className={styles.profileForm}>
      <div className={styles.profileFormInfo}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Username
            <input
              type="text"
              {...register('username', {
                required: 'Username is required',
              })}
              placeholder="Username"
              className={errors.username ? styles.inputError : ''}
            />
            {errors.username && (
              <p className={styles.errorMessage}>{errors.username.message}</p>
            )}
          </label>

          {/* Email */}
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
            New Password
            <input
              type="password"
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'Your password needs to be at least 6 characters.',
                },
                maxLength: {
                  value: 40,
                  message: 'Maximum 40 characters',
                },
              })}
              placeholder="New Password"
              className={errors.password ? styles.inputError : ''}
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
          </label>

          <label>
            Avatar image (url)
            <input
              type="url"
              {...register('avatar', {
                required: 'Avatar URL is required',
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: 'Invalid URL',
                },
              })}
              placeholder="Avatar URL"
              className={errors.avatar ? styles.inputError : ''}
            />
            {errors.avatar && (
              <p className={styles.errorMessage}>{errors.avatar.message}</p>
            )}
          </label>

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
