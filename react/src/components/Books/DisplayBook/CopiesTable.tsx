import React, { useEffect, useState, useContext } from 'react';

import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import {
  collection,
  where,
  orderBy,
  query,
  limit,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  Add,
  CheckCircleOutlined,
  Delete,
  HighlightOff,
} from '@mui/icons-material';

import CopyInterface, {
  status as statusType,
  condition as conditionType,
} from '@common/types/Copy';
import NotificationContext from 'src/contexts/NotificationContext';
import WithID from '@common/types/WithID';

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

function isCopySame(
  barcode: string,
  status: statusType,
  condition: conditionType,
  notes: string,
  barcodeValue: string,
  statusValue: statusType,
  conditionValue: conditionType,
  notesValue: string
) {
  if (barcode !== barcodeValue) return false;
  if (status !== statusValue) return false;
  if (condition !== conditionValue) return false;
  if (notes !== notesValue) return false;
  return true;
}

const CopiesTable = ({
  bookID,
  editing,
}: {
  bookID: string;
  editing: boolean;
}) => {
  const firestore = useFirestore();
  const user = useUser().data;
  if (user === null) throw new Error('No user exists.');

  const copiesInitRef = collection(firestore, `books/${bookID}/copies`);

  const copiesRef = editing
    ? query(copiesInitRef, limit(25))
    : query(
        copiesInitRef,
        where('status', '!=', 4),
        orderBy('status'),
        limit(25)
      );

  const copies: WithID<CopyInterface>[] = useFirestoreCollectionData(
    copiesRef,
    {
      idField: 'ID',
    }
  ).data as unknown as WithID<CopyInterface>[];

  return (
    <div className="mx-5">
      {(copies.length !== 0 || editing) && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell
                className={editing ? 'h4 text-center' : 'h4'}
                style={editing ? { width: 1 } : {}}
              >
                Barcode
              </TableCell>
              <TableCell className={editing ? 'h4 text-center' : 'h4'}>
                Status
              </TableCell>
              {editing && (
                <TableCell className="h4 text-center" style={{ width: 1 }}>
                  Condition
                </TableCell>
              )}
              {editing && <TableCell className="h4">Notes</TableCell>}
              {editing && (
                <TableCell className="h4" style={editing ? { width: 1 } : {}}>
                  Actions
                  <Button
                    className="px-3"
                    onClick={() => {
                      addDoc(collection(firestore, `books/${bookID}/copies`), {
                        barcode: '',
                        status: 4,
                        condition: 3,
                        notes: '',
                        lastEditedBy: user.uid,
                        lastEdited: serverTimestamp(),
                      });
                    }}
                  >
                    <Add className="mt-0" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {copies.map(({ ID, barcode, status, condition, notes }) =>
              editing ? (
                <EditCopy
                  key={ID}
                  id={ID}
                  bookID={bookID}
                  barcode={barcode || ''}
                  status={status}
                  condition={condition}
                  notes={notes}
                />
              ) : (
                status !== 4 && (
                  <Copy key={ID} id={ID} barcode={barcode} status={status} />
                )
              )
            )}
          </TableBody>
        </Table>
      )}
      {copies.length === 0 && !editing && (
        <h2 className="text-center mb-5">
          Sorry, we don&apos;t currently have any copies of this book.
        </h2>
      )}
    </div>
  );
};

const Copy = ({
  id,
  barcode,
  status,
}: {
  id: string | undefined;
  barcode: string | undefined;
  status: statusType | undefined;
}) => (
  <tr key={id} className="font-weight-bold">
    <TableCell className="text-center">
      {(status === 0 || status === 1) && (
        <CheckCircleOutlined className="green-text mr-2" />
      )}
      {!(status === 0 || status === 1) && (
        <HighlightOff className="red-text mr-2" />
      )}
    </TableCell>
    <TableCell>
      <h5>{barcode}</h5>
    </TableCell>
    <TableCell>
      <h5>{determineStatus(status)}</h5>
    </TableCell>
  </tr>
);

const EditCopy = ({
  id,
  bookID,
  barcode,
  status,
  condition,
  notes,
}: {
  id: string | undefined;
  bookID: string | undefined;
  barcode: string | undefined;
  status: statusType | undefined;
  condition: conditionType | undefined;
  notes: string | undefined;
}) => {
  const NotificationHandler = useContext(NotificationContext);

  const [barcodeValue, setBarcodeValue] = useState(barcode || '');
  const [statusValue, setStatusValue] = useState(status);
  const [conditionValue, setConditionValue] = useState(condition || 3);
  const [notesValue, setNotesValue] = useState(notes || '');

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const firestore = useFirestore();
  const user = useUser().data;
  if (user === null) throw new Error('No user exists.');

  let activeTimer: NodeJS.Timeout | null = null;

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer);
    };
  });

  return (
    <TableRow key={id} className="font-weight-bold">
      <TableCell className="text-center">
        {(statusValue === 0 || statusValue === 1) && (
          <CheckCircleOutlined className="green-text mr-2" />
        )}
        {!(statusValue === 0 || statusValue === 1) && (
          <HighlightOff className="red-text mr-2" />
        )}
      </TableCell>
      <TableCell>
        <TextField
          label="Barcode"
          value={barcodeValue}
          onChange={(event) => setBarcodeValue(event.target.value)}
        />
      </TableCell>
      <TableCell className="text-center">
        <ButtonGroup size="small">
          <Button
            disabled={statusValue === 0 || statusValue === 2}
            className="px-2"
            onClick={() => setStatusValue(0)}
            variant="contained"
          >
            {determineStatus(0)}
          </Button>
          <Button
            disabled={statusValue === 1 || statusValue === 2}
            className="px-2"
            onClick={() => setStatusValue(1)}
            variant="contained"
          >
            {determineStatus(1)}
          </Button>
        </ButtonGroup>
        <br />
        <ButtonGroup size="small">
          <Tooltip
            placement="bottom"
            title={`To set a copy's status to ${determineStatus(2)}, please use
              the Check Out tool.`}
          >
            <Button
              color={statusValue === 2 ? 'primary' : 'inherit'}
              disabled={statusValue === 2}
              className="px-2"
              variant="contained"
            >
              {determineStatus(2)}
            </Button>
          </Tooltip>
          <Button
            disabled={statusValue === 3 || statusValue === 2}
            className="px-2"
            onClick={() => setStatusValue(3)}
            variant="contained"
          >
            {determineStatus(3)}
          </Button>
        </ButtonGroup>
        <br />
        <Button
          size="small"
          disabled={statusValue === 4 || statusValue === 2}
          className="px-2"
          onClick={() => setStatusValue(4)}
          variant="contained"
        >
          {determineStatus(4)}
        </Button>
      </TableCell>
      <TableCell className="text-center">
        <ButtonGroup size="small">
          <Button
            disabled={conditionValue === 1}
            className="px-2"
            onClick={() => setConditionValue(1)}
            variant="contained"
          >
            New
          </Button>
          <Button
            disabled={conditionValue === 2}
            className="px-2"
            onClick={() => setConditionValue(2)}
            variant="contained"
          >
            Good
          </Button>
        </ButtonGroup>
        <br />
        <Button
          size="small"
          disabled={conditionValue === 3}
          className="px-2"
          onClick={() => setConditionValue(3)}
          variant="contained"
        >
          Fair
        </Button>
        <br />
        <ButtonGroup size="small">
          <Button
            disabled={conditionValue === 4}
            className="px-2"
            onClick={() => setConditionValue(4)}
            variant="contained"
          >
            Poor
          </Button>
          <Button
            disabled={conditionValue === 5}
            className="px-2"
            onClick={() => setConditionValue(5)}
            variant="contained"
          >
            Bad
          </Button>
        </ButtonGroup>
      </TableCell>
      <TableCell>
        <TextField
          label="Notes"
          multiline
          rows="3"
          value={notesValue}
          onChange={(event) => setNotesValue(event.target.value)}
        />
      </TableCell>
      <TableCell>
        <ButtonGroup>
          <Button
            disabled={isCopySame(
              barcode || '',
              status || 0,
              condition || 1,
              notes || '',
              barcodeValue || '',
              statusValue || 0,
              conditionValue || 1,
              notesValue || ''
            )}
            color="primary"
            className="px-4"
            variant="contained"
            onClick={async () => {
              await updateDoc(
                doc(firestore, 'books', bookID ?? '', 'copies', id ?? ''),
                {
                  barcode: barcodeValue,
                  status: statusValue,
                  condition: conditionValue,
                  notes: notesValue,
                  lastEditedBy: user.uid,
                  lastEdited: serverTimestamp(),
                }
              )
                .then(() => {
                  NotificationHandler.addNotification({
                    message: 'Copy updated.',
                    severity: 'success',
                  });
                })
                .catch((err) => {
                  console.error(err);
                  NotificationHandler.addNotification({
                    message: `An unexpected error occurred: ${err.message} (${err.code})`,
                    severity: 'error',
                  });
                });
              setSubmitSuccess(true);
              const timer = () =>
                setTimeout(async () => {
                  setSubmitSuccess(false);
                }, 5000);
              activeTimer = timer();
            }}
          >
            {!submitSuccess && 'Save'}
            {submitSuccess && <CheckCircleOutlined />}
          </Button>
          <Button
            color="secondary"
            className="px-3"
            onClick={() => {
              deleteDoc(
                doc(firestore, 'books', bookID ?? '', 'copies', id ?? '')
              );
            }}
          >
            <Delete />
          </Button>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};

export default CopiesTable;
