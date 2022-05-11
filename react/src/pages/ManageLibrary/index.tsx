import React, { useState } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import {
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import User from '@common/types/User';

const LibraryMenuItem = ({ libraryID }: { libraryID: string }) => {
  const firestore = useFirestore();
  const library = useFirestoreDocData(doc(firestore, 'libraries', libraryID));

  if (library.status !== 'success') return <Skeleton variant="text" />;

  return <MenuItem value={30}>Thirty</MenuItem>;
};

const SelectLibrary = ({
  library,
  setLibrary,
}: {
  library: string;
  setLibrary: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const firestore = useFirestore();
  const user = useUser().data;

  if (user === null) throw new Error('User is null');

  const userDoc = useFirestoreDocData(doc(firestore, 'users', user.uid));

  if (userDoc.status !== 'success') return <Skeleton variant="rectangular" />;

  if (userDoc.data) throw new Error('User is null');

  const userDocData = userDoc.data as User;

  console.log(userDocData);

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={library}
        label="Age"
        onChange={(e) => setLibrary(e.target.value)}
      >
        <LibraryMenuItem />
      </Select>
    </FormControl>
  );
};

const ManageLibrary = () => {
  const [library, setLibrary] = useState<string | null>(null);
  return (
    <div>
      <SelectLibrary library={library} setLibrary={setLibrary} />
      {library && 'No Library Selected'}
    </div>
  );
};

export default ManageLibrary;
