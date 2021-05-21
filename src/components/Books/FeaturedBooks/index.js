import React from 'react';
import {
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  // MDBCardImage,
  MDBCol,
  MDBView,
} from 'mdbreact';
import { useHistory } from 'react-router-dom';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

const FeaturedBooks = () => {
  const history = useHistory();
  // const featuredBooksRef = useFirestore().collection('summaries').doc('books');
  const featuredBooksRef = useFirestore()
    .collection('books')
    .where('featured', '==', true);
  const featured = useFirestoreCollectionData(featuredBooksRef, {
    idField: 'id',
  }).data;

  if (!featured || featured.length < 1)
    return (
      <MDBContainer className="mt-4">
        <MDBCarousel
          activeItem={1}
          length={1}
          className="mx-auto"
          style={{ maxWidth: '22rem' }}
          slide
        >
          <MDBCarouselInner>
            <MDBCarouselItem itemId="1">
              <MDBCol style={{ maxWidth: '22rem' }} className="mx-auto">
                <MDBView zoom>
                  <MDBCard
                    className="text-center p-3 rgba-green-strong"
                    style={{ minHeight: '26rem' }}
                  >
                    <MDBCardBody>
                      <h4 className="font-weight-bold white-text mb-3 rgba-green-strong">
                        There are no featured books right now!
                      </h4>
                    </MDBCardBody>
                  </MDBCard>
                </MDBView>
              </MDBCol>
            </MDBCarouselItem>
          </MDBCarouselInner>
        </MDBCarousel>
      </MDBContainer>
    );

  return (
    <MDBContainer className="mt-4">
      <MDBCarousel
        activeItem={1}
        length={featured.length || 0}
        className="mx-auto"
        style={{ maxWidth: '22rem' }}
        slide
      >
        <MDBCarouselInner>
          {featured.map(
            (
              {
                volumeInfo: {
                  title = 'Unknown book',
                  image = 'https://www.abbeville.com/assets/common/images/edition_placeholder.png',
                },
                id,
              },
              index
            ) => (
              <MDBCarouselItem itemId={(index + 1).toString()} key={id}>
                <MDBCol style={{ maxWidth: '22rem' }} className="mx-auto">
                  <MDBView zoom>
                    <MDBCard
                      className="text-center p-3 rgba-green-strong"
                      style={{ minHeight: '26rem', cursor: 'pointer' }}
                      onClick={() => history.push(`books/${id}`)}
                    >
                      <img
                        className="img-fluid mx-auto z-depth-3"
                        src={image}
                        style={{ height: 250 }}
                        alt={`${title} | Cover`}
                      />
                      <MDBCardBody>
                        <h3 className="font-weight-bold white-text mb-2">
                          {title}
                        </h3>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBView>
                </MDBCol>
              </MDBCarouselItem>
            )
          )}
        </MDBCarouselInner>
      </MDBCarousel>
    </MDBContainer>
  );
};

export default FeaturedBooks;
