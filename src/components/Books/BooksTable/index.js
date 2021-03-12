import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import {
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBRow,
} from 'mdbreact';
import { useFirestore, useUser } from 'reactfire';
import TableBody from './TableBody';
import Loading from '../../Loading';

const BooksTable = () => {
  const firestore = useFirestore();
  const fieldValue = useFirestore.FieldValue;

  const user = useUser().data;
  const history = useHistory();

  return (
    <>
      <MDBCard className="py-2 my-4 mx-5 mb-5">
        <MDBCardHeader className="rgba-green-strong m-4">
          <MDBContainer>
            <MDBRow>
              <MDBCol size="2" />
              <MDBCol size="8" className="flex-center">
                <h2 className="white-text">Books</h2>
              </MDBCol>
              <MDBCol size="2" className="text-right">
                <MDBBtn
                  outline
                  rounded
                  color="white"
                  className="px-3"
                  onClick={() => {
                    firestore
                      .collection('books')
                      .add({
                        featured: false,
                        volumeInfo: {
                          authors: [],
                          genres: [],
                          description: '',
                          image: '',
                          isbn10: '',
                          isbn13: '',
                          grades: {
                            grade0: false,
                            grade1: false,
                            grade2: false,
                            grade3: false,
                            grade4: false,
                            grade5: false,
                            grade6: false,
                            grade7: false,
                            grade8: false,
                            grade9: false,
                            grade10: false,
                            grade11: false,
                            grade12: false,
                            grade13: false,
                          },
                          subtitle: '',
                          title: '',
                        },
                        copies: [],
                        lastEditedBy: user.uid,
                        lastEdited: fieldValue.serverTimestamp(),
                      })
                      .then((book) => {
                        history.push(book.path, { editing: true });
                      });
                  }}
                >
                  <i className="fas fa-plus mt-0" />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </MDBCardHeader>
        <Suspense fallback={<Loading />}>
          <TableBody />
        </Suspense>
      </MDBCard>
    </>
  );
};
export default BooksTable;
