import React, { useContext, useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as yup from 'yup';
import { useFirestore, useUser } from 'reactfire';
import { Button, Chip, TextField } from '@mui/material';

import Book, { volumeInfo as volumeInfoType } from '@common/types/Book';
import NotificationContext from 'src/contexts/NotificationContext';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import RecursivePartial from '@common/types/util/RecursivePartial';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';

const EditBook = ({
  volumeInfo,
  bookID,
  setEditing,
}: {
  volumeInfo: volumeInfoType;
  bookID: string;
  setEditing: any;
}) => {
  const NotificationHandler = useContext(NotificationContext);

  const firestore = useFirestore();
  const user = useUser().data;
  if (user === null) throw new Error('No user exists.');

  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const EditBookSchema = yup.object().shape({
    authors: yup.array().of(yup.string()),
    genres: yup.array().of(yup.string()),
    description: yup.string(),
    image: yup.string().url(),
    isbn10: yup.string(),
    isbn13: yup.string(),
    callNumber: yup.string(),
    subtitle: yup.string(),
    title: yup.string().required('Books must have a title'),
  });

  const [newGenre, setNewGenre] = useState('');

  const [newAuthor, setNewAuthor] = useState('');

  const bookRef = doc(firestore, 'libraries', activeLibraryID, 'books', bookID);

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
          callNumber: volumeInfo.callNumber || '',
          subtitle: volumeInfo.subtitle || '',
          title: volumeInfo.title || '',
        }}
        validationSchema={EditBookSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          actions.setSubmitting(false);
          const newData: RecursivePartial<Book> = {
            volumeInfo: {
              authors: values.authors,
              genres: values.genres,
              description: values.description.trim(),
              image: values.image === '' ? null : values.image.trim(),
              isbn10: values.isbn10.trim(),
              isbn13: values.isbn13.trim(),
              callNumber: values.callNumber.trim(),
              subtitle: values.subtitle.trim(),
              title: values.title.trim(),
            },
            updatedBy: user.uid,
            updatedAt: serverTimestamp() as any,
          };

          await setDoc(bookRef, newData, { merge: true })
            .then(() => {
              NotificationHandler.addNotification({
                message: 'Book updated.',
                severity: 'success',
              });
            })
            .catch((err) => {
              console.error(err);
              NotificationHandler.addNotification({
                message: `An unexpected error occurred: ${err.message} (${err.code})`,
                severity: 'error',
              });
            });
          setEditing(false);
        }}
      >
        {({ values, errors, isSubmitting, handleChange }) => (
          <Form
            noValidate
            className="pb-5 px-5"
            onKeyDown={(keyEvent: React.KeyboardEvent<HTMLFormElement>) => {
              const target = keyEvent.target as HTMLFormElement;

              if (
                (keyEvent.key || keyEvent.code) === 'Enter' &&
                target.id !== 'description'
              ) {
                keyEvent.preventDefault();
              }
            }}
          >
            <TextField
              id="title"
              type="text"
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              label="Title"
              value={values.title}
              onChange={handleChange}
              sx={{ marginBlock: '1rem' }}
            />
            <TextField
              id="subtitle"
              type="text"
              error={!!errors.subtitle}
              helperText={errors.subtitle}
              fullWidth
              label="Subtitle"
              value={values.subtitle}
              onChange={handleChange}
              sx={{ marginBlock: '1rem' }}
            />
            <TextField
              id="description"
              multiline
              maxRows={10}
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
              label="Description"
              value={values.description}
              onChange={handleChange}
              sx={{ marginBlock: '1rem' }}
            />
            <TextField
              id="image"
              type="text"
              error={!!errors.image}
              helperText={errors.image}
              fullWidth
              label="Image URL"
              value={values.image}
              onChange={handleChange}
              sx={{ marginBlock: '1rem' }}
            />
            <FieldArray
              name="authors"
              render={(arrayHelpers) => (
                <TextField
                  InputProps={{
                    startAdornment: values.authors.map((author, index) => (
                      <Chip
                        key={author.toString()}
                        style={{ margin: 3 }}
                        color="default"
                        label={author}
                        onDelete={() => arrayHelpers.remove(index)}
                      />
                    )),
                  }}
                  label="Add a new Author"
                  fullWidth
                  value={newAuthor.toString()}
                  onChange={(event) => setNewAuthor(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === 'Enter') {
                      e.preventDefault();
                      if (
                        newAuthor !== '' &&
                        !values.authors.includes(newAuthor)
                      ) {
                        arrayHelpers.push(newAuthor.trim());
                        setNewAuthor('');
                      }
                    }
                  }}
                  sx={{ marginBlock: '1rem' }}
                />
              )}
            />
            <FieldArray
              name="genres"
              render={(arrayHelpers) => (
                <TextField
                  InputProps={{
                    startAdornment: values.genres.map((genre, index) => (
                      <Chip
                        key={genre.toString()}
                        style={{ margin: 5 }}
                        color="default"
                        label={genre}
                        onDelete={() => arrayHelpers.remove(index)}
                      />
                    )),
                  }}
                  label="Add a new Genre"
                  fullWidth
                  value={newGenre.toString()}
                  onChange={(event) => setNewGenre(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === 'Enter') {
                      e.preventDefault();
                      if (
                        newGenre !== '' &&
                        !values.genres.includes(newGenre)
                      ) {
                        arrayHelpers.push(newGenre.trim());
                        setNewGenre('');
                      }
                    }
                  }}
                  sx={{ marginBlock: '1rem' }}
                />
              )}
            />
            <TextField
              id="isbn10"
              type="text"
              error={!!errors.isbn10}
              helperText={errors.isbn10}
              fullWidth
              label="ISBN-10"
              value={values.isbn10}
              onChange={handleChange}
              sx={{ marginBlock: '1rem' }}
            />
            <TextField
              id="isbn13"
              type="text"
              error={!!errors.isbn13}
              helperText={errors.isbn13}
              fullWidth
              label="ISBN-13"
              value={values.isbn13}
              onChange={handleChange}
              sx={{ marginBlock: '1rem' }}
            />
            <TextField
              id="callNumber"
              type="text"
              error={!!errors.callNumber}
              helperText={errors.callNumber}
              fullWidth
              label="Call Number"
              value={values.callNumber}
              onChange={handleChange}
              sx={{ marginBlock: '1rem' }}
            />
            <hr className="hr-dark" />
            <div className="text-center mt-4 black-text">
              <Button
                size="large"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {!isSubmitting && <>Save Changes</>}
                {isSubmitting && (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditBook;
