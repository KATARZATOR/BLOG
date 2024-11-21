import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, useFieldArray } from 'react-hook-form';
import styles from './ArticleForm.module.css';
import { UserContext } from '../UserContext';
import { useNavigate, useParams } from 'react-router-dom';

function ArticleForm({ isEdit }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { slug } = useParams();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tagList: [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  });

  const [serverErrors, setServerErrors] = useState(null);

  useEffect(() => {
    if (isEdit && slug) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(
            `https://blog-platform.kata.academy/api/articles/${slug}`,
          );
          const data = await response.json();
          const article = data.article;

          if (article.author.username !== user.username) {
            navigate('/');
          } else {
            setValue('title', article.title);
            setValue('description', article.description);
            setValue('body', article.body);
            setValue(
              'tagList',
              article.tagList.length ? article.tagList : [''],
            );
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchArticle();
    }
  }, [isEdit, slug, setValue, user, navigate]);

  const onSubmit = async data => {
    const articleData = {
      title: data.title,
      description: data.description,
      body: data.body,
      tagList: data.tagList.filter(tag => tag.trim() !== ''),
    };

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit
        ? `https://blog-platform.kata.academy/api/articles/${slug}`
        : 'https://blog-platform.kata.academy/api/articles';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${user.token}`,
        },
        body: JSON.stringify({ article: articleData }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerErrors(result.errors);
      } else {
        navigate(`/articles/${result.article.slug}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const canAddTag = fields.length < 10;

  return (
    <div className={styles.articleForm}>
      <div className={styles.articleFormInfo}>
        <h2>{isEdit ? 'Edit Article' : 'Create New Article'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Title
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              placeholder="Title"
              className={errors.title ? styles.inputError : ''}
            />
            {errors.title && (
              <p className={styles.errorMessage}>{errors.title.message}</p>
            )}
            {serverErrors && serverErrors.title && (
              <p className={styles.errorMessage}>{serverErrors.title}</p>
            )}
          </label>

          <label>
            Short description
            <input
              type="text"
              {...register('description', {
                required: 'Description is required',
              })}
              placeholder="Short description"
              className={errors.description ? styles.inputError : ''}
            />
            {errors.description && (
              <p className={styles.errorMessage}>
                {errors.description.message}
              </p>
            )}
            {serverErrors && serverErrors.description && (
              <p className={styles.errorMessage}>{serverErrors.description}</p>
            )}
          </label>

          <label>
            Text
            <textarea
              {...register('body', { required: 'Text is required' })}
              placeholder="Text"
              className={errors.body ? styles.inputError : ''}
              rows="8"
            ></textarea>
            {errors.body && (
              <p className={styles.errorMessage}>{errors.body.message}</p>
            )}
            {serverErrors && serverErrors.body && (
              <p className={styles.errorMessage}>{serverErrors.body}</p>
            )}
          </label>

          <label>
            Tags
            {fields.map((field, index) => {
              const isLast = index === fields.length - 1;
              const isEmpty = !field.value || field.value.trim() === '';

              return (
                <div key={field.id} className={styles.tagInput}>
                  <input
                    type="text"
                    {...register(`tagList.${index}`)}
                    placeholder="Tag"
                  />
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => remove(index)}
                  >
                    Delete
                  </button>
                  {isLast && isEmpty && canAddTag && (
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => append('')}
                    >
                      Add tag
                    </button>
                  )}
                </div>
              );
            })}
            {canAddTag &&
              fields.every(
                field => field.value && field.value.trim() !== '',
              ) && (
                <div className={styles.tagInput}>
                  <input
                    type="text"
                    {...register(`tagList.${fields.length}`)}
                    placeholder="Tag"
                  />
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => remove(fields.length)}
                  >
                    Delete
                  </button>
                  {fields.length < 9 && (
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => append('')}
                    >
                      Add tag
                    </button>
                  )}
                </div>
              )}
          </label>

          <button type="submit">{isEdit ? 'Save' : 'Send'}</button>
        </form>
      </div>
    </div>
  );
}

ArticleForm.propTypes = {
  isEdit: PropTypes.bool,
};

ArticleForm.defaultProps = {
  isEdit: false,
};

export default ArticleForm;
