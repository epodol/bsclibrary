import React from 'react';
import { Chip } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { volumeInfo as volumeInfoInterface } from '@common/types/Book';

const ViewBook = ({ volumeInfo }: { volumeInfo: volumeInfoInterface }) => {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: 20 }}>
        {volumeInfo.isbn13 && (
          <div className="mb-3">
            <img
              style={{ maxHeight: 500 }}
              className="rounded mx-auto d-block img-fluid z-depth-3"
              src={`https://covers.openlibrary.org/b/isbn/${volumeInfo.isbn13}-L.jpg`}
              alt={volumeInfo.title || 'Book Thumbnail'}
            />
          </div>
        )}
        {!volumeInfo.isbn13 && volumeInfo.isbn10 && (
          <div className="mb-3">
            <img
              style={{ maxHeight: 500 }}
              className="rounded mx-auto d-block img-fluid z-depth-3"
              src={`https://covers.openlibrary.org/b/isbn/${volumeInfo.isbn10}-L.jpg`}
              alt={volumeInfo.title || 'Book Thumbnail'}
            />
          </div>
        )}
        {typeof volumeInfo.subtitle !== 'undefined' && (
          <div className="text-center">
            <p className="lead">{volumeInfo.subtitle}</p>
          </div>
        )}

        <br />
        {typeof volumeInfo.description !== 'undefined' && (
          <div style={{ whiteSpace: 'pre-line' }}>{volumeInfo.description}</div>
        )}
        <br />

        {volumeInfo?.authors?.length !== 0 &&
          typeof volumeInfo.authors !== 'undefined' && (
            <h3>
              Authors:
              {volumeInfo.authors.map((author) => (
                <Chip
                  key={author.toString()}
                  style={{ cursor: 'pointer', marginLeft: 3, marginRight: 3 }}
                  label={author}
                  onClick={() => {
                    navigate(`/books?searchBy=authors&search=${author}`);
                  }}
                />
              ))}
            </h3>
          )}
        {volumeInfo?.genres?.length !== 0 &&
          typeof volumeInfo.genres !== 'undefined' && (
            <h3>
              Genres:
              {volumeInfo.genres.map((genre) => (
                <Chip
                  key={genre.toString()}
                  style={{ cursor: 'pointer', marginLeft: 3, marginRight: 3 }}
                  label={genre}
                  onClick={() =>
                    navigate(`/books?searchBy=genres&search=${genre}`)
                  }
                />
              ))}
            </h3>
          )}
        <h3>
          {volumeInfo.isbn10 && volumeInfo?.isbn10?.length > 0 && (
            <>
              <>ISBN-10:</>
              <Chip className="mx-1" label={volumeInfo.isbn10} />
            </>
          )}
          {volumeInfo.isbn13 && volumeInfo?.isbn13?.length > 0 && (
            <>
              <>ISBN-13:</>
              <Chip className="mx-1" label={volumeInfo.isbn13} />
            </>
          )}
          {volumeInfo.callNumber && volumeInfo?.callNumber?.length > 0 && (
            <>
              <>Call Number:</>
              <Chip className="mx-1" label={volumeInfo.callNumber} />
            </>
          )}
        </h3>
      </div>
    </>
  );
};

export default ViewBook;
