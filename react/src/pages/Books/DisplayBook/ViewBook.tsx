import React from 'react';
import { Chip } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { volumeInfo as volumeInfoInterface } from '@common/types/Book';

const ViewBook = ({ volumeInfo }: { volumeInfo: volumeInfoInterface }) => {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: 20 }}>
        {volumeInfo.image && (
          <div className="mb-3">
            <img
              style={{ maxHeight: 500 }}
              className="rounded mx-auto d-block img-fluid z-depth-3"
              src={volumeInfo.image}
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
                  onClick={() =>
                    navigate('/books', {
                      state: {
                        query: {
                          field: 'authors',
                          search: author,
                        },
                      },
                    })
                  }
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
                    navigate('/books', {
                      state: {
                        query: {
                          field: 'genres',
                          search: genre,
                        },
                      },
                    })
                  }
                />
              ))}
            </h3>
          )}
        <h3>
          {typeof volumeInfo.isbn10 !== 'undefined' &&
            volumeInfo?.isbn10?.length > 0 && (
              <>
                <>ISBN-10:</>
                <Chip className="mx-1" label={volumeInfo.isbn10} />
              </>
            )}
          {typeof volumeInfo.isbn13 !== 'undefined' &&
            volumeInfo?.isbn13?.length > 0 && (
              <>
                <>ISBN-13:</>
                <Chip className="mx-1" label={volumeInfo.isbn13} />
              </>
            )}
        </h3>

        <>
          {volumeInfo.grades && (
            <h3>
              {Object.values(volumeInfo.grades).includes(true) && <>Grades:</>}
              {volumeInfo.grades.grade0 && <Chip className="mx-1" label="<1" />}
              {volumeInfo.grades.grade1 && <Chip className="mx-1" label="1" />}
              {volumeInfo.grades.grade2 && <Chip className="mx-1" label="2" />}
              {volumeInfo.grades.grade3 && <Chip className="mx-1" label="3" />}
              {volumeInfo.grades.grade4 && <Chip className="mx-1" label="4" />}
              {volumeInfo.grades.grade5 && <Chip className="mx-1" label="5" />}
              {volumeInfo.grades.grade6 && <Chip className="mx-1" label="6" />}
              {volumeInfo.grades.grade7 && <Chip className="mx-1" label="7" />}
              {volumeInfo.grades.grade8 && <Chip className="mx-1" label="8" />}
              {volumeInfo.grades.grade9 && <Chip className="mx-1" label="9" />}
              {volumeInfo.grades.grade10 && (
                <Chip className="mx-1" label="10" />
              )}
              {volumeInfo.grades.grade11 && (
                <Chip className="mx-1" label="11" />
              )}
              {volumeInfo.grades.grade12 && (
                <Chip className="mx-1" label="12" />
              )}
              {volumeInfo.grades.grade13 && (
                <Chip className="mx-1" label="12+" />
              )}
            </h3>
          )}
        </>
      </div>
    </>
  );
};

export default ViewBook;
