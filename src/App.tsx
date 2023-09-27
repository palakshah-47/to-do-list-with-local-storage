import "./styles.css";
import { useState, useEffect, useCallback } from "react";

type NoteProps = {
  title: string;
  status: string;
  id: number;
};

export default function App() {
  const [note, setNote] = useState<NoteProps>({
    title: "",
    status: "",
    id: Math.random()
  });

  const [notes, setNotes] = useState<NoteProps[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteProps[]>([]);
  const [tab, setTab] = useState(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = e?.target?.name;
    if (!e?.target?.value) setNote({ ...note, [name]: "", id: -1 });

    let noteObj = { [name]: e?.target?.value };
    setNote({ ...note, ...noteObj, id: Math.random() });
  };

  const handleSubmit = () => {
    let modifiedNotes = [...notes, { ...note }];
    setNotes([...modifiedNotes]);
    setFilteredNotes([...modifiedNotes]);
    localStorage.setItem("notes", JSON.stringify([...modifiedNotes]));
    setNote({ title: "", status: "", id: -1 });
  };

  const handleActiveStatus = () => {
    setTab(1);
    setFilteredNotes([...notes.filter((note) => note.status === "active")]);
  };

  const setAllTab = useCallback(() => {
    setTab(0);
    let activeNotes = [...notes.filter((note) => note.status === "active")]
      .sort()
      .reverse();
    let completedNotes = [
      ...notes.filter((note) => note.status === "completed")
    ]
      .sort()
      .reverse();
    const combineNotes = [...activeNotes, ...completedNotes];
    const pendingNotes = notes.filter(
      (n) => n.status !== "active" && n.status !== "completed"
    );

    setFilteredNotes([...combineNotes, ...pendingNotes]);
  }, [notes]);

  useEffect(() => {
    const notesfromStorage = JSON.parse(localStorage.getItem("notes"));
    if (notesfromStorage?.length) {
      setNotes(notesfromStorage);
      setFilteredNotes(notesfromStorage);
    }
    // setAllTab()
  }, []);

  useEffect(() => {
    if (notes?.length) setAllTab();
  }, [notes, setAllTab]);

  const handleAllStatus = () => {
    setAllTab();
  };

  const handleCompletedStatus = () => {
    setTab(2);
    setFilteredNotes([...notes.filter((note) => note.status === "completed")]);
  };
  return (
    <>
      <div className="App">
        <label>Add Title : </label>
        <input
          type="text"
          value={note.title}
          onChange={handleChange}
          name="title"
        ></input>
        <label style={{ marginLeft: "10px" }}> Add Status : </label>
        <input
          type="text"
          value={note.status}
          onChange={handleChange}
          name="status"
        ></input>
        <button onClick={handleSubmit} style={{ marginLeft: 5 }}>
          Add Note
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyItems: "center",
          marginTop: 40
        }}
      >
        <button
          className={tab === 0 ? "active" : ""}
          style={{ marginLeft: "20px", marginRight: "20px" }}
          onClick={handleAllStatus}
        >
          All
        </button>
        <button
          className={tab === 1 ? "active" : ""}
          style={{ marginLeft: "20px", marginRight: "20px" }}
          onClick={handleActiveStatus}
        >
          Active
        </button>
        <button
          className={tab === 2 ? "active" : ""}
          style={{ marginLeft: "20px", marginRight: "20px" }}
          onClick={handleCompletedStatus}
        >
          Completed
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "row",
          justifyItems: "center"
        }}
      >
        <ul>
          <label style={{ marginLeft: "20px", marginRight: "60px" }}>
            Title
          </label>
          <label style={{ marginLeft: "60px" }}>Status</label>
          {filteredNotes?.map((note) => (
            <li key={note?.id}>
              <span style={{ marginLeft: "20px", marginRight: "60px" }}>
                {note.title}
              </span>
              <span style={{ marginLeft: "60px" }}>{note.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
