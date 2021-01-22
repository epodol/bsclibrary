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
import { useFirestore } from 'reactfire';
import TableBody from './TableBody';
import Loading from '../../Loading';

const BooksTable = () => {
  const firebase = useFirestore();
  const history = useHistory();

  return (
    <>
      <MDBCard className="py-2 my-4 mx-5">
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
                    firebase
                      .collection('books')
                      .add({
                        featured: false,
                        volumeInfo: {},
                        copies: [],
                      })
                      .then((book) => {
                        history.push(book.path, { edit: true });
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
