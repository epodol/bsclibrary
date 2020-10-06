import React, {useEffect} from 'react';
import {MDBDataTableV5} from 'mdbreact';
import {db} from '../../fire/FirebaseConfig'

let data = [];

const groomData = (bookData) => {

    console.log("grromdata:", bookData)
    const books = bookData.books.map(book =>
        ({
            ...book,
            author: book.author.map(author => (author + ', '))
        }))
    return books;
}

const getBooksSummary = groceryListId => {
    return db.collection('books')
        .doc("summary")
        .get();
};


export default function Books() {
    const [datatable, setDatatable] = React.useState({
        columns: [],
        rows: data,
    });

    const columns = [
        {
            label: 'Title',
            field: 'title',
            width: 150,
            attributes: {
                'aria-controls': 'DataTable',
                'aria-label': 'Title',
            },
        },
        {
            label: 'Author',
            field: 'author',
            width: 270,
        },
        {
            label: 'Start date',
            field: 'date',
            sort: 'disabled',
            width: 150,
        },
        {
            label: 'Salary',
            field: 'salary',
            sort: 'disabled',
            width: 100,
        },
    ]

    // var bookSummaryRef = db.collection("books").doc("summary");

    // bookSummaryRef.onSnapshot(function (doc) {
    //     console.log("Document data:", doc.data());
    //     setDatatable({
    //         columns: columns,
    //         rows: doc.data().books,
    //     })
    // })


    useEffect(() => {
        getBooksSummary()
            .then(function (doc) {
                console.log('DOC:', doc.data())
                const groomedDATA = groomData(doc.data())
                console.log('groomedDATA:', groomedDATA)

                setDatatable({
                    columns: columns,
                    rows: groomedDATA
                })
            })
    }, [getBooksSummary]);


    console.log("setDatatable", datatable)

    return (
        <>
            <div className="container">
                <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datatable}
                                materialSearch/>
            </div>
        </>
    )
}

