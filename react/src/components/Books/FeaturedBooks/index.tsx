import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  CardMedia,
  CardActions,
} from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';

import { useHistory } from 'react-router-dom';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import './featured.css';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';

import Book from '@common/types/Book';

interface BookWithID extends Book {
  id?: string;
}

const FeaturedBooks = () => {
  const history = useHistory();
  const featuredBooksRef = useFirestore()
    .collection('books')
    .where('featured', '==', true);
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
            <Card key={id} onClick={() => history.push(`books/${id}`)}>
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
