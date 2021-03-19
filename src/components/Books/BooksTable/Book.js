import React from 'react';
import { MDBBadge, MDBIcon } from 'mdbreact';
import { useHistory } from 'react-router-dom';

const Book = ({
  id,
  title,
  subtitle,
  authors,
  genres,
  setQuery,
  setSearch,
  copiesCount,
  copiesAvailable,
}) => {
  const history = useHistory();
  return (
    <tr
      key={id}
      style={{ cursor: 'pointer' }}
      className="font-weight-bold"
      onClick={() => history.push(`/books/${id}`)}
    >
      <td>
        <span className="font-weight-bold pr-2">{title || ''}</span>
        <span className="font-weight-light">{subtitle || ''}</span>
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
      <td>
        {copiesAvailable > 0 && (
          <MDBIcon icon="check-circle" size="lg" className="green-text mr-2" />
        )}
        {copiesAvailable === 0 && (
          <MDBIcon icon="times-circle" size="lg" className="red-text mr-2" />
        )}
        {copiesAvailable}/{copiesCount}
      </td>
    </tr>
  );
};

export default Book;
