import React, {
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  ButtonGroup,
} from '@mui/material';
import {
  useUser,
  useFirestore,
  useFirestoreDocData,
  useFirestoreCollection,
} from 'reactfire';
import {
  serverTimestamp,
  Timestamp,
  where,
  query,
  doc,
  collectionGroup,
  QuerySnapshot,
  setDoc,
} from 'firebase/firestore';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import WithID from '@common/types/util/WithID';
import { useTheme } from '@mui/material/styles';

import Copy, {
  condition as conditionType,
  status as statusType,
} from '@common/types/Copy';
import Library from '@common/types/Library';

const conditionOptions: conditionType[] = [1, 2, 3, 4, 5];
const statusOptions: { id: statusType; text: string }[] = [
  { id: 0, text: 'On Shelf' },
  { id: 1, text: 'In Storage' },
  { id: 3, text: 'Missing' },
  { id: 4, text: 'Not Tracked' },
];

function determineStatus(status: statusType | undefined) {
  switch (status) {
    case 0:
      return 'On Shelf';
    case 1:
      return 'In Storage';
    case 2:
      return 'Checked Out';
    case 3:
      return 'Missing';
    case 4:
      return 'Not Tracked';
    default:
      return 'Unknown Status';
  }
}

const UpdateCopyRow = ({
  identifier,
  condition,
  status,
}: {
  identifier: string;
  condition: conditionType | null;
  status: statusType | null;
}) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const [isUpdated, setIsUpdated] = useState(false);

  const firestore = useFirestore();
  const user = useUser().data;

  const activeLibraryDoc: Library = useFirestoreDocData(
    doc(firestore, `libraries/${activeLibraryID}`)
  ).data as Library;

  if (!user) throw new Error('No user exists.');

  const copyResults = useFirestoreCollection(
    query(
      collectionGroup(firestore, 'copies'),
      where('identifier', '==', identifier),
      where('libraryID', '==', activeLibraryID)
    )
  ).data as QuerySnapshot<WithID<Copy>>;

  const copy = copyResults.docs[0];

  useEffect(() => {
    if (!copy || copyResults.size !== 1) return;
    async function fetchData() {
      const data = copy.data();

      if (data.status === 2) return;

      const updatedDoc: Partial<Copy> = {
        updatedAt: serverTimestamp() as Timestamp,
        updatedBy: user?.uid,
      };

      if (status !== null) updatedDoc.status = status;
      if (condition !== null) updatedDoc.condition = condition;

      setDoc(copy.ref, updatedDoc, { merge: true }).then(() =>
        setIsUpdated(true)
      );
    }
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (copyResults.size !== 1)
    return <TableRow>Uh Oh! There was an error finding that copy.</TableRow>;

  return (
    <TableRow key={identifier}>
      <TableCell>{identifier}</TableCell>
      <TableCell>
        {condition !== null
          ? activeLibraryDoc.conditionOptions[condition]
          : 'No condition set'}
      </TableCell>
      <TableCell>
        {status !== null ? determineStatus(status) : 'No status set'}
      </TableCell>
      <TableCell>{isUpdated ? 'Updated!' : 'Loading...'}</TableCell>
    </TableRow>
  );
};

const UpdateCopyStatusCondition = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const user = useUser().data;
  if (!user) throw new Error('No user exists.');

  const [status, setStatus] = useState<statusType | null>(null);
  const [condition, setCondition] = useState<conditionType | null>(null);
  const [identifier, setIdentifier] = useState<string>('');

  const [copyUpdates, setCopyUpdates] = useState<
    {
      identifier: string;
      condition: conditionType | null;
      status: statusType | null;
      id: number;
    }[]
  >([]);

  const firestore = useFirestore();

  const activeLibraryDoc: Library = useFirestoreDocData(
    doc(firestore, `libraries/${activeLibraryID}`)
  ).data as Library;

  const identifierInputRef = useRef<HTMLInputElement>();

  const focus = () => {
    if (identifierInputRef.current) identifierInputRef.current.focus();
  };

  const handleClose = (close: boolean) => {
    setStatus(null);
    setCondition(null);
    setIdentifier('');

    if (close) {
      setIsOpen(false);
      setCopyUpdates([]);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      fullScreen={fullScreen}
      scroll="body"
    >
      <DialogTitle>Update Copy Status/Condition</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <DialogContentText>
          Use this tool to quickly update the status or condition of copies.
        </DialogContentText>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if ((status === null && condition === null) || identifier === '')
              return;
            setCopyUpdates((prev) => {
              const newArr = [...prev];
              newArr.splice(0, 0, {
                identifier,
                condition,
                status,
                id: newArr.length,
              });
              setIdentifier('');
              return newArr;
            });
          }}
        >
          <br />
          Copy Status
          <br />
          <ButtonGroup
            style={{ margin: '1rem' }}
            color="primary"
            size="large"
            className="text-center"
          >
            {statusOptions.map((buttonStatus) => (
              <Button
                key={buttonStatus.id}
                onClick={() => {
                  setStatus(buttonStatus.id);
                  focus();
                }}
                disabled={status === buttonStatus.id}
              >
                {buttonStatus.text}
              </Button>
            ))}
          </ButtonGroup>
          {status !== null && (
            <Button onClick={() => setStatus(null)}>Clear</Button>
          )}
          <br />
          Copy Condition
          <br />
          <ButtonGroup
            style={{ margin: '1rem' }}
            color="primary"
            size="large"
            className="text-center"
          >
            {conditionOptions.map((buttonCondition) => (
              <Button
                key={buttonCondition}
                onClick={() => {
                  setCondition(buttonCondition);
                  focus();
                }}
                disabled={condition === buttonCondition}
              >
                {activeLibraryDoc.conditionOptions[buttonCondition]}
              </Button>
            ))}
          </ButtonGroup>
          {condition !== null && (
            <Button onClick={() => setCondition(null)}>Clear</Button>
          )}
          <br />
          <TextField
            id="identifier"
            label="Identifier"
            type="text"
            margin="dense"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            inputRef={(input) => {
              identifierInputRef.current = input;
            }}
            autoFocus
          />
        </form>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Identifier</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Updated?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {copyUpdates.map((update) => (
              <UpdateCopyRow
                key={update.id}
                identifier={update.identifier}
                condition={update.condition}
                status={update.status}
              />
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => handleClose(true)}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCopyStatusCondition;
