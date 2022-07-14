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
import { useNavigate } from 'react-router-dom';

const Book = ({
  id,
  title,
  subtitle,
  authors,
  genres,
  query,
  setQuery,
  setSearch,
  copiesCount,
  copiesAvailable,
  description,
  isbn10,
  isbn13,
  image,
  callNumber,
}: {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  genres: string[];
  query: any;
  setQuery: any;
  setSearch: any;
  copiesCount: number;
  copiesAvailable: number;
  description: string;
  isbn10: string;
  isbn13: string;
  image: string;
  callNumber: string;
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow key={id} className="font-weight-bold">
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
          <span className="font-weight-bold pr-2">{title || ''}</span>
          <span className="font-weight-light">{subtitle || ''}</span>
        </TableCell>
        <TableCell className="font-weight-bold h6">
          {Array.isArray(authors)
            ? authors.map((author) => (
                <Chip
                  label={author}
                  key={author.toString()}
                  color="default"
                  className="m-1"
                  style={{ cursor: 'pointer' }}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSearch(author);
                    setQuery({
                      search: author,
                      limit: query.limit,
                    });
                  }}
                />
              ))
            : null}
        </TableCell>
        <TableCell className="font-weight-bold h6">
          {Array.isArray(genres)
            ? genres.map((genre) => (
                <Chip
                  label={genre}
                  key={genre.toString()}
                  color="default"
                  className="m-1"
                  style={{ cursor: 'pointer' }}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSearch(genre);
                    setQuery({
                      search: genre,
                      limit: query.limit,
                    });
                  }}
                />
              ))
            : null}
        </TableCell>
        <TableCell>
          {copiesAvailable > 0 && (
            <CheckCircleOutlined className="green-text mr-2" />
          )}
          {copiesAvailable === 0 && <HighlightOff className="red-text mr-2" />}
          {copiesAvailable}/{copiesCount}
        </TableCell>
        <TableCell padding="none">
          <Button
            size="small"
            variant="text"
            onClick={() => navigate(`/books/${id}`)}
          >
            View Book
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container spacing={2}>
              {image && image !== '' && (
                <Grid item xs={1}>
                  <img
                    src={image}
                    alt="Book cover"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={image !== '' ? 8 : 9}>
                <div style={{ whiteSpace: 'pre-line' }}>{description}</div>
              </Grid>
              <Grid item xs={3}>
                {isbn10 && `ISBN-10: ${isbn10}`}
                <br />
                {isbn13 && `ISBN-13: ${isbn13}`}
                <br />
                {callNumber && `Call Number: ${callNumber}`}
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Book;
