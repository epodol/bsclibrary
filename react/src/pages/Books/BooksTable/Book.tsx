import React, { useState } from 'react';
import {
  Chip,
  TableCell,
  TableRow,
  IconButton,
  Collapse,
  Button,
  Grid,
} from '@mui/material';
import {
  CheckCircleOutlined,
  HighlightOff,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BookType from '@common/types/Book';
import WithID from '@common/types/util/WithID';

const Book = ({ book }: { book: WithID<BookType> }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <TableRow key={book.ID} className="font-weight-bold">
        <TableCell padding="none">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <span className="font-weight-bold pr-2">
            {book?.volumeInfo?.title || ''}
          </span>
          <span className="font-weight-light">
            {book?.volumeInfo?.subtitle || ''}
          </span>
        </TableCell>
        <TableCell className="font-weight-bold h6">
          {Array.isArray(book?.volumeInfo?.authors) &&
            book?.volumeInfo?.authors.map((author) => (
              <Chip
                label={author}
                key={author.toString()}
                color="default"
                className="m-1"
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                  event.stopPropagation();
                  searchParams.set('searchBy', 'authors');
                  searchParams.set('search', author);
                  setSearchParams(searchParams);
                }}
              />
            ))}
        </TableCell>
        <TableCell className="font-weight-bold h6">
          {Array.isArray(book?.volumeInfo?.genres) &&
            book?.volumeInfo?.genres.map((genre) => (
              <Chip
                label={genre}
                key={genre.toString()}
                color="default"
                className="m-1"
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                  event.stopPropagation();
                  searchParams.set('searchBy', 'genres');
                  searchParams.set('search', genre);
                  setSearchParams(searchParams);
                }}
              />
            ))}
        </TableCell>
        <TableCell>
          {book?.copiesAvailable > 0 && (
            <CheckCircleOutlined className="green-text mr-2" />
          )}
          {book?.copiesAvailable === 0 && (
            <HighlightOff className="red-text mr-2" />
          )}
          {book?.copiesAvailable || 0}/{book?.copiesTotal || 0}
        </TableCell>
        <TableCell padding="none">
          <Button
            size="small"
            variant="text"
            onClick={() => navigate(`/books/${book.ID}`)}
          >
            View Book
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container spacing={2}>
              {(book?.volumeInfo?.isbn10 || book?.volumeInfo?.isbn13) && (
                <Grid item xs={1}>
                  {book?.volumeInfo?.isbn13 && (
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${book?.volumeInfo?.isbn13}-L.jpg`}
                      alt="Book cover"
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                      }}
                    />
                  )}
                  {!book?.volumeInfo?.isbn13 && book?.volumeInfo?.isbn10 && (
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${book?.volumeInfo?.isbn10}-L.jpg`}
                      alt="Book cover"
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                      }}
                    />
                  )}
                </Grid>
              )}
              <Grid
                item
                xs={
                  (book?.volumeInfo?.isbn10 || book?.volumeInfo?.isbn13) !== ''
                    ? 8
                    : 9
                }
              >
                <div style={{ whiteSpace: 'pre-line' }}>
                  {book?.volumeInfo?.description}
                </div>
              </Grid>
              <Grid item xs={3}>
                {book?.volumeInfo?.isbn10 &&
                  `ISBN-10: ${book?.volumeInfo?.isbn10}`}
                <br />
                {book?.volumeInfo?.isbn13 &&
                  `ISBN-13: ${book?.volumeInfo?.isbn13}`}
                <br />
                {book?.volumeInfo?.callNumber &&
                  `Call Number: ${book?.volumeInfo?.callNumber}`}
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Book;
