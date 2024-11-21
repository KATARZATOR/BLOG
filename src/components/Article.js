import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Article.module.css';
import heart from '../assets/heart.svg';
import heartFilled from '../assets/heart-filled.svg';
import { UserContext } from '../UserContext';

function Article({ article }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    try {
      const method = article.favorited ? 'DELETE' : 'POST';
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${article.slug}/favorite`,
        {
          method,
          headers: {
            Authorization: `Token ${user.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Ошибка при обновлении лайка');
      }

      const data = await response.json();
      article.favorited = data.article.favorited;
      article.favoritesCount = data.article.favoritesCount;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.articleCard}>
      <div className={styles.articleHeader}>
        <div className={styles.headerTitle}>
          <div className={styles.titleFirst}>
            <Link
              to={`/articles/${article.slug}`}
              className={styles.articleTitle}
            >
              {article.title}
            </Link>
            <div className={styles.articleLikes}>
              <img
                src={article.favorited ? heartFilled : heart}
                alt="Heart"
                style={{
                  height: '16px',
                  width: '16px',
                  marginRight: '4px',
                  cursor: 'pointer',
                }}
                onClick={handleLike}
              />{' '}
              {article.favoritesCount}
            </div>
          </div>
          <div className={styles.titleTags}>
            {article.tagList.map(tag => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.infoBox}>
            <div className={styles.infoName}>{article.author.username}</div>
            <div className={styles.infoDate}>
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className={styles.headerAvatar}>
            <img
              src={article.author.image || 'https://via.placeholder.com/46'}
              alt="Avatar"
            />
          </div>
        </div>
      </div>
      <div className={styles.articleText}>{article.description}</div>
    </div>
  );
}

Article.propTypes = {
  article: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    favorited: PropTypes.bool,
    favoritesCount: PropTypes.number,
    tagList: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.shape({
      username: PropTypes.string,
      image: PropTypes.string,
    }),
    createdAt: PropTypes.string,
  }).isRequired,
};

export default Article;
