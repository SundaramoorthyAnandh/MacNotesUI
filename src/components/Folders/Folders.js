import React, { useState, useEffect, useRef } from 'react';
import "./Folders.css";
import { Button, Col, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap';

import { CgFolderAdd } from "react-icons/cg";
import { TiDelete } from "react-icons/ti";


function Folders({ foldersList, selectFolder, addFolder, currentFolder, deleteFolder }) {
    const [folders, setFolders] = useState([]);
    const [latestId, setLatestId] = useState(0);
    const [selectedFolder, setSelectedFolder] = useState(currentFolder);
    const [addNewFolder, setAddNewFolder] = useState(false);
    const textInputRef = useRef(null);

    useEffect(() => {
        setFolders(foldersList);

        let latestId = 0;

        if (foldersList && foldersList.length) {
            foldersList.forEach(folder => {
                if (Number(folder.fid) > Number(latestId)) latestId = folder.fid
            });

            setSelectedFolder(foldersList[0]["fid"]);

            setLatestId(latestId);

        }

    }, [foldersList]);

    useEffect(() => {
        if (addNewFolder) textInputRef.current.focus()
    }, [addNewFolder])

    return (
        <>
            <div className={addNewFolder ? "folders add-folder" : "folders"}>
                {folders.map((folder) =>
                    <Row style={{ cursor: "pointer" }}
                        key={folder.fid}
                        className={folder.fid === selectedFolder ? "folder active" : "folder"}
                        onClick={() => {
                            setSelectedFolder(folder.fid);
                            selectFolder(folder.fid);
                        }}
                    >
                        <Col>
                            {folder.name}
                            <TiDelete
                                className={"del-btn"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    deleteFolder(folder.fid);
                                }}
                            />
                        </Col>
                    </Row>
                )}
            </div>
            <div>
                {
                    addNewFolder ?
                        <Row className={"folder"}>
                            <Col>
                                <InputGroup >
                                    <Input
                                        type="search"
                                        ref={textInputRef}
                                        maxLength={30}
                                        placeholder={"Enter New Folder's Name"}
                                        onKeyPress={async e => {
                                            if (e.key.toLowerCase() === "enter" && e.target.value && e.target.value.length) {
                                                setAddNewFolder(false);
                                                await addFolder({
                                                    fid: (Number(latestId) + 1).toString(),
                                                    id: (Number(latestId) + 1).toString(),
                                                    name: e.target.value.trim()
                                                });
                                            }
                                        }}
                                    />
                                    <InputGroupAddon addonType="append">
                                        <Button
                                            color="secondary"
                                            onClick={() => setAddNewFolder(false)}
                                        >{" X "}</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </Row> :
                        <Row
                            style={{ position: "absolute", bottom: "0", boxSizing: "border-box", textAlign: "center" }}
                            className="folder"
                            onClick={() => {
                                setAddNewFolder(true);
                            }}
                        >
                            <Col>
                                <CgFolderAdd style={{ paddingRight: "10px" }} />{"Add Folder"}
                            </Col>
                        </Row>
                }
            </div>

        </>
    )
}

export default Folders;
