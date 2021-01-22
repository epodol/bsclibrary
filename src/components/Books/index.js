import React, { Suspense } from 'react';

import BooksTable from './BooksTable';
import FeaturedBooks from './FeaturedBooks';
import Loading from '../Loading';

const Books = () => (
  <>
    <Suspense fallback={<Loading />}>
      <FeaturedBooks />
    </Suspense>
    <BooksTable />
  </>
);

export default Books;
