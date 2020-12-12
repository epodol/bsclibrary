import React, { useEffect, useState } from 'react';
import { MDBDataTableV5 } from 'mdbreact';

const Books = ({ firebase }) => {
  const columns = [
    {
      label: 'Title',
      field: 'title',
      width: 150,
      attributes: {
        'aria-controls': 'DataTable',
        'aria-label': 'Title',
      },
    },
    {
      label: 'Author',
      field: 'author',
      width: 270,
    },
    {
      label: 'Genre',
      field: 'genre',
      width: 270,
    },
  ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    firebase.firestore
      .collection('books')
      .limit(25)
      .get()
      .then((data) => {
        const docsData = [];
        data.docs.forEach((doc) => {
          if (doc.id !== 'summary') {
            docsData.push({
              title: doc.data().volumeInfo.title
                ? doc.data().volumeInfo.title
                : null,
              author: doc.data().volumeInfo.authors
                ? doc.data().volumeInfo.authors.join(', ')
                : null,
              // copies: doc.data().copies,
              genre: doc.data().volumeInfo.genre
                ? doc.data().volumeInfo.genre.join(', ')
                : null,
            });
          }
        });
        setRows(docsData);
      })
      .catch();
  }, [firebase.firestore]);

  return (
    <>
      <div className="container">
        <MDBDataTableV5
          hover
          entriesOptions={[5, 20, 25]}
          entries={5}
          pagesAmount={4}
          data={{ rows, columns }}
          materialSearch
        />
      </div>
    </>
  );
};

export default Books;
