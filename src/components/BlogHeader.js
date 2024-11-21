import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './BlogHeader.module.css';
import { UserContext } from '../UserContext';

function BlogHeader() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className={styles.blogHeader}>
      <Link to="/" className={styles.logo}>
        Realworld Blog
      </Link>
      <div className={styles.headerBtn}>
        {user ? (
          <>
            <Link to="/new-article">
              <button className={[styles.btn, styles.btnCreate].join(' ')}>
                Create Article
              </button>
            </Link>
            <Link to="/profile" className={styles.userInfo}>
              <span>{user.username}</span>
              <img
                src={user.image || 'https://via.placeholder.com/46'}
                alt="Аватар"
              />
            </Link>
            <button
              className={`${styles.btn} ${styles.btnLogOut}`}
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in">
              <button className={[styles.btn, styles.btn1].join(' ')}>
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button className={[styles.btn, styles.btn2].join(' ')}>
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default BlogHeader;
