import React, { useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useFirestoreDocData, useFirestore } from 'reactfire';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardHeader,
  MDBTooltip,
} from 'mdbreact';
import FirebaseContext from '../../Firebase';
import ViewBook from './ViewBook';
import EditBook from './EditBook';

const Book = () => {
  const { id } = useParams();
  const location = useLocation();
  const firestore = useFirestore();
  const ref = firestore.collection('books').doc(id);
  const { data } = useFirestoreDocData(ref, {
    idField: 'id',
  });
  const { volumeInfo, featured } = data;
  const firebaseContext = useContext(FirebaseContext);

  const [editing, setEditing] = useState(
    typeof location?.state?.editing !== 'undefined'
      ? location?.state?.editing
      : false
  );

  if (typeof volumeInfo === 'undefined') {
    return <h1>Book Not Found!</h1>;
  }

  return (
    <MDBContainer className="my-4">
      <MDBRow>
        <MDBCol>
          <MDBCard>
            <MDBCardHeader className="rgba-green-strong text-white m-4">
              <MDBContainer>
                <MDBRow>
                  <MDBCol size="2">
                    {firebaseContext.isAdmin && (
                      <MDBTooltip placement="bottom">
                        <MDBBtn outline className="px-3" color="danger">
                          <MDBIcon icon="trash" />
                        </MDBBtn>
                        <div>Delete Book</div>
                      </MDBTooltip>
                    )}
                  </MDBCol>
                  <MDBCol className="text-center" size="8">
                    {typeof volumeInfo.title !== 'undefined' && (
                      <h1 className="hr-bold">{volumeInfo.title}</h1>
                    )}
                  </MDBCol>
                  <MDBCol className="text-right" size="2">
                    <MDBTooltip placement="bottom">
                      <MDBBtn
                        color="yellow"
                        className="px-3"
                        disabled={!firebaseContext.isAdmin}
                        onClick={() => {
                          ref.update({
                            featured: !featured,
                          });
                        }}
                      >
                        <MDBIcon fas={featured} far={!featured} icon="star" />
                      </MDBBtn>
                      <div>Featured Book</div>
                    </MDBTooltip>
                    {firebaseContext.isAdmin && (
                      <MDBTooltip placement="bottom">
                        <MDBBtn
                          outline
                          color="white"
                          className="px-3"
                          onClick={() => {
                            setEditing(!editing);
                          }}
                        >
                          <MDBIcon icon="edit" />
                        </MDBBtn>
                        <div>Edit Book</div>
                      </MDBTooltip>
                    )}
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBCardHeader>
            {!editing && <ViewBook volumeInfo={volumeInfo} />}
            {editing && <EditBook volumeInfo={volumeInfo} />}
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Book;
