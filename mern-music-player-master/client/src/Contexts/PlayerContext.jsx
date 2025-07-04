import { createContext, useContext, useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [currSong, setCurrSong] = useState();
  const [playing, setPlaying] = useState(false);
  const [songs, setSongs] = useState([]);
  const [volume, setVolume] = useState(0.67);
  const [isMute, setMute] = useState(false);
  const audioElem = useRef();

  // Load song list on load
  useEffect(() => {
    getAllSongs();
  }, []);

  // Set default after songs load
  useEffect(() => {
    if (songs.length > 0) {
      setSongInPlayer(songs[0]._id);
    }
  }, [songs]);

  // Playback and volume effects
  useEffect(() => { if (audioElem.current) playing ? audioElem.current.play() : audioElem.current.pause() }, [playing]);
  useEffect(() => { if (audioElem.current) audioElem.current.volume = volume }, [volume]);

  const getAllSongs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/songs/all`);
      setSongs(res.data.songs);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  const getSong = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/song/${id}`);
      return res.data.song;
    } catch (err) {
      console.error("Error fetching song:", err);
    }
  };

  const setSongInPlayer = async (id) => {
    setPlaying(false);
    const song = await getSong(id);
    if (song) {
      song.currTime = 0; song.duration = 0;
      setCurrSong(song);
      setPlaying(true);
    }
  };

  const togglePlaying = () => setPlaying(!playing);

  const whilePlaying = () => {
    const currTime = audioElem.current.currentTime,
          duration = audioElem.current.duration;
    setCurrSong({ ...currSong, currTime, duration });
  };

  const seekPlayer = evt => audioElem.current.currentTime = evt.target.value;

  const getPrevTrack = () => {
    const idx = songs.findIndex(s => s._id === currSong._id);
    if (idx > 0) setSongInPlayer(songs[idx - 1]._id);
  };

  const getNextTrack = () => {
    const idx = songs.findIndex(s => s._id === currSong._id);
    if (idx !== -1) setSongInPlayer(songs[(idx + 1) % songs.length]._id);
  };

  const changeVolume = evt => {
    if (isMute && evt.target.value > 0) toggleMute();
    setVolume(evt.target.value);
  };

  const toggleMute = () => {
    audioElem.current.volume = isMute ? volume : 0;
    setMute(!isMute);
  };

  return (
    <PlayerContext.Provider {...{ currSong, songs, playing, togglePlaying, seekPlayer, getPrevTrack, getNextTrack, volume, changeVolume, isMute, toggleMute }}>
      {children}
      {currSong && <audio src={currSong.audio_url} ref={audioElem} onTimeUpdate={whilePlaying} onEnded={getNextTrack} />}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
