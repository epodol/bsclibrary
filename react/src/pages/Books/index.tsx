import React, { Suspense } from 'react';

import BooksTable from 'src/pages/Books/BooksTable';
import FeaturedBooks from 'src/pages/Books/FeaturedBooks';
import Loading from 'src/components/Loading';

const Books = () => (
  <>
    <Suspense fallback={<Loading />}>
      <FeaturedBooks />
    </Suspense>
    <BooksTable />
  </>
);

export default Books;
