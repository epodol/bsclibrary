import React, { useState } from 'react';
import { MDBBadge, MDBBtn, MDBIcon, MDBInput, MDBInputGroup } from 'mdbreact';
import { Formik, Form, FieldArray } from 'formik';
import * as yup from 'yup';
import { useFirestore, useUser } from 'reactfire';

const EditBook = ({ volumeInfo, bookID, setEditing }) => {
  const fieldValue = useFirestore.FieldValue;

  const user = useUser().data;

  const EditBookSchema = yup.object().shape({
    authors: yup.array().of(yup.string()),
    genres: yup.array().of(yup.string()),
    description: yup.string(),
    image: yup.string(),
    isbn10: yup.string(),
    isbn13: yup.string(),
    grade0: yup.boolean(),
    grade1: yup.boolean(),
    grade2: yup.boolean(),
    grade3: yup.boolean(),
    grade4: yup.boolean(),
    grade5: yup.boolean(),
    grade6: yup.boolean(),
    grade7: yup.boolean(),
    grade8: yup.boolean(),
    grade9: yup.boolean(),
    grade10: yup.boolean(),
    grade11: yup.boolean(),
    grade12: yup.boolean(),
    grade13: yup.boolean(),
    subtitle: yup.string(),
    title: yup.string(),
  });

  const [newGenre, setNewGenre] = useState('');
  const [genreAddHover, setGenreAddHover] = useState(false);

  const [newAuthor, setNewAuthor] = useState('');
  const [authorAddHover, setAuthorAddHover] = useState(false);

  const bookRef = useFirestore().collection('books').doc(bookID);

  return (
    <div>
      <Formik
        initialValues={{
          authors: volumeInfo.authors || [],
          genres: volumeInfo.genres || [],
          description: volumeInfo.description || '',
          image: volumeInfo.image || '',
          isbn10: volumeInfo.isbn10 || '',
          isbn13: volumeInfo.isbn13 || '',
          grade0: volumeInfo?.grades?.grade0 || false,
          grade1: volumeInfo?.grades?.grade1 || false,
          grade2: volumeInfo?.grades?.grade2 || false,
          grade3: volumeInfo?.grades?.grade3 || false,
          grade4: volumeInfo?.grades?.grade4 || false,
          grade5: volumeInfo?.grades?.grade5 || false,
          grade6: volumeInfo?.grades?.grade6 || false,
          grade7: volumeInfo?.grades?.grade7 || false,
          grade8: volumeInfo?.grades?.grade8 || false,
          grade9: volumeInfo?.grades?.grade9 || false,
          grade10: volumeInfo?.grades?.grade10 || false,
          grade11: volumeInfo?.grades?.grade11 || false,
          grade12: volumeInfo?.grades?.grade12 || false,
          grade13: volumeInfo?.grades?.grade13 || false,
          subtitle: volumeInfo.subtitle || '',
          title: volumeInfo.title || '',
        }}
        validationSchema={EditBookSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          actions.setSubmitting(false);
          bookRef.set(
            {
              volumeInfo: {
                authors: values.authors,
                genres: values.genres,
                description: values.description.trim(),
                image: values.image.trim(),
                isbn10: values.isbn10.trim(),
                isbn13: values.isbn13.trim(),
                grades: {
                  grade0: values.grade0,
                  grade1: values.grade1,
                  grade2: values.grade2,
                  grade3: values.grade3,
                  grade4: values.grade4,
                  grade5: values.grade5,
                  grade6: values.grade6,
                  grade7: values.grade7,
                  grade8: values.grade8,
                  grade9: values.grade9,
                  grade10: values.grade10,
                  grade11: values.grade11,
                  grade12: values.grade12,
                  grade13: values.grade13,
                },
                subtitle: values.subtitle.trim(),
                title: values.title.trim(),
              },
              lastEditedBy: user.uid,
              lastEdited: fieldValue.serverTimestamp(),
            },
            { merge: true }
          );
          setEditing(false);
        }}
      >
        {({
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          submitCount,
        }) => (
          <Form
            noValidate
            className="pb-5 px-5"
            onKeyDown={(keyEvent) => {
              if (
                (keyEvent.key || keyEvent.code) === 'Enter' &&
                keyEvent.target.id !== 'description'
              ) {
                keyEvent.preventDefault();
              }
            }}
          >
            <MDBInput
              id="title"
              type="text"
              className={
                errors.title && (touched.title || submitCount > 1)
                  ? 'is-invalid'
                  : ''
              }
              label="Title"
              icon="pencil-alt"
              value={values.title}
              onChange={handleChange}
            />
            {errors.title && touched.title ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.title}
              </div>
            ) : null}

            <MDBInput
              id="subtitle"
              type="text"
              className={
                errors.subtitle && (touched.subtitle || submitCount > 1)
                  ? 'is-invalid'
                  : ''
              }
              label="Subtitle"
              icon="pencil-alt"
              value={values.subtitle}
              onChange={handleChange}
            />
            {errors.subtitle && touched.subtitle ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.subtitle}
              </div>
            ) : null}

            <MDBInput
              id="description"
              type="textarea"
              rows="5"
              className={
                errors.description && (touched.description || submitCount > 1)
                  ? 'is-invalid'
                  : ''
              }
              label="Description"
              icon="quote-left"
              value={values.description}
              onChange={handleChange}
            />
            {errors.description && touched.description ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.description}
              </div>
            ) : null}

            <MDBInput
              id="image"
              type="text"
              className={
                errors.image && (touched.image || submitCount > 1)
                  ? 'is-invalid'
                  : ''
              }
              label="Image URL"
              icon="link"
              value={values.image}
              onChange={handleChange}
            />
            {errors.image && touched.image ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.image}
              </div>
            ) : null}

            <FieldArray
              name="authors"
              render={(arrayHelpers) => (
                <h3 style={authorAddHover ? { cursor: 'pointer' } : {}}>
                  Authors:
                  {values.authors.map((author, index) => (
                    <MDBBadge
                      key={author.toString()}
                      color="light"
                      pill
                      className="m-1"
                    >
                      {author}
                      <MDBIcon
                        icon="minus-circle"
                        className="ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => arrayHelpers.remove(index)}
                      />
                    </MDBBadge>
                  ))}
                  <MDBInput
                    label="Add a new Author"
                    icon="plus"
                    type="text"
                    onIconMouseEnter={() => setAuthorAddHover(true)}
                    onIconMouseLeave={() => setAuthorAddHover(false)}
                    value={newAuthor.toString()}
                    onChange={(event) => setNewAuthor(event.target.value)}
                    onIconClick={() => {
                      if (newAuthor !== '') {
                        arrayHelpers.push(newAuthor.trim());
                        setNewAuthor('');
                      }
                    }}
                  />
                </h3>
              )}
            />

            <FieldArray
              name="genres"
              render={(arrayHelpers) => (
                <h3 style={genreAddHover ? { cursor: 'pointer' } : {}}>
                  Genres:
                  {values.genres.map((genre, index) => (
                    <MDBBadge
                      key={genre.toString()}
                      color="light"
                      pill
                      className="m-1"
                    >
                      {genre}
                      <MDBIcon
                        icon="minus-circle"
                        className="ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => arrayHelpers.remove(index)}
                      />
                    </MDBBadge>
                  ))}
                  <MDBInput
                    label="Add a new Genre"
                    icon="plus"
                    type="text"
                    onIconMouseEnter={() => setGenreAddHover(true)}
                    onIconMouseLeave={() => setGenreAddHover(false)}
                    value={newGenre.toString()}
                    onChange={(event) => setNewGenre(event.target.value)}
                    onIconClick={() => {
                      if (newGenre !== '') {
                        arrayHelpers.push(newGenre.trim());
                        setNewGenre('');
                      }
                    }}
                  />
                </h3>
              )}
            />

            <MDBInputGroup
              material
              containerClassName="m-0"
              prepend="ISBN (No spaces or dashes)"
              inputs={
                <>
                  <MDBInput
                    noTag
                    id="isbn10"
                    type="text"
                    className={
                      errors.isbn10 && (touched.isbn10 || submitCount > 1)
                        ? 'is-invalid'
                        : ''
                    }
                    hint="ISBN-10"
                    value={values.isbn10}
                    onChange={handleChange}
                  />
                  <MDBInput
                    noTag
                    id="isbn13"
                    type="text"
                    className={
                      errors.isbn13 && (touched.isbn13 || submitCount > 1)
                        ? 'is-invalid'
                        : ''
                    }
                    hint="ISBN-13"
                    value={values.isbn13}
                    onChange={handleChange}
                  />
                </>
              }
            />
            {errors.isbn10 && touched.isbn10 ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.isbn10}
              </div>
            ) : null}
            {errors.isbn13 && touched.isbn13 ? (
              <div className="invalid-feedback" style={{ display: 'inline' }}>
                {errors.isbn13}
              </div>
            ) : null}

            <div className="form-inline">
              <p className="m-1">Grades</p>
              <MDBInput
                type="checkbox"
                id="grade0"
                className={
                  errors.grade0 && (touched.grade0 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="<1"
                checked={values.grade0}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade1"
                className={
                  errors.grade1 && (touched.grade1 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="1"
                checked={values.grade1}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade2"
                className={
                  errors.grade2 && (touched.grade2 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="2"
                checked={values.grade2}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade3"
                className={
                  errors.grade3 && (touched.grade3 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="3"
                checked={values.grade3}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade4"
                className={
                  errors.grade4 && (touched.grade4 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="4"
                checked={values.grade4}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade5"
                className={
                  errors.grade5 && (touched.grade5 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="5"
                checked={values.grade5}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade6"
                className={
                  errors.grade6 && (touched.grade6 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="6"
                checked={values.grade6}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade7"
                className={
                  errors.grade7 && (touched.grade7 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="7"
                checked={values.grade7}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade8"
                className={
                  errors.grade8 && (touched.grade8 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="8"
                checked={values.grade8}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade9"
                className={
                  errors.grade9 && (touched.grade9 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="9"
                checked={values.grade9}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade10"
                className={
                  errors.grade10 && (touched.grade10 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="10"
                checked={values.grade10}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade11"
                className={
                  errors.grade11 && (touched.grade11 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="11"
                checked={values.grade11}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade12"
                className={
                  errors.grade12 && (touched.grade12 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="12"
                checked={values.grade12}
                onChange={handleChange}
              />
              <MDBInput
                type="checkbox"
                id="grade13"
                className={
                  errors.grade13 && (touched.grade13 || submitCount > 1)
                    ? 'is-invalid mx-3'
                    : 'mx-3'
                }
                label="12+"
                checked={values.grade13}
                onChange={handleChange}
              />
            </div>
            <hr className="hr-dark" />
            <div className="text-center mt-4 black-text">
              <MDBBtn
                size="lg"
                color="orange"
                type="submit"
                disabled={isSubmitting}
              >
                {!isSubmitting && <>Save Changes</>}
                {isSubmitting && (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </MDBBtn>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditBook;
