import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import React from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { auth, db, storage } from "./config/firebase";

function App() {
  const [animeList, setAnimeList] = React.useState([]);

  const [newAnimeTitle, setNewAnimeTitle] = React.useState("");
  const [newReleaseDate, setNewReleaseDate] = React.useState("");
  const [newReceivedAward, setNewReceivedAward] = React.useState(false);
  const [fileUpload, setFileUpload] = React.useState(null);

  //update title state
  const [updatedDate, setUpdatedDate] = React.useState("");
  const animeCollectionRef = collection(db, "animes");

  //function to read our database
  async function getAnimeList() {
    //READ THE DATA
    //SET ANIME LIST
    try {
      const data = await getDocs(animeCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(filteredData);
      setAnimeList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }

  async function onSubmitAnime() {
    try {
      //takes 2 parameters, the reference doc to be added to and the content
      await addDoc(animeCollectionRef, {
        title: newAnimeTitle,
        releaseDate: newReleaseDate,
        receiveAnAward: newReceivedAward,
        userId: auth.currentUser.uid,
      });

      getAnimeList();
      setNewAnimeTitle("");
      setNewReleaseDate("");
      setNewReceivedAward(false);
    } catch (err) {
      console.error(err);
    }
  }

  const deleteAnime = async (id) => {
    const animeDoc = doc(db, "animes", id);
    await deleteDoc(animeDoc);
    getAnimeList();
  };

  const updateAnimeDate = async (id) => {
    const animeDoc = doc(db, "animes", id);
    await updateDoc(animeDoc, { releaseDate: updatedDate });
    setUpdatedDate("");
    getAnimeList();
  };

  const uploadFile = async () => {
    //if null
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    //sending our file to the path we defined in filesFolderRef
    try {
      await uploadBytes(filesFolderRef, fileUpload);
      setFileUpload(null);
    } catch (err) {
      console.err(err);
    }
  };

  React.useEffect(() => {
    getAnimeList();
  }, []); //[callback,dependency]

  return (
    <div className="App">
      <Auth />

      <div>
        <input
          placeholder="Anime title..."
          onChange={(e) => setNewAnimeTitle(e.target.value)}
          value={newAnimeTitle}
        />
        <input
          placeholder="Release Date"
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          value={newReleaseDate}
        />
        <input
          type="checkbox"
          checked={newReceivedAward}
          onChange={(e) => setNewReceivedAward(e.target.checked)}
        />
        <label>Received an Award</label>
        <button onClick={onSubmitAnime}>Submit Anime</button>
      </div>

      <div>
        {animeList.map((anime) => (
          <div>
            <h1 style={{ color: anime.receiveAnAward ? "green" : "red" }}>
              {anime.title}
            </h1>
            <p>Date: {anime.releaseDate}</p>
            <button onClick={() => deleteAnime(anime.id)}>Delete Anime</button>

            {/* every Input is synced because i didn't make them individual components. should def fix it in the future ahah :) */}
            <input
              placeholder="new date..."
              onChange={(e) => setUpdatedDate(e.target.value)}
              value={updatedDate}
            />
            <button onClick={() => updateAnimeDate(anime.id)}>
              Update Date
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="file"
          onChange={(e) => setFileUpload(e.target.files[0])}
        ></input>
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
