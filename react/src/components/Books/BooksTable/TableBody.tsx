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
} from '@mui/material';
import { HelpOutline, Search } from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import algoliasearch from 'algoliasearch';

import Book from './Book';
import {
  collection,
  query as firestoreQuery,
  where,
  limit,
  getDocs,
} from 'firebase/firestore';
import { useFirestore } from 'reactfire';

const isDev = process.env.NODE_ENV !== 'production';

const TableBody = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const firestore = useFirestore();

  const [query, setQuery] = useState({
    search: (location?.state as any)?.query?.search || '',
    limit: 30,
  });
  const [search, setSearch] = useState('');

  const [books, setBooks] = useState<any[]>([]);

  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  useEffect(() => {
    let isSubscribed = true;
    navigate(location.pathname, { replace: true });

    if (
      !isDev &&
      process.env.REACT_APP_ALGOLIA_APP_ID &&
      process.env.REACT_APP_ALGOLIA_API_KEY
    ) {
      // ONLY EXECUTED IN PRODUCTION
      algoliasearch(
        process.env.REACT_APP_ALGOLIA_APP_ID,
        process.env.REACT_APP_ALGOLIA_API_KEY
      )
        .initIndex('books')
        .search(query.search, { hitsPerPage: query.limit })
        .then(({ hits }) => setBooks(hits));
    } else {
      // ONLY EXECUTED IN A DEVELOPMENT ENVIRONMENT
      const booksRef = collection(firestore, 'books');

      const ref =
        query.search !== ''
          ? firestoreQuery(
              booksRef,
              where('volumeInfo.title', '>=', query.search),
              where('volumeInfo.title', '<=', `${query.search}~`),
              limit(query.limit)
            )
          : firestoreQuery(booksRef, limit(query.limit));

      const booksArray: any = [];
      getDocs(ref).then((res) => {
        res.docs.forEach((doc) =>
          booksArray.push({ ...doc.data(), objectID: doc.id })
        );
        if (isSubscribed) setBooks(booksArray);
      });
    }
    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.pathname, query, firestore]);

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
                const target = event.target as HTMLTextAreaElement;
                setSearch(target.value);
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
                    <IconButton type="submit" aria-label="search" size="large">
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
