import React, { Fragment, useEffect, useState } from 'react';
// import EditorJs from 'react-editor-js';
import { Input } from 'reactstrap';
import "./Editor.css"

function Editor({ selectedNote, updateContent }) {
    const [noteDetails, setNoteDetails] = useState({});
    const [content, setContent] = useState("");

    useEffect(() => {
        setNoteDetails(selectedNote);
        setContent(selectedNote.content);
    }, [selectedNote]);

    if (noteDetails && Object.keys(noteDetails).length) {
        return (
            <div style={{ paddingLeft: "15px" }} className="editor-font">
                <p style={{ textAlign: "center", marginTop: "15px" }}>{new Date(parseInt(noteDetails.modified_date)).toLocaleString()}</p>
                <h3>{noteDetails.name}</h3>
                <Input
                    type="textarea"
                    name="noteContent"
                    id="noteContent"
                    placeholder="Start Adding Your Notes.."
                    className="input-font remove-outline"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                    onKeyPress={
                        e => {
                            if (e.key === "Enter") updateContent(content, noteDetails.id, Date.now().toString(), noteDetails.fid)
                        }
                    }
                />

            </div>
        )
    }
    return <div></div>
}

export default Editor
