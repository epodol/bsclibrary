import React, { useState, useContext, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';

import { useSearchParams } from 'react-router-dom';

import {
  collection,
  limit,
  orderBy,
  query as firestoreQuery,
  where,
} from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import Book from 'src/pages/Books/BooksTable/Book';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import BookType from '@common/types/Book';
import WithID from '@common/types/util/WithID';

const searchByOptions = [
  { id: 'title', label: 'Title', type: 'textSearch' },
  { id: 'subtitle', label: 'Subtitle', type: 'textSearch' },
  { id: 'authors', label: 'Author', type: 'arrayContains' },
  { id: 'genres', label: 'Genre', type: 'arrayContains' },
  { id: 'isbn10', label: 'ISBN-10', type: 'textSearch' },
  { id: 'isbn13', label: 'ISBN-13', type: 'textSearch' },
  { id: 'callNumber', label: 'Call Number', type: 'textSearch' },
];

const useBuildBooksQuery = (searchParams: URLSearchParams) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID!');

  const firestore = useFirestore();

  let query = firestoreQuery(
    collection(firestore, 'libraries', activeLibraryID, 'books')
  );

  const search = searchParams.get('search');
  const searchBy = searchParams.get('searchBy') || 'title';
  const rowsPerPage = Number(searchParams.get('rowsPerPage')) || 10;

  if (search && search.length > 0) {
    if (searchByOptions.map((option) => option.id).includes(searchBy)) {
      if (
        searchByOptions.find((option) => option.id === searchBy)?.type ===
        'textSearch'
      ) {
        query = firestoreQuery(
          query,
          where(`volumeInfo.${searchBy}`, '>=', search),
          where(`volumeInfo.${searchBy}`, '<=', `${search}\uf8ff`)
        );
      } else if (
        searchByOptions.find((option) => option.id === searchBy)?.type ===
        'arrayContains'
      ) {
        query = firestoreQuery(
          query,
          where(
            `volumeInfo.${searchBy}`,
            'array-contains-any',
            search.split(/[,\s]+/).map((word) => word.trim())
          )
        );
      }
    } else {
      query = firestoreQuery(
        query,
        where('title', '>=', search),
        where('title', '<=', `${search}\uf8ff`)
      );
    }
  } else {
    query = firestoreQuery(
      query,
      orderBy('featured', 'desc'),
      orderBy('copiesAvailable', 'desc'),
      orderBy('copiesTotal', 'desc')
    );
  }

  query = firestoreQuery(query, limit(rowsPerPage + 1));

  return query;
};

const TableBody = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const query = useBuildBooksQuery(searchParams);

  const books = useFirestoreCollectionData(query, {
    idField: 'ID',
  }).data as unknown as WithID<BookType>[];

  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          marginBlock: '2.5%',
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (search.length > 0) {
              searchParams.set('search', search);
              setSearchParams(searchParams);
            } else {
              searchParams.delete('search');
              setSearchParams(searchParams);
            }
          }}
        >
          <FormControl
            sx={{ marginInline: 2, width: 160, marginBottom: '1rem' }}
          >
            <InputLabel id="searchByLabel">Search by</InputLabel>
            <Select
              labelId="searchByLabel"
              id="searchBy"
              value={searchParams.get('searchBy') || 'title'}
              label="Search by"
              onChange={(e) => {
                if (e.target.value) {
                  searchParams.set('searchBy', e.target.value);
                  setSearchParams(searchParams);
                } else {
                  searchParams.delete('searchBy');
                  setSearchParams(searchParams);
                }
              }}
            >
              {searchByOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Search"
            helperText={`Tip: Enter only the beginning of your search in its correct case. For example if you want to search for "A Wrinkle in Time" you should enter at least "A Wrinkle".`}
            value={search}
            onInput={(event) => {
              const target = event.target as HTMLTextAreaElement;
              setSearch(target.value);
            }}
            autoFocus
            sx={{
              width: {
                xs: '95%',
                sm: '90%',
                md: '80%',
                lg: '70%',
                xl: '60%',
              },
              marginBottom: '1rem',
            }}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    aria-label="search"
                    size="large"
                    color="primary"
                  >
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
              'aria-label': 'search our book collection',
            }}
          />
          <FormControl
            sx={{ marginInline: 2, width: 120, marginBottom: '1rem' }}
          >
            <InputLabel id="rowsPerPageLabel">Rows per page</InputLabel>
            <Select
              labelId="rowsPerPageLabel"
              id="rowsPerPage"
              label="Rows per page"
              value={searchParams.get('rowsPerPage') || 10}
              onChange={(e) => {
                if (e.target.value && e.target.value === 10) {
                  searchParams.delete('rowsPerPage');
                  setSearchParams(searchParams);
                } else if (e.target.value) {
                  searchParams.set('rowsPerPage', String(e.target.value));
                  setSearchParams(searchParams);
                }
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </form>
      </div>
      <Dialog
        open={isRequestDialogOpen}
        onClose={() => setIsRequestDialogOpen(false)}
      >
        <DialogTitle>Request a book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The BASIS Scottsdale Library is always looking for new books to add
            to our collection. If there is a specific book you would like added,
            feel free to send us an email at info@bsclibrary.net!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRequestDialogOpen(false)} color="primary">
            Close
          </Button>
          {/* <Button onClick={() => setIsRequestDialogOpen(false)} color="primary">
            Request
          </Button> */}
        </DialogActions>
      </Dialog>
      <Table stickyHeader>
        <caption style={{ padding: 0 }}>
          <div className="text-right">
            <Button onClick={() => setIsRequestDialogOpen(true)}>
              Can&apos;t find the book you want?
            </Button>
          </div>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell padding="none" />
            <TableCell className="h4" size="medium">
              Title
            </TableCell>
            <TableCell className="h4">Authors</TableCell>
            <TableCell className="h4">Genres</TableCell>
            <TableCell className="h4">Availability</TableCell>
            <TableCell padding="none" size="small" />
          </TableRow>
        </TableHead>
        <MUITableBody>
          {books.map((bookItem) => (
            <Book key={bookItem.ID} book={bookItem} />
          ))}
        </MUITableBody>
      </Table>
    </div>
  );
};

export default TableBody;
