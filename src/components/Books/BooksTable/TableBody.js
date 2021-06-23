import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  // TableBody is the name of this component
  TableBody as MUITableBody,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@material-ui/core';
import { HelpOutline, Search } from '@material-ui/icons';

import { useHistory, useLocation } from 'react-router-dom';
import algoliasearch from 'algoliasearch';
import firebase from 'firebase/app';

import Book from './Book';

const isDev = process.env.NODE_ENV !== 'production';

const TableBody = () => {
  const history = useHistory();
  const location = useLocation();

  const [query, setQuery] = useState({
    search: location?.state?.query?.search || '',
    limit: 5,
  });
  const [search, setSearch] = useState('');

  const [books, setBooks] = useState([]);

  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  useEffect(() => {
    history.replace(location.pathname);

    if (!isDev) {
      // ONLY EXECUTED IN PRODUCTION
      algoliasearch(
        process.env.REACT_APP_ALGOLIA_APP_ID,
        process.env.REACT_APP_ALGOLIA_API_KEY
      )
        .initIndex('books')
        .search(query.search, { hitsPerPage: query.limit })
        .then((res) => setBooks(res.hits));
    } else {
      // ONLY EXECUTED IN A DEVELOPMENT ENVIRONMENT
      const booksRef = firebase.firestore().collection('books');

      const ref =
        query.search !== ''
          ? booksRef
              .where('volumeInfo.title', '>=', query.search)
              .where('volumeInfo.title', '<=', `${query.search}~`)
          : booksRef;

      const booksArray = [];
      ref
        .limit(query.limit)
        .get()
        .then((res) => {
          res.docs.forEach((doc) =>
            booksArray.push({ ...doc.data(), objectID: doc.id })
          );
          setBooks(booksArray);
        });
    }
  }, [history, location.pathname, query]);

  const searchRef = useRef(search);
  searchRef.current = search;

  const queryRef = useRef(query);
  queryRef.current = query;

  useEffect(() => {
    setTimeout(() => {
      if (
        search === searchRef.current &&
        searchRef.current !== queryRef.current.search
      ) {
        setQuery({
          search,
          limit: queryRef.current.limit,
        });
      }
    }, 1500);
  }, [search]);

  return (
    <div>
      <div className="mx-auto px-auto">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (search === query.search) return;
            setQuery({
              search,
              limit: queryRef.current.limit,
            });
          }}
        >
          <div
            style={{
              padding: '15px 0px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              label="Search our book collection"
              variant="outlined"
              value={search}
              onInput={(event) => {
                setSearch(event.target.value);
              }}
              autoFocus
              fullWidth
              InputProps={{
                startAdornment: (
                  <Tooltip title="Search our book collection by entering any part of the book's title, subtitle, author, genre, description, or ISBN. Search results powered by Algolia.">
                    <HelpOutline style={{ marginRight: 10 }} />
                  </Tooltip>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" aria-label="search">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
                'aria-label': 'search our book collection',
              }}
            />
          </div>
        </form>
      </div>
      <Dialog
        open={isRequestDialogOpen}
        onClose={() => setIsRequestDialogOpen(false)}
      >
        <DialogTitle>Request a book</DialogTitle>
        <DialogContent>
          <DialogContentText>This feature is coming soon.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRequestDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setIsRequestDialogOpen(false)} color="primary">
            Request
          </Button>
        </DialogActions>
      </Dialog>
      <Table stickyHeader>
        <caption style={{ padding: 0 }}>
          <div className="text-right">
            <Button onClick={() => setIsRequestDialogOpen(true)}>
              Can&apos;t find the book you want? Request it here!
            </Button>
          </div>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell padding="none" />
            <TableCell className="h4">Title</TableCell>
            <TableCell className="h4">Authors</TableCell>
            <TableCell className="h4">Genres</TableCell>
            <TableCell className="h4">Availability</TableCell>
            <TableCell padding="none" />
          </TableRow>
        </TableHead>
        <MUITableBody>
          {books.map(
            ({
              objectID,
              copiesCount = 0,
              copiesAvailable = 0,
              volumeInfo: {
                title,
                subtitle,
                description,
                image,
                isbn10,
                isbn13,
              } = '',
              volumeInfo: { authors, genres } = [],
            }) => (
              <Book
                key={objectID}
                id={objectID}
                title={title}
                subtitle={subtitle}
                authors={authors}
                genres={genres}
                query={query}
                setQuery={setQuery}
                setSearch={setSearch}
                copiesCount={copiesCount}
                copiesAvailable={copiesAvailable}
                description={description}
                image={image}
                isbn10={isbn10}
                isbn13={isbn13}
              />
            )
          )}
        </MUITableBody>
      </Table>
      <div className="text-center">
        <Button
          disabled={books.length < query.limit}
          onClick={() =>
            setQuery({
              search: query.search,
              limit: query.limit + 5,
            })
          }
        >
          Load More
        </Button>
      </div>
    </div>
  );
};

export default TableBody;
