import { createContext, FC, ReactNode, useContext, useState } from 'react';
import Episode from '../../interfaces/episode';

interface PlayerContextData {
  episodes: Episode[];
  currentIndex: number;
  play: (episode: Episode) => void;
  isPlaying: boolean;
  togglePlay: (event: any) => void;
  setIsPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearState: () => void;
  isLooping: boolean;
  isShuffling: boolean;
}

interface PlayerProviderProps {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export const PlayerProvider: FC<PlayerProviderProps> = ({ children }) => {
  const [episodes, setEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = (episode) => {
    setEpisodes([episode]);
    setCurrentIndex(0);
    setIsPlaying(true);
  }

  const playList = (list: Episode[], index: number) => {
    setEpisodes(list);
    setCurrentIndex(index);
    setIsPlaying(true);
  }

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleLoop = () => setIsLooping(!isLooping);
  const toggleShuffle = () => setIsShuffling(!isShuffling);
  const setIsPlayingState = (state: boolean) => setIsPlaying(state);

  const playNext = () => {
    const nextIndex = isShuffling
      ? Math.floor(Math.random() * episodes.length)
      : currentIndex + 1;

    if (nextIndex < episodes.length) setCurrentIndex(nextIndex);
  }

  const playPrevious = () => {
    const previousIndex = isShuffling
      ? Math.floor(Math.random() * episodes.length)
      : currentIndex - 1;

    if (previousIndex) setCurrentIndex(previousIndex);
  }

  const clearState = () => {
    setCurrentIndex(0);
    setEpisodes([]);
    setIsShuffling(false);
    setIsLooping(false);
  }

  return (
    <PlayerContext.Provider value={{
      episodes,
      currentIndex,
      play,
      isPlaying,
      togglePlay,
      setIsPlayingState,
      playList,
      playNext,
      playPrevious,
      toggleLoop,
      isLooping,
      toggleShuffle,
      isShuffling,
      clearState,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);