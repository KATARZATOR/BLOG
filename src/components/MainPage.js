import React, { useEffect, useState, useContext } from 'react';
import styles from './MainPage.module.css';
import ArticleList from './ArticleList';
import { Pagination } from 'antd';
import { UserContext } from '../UserContext';
import { useSearchParams } from 'react-router-dom';

function MainPage() {
  const { user } = useContext(UserContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 5;
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalArticles, setTotalArticles] = useState(0);

  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage, setSearchParams]);

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
