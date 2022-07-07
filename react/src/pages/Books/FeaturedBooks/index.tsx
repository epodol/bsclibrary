import React, { useContext } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  CardMedia,
  CardActions,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import { useNavigate } from 'react-router-dom';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import './featured.css';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

import Book from '@common/types/Book';
import { collection, query, where } from 'firebase/firestore';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';

interface BookWithID extends Book {
  id?: string;
}

const FeaturedBooks = () => {
  const navigate = useNavigate();
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const featuredBooksRef = query(
    collection(firestore, 'libraries', activeLibraryID, 'books'),
    where('featured', '==', true)
  );

  const featured: BookWithID[] = useFirestoreCollectionData(featuredBooksRef, {
    idField: 'id',
  }).data as unknown as BookWithID[];

  if (!featured || featured.length < 1) return <></>;

  return (
    <div style={{ marginLeft: '42%', marginRight: '42%', marginTop: 10 }}>
      <Carousel NextIcon={<ArrowRight />} PrevIcon={<ArrowLeft />}>
        {featured.map(({ volumeInfo, id }) => {
          if (typeof volumeInfo === 'undefined') return <></>;
          const {
            title = 'Unknown book',
            subtitle = '',
            image = 'https://www.abbeville.com/assets/common/images/edition_placeholder.png',
          } = volumeInfo;
          return (
            <Card key={id} onClick={() => navigate(`/books/${id}`)}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt={`${title} | Cover`}
                  height="350"
                  image={image}
                  title={`${title} | Cover`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {subtitle}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button size="small" color="primary">
                  View Book
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Carousel>
    </div>
  );
};

export default FeaturedBooks;
