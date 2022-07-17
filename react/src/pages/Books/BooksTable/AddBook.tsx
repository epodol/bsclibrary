import React, {
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useUser, useFirestore, useFirestoreCollectionData } from 'reactfire';
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  where,
  query,
} from 'firebase/firestore';
import { useNavigate } from 'react-router';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import NotificationContext from 'src/contexts/NotificationContext';
import Book from 'src/pages/Books/BooksTable/Book';
import BookType, { volumeInfo } from '@common/types/Book';
import WithID from '@common/types/util/WithID';
import { useTheme } from '@mui/material/styles';
import { Search } from '@mui/icons-material';

function combineArrayAndRemoveDuplicates(arr1: any[], arr2: any[]) {
  const combined: any[] = [];
  arr1.concat(arr2).forEach((item) => {
    if (!combined.includes(item)) combined.push(item);
  });
  return combined;
}

const AddBook = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const NotificationHandler = useContext(NotificationContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const user = useUser().data;
  if (!user) throw new Error('No user exists.');

  const navigate = useNavigate();

  const firestore = useFirestore();

  const [isbn, setIsbn] = useState<string>('');

  const [step, setStep] = useState<0 | 1 | 2>(0);

  const handleClose = () => {
    setIsbn('');
    setStep(0);
    setIsOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth={step === 1 ? 'lg' : 'md'}
      fullScreen={fullScreen}
      scroll="body"
    >
      <DialogTitle>Add Book</DialogTitle>
      <DialogContent>
        {step === 0 && (
          <>
            <DialogContentText>
              To quickly add a book, enter the ISBN of the book here and we will
              look up the book.
            </DialogContentText>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isbn) setStep(1);
              }}
            >
              <TextField
                autoFocus
                id="isbn"
                label="ISBN (10 or 13)"
                type="text"
                margin="dense"
                fullWidth
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
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
            </form>
          </>
        )}
        {step === 1 && <AddBook1 isbn={isbn} setStep={setStep} />}
        {step === 2 && <AddBook2 isbn={isbn} />}
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={() => {
            const newData: BookType = {
              volumeInfo: {
                authors: [],
                genres: [],
                description: '',
                isbn10: '',
                isbn13: '',
                subtitle: '',
                title: '',
                callNumber: '',
              },
              featured: false,
              updatedBy: user.uid,
              updatedAt: serverTimestamp() as Timestamp,
              createdBy: user.uid,
              createdAt: serverTimestamp() as Timestamp,
              copiesAvailable: 0,
              copiesTotal: 0,
            };
            addDoc(
              collection(firestore, 'libraries', activeLibraryID, 'books'),
              newData
            )
              .then((book) => {
                NotificationHandler.addNotification({
                  message: `New book created.`,
                  severity: 'success',
                });
                navigate(`/books/${book.id}`, {
                  state: { editing: true },
                });
              })
              .catch((err) => {
                console.error(err);
                NotificationHandler.addNotification({
                  message: `An unexpected error occurred.`,
                  severity: 'error',
                  timeout: 10000,
                });
                handleClose();
              });
          }}
        >
          Create a Blank Book Instead
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddBook1 = ({
  isbn,
  setStep,
}: {
  isbn: string;
  setStep: Dispatch<SetStateAction<0 | 1 | 2>>;
}) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const booksByISBN10: WithID<BookType>[] = useFirestoreCollectionData(
    query(
      collection(firestore, 'libraries', activeLibraryID, 'books'),
      where('volumeInfo.isbn10', '==', isbn)
    ),
    { idField: 'ID' }
  ).data as WithID<BookType>[];

  const booksByISBN13: WithID<BookType>[] = useFirestoreCollectionData(
    query(
      collection(firestore, 'libraries', activeLibraryID, 'books'),
      where('volumeInfo.isbn13', '==', isbn)
    ),
    { idField: 'ID' }
  ).data as WithID<BookType>[];

  useEffect(() => {
    if (booksByISBN10.length + booksByISBN13.length === 0) {
      setStep(2);
    }
  }, [booksByISBN10, booksByISBN13, setStep]);

  const combinedBooks: WithID<BookType>[] = combineArrayAndRemoveDuplicates(
    booksByISBN10,
    booksByISBN13
  );

  return (
    <div>
      Uh oh. I already found some books with that ISBN. Do not recreate a book
      that already exists.
      <br />
      <br />
      <Table stickyHeader>
        <caption style={{ padding: 0 }}>
          <div className="text-right">
            <Button onClick={() => setStep(2)} color="warning">
              Ignore and Add Book
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
        <TableBody>
          {combinedBooks.map((bookItem) => (
            <Book key={bookItem.ID} book={bookItem} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface lookupBookResponse {
  title: string[];
  subtitle: string[];
  authors: string[];
  genres: string[];
  description: string[];
  isbn10: string[];
  isbn13: string[];
  callNumber: string[];
}

const useISBNLookup = (isbn: string) => {
  const [books, setBooks] = useState<lookupBookResponse | null>(null);
  useEffect(() => {
    if (isbn) {
      const fetchBook = async () => {
        const response = await (
          await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
          )
        ).json();
        const newBooks: lookupBookResponse = {
          title: [],
          subtitle: [],
          authors: [],
          genres: [],
          description: [],
          isbn10: [],
          isbn13: [],
          callNumber: [],
        };
        if (response.items && response.items.length > 0) {
          response.items.forEach((item: any) => {
            if (item.volumeInfo) {
              if (item.volumeInfo.title) {
                newBooks.title.push(item.volumeInfo.title);
                newBooks.title = combineArrayAndRemoveDuplicates(
                  newBooks.title,
                  []
                );
              }
              if (item.volumeInfo.subtitle) {
                newBooks.subtitle.push(item.volumeInfo.subtitle);
                newBooks.subtitle = combineArrayAndRemoveDuplicates(
                  newBooks.subtitle,
                  []
                );
              }
              if (item.volumeInfo.authors) {
                newBooks.authors.push(...item.volumeInfo.authors);
                newBooks.authors = combineArrayAndRemoveDuplicates(
                  newBooks.authors,
                  []
                );
              }
              if (item.volumeInfo.categories) {
                newBooks.genres.push(...item.volumeInfo.categories);
                newBooks.genres = combineArrayAndRemoveDuplicates(
                  newBooks.genres,
                  []
                );
              }
              if (item.volumeInfo.description) {
                newBooks.description.push(item.volumeInfo.description);
                newBooks.description = combineArrayAndRemoveDuplicates(
                  newBooks.description,
                  []
                );
              }
              if (item.volumeInfo.industryIdentifiers)
                item.volumeInfo.industryIdentifiers.forEach(
                  (identifier: any) => {
                    if (identifier.type === 'ISBN_10') {
                      newBooks.isbn10.push(identifier.identifier);
                      newBooks.isbn10 = combineArrayAndRemoveDuplicates(
                        newBooks.isbn10,
                        []
                      );
                    } else if (identifier.type === 'ISBN_13') {
                      newBooks.isbn13.push(identifier.identifier);
                      newBooks.isbn13 = combineArrayAndRemoveDuplicates(
                        newBooks.isbn13,
                        []
                      );
                    }
                  }
                );
              if (item.volumeInfo.callNumber) {
                newBooks.callNumber.push(item.volumeInfo.callNumber);
                newBooks.callNumber = combineArrayAndRemoveDuplicates(
                  newBooks.callNumber,
                  []
                );
              }
            }
          });
        }
        setBooks(newBooks);
      };
      fetchBook();
    }
  }, [isbn]);
  return books;
};

const AddBook2 = ({ isbn }: { isbn: string }) => {
  const books = useISBNLookup(isbn);

  if (!books) return <>Loading...</>;

  return (
    <div>
      <DialogContentText>
        To add a book, enter the information below.
      </DialogContentText>
      <AddBook2Form books={books} />
    </div>
  );
};

const AddBook2Form = ({ books }: { books: lookupBookResponse }) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID');

  const NotificationHandler = useContext(NotificationContext);

  const firestore = useFirestore();

  const user = useUser().data;
  if (!user) throw new Error('No user exists.');

  const navigate = useNavigate();

  const [newVolumeInfo, setNewVolumeInfo] = useState<volumeInfo>({
    title: books.title[0] || '',
    subtitle: books.subtitle[0] || '',
    authors: books.authors || [],
    genres: books.genres || [],
    description: books.description[0] || '',
    isbn10: books.isbn10[0] || '',
    isbn13: books.isbn13[0] || '',
    callNumber: books.callNumber[0] || '',
  });

  const [newGenre, setNewGenre] = useState('');

  const [newAuthor, setNewAuthor] = useState('');

  return (
    <div>
      <Autocomplete
        id="title"
        value={newVolumeInfo.title}
        inputValue={newVolumeInfo.title}
        onInputChange={(event, newInputValue) => {
          setNewVolumeInfo((oldValue) => ({
            ...oldValue,
            title: newInputValue,
          }));
        }}
        options={books.title}
        sx={{
          marginBlock: '0.5rem',
        }}
        freeSolo
        filterOptions={(options) => options}
        renderInput={(params) => (
          <TextField
            helperText={`${books.title.length} suggestion${
              books.title.length === 1 ? '' : 's'
            } available.`}
            {...params}
            label="Title"
          />
        )}
      />
      <Autocomplete
        id="subtitle"
        getOptionDisabled={() => false}
        value={newVolumeInfo.subtitle}
        inputValue={newVolumeInfo.subtitle}
        onInputChange={(event, newInputValue) => {
          setNewVolumeInfo((oldValue) => ({
            ...oldValue,
            subtitle: newInputValue,
          }));
        }}
        options={books.subtitle}
        sx={{
          marginBlock: '0.5rem',
        }}
        freeSolo
        filterOptions={(options) => options}
        renderInput={(params) => (
          <TextField
            helperText={`${books.subtitle.length} suggestion${
              books.subtitle.length === 1 ? '' : 's'
            } available.`}
            {...params}
            label="Subtitle"
          />
        )}
      />
      <TextField
        InputProps={{
          startAdornment: newVolumeInfo.authors.map((author, index) => (
            <Chip
              key={author.toString()}
              style={{ margin: 3 }}
              color="default"
              label={author}
              onDelete={() =>
                setNewVolumeInfo((oldValue) => ({
                  ...oldValue,
                  authors: oldValue.authors.filter((_, i) => i !== index),
                }))
              }
            />
          )),
        }}
        label="Add a new Author"
        fullWidth
        multiline
        value={newAuthor.toString()}
        onChange={(event) => setNewAuthor(event.target.value)}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            if (
              newAuthor !== '' &&
              !newVolumeInfo.authors.includes(newAuthor)
            ) {
              setNewVolumeInfo((oldValue) => ({
                ...oldValue,
                authors: [...oldValue.authors, newAuthor.trim()],
              }));
              setNewAuthor('');
            }
          }
        }}
        sx={{ marginBlock: '1rem' }}
      />
      <TextField
        InputProps={{
          startAdornment: newVolumeInfo.genres.map((genre, index) => (
            <Chip
              key={genre.toString()}
              style={{ margin: 3 }}
              color="default"
              label={genre}
              onDelete={() =>
                setNewVolumeInfo((oldValue) => ({
                  ...oldValue,
                  genres: oldValue.genres.filter((_, i) => i !== index),
                }))
              }
            />
          )),
        }}
        label="Add a new Genre"
        fullWidth
        multiline
        value={newGenre.toString()}
        onChange={(event) => setNewGenre(event.target.value)}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            if (newGenre !== '' && !newVolumeInfo.genres.includes(newGenre)) {
              setNewVolumeInfo((oldValue) => ({
                ...oldValue,
                genres: [...oldValue.genres, newGenre.trim()],
              }));
              setNewGenre('');
            }
          }
        }}
        sx={{ marginBlock: '1rem' }}
      />
      <Autocomplete
        id="description"
        value={newVolumeInfo.description}
        inputValue={newVolumeInfo.description}
        onInputChange={(event, newInputValue) => {
          setNewVolumeInfo((oldValue) => ({
            ...oldValue,
            description: newInputValue,
          }));
        }}
        options={books.description}
        sx={{
          marginBlock: '0.5rem',
        }}
        filterOptions={(options) => options}
        renderInput={(params) => (
          <TextField
            helperText={`${books.description.length} suggestion${
              books.description.length === 1 ? '' : 's'
            } available.`}
            {...params}
            multiline
            label="Description"
          />
        )}
      />
      <Autocomplete
        id="isbn10"
        value={newVolumeInfo.isbn10}
        inputValue={newVolumeInfo.isbn10}
        onInputChange={(event, newInputValue) => {
          setNewVolumeInfo((oldValue) => ({
            ...oldValue,
            isbn10: newInputValue,
          }));
        }}
        options={books.isbn10}
        sx={{
          marginBlock: '0.5rem',
        }}
        freeSolo
        filterOptions={(options) => options}
        renderInput={(params) => (
          <TextField
            helperText={`${books.isbn10.length} suggestion${
              books.isbn10.length === 1 ? '' : 's'
            } available.`}
            {...params}
            label="ISBN-10"
          />
        )}
      />
      <Autocomplete
        id="isbn13"
        value={newVolumeInfo.isbn13}
        inputValue={newVolumeInfo.isbn13}
        onInputChange={(event, newInputValue) => {
          setNewVolumeInfo((oldValue) => ({
            ...oldValue,
            isbn13: newInputValue,
          }));
        }}
        options={books.isbn13}
        sx={{
          marginBlock: '0.5rem',
        }}
        freeSolo
        filterOptions={(options) => options}
        renderInput={(params) => (
          <TextField
            helperText={`${books.isbn13.length} suggestion${
              books.isbn13.length === 1 ? '' : 's'
            } available.`}
            {...params}
            label="ISBN-13"
          />
        )}
      />
      <Autocomplete
        id="callNumber"
        value={newVolumeInfo.callNumber}
        inputValue={newVolumeInfo.callNumber}
        onInputChange={(event, newInputValue) => {
          setNewVolumeInfo((oldValue) => ({
            ...oldValue,
            callNumber: newInputValue,
          }));
        }}
        options={books.callNumber}
        sx={{
          marginBlock: '0.5rem',
        }}
        freeSolo
        filterOptions={(options) => options}
        renderInput={(params) => (
          <TextField
            helperText={`${books.callNumber.length} suggestion${
              books.callNumber.length === 1 ? '' : 's'
            } available.`}
            {...params}
            label="Call Number"
          />
        )}
      />
      <div style={{ marginBlock: '1rem', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            const newBook: BookType = {
              featured: false,
              updatedBy: user.uid,
              updatedAt: serverTimestamp() as Timestamp,
              createdBy: user.uid,
              createdAt: serverTimestamp() as Timestamp,
              copiesAvailable: 0,
              copiesTotal: 0,
              volumeInfo: newVolumeInfo,
            };
            addDoc(
              collection(firestore, 'libraries', activeLibraryID, 'books'),
              newBook
            )
              .then((book) => {
                NotificationHandler.addNotification({
                  message: `New book created.`,
                  severity: 'success',
                });
                navigate(`/books/${book.id}`, {
                  state: { editing: true },
                });
              })
              .catch((err) => {
                console.error(err);
                NotificationHandler.addNotification({
                  message: `An unexpected error occurred.`,
                  severity: 'error',
                  timeout: 10000,
                });
              });
          }}
        >
          Add Book
        </Button>
      </div>
    </div>
  );
};

export default AddBook;
