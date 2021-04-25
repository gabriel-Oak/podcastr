import { useState } from 'react';
import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerContext, PlayerProvider } from '../components/Player/Context';
import styles from './app.module.scss'

import 'rc-slider/assets/index.css';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const [episodes, setEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (episode) => {
    setEpisodes([episode]);
    setCurrentIndex(0);
    setIsPlaying(true);
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }

  const setIsPlayingState = (state: boolean) => setIsPlaying(state);

  const context = {
    episodes, currentIndex, play, isPlaying, togglePlay, setIsPlayingState,
  };

  return (
    <PlayerProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />

          <section className={styles.mainContent}>
            <Component {...pageProps} />
          </section>
        </main>

        <Player />
      </div>
    </PlayerProvider>
  );
}

export default MyApp
