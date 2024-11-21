import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './ArticlePage.module.css';
import heart from '../assets/heart.svg';
import heartFilled from '../assets/heart-filled.svg';
import { UserContext } from '../UserContext';

function ArticlePage() {
  const { slug } = useParams();
  const { user } = useContext(UserContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const headers = user ? { Authorization: `Token ${user.token}` } : {};
        const response = await fetch(
          `https://blog-platform.kata.academy/api/articles/${slug}`,
          { headers },
        );
        const data = await response.json();
        setArticle(data.article);
      } catch {
        setError('Ошибка при загрузке статьи');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, user]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${user.token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Ошибка при удалении статьи');
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    try {
      const method = article.favorited ? 'DELETE' : 'POST';
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
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
      setArticle(data.article);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className={styles.articlePage}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.articlePage}>{error}</div>;
  }

  const isAuthor = user && user.username === article.author.username;

  return (
    <div className={styles.articlePage}>
      <div className={styles.articleCard}>
        <div className={styles.articleHeader}>
          <div className={styles.headerTitle}>
            <div className={styles.titleFirst}>
              <div className={styles.articleTitle}>{article.title}</div>
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
        {isAuthor && (
          <div className={styles.actionButtons}>
            <Link to={`/articles/${slug}/edit`} className={styles.editButton}>
              Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        )}
        <div className={styles.articleText}>
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>
      </div>
      {showConfirm && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmContent}>
            <p>Are you sure you want to delete this article?</p>
            <div className={styles.confirmButtons}>
              <button onClick={handleDelete}>Yes</button>
              <button onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticlePage;
