import React, { useEffect, useState, useContext } from 'react';
import styles from './MainPage.module.css';
import ArticleList from './ArticleList';
import { Pagination } from 'antd';
import { UserContext } from '../UserContext';

function MainPage() {
  const { user } = useContext(UserContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const pageSize = 5;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const headers = user ? { Authorization: `Token ${user.token}` } : {};
        const response = await fetch(
          `https://blog-platform.kata.academy/api/articles?limit=${pageSize}&offset=${
            (currentPage - 1) * pageSize
          }`,
          { headers },
        );
        const data = await response.json();
        setArticles(data.articles);
        setTotalArticles(data.articlesCount);
      } catch {
        setError('Ошибка при загрузке статей');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [currentPage, user]);

  if (loading) {
    return <div className={styles.mainPage}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.mainPage}>{error}</div>;
  }

  const onChangePage = page => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.mainPage}>
      <ArticleList articles={articles} />
      <Pagination
        current={currentPage}
        total={totalArticles}
        pageSize={pageSize}
        onChange={onChangePage}
        showSizeChanger={false}
        className={styles.pagination}
      />
    </div>
  );
}

export default MainPage;
