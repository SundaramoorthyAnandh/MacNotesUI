import React, { useEffect, useState } from 'react'
import { TiDelete } from 'react-icons/ti';
import { Col, Row, Spinner } from 'reactstrap';

function Notes({ notes, selectNote, loading, deleteNote }) {

    const [notesList, setNotesList] = useState([]);
    const [currentNote, setCurrentNote] = useState(null)

    useEffect(() => {
        notes.sort((a, b) => Number(b.modified_date) - Number(a.modified_date));
        setNotesList(notes);
    }, [notes, currentNote]);

    if (notesList && notesList.length > 0 && !loading) {
        return notesList.map(note => {
            let title = "";
            const dotIntex = note.content.indexOf(".");
            const enterIndex = note.content.indexOf("\n");
            if (dotIntex > -1 && enterIndex > -1) {
                title = note.content.substr(0, dotIntex > enterIndex ? enterIndex : dotIntex);
            } else if (dotIntex > -1 && enterIndex === -1) {
                title = note.content.substr(0, dotIntex);
            } else if (dotIntex === -1 && enterIndex > -1) {
                title = note.content.substr(0, enterIndex);
            } else if (dotIntex === -1 && enterIndex === -1 && note.content.length) {
                title = note.content.substr(0, note.content.indexOf(" ") > -1 ? note.content.indexOf(" ") : note.content.length);
            } else title = "Untitled Notes"

            return <React.Fragment key={note.id}>
                <div
                    style={{
                        padding: "10px 5px",
                        borderBottom: "1px solid #dbdbd7",
                        backgroundColor: Number(note.id) === Number(currentNote) ? "#ccc" : ""
                    }}>
                    <Row
                        className={"note"}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setCurrentNote(note.id);
                            selectNote(note)
                        }
                        }>
                        <Col>
                            <strong
                                style={{
                                    float: "left",
                                    width: "calc(100% - 50px)",
                                    paddingRight: "5px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                {title}
                            </strong>
                            <TiDelete
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    deleteNote(note.id);
                                }}
                                className={"del-btn"}
                            />
                            <br />
                            <article style={{ width: "90%", paddingRight: "5px", fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                <i
                                    style={{ fontSize: "11px", color: "#a1a19d", whiteSpace: "nowrap", overflow: "hidden", paddingRight: "5px" }}>
                                    {(new Date(parseInt(note.modified_date))).toLocaleString()}</i>
                                {note.content}
                            </article>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        });
    }

    return (
        <div style={{ textAlign: "center", color: "grey", marginTop: "50%" }}>
            {loading ? <Spinner height="30px" width="30px" /> : "No Notes Available"}
        </div>
    )
}

export default Notes
