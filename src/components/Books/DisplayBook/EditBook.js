import React, { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as yup from 'yup';
import { useFirestore, useUser } from 'reactfire';
import {
  Button,
  Chip,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@material-ui/core';

const EditBook = ({ volumeInfo, bookID, setEditing }) => {
  const fieldValue = useFirestore.FieldValue;

  const user = useUser().data;

  const EditBookSchema = yup.object().shape({
    authors: yup.array().of(yup.string()),
    genres: yup.array().of(yup.string()),
    description: yup.string(),
    image: yup.string().url(),
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
    title: yup.string().required('Books must have a title'),
  });

  const [newGenre, setNewGenre] = useState('');

  const [newAuthor, setNewAuthor] = useState('');

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
        {({ values, errors, isSubmitting, handleChange }) => (
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
            <TextField
              id="title"
              type="text"
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              label="Title"
              value={values.title}
              onChange={handleChange}
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
            />
            <br />
            <br />
            <TextField
              id="description"
              multiline
              rowsMax={10}
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
              label="Description"
              value={values.description}
              onChange={handleChange}
            />
            <br />
            <br />
            <TextField
              id="image"
              type="text"
              error={!!errors.image}
              helperText={errors.image}
              fullWidth
              label="Image URL"
              value={values.image}
              onChange={handleChange}
            />
            <br />
            <br />
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
                />
              )}
            />
            <TextField
              id="isbn10"
              type="text"
              error={!!errors.isbn10}
              label="ISBN-10"
              value={values.isbn10}
              onChange={handleChange}
            />
            <TextField
              id="isbn13"
              type="text"
              error={!!errors.isbn13}
              label="ISBN-13"
              value={values.isbn13}
              onChange={handleChange}
            />
            <br />
            <br />
            <FormLabel>Grades</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade0"
                    color="primary"
                    checked={values.grade0}
                    onChange={handleChange}
                  />
                }
                label="<1"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade1"
                    color="primary"
                    checked={values.grade1}
                    onChange={handleChange}
                  />
                }
                label="1"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade2"
                    color="primary"
                    checked={values.grade2}
                    onChange={handleChange}
                  />
                }
                label="2"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade3"
                    color="primary"
                    checked={values.grade3}
                    onChange={handleChange}
                  />
                }
                label="3"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade4"
                    color="primary"
                    checked={values.grade4}
                    onChange={handleChange}
                  />
                }
                label="4"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade5"
                    color="primary"
                    checked={values.grade5}
                    onChange={handleChange}
                  />
                }
                label="5"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade6"
                    color="primary"
                    checked={values.grade6}
                    onChange={handleChange}
                  />
                }
                label="6"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade7"
                    color="primary"
                    checked={values.grade7}
                    onChange={handleChange}
                  />
                }
                label="7"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade8"
                    color="primary"
                    checked={values.grade8}
                    onChange={handleChange}
                  />
                }
                label="8"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade9"
                    color="primary"
                    checked={values.grade9}
                    onChange={handleChange}
                  />
                }
                label="9"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade10"
                    color="primary"
                    checked={values.grade10}
                    onChange={handleChange}
                  />
                }
                label="10"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade11"
                    color="primary"
                    checked={values.grade11}
                    onChange={handleChange}
                  />
                }
                label="11"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade12"
                    color="primary"
                    checked={values.grade12}
                    onChange={handleChange}
                  />
                }
                label="12"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="grade13"
                    color="primary"
                    checked={values.grade13}
                    onChange={handleChange}
                  />
                }
                label="12+"
              />
            </FormGroup>
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
