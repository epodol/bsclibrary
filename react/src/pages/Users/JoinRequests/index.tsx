import React, { useState, Suspense, useContext } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import {
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import Loading from 'src/components/Loading';
import { collection, limit, query, where } from '@firebase/firestore';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import JoinRequest from '@common/types/JoinRequest';
import { useNavigate } from 'react-router';
import ApproveUserDialog from 'src/pages/Users/JoinRequests/ApproveUserDialog';

function determineSearchField(searchField: 1 | 2 | 3 | 4) {
  let res = 'firstName';
  if (searchField === 1) res = 'firstName';
  if (searchField === 2) res = 'lastName';
  if (searchField === 3) res = 'email';

  return res;
}

const JoinRequestsTable = ({
  searchField,
  searchTerm,
  showApproved,
}: {
  searchField: 1 | 2 | 3 | 4;
  searchTerm: string;
  showApproved: boolean;
}) => {
  const textSearchField = determineSearchField(searchField);

  const firestore = useFirestore();
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library!');

  const navigate = useNavigate();

  const [approveUserDialog, setApproveUserDialog] =
    useState<JoinRequest | null>(null);

  let userQueryRef = query(
    collection(firestore, 'libraries', activeLibraryID, 'joinRequests'),
    where(textSearchField, '>=', searchTerm),
    where(textSearchField, '<=', `${searchTerm}~`),
    limit(25)
  );

  if (!showApproved) {
    userQueryRef = query(userQueryRef, where('approved', '==', false));
  }

  const joinRequestData: JoinRequest[] = useFirestoreCollectionData(
    userQueryRef,
    {
      idField: 'id',
    }
  ).data as unknown as JoinRequest[];

  return (
    <div className="text-center">
      <ApproveUserDialog
        joinRequest={approveUserDialog}
        closeDialog={() => setApproveUserDialog(null)}
      />
      {joinRequestData.length !== 0 && (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {joinRequestData.map((joinRequest) => {
              if (!joinRequest) return <></>;
              return (
                <TableRow key={joinRequest.uid}>
                  <TableCell component="th" scope="row">
                    {joinRequest.firstName} {joinRequest.lastName}
                  </TableCell>
                  <TableCell>{joinRequest.email}</TableCell>
                  <TableCell>
                    {joinRequest.createdAt?.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {joinRequest.approved ? <strong>Yes</strong> : 'No'}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        if (joinRequest.approved)
                          navigate(`/users/${joinRequest.uid}`);
                        else setApproveUserDialog(joinRequest);
                      }}
                    >
                      {joinRequest.approved ? 'View User' : 'Approve User'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {joinRequestData.length === 0 && (
        <>
          <br />
          <h3>No Join Requests Found.</h3>
        </>
      )}
    </div>
  );
};

const JoinRequests = () => {
  const [searchField, setSearchField] = useState<1 | 2 | 3 | 4>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [showApproved, setShowApproved] = useState<boolean>(false);

  const [lastSearchField, setLastSearchField] = useState<1 | 2 | 3 | 4>(1);
  const [lastSearchTerm, setLastSearchTerm] = useState<string>('');

  return (
    <div>
      <h2 className="flex-center text-center">Join Requests</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="text-center mx-auto"
      >
        <div style={{ marginTop: '1rem' }}>
          <FormControl
            sx={{ marginInline: 2, width: 160, marginBottom: '1rem' }}
          >
            <InputLabel id="searchByLabel">Search by</InputLabel>
            <Select
              labelId="searchByLabel"
              id="searchBy"
              label="Search by"
              value={searchField}
              onChange={(e: any) => setSearchField(e.target.value)}
            >
              <MenuItem value={1}>First Name</MenuItem>
              <MenuItem value={2}>Last Name</MenuItem>
              <MenuItem value={3}>Email</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Search Terms"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <FormControlLabel
            control={
              <Checkbox
                value={showApproved}
                onChange={(e) => {
                  setShowApproved(e.target.checked);
                }}
              />
            }
            label="Show Approved Requests"
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
      <Suspense fallback={<Loading />}>
        <JoinRequestsTable
          searchField={lastSearchField}
          searchTerm={lastSearchTerm}
          showApproved={showApproved}
        />
      </Suspense>
    </div>
  );
};

export default JoinRequests;
