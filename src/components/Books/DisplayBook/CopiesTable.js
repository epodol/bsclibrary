import React, { useState } from 'react';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
  MDBBtn,
  MDBBtnGroup,
  MDBTooltip,
  MDBInput,
  MDBBadge,
} from 'mdbreact';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';

function determineStatus(status) {
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

const CopiesTable = ({ bookID, editing }) => {
  const firestore = useFirestore();
  const fieldValue = useFirestore.FieldValue;
  const user = useUser().data;

  const copiesInitRef = firestore
    .collection('books')
    .doc(bookID)
    .collection('copies');

  const copiesRef = editing
    ? copiesInitRef
    : copiesInitRef.where('status', '!=', 4).orderBy('status');

  const copies = useFirestoreCollectionData(copiesRef.limit(25), {
    idField: 'id',
  }).data;

  return (
    <div className="mx-5">
      {(copies.length !== 0 || editing) && (
        <MDBTable btn striped hover responsive>
          <MDBTableHead>
            <tr>
              <th className="h4" style={{ width: 1 }}>
                <></>
              </th>
              <th
                className={editing ? 'h4 text-center' : 'h4'}
                style={editing ? { width: 1 } : {}}
              >
                Barcode
              </th>
              <th className={editing ? 'h4 text-center' : 'h4'}>Status</th>
              {editing && (
                <th className="h4 text-center" style={{ width: 1 }}>
                  Condition
                </th>
              )}
              {editing && <th className="h4">Notes</th>}
              {editing && (
                <th className="h4" style={editing ? { width: 1 } : {}}>
                  Actions
                  <MDBBtn
                    rounded
                    className="px-3"
                    onClick={() => {
                      firestore
                        .collection('books')
                        .doc(bookID)
                        .collection('copies')
                        .add({
                          barcode: '',
                          status: 4,
                          condition: 3,
                          notes: '',
                          lastEditedBy: user.uid,
                          lastEdited: fieldValue.serverTimestamp(),
                        });
                    }}
                  >
                    <i className="fas fa-plus mt-0" />
                  </MDBBtn>
                </th>
              )}
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {copies.map(({ id, barcode, status, condition, notes }) =>
              editing ? (
                <EditCopy
                  key={id}
                  id={id}
                  bookID={bookID}
                  barcode={barcode}
                  status={status}
                  condition={condition}
                  notes={notes}
                />
              ) : (
                status !== 4 && (
                  <Copy key={id} id={id} barcode={barcode} status={status} />
                )
              )
            )}
          </MDBTableBody>
        </MDBTable>
      )}
      {copies.length === 0 && !editing && (
        <h2 className="text-center mb-5">
          Sorry, we don&apos;t currently have any copies of this book.
        </h2>
      )}
    </div>
  );
};

const Copy = ({ id, barcode, status }) => (
  <tr key={id} className="font-weight-bold">
    <td className="text-center">
      {(status === 0 || status === 1) && (
        <MDBIcon icon="check-circle" size="2x" className="green-text mr-2" />
      )}
      {!(status === 0 || status === 1) && (
        <MDBIcon icon="times-circle" size="2x" className="red-text mr-2" />
      )}
    </td>
    <td className="h4">
      <MDBBadge color="light" pill className="mx-1 h3">
        {barcode}
      </MDBBadge>
    </td>
    <td>{determineStatus(status)}</td>
  </tr>
);

const EditCopy = ({ id, bookID, barcode, status, condition, notes }) => {
  const [barcodeValue, setBarcodeValue] = useState(barcode || '');
  const [statusValue, setStatusValue] = useState(status);
  const [conditionValue, setConditionValue] = useState(condition || 3);
  const [notesValue, setNotesValue] = useState(notes || '');

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const firestore = useFirestore();
  const fieldValue = useFirestore.FieldValue;
  const user = useUser().data;

  return (
    <tr key={id} className="font-weight-bold">
      <td className="text-center">
        {(statusValue === 0 || statusValue === 1) && (
          <MDBIcon icon="check-circle" size="2x" className="green-text mr-2" />
        )}
        {!(statusValue === 0 || statusValue === 1) && (
          <MDBIcon
            icon="times-circle"
            size="2x"
            className={statusValue === 4 ? 'grey-text mr-2' : 'red-text mr-2'}
          />
        )}
      </td>
      <td>
        <MDBInput
          label="Barcode"
          value={barcodeValue}
          onChange={(event) => setBarcodeValue(event.target.value)}
        />
      </td>
      <td className="text-center">
        <MDBBtnGroup size="sm">
          <MDBBtn
            color="green"
            active={statusValue === 0}
            className="px-2"
            onClick={() => setStatusValue(0)}
          >
            {determineStatus(0)}
          </MDBBtn>
          <MDBBtn
            color="green"
            active={statusValue === 1}
            className="px-2"
            onClick={() => setStatusValue(1)}
          >
            {determineStatus(1)}
          </MDBBtn>
        </MDBBtnGroup>
        <br />
        <MDBBtnGroup size="sm">
          <MDBTooltip placement="bottom">
            <MDBBtn
              color="green"
              active={statusValue === 2}
              className="px-2"
              //   onClick={() => setStatusValue(2)}
            >
              {determineStatus(2)}
            </MDBBtn>
            <div>
              To set a copy&apos;s status to {determineStatus(2)}, please use
              the appropriate tool.
            </div>
          </MDBTooltip>
          <MDBBtn
            color="green"
            active={statusValue === 3}
            className="px-2"
            onClick={() => setStatusValue(3)}
          >
            {determineStatus(3)}
          </MDBBtn>
        </MDBBtnGroup>
        <br />
        <MDBBtn
          color="green"
          size="sm"
          active={statusValue === 4}
          className="px-2"
          onClick={() => setStatusValue(4)}
        >
          {determineStatus(4)}
        </MDBBtn>
      </td>
      <td className="text-center">
        <MDBBtnGroup size="sm">
          <MDBBtn
            color="green"
            active={conditionValue === 1}
            className="px-2"
            onClick={() => setConditionValue(1)}
          >
            New
          </MDBBtn>
          <MDBBtn
            color="green"
            active={conditionValue === 2}
            className="px-2"
            onClick={() => setConditionValue(2)}
          >
            Good
          </MDBBtn>
        </MDBBtnGroup>
        <br />
        <MDBBtn
          color="green"
          size="sm"
          active={conditionValue === 3}
          className="px-2"
          onClick={() => setConditionValue(3)}
        >
          Fair
        </MDBBtn>
        <br />
        <MDBBtnGroup size="sm">
          <MDBBtn
            color="green"
            active={conditionValue === 4}
            className="px-2"
            onClick={() => setConditionValue(4)}
          >
            Poor
          </MDBBtn>
          <MDBBtn
            color="green"
            active={conditionValue === 5}
            className="px-2"
            onClick={() => setConditionValue(5)}
          >
            Bad
          </MDBBtn>
        </MDBBtnGroup>
      </td>
      <td>
        <MDBInput
          label="Notes"
          type="textarea"
          rows="3"
          value={notesValue}
          onChange={(event) => setNotesValue(event.target.value)}
        />
      </td>
      <td>
        <MDBBtnGroup>
          <MDBBtn
            color="orange"
            className="px-4"
            onClick={async () => {
              await firestore
                .collection('books')
                .doc(bookID)
                .collection('copies')
                .doc(id)
                .update({
                  barcode: barcodeValue,
                  status: statusValue,
                  condition: conditionValue,
                  notes: notesValue,
                  lastEditedBy: user.uid,
                  lastEdited: fieldValue.serverTimestamp(),
                });
              setSubmitSuccess(true);
              setTimeout(async () => {
                setSubmitSuccess(false);
              }, 4000);
            }}
          >
            {!submitSuccess && 'Save'}
            {submitSuccess && <MDBIcon icon="check" />}
          </MDBBtn>
          <MDBBtn
            color="red"
            className="px-3"
            onClick={() => {
              firestore
                .collection('books')
                .doc(bookID)
                .collection('copies')
                .doc(id)
                .delete();
            }}
          >
            <MDBIcon icon="trash" />
          </MDBBtn>
        </MDBBtnGroup>
      </td>
    </tr>
  );
};

export default CopiesTable;
