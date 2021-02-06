import React from 'react';
import { MDBBadge } from 'mdbreact';
import { useHistory } from 'react-router-dom';

const Book = ({ id, title, authors, genres, setQuery, setSearch }) => {
  const history = useHistory();
  return (
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
  );
};

export default Book;
