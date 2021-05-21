import React, { useState, useEffect } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCardBody,
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
import Book from './Book';

const TableBody = () => {
  const history = useHistory();
  const location = useLocation();
  const [query, setQuery] = useState({
    field: location?.state?.query?.field || 'title',
    search: location?.state?.query?.search || '',
  });

  const [search, setSearch] = useState({
    field: query.field,
    search: query.search,
  });

  useEffect(() => {
    history.push(location.pathname);
  }, [history, location.pathname]);

  const booksCollection = useFirestore().collection('books');

  const booksQueryRef =
    query.search.length > 0
      ? booksCollection
          .where(
            `volumeInfo.${query.field}Query`,
            'array-contains-any',
            query.search.toLowerCase().split(' ')
          )
          .orderBy(`volumeInfo.${query.field}`)
      : booksCollection.where(`copiesAvailable`, '>', 0);

  const books = useFirestoreCollectionData(booksQueryRef.limit(25), {
    idField: 'id',
  }).data;

  return (
    <MDBCardBody cascade>
      <div className="mx-auto px-auto">
        <form
          className="md-form my-0 mx-auto"
          onSubmit={(event) => {
            setQuery({ search: search.search.trim(), field: search.field });
            event.preventDefault();
          }}
          // style={{ width: '100%' }}
        >
          <MDBRow>
            <MDBCol md="1">
              <MDBDropdown>
                <MDBDropdownToggle caret color="green" className="white-text">
                  {search.field}
                </MDBDropdownToggle>
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
            <th className="h4">Availability</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {books.map(
            ({
              id,
              copiesCount = 0,
              copiesAvailable = 0,
              volumeInfo: { title, subtitle } = '',
              volumeInfo: { authors, genres } = [],
            }) => (
              <Book
                key={id}
                id={id}
                title={title}
                subtitle={subtitle}
                authors={authors}
                genres={genres}
                setQuery={setQuery}
                setSearch={setSearch}
                copiesCount={copiesCount}
                copiesAvailable={copiesAvailable}
              />
            )
          )}
        </MDBTableBody>
      </MDBTable>
    </MDBCardBody>
  );
};

export default TableBody;
