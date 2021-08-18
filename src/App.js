import './App.css';
import { Button, Col, Container, Input, Navbar, NavbarBrand, Row } from "reactstrap";
import Folders from './components/Folders/Folders';
import Notes from './components/Notes/Notes';
import Editor from './components/Editor/Editor';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineDocumentAdd } from "react-icons/hi";


const FETCH_NOTES_BASE_URL = "http://localhost:4200/notes?fid=";
const NOTES_BASE_URL = "http://localhost:4200/notes/";
const FOLDERS_BASE_URL = "http://localhost:4200/folders/";
const FOLDERS_URL_WITH_ASC_SORT = "http://localhost:4200/folders?_sort=name&_order=asc";
const SEARCH_NOTES_BASE_URL = "http://localhost:4200/notes?q="

function App() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState({});
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [searchString, setSearchString] = useState(null);
  const [hamburgerOpen, setHamburgerOpen] = useState(false)

  useEffect(() => {
    async function getFolders() {
      try {
        await fetchFolders();
      } catch (error) {
        console.log(error);
      }
    }
    getFolders();
  }, [])

  const fetchFolders = async () => {
    try {
      const { data: folders } = await axios.get(FOLDERS_URL_WITH_ASC_SORT);
      setFolders(folders);
      await handleSelectFolder(folders[0]["fid"]);
    } catch (error) {
      console.log(error);
    }
  }

  const getNotesWithFolderId = async (fid) => {
    setLoadingNotes(true);
    const URL = fid && fid.length ? FETCH_NOTES_BASE_URL + fid : NOTES_BASE_URL;
    const { data: notes } = await axios.get(URL);
    setLoadingNotes(false);
    return notes;
  }

  const handleSelectFolder = async (fid) => {
    if (fid) {
      try {
        setCurrentFolderId(fid);
        setSelectedNote({})
        setNotes(await getNotesWithFolderId(fid));
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleNoteSelection = (selectedNote) => {
    setSelectedNote(selectedNote);
  }

  const handleContentUpdation = async (content, noteId, modified_date, fid) => {
    try {
      await axios.patch(NOTES_BASE_URL + noteId, {
        content,
        modified_date
      });
      setNotes(await getNotesWithFolderId(fid));
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddFolder = async (data) => {
    try {
      await axios.post(FOLDERS_BASE_URL, data);
      const { data: _folders } = await axios.get(FOLDERS_URL_WITH_ASC_SORT);
      setFolders(_folders)
      await handleSelectFolder(_folders[0]["fid"]);
      await getNotesWithFolderId(_folders[0]["fid"]);
      setCurrentFolderId(_folders[0]["fid"]);
    } catch (error) {
      console.log(error);
    }
  }


  const handleAddNewNote = async () => {
    let notes = await getNotesWithFolderId();
    let latestNotesId = 0;

    notes.forEach(note => {
      if (Number(note.id) > latestNotesId) {
        latestNotesId = note.id;
      }
    });

    await axios.post(NOTES_BASE_URL, {
      id: (Number(latestNotesId) + 1).toString(),
      fid: currentFolderId.toString(),
      content: "",
      creation_date: Date.now().toString(),
      modified_date: Date.now().toString()
    });

    setNotes(await getNotesWithFolderId(currentFolderId));
  }

  const throttle = (func, delay) => {

    let flag = true;
    return function () {
      let context = this, args = arguments;
      if (flag) {
        func.apply(context, args);
        flag = false;
        setTimeout(() => {
          flag = true;
        }, delay);
      }
    }
  }

  const throttleAddNotes = throttle(handleAddNewNote, 1000);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer)
      debounceTimer
        = setTimeout(() => func.apply(context, args), delay)
    }
  }

  const searchNotes = async (event) => {
    if (event.target.value && event.target.value.length > 0) {
      const { data: searchedNotes } = await axios.get(SEARCH_NOTES_BASE_URL + event.target.value.trim() + `&fid=${currentFolderId}`);
      setNotes(searchedNotes);
    } else {
      setNotes(await getNotesWithFolderId(currentFolderId));
    }
  }

  const debounceSearch = debounce(searchNotes, 400);

  const handleDeleteFolder = async (fid) => {
    try {
      await axios.delete(FOLDERS_BASE_URL + fid);
      const { data: notesLinkedWithFolder } = await axios.get(FETCH_NOTES_BASE_URL + fid);
      notesLinkedWithFolder.forEach(async note => await axios.delete(NOTES_BASE_URL + Number(note.id)));
      const folders = await fetchFolders();
      if (folders && folders.length) await handleSelectFolder(folders[0]["fid"]);
    } catch (error) {
      console.log(error);
    }
  }

  const handleNoteDeletion = async (noteId) => {
    try {
      await axios.delete(NOTES_BASE_URL + Number(noteId));
      if (Number(noteId) === Number(selectedNote.id)) setSelectedNote({});
      const { data: notes } = await axios.get(FETCH_NOTES_BASE_URL + currentFolderId);
      setNotes(notes);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Container >
      <Row style={{ height: "50px", "backgroundColor": "gray" }}>
        <Navbar color="faded">
          {/* { hamburgerOpen ? */}
          <GiHamburgerMenu onClick={() => setHamburgerOpen(!hamburgerOpen)} className={"hamburgerMenu"} />
          {/* :<GrClose onClick={() => setHamburgerOpen(!hamburgerOpen)} className={"hamburgerMenu"}/>} */}
          <NavbarBrand style={{ "color": "white", "marginLeft": "2px", "padding": "10px", "marginTop": "15px" }}>Mac-Os Notes</NavbarBrand>
          <Button
            onClick={throttleAddNotes}
            style={{ marginLeft: "22%", padding: "2px 5px", lineHeight: "24px" }}
          > <HiOutlineDocumentAdd className={"add-notes-icon"} />
            {"Add Notes"}</Button>
          <Input
            style={{ float: "right", "marginRight": "2%", "marginTop": "5px", "borderRadius": "10px", "padding": "10px", "width": "300px", outline: "none" }}
            placeholder={"Search Notes"}
            onChange={debounceSearch}
          />
        </Navbar>
      </Row>
      <Row className={"content"}>
        <Col lg={2} className={`split split-left ${hamburgerOpen ? "ham-close" : "ham-open"}`}>
          <Folders
            foldersList={folders}
            selectFolder={handleSelectFolder}
            addFolder={handleAddFolder}
            currentFolder={currentFolderId}
            deleteFolder={handleDeleteFolder}
          />
        </Col>
        <Col lg={4} className="split split-center">
          <Notes
            loading={loadingNotes}
            notes={notes}
            selectedFolder={currentFolderId}
            selectNote={handleNoteSelection}
            searchNote={searchString}
            deleteNote={handleNoteDeletion}
          />
        </Col>
        <Col lg={6} className="split split-right">
          <Editor selectedNote={selectedNote} updateContent={handleContentUpdation} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
