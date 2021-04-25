import { createContext, FC, ReactNode, useState } from 'react';
import Episode from '../../interfaces/episode';

interface PlayerContextData {
  episodes: Episode[];
  currentIndex: number;
  play: (episode: Episode) => void;
  isPlaying: boolean;
  togglePlay: (event: any) => void;
  setIsPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
}

interface PlayerProviderProps {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export const PlayerProvider: FC<PlayerProviderProps> = ({ children }) => {
  const [episodes, setEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }

  const setIsPlayingState = (state: boolean) => setIsPlaying(state);

  return (
    <PlayerContext.Provider value={{
      episodes,
      currentIndex,
      play,
      isPlaying,
      togglePlay,
      setIsPlayingState,
      playList,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}