import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import ArticlePage from './components/ArticlePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import BlogHeader from './components/BlogHeader';
import ArticleForm from './components/ArticleForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <BlogHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/articles" element={<MainPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route
          path="/articles/:slug/edit"
          element={
            <PrivateRoute>
              <ArticleForm isEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-article"
          element={
            <PrivateRoute>
              <ArticleForm />
            </PrivateRoute>
          }
        />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
