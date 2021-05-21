/* eslint-disable no-nested-ternary */
import React, { useState, Suspense } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { useHistory } from 'react-router';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Loading from '../../Loading';

const FindUserTable = ({ searchField, searchTerm }) => {
  const textSearchField =
    searchField === 1
      ? 'userInfo.queryFirstName'
      : searchField === 2
      ? 'userInfo.queryLastName'
      : searchField === 3
      ? 'userInfo.queryEmail'
      : 'userInfo.queryFirstName';

  const userQueryRef = useFirestore()
    .collection('users')
    .where(textSearchField, '>=', searchTerm.toLowerCase())
    .where(textSearchField, '<=', `${searchTerm.toLowerCase()}~`)
    .limit(25);

  const userData = useFirestoreCollectionData(userQueryRef, {
    idField: 'id',
  }).data;

  const history = useHistory();

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
            {userData.map(
              ({
                userInfo: {
                  firstName,
                  lastName,
                  email,
                  disabled,
                  createdTime,
                  role,
                  uid,
                },
              }) => (
                <TableRow
                  key={uid}
                  style={{ cursor: 'pointer' }}
                  hover
                  onClick={() => history.push(`/users/${uid}`)}
                  // onClick={() => {
                  //   console.log(uid);
                  // }}
                >
                  <TableCell component="th" scope="row">
                    {firstName} {lastName}
                  </TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell>
                    {createdTime.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell>{role}</TableCell>
                  <TableCell>{disabled ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              )
            )}
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
  const [searchField, setSearchField] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [lastSearchField, setLastSearchField] = useState(null);
  const [lastSearchTerm, setLastSearchTerm] = useState(null);

  return (
    <div>
      <h2 className="flex-center">Search Users</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="text-center mx-auto"
      >
        <div>
          <FormControl className="mt-3 text-center mx-auto">
            <Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
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
