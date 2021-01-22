import React, { useState, useEffect } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCardBody,
  MDBBadge,
  MDBDropdown,
  MDBDropdownToggle,
  MDBIcon,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBBtn,
  MDBCol,
  MDBRow,
  MDBInput,
} from 'mdbreact';
import { useHistory, useLocation } from 'react-router-dom';

const TableBody = () => {
  const history = useHistory();
  const location = useLocation();
  const [query, setQuery] = useState({
    field:
      typeof location?.state?.query?.field !== 'undefined'
        ? location?.state?.query?.field
        : 'title',
    search:
      typeof location?.state?.query?.search !== 'undefined'
        ? location?.state?.query?.search
        : '',
  });

  const [search, setSearch] = useState({
    field: query.field,
    search: query.search,
  });

  useEffect(() => {
    history.push(location.pathname);
  }, [history, location.pathname]);

  const booksCollection = useFirestore().collection('books');

  /* eslint-disable no-nested-ternary */
  const booksQueryRef =
    query.field === 'title' && query.search.length > 0
      ? booksCollection
          .orderBy('volumeInfo.title')
          .where(
            'volumeInfo.titleQuery',
            'array-contains-any',
            query.search.toLowerCase().split(' ')
          )
          .limit(25)
      : query.field === 'authors' && query.search.length > 0
      ? booksCollection
          .orderBy('volumeInfo.authorsQuery')
          .where(
            'volumeInfo.authorsQuery',
            'array-contains-any',
            query.search.toLowerCase().split(' ')
          )
          .limit(25)
      : query.field === 'genres' && query.search.length > 0
      ? booksCollection
          .orderBy('volumeInfo.genresQuery')
          .where(
            'volumeInfo.genresQuery',
            'array-contains',
            query.search.toLowerCase()
          )
          .limit(25)
      : booksCollection.limit(25);
  /* eslint-enable no-nested-ternary */

  const books = useFirestoreCollectionData(booksQueryRef, {
    idField: 'id',
  }).data;

  return (
    <MDBCardBody cascade>
      <div className="mx-auto px-auto">
        <form
          className="md-form my-0 mx-auto"
          onSubmit={(event) => {
            setQuery({ search: search.search, field: search.field });
            event.preventDefault();
          }}
          // style={{ width: '100%' }}
        >
          <MDBRow>
            <MDBCol md="1">
              <MDBDropdown>
                <MDBDropdownToggle caret>{search.field}</MDBDropdownToggle>
                <MDBDropdownMenu color="secondary">
                  <MDBDropdownItem
                    active={search.field === 'title'}
                    onClick={() => {
                      setSearch({ search: search.search, field: 'title' });
                    }}
                  >
                    Title
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    active={search.field === 'authors'}
                    onClick={() => {
                      setSearch({ search: search.search, field: 'authors' });
                    }}
                  >
                    Authors
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    active={search.field === 'genres'}
                    onClick={() => {
                      setSearch({ search: search.search, field: 'genres' });
                    }}
                  >
                    Genres
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBCol>
            <MDBCol md="10">
              <MDBInput
                type="text"
                label="Search"
                aria-label="Search"
                value={search.search}
                onInput={(event) => {
                  setSearch({
                    search: event.target.value,
                    field: search.field,
                  });
                }}
              />
            </MDBCol>
            <MDBCol md="1">
              <MDBBtn type="submit" className="">
                <MDBIcon icon="search" />
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
      </div>
      <MDBTable btn striped hover responsive>
        <MDBTableHead>
          <tr>
            <th className="h4">Title</th>
            <th className="h4">Authors</th>
            <th className="h4">Genres</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {books.map(
            ({
              id,
              volumeInfo: { title } = '',
              volumeInfo: { authors, genres } = [],
            }) => (
              <tr
                key={id}
                style={{ cursor: 'pointer' }}
                className="font-weight-bold"
                onClick={() => history.push(`/books/${id}`)}
              >
                <td className="font-weight-bold">
                  {typeof title === 'string' ? title : null}
                </td>
                <td className="font-weight-bold h6">
                  {Array.isArray(authors)
                    ? authors.map((author) => (
                        <MDBBadge
                          key={author.toString()}
                          color="light"
                          className="mx-1"
                          pill
                          style={{ cursor: 'pointer' }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setQuery({
                              field: 'authors',
                              search: author,
                            });
                            setSearch({
                              field: 'authors',
                              search: author,
                            });
                          }}
                        >
                          {author}
                        </MDBBadge>
                      ))
                    : null}
                </td>
                <td className="font-weight-bold h6">
                  {Array.isArray(genres)
                    ? genres.map((genre) => (
                        <MDBBadge
                          key={genre.toString()}
                          color="light"
                          className="mx-1"
                          pill
                          style={{ cursor: 'pointer' }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setQuery({
                              field: 'genres',
                              search: genre,
                            });
                            setSearch({
                              field: 'genres',
                              search: genre,
                            });
                          }}
                        >
                          {genre}
                        </MDBBadge>
                      ))
                    : null}
                </td>
              </tr>
            )
          )}
        </MDBTableBody>
      </MDBTable>
    </MDBCardBody>
  );
};

export default TableBody;
