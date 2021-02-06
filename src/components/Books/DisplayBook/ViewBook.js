import React from 'react';
import { MDBBadge } from 'mdbreact';
import { useHistory } from 'react-router-dom';

const ViewBook = ({ volumeInfo }) => {
  const history = useHistory();

  return (
    <>
      <div className="pb-5 px-5">
        {volumeInfo.image && (
          <div className="text-center">
            <img
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
        {typeof volumeInfo.description !== 'undefined' && (
          <p>{volumeInfo.description}</p>
        )}
        {typeof volumeInfo.authors !== 'undefined' && (
          <h3>
            Authors:
            {volumeInfo.authors.map((author) => (
              <MDBBadge
                key={author.toString()}
                color="light"
                pill
                style={{ cursor: 'pointer' }}
                className="mx-1"
                onClick={() =>
                  history.push({
                    pathname: '/books',
                    state: {
                      query: {
                        field: 'authors',
                        search: author,
                      },
                    },
                  })
                }
              >
                {author}
              </MDBBadge>
            ))}
          </h3>
        )}
        {typeof volumeInfo.genres !== 'undefined' && (
          <h3>
            Genres:
            {volumeInfo.genres.map((genre) => (
              <MDBBadge
                key={genre.toString()}
                color="light"
                pill
                style={{ cursor: 'pointer' }}
                className="mx-1"
                onClick={() =>
                  history.push({
                    pathname: '/books',
                    state: {
                      query: {
                        field: 'genres',
                        search: genre,
                      },
                    },
                  })
                }
              >
                {genre}
              </MDBBadge>
            ))}
          </h3>
        )}
      </div>
    </>
  );
};

export default ViewBook;
