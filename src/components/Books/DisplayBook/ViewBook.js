import React from 'react';
import { MDBBadge, MDBRow } from 'mdbreact';
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
        {volumeInfo?.authors?.length !== 0 &&
          typeof volumeInfo.authors !== 'undefined' && (
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
        {volumeInfo?.genres?.length !== 0 &&
          typeof volumeInfo.genres !== 'undefined' && (
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
        <MDBRow>
          {typeof volumeInfo.isbn10 !== 'undefined' &&
            volumeInfo?.isbn10?.length > 0 && (
              <h3 className="mx-3">
                ISBN-10:
                <MDBBadge color="light" pill className="mx-1">
                  {volumeInfo.isbn10}
                </MDBBadge>
              </h3>
            )}
          {typeof volumeInfo.isbn13 !== 'undefined' &&
            volumeInfo?.isbn13?.length > 0 && (
              <h3>
                ISBN-13:
                <MDBBadge color="light" pill className="mx-1">
                  {volumeInfo.isbn13}
                </MDBBadge>
              </h3>
            )}
        </MDBRow>

        <MDBRow>
          <h3 className="ml-3">
            {!Object.keys(volumeInfo.grades).every(
              (k) => !volumeInfo.grades[k]
            ) && <>Grades:</>}
            {volumeInfo.grades.grade0 && (
              <MDBBadge color="light" pill className="mx-1">
                {'<1'}
              </MDBBadge>
            )}
            {volumeInfo.grades.grade1 && (
              <MDBBadge color="light" pill className="mx-1">
                1
              </MDBBadge>
            )}
            {volumeInfo.grades.grade2 && (
              <MDBBadge color="light" pill className="mx-1">
                2
              </MDBBadge>
            )}
            {volumeInfo.grades.grade3 && (
              <MDBBadge color="light" pill className="mx-1">
                3
              </MDBBadge>
            )}
            {volumeInfo.grades.grade4 && (
              <MDBBadge color="light" pill className="mx-1">
                4
              </MDBBadge>
            )}
            {volumeInfo.grades.grade5 && (
              <MDBBadge color="light" pill className="mx-1">
                5
              </MDBBadge>
            )}
            {volumeInfo.grades.grade6 && (
              <MDBBadge color="light" pill className="mx-1">
                6
              </MDBBadge>
            )}
            {volumeInfo.grades.grade7 && (
              <MDBBadge color="light" pill className="mx-1">
                7
              </MDBBadge>
            )}
            {volumeInfo.grades.grade8 && (
              <MDBBadge color="light" pill className="mx-1">
                8
              </MDBBadge>
            )}
            {volumeInfo.grades.grade9 && (
              <MDBBadge color="light" pill className="mx-1">
                9
              </MDBBadge>
            )}
            {volumeInfo.grades.grade10 && (
              <MDBBadge color="light" pill className="mx-1">
                10
              </MDBBadge>
            )}
            {volumeInfo.grades.grade11 && (
              <MDBBadge color="light" pill className="mx-1">
                11
              </MDBBadge>
            )}
            {volumeInfo.grades.grade12 && (
              <MDBBadge color="light" pill className="mx-1">
                12
              </MDBBadge>
            )}
            {volumeInfo.grades.grade13 && (
              <MDBBadge color="light" pill className="mx-1">
                12+
              </MDBBadge>
            )}
          </h3>
        </MDBRow>
      </div>
    </>
  );
};

export default ViewBook;
