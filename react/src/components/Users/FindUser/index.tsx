import React, { useState, Suspense } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { useNavigate } from 'react-router-dom';

import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import User from '@common/types/User';

import Loading from 'src/components/Loading';
import { collection, limit, query, where } from '@firebase/firestore';

function determineSearchField(searchField: 1 | 2 | 3) {
  let res = 'userInfo.queryFirstName';
  if (searchField === 1) res = 'userInfo.queryFirstName';
  if (searchField === 2) res = 'userInfo.queryLastName';
  if (searchField === 3) res = 'userInfo.queryEmail';

  return res;
}

const FindUserTable = ({
  searchField,
  searchTerm,
}: {
  searchField: 1 | 2 | 3;
  searchTerm: string;
}) => {
  const textSearchField = determineSearchField(searchField);

  const firestore = useFirestore();

  const userQueryRef = query(
    collection(firestore, 'users'),
    where(textSearchField, '>=', searchTerm.toLowerCase()),
    where(textSearchField, '<=', `${searchTerm.toLowerCase()}~`),
    limit(25)
  );

  const userData: User[] = useFirestoreCollectionData(userQueryRef, {
    idField: 'id',
  }).data as unknown as User[];

  const navigate = useNavigate();

  return (
    <div className="text-center">
      {userData.length !== 0 && (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Disabled</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map(({ userInfo }) => {
              if (!userInfo) return <></>;
              return (
                <TableRow
                  key={userInfo.uid}
                  style={{ cursor: 'pointer' }}
                  hover
                  onClick={() => navigate(`/users/${userInfo.uid}`)}
                >
                  <TableCell component="th" scope="row">
                    {userInfo.firstName} {userInfo.lastName}
                  </TableCell>
                  <TableCell>{userInfo.email}</TableCell>
                  <TableCell>
                    {userInfo.createdTime?.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell>{userInfo.role}</TableCell>
                  <TableCell>{userInfo.disabled ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {userData.length === 0 && (
        <>
          <br />
          <h3>No Users Found.</h3>
        </>
      )}
    </div>
  );
};

const FindUser = () => {
  const [searchField, setSearchField] = useState<1 | 2 | 3>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [lastSearchField, setLastSearchField] = useState<1 | 2 | 3>(1);
  const [lastSearchTerm, setLastSearchTerm] = useState<string | null>(null);

  return (
    <div>
      <h2 className="flex-center text-center">Search Users</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="text-center mx-auto"
      >
        <div>
          <FormControl className="mt-3 text-center mx-auto">
            <Select
              value={searchField}
              onChange={(e: any) => setSearchField(e.target.value)}
            >
              <MenuItem value={1}>First Name</MenuItem>
              <MenuItem value={2}>Last Name</MenuItem>
              <MenuItem value={3}>Email</MenuItem>
            </Select>
          </FormControl>
          <TextField
            className=""
            label="Search Terms"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
        <div className="pt-3 mx-auto text-center">
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              setLastSearchField(searchField);
              setLastSearchTerm(searchTerm);
            }}
          >
            Search
          </Button>
        </div>
      </form>
      {lastSearchField !== null &&
        lastSearchTerm !== null &&
        lastSearchTerm !== '' && (
          <Suspense fallback={<Loading />}>
            <FindUserTable
              searchField={lastSearchField}
              searchTerm={lastSearchTerm}
            />
          </Suspense>
        )}
      {lastSearchTerm === '' && (
        <h5 className="text-center">Please enter a search term</h5>
      )}
    </div>
  );
};

export default FindUser;
