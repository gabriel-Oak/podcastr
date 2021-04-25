import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import { usePlayer } from './Context';
import styles from './styles.module.scss';
import durationToTime from '../../utils/durationToTime';

const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const setProgressListener = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  const handleSlide = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  const handleEnded = () => {
    if (currentIndex + 1 < episodes.length || isShuffling) {
      playNext();
    }
    else {
      clearState();
      setProgress(0);
    }
  }

  const {
    episodes, currentIndex, isPlaying, togglePlay, setIsPlayingState, playNext,
    playPrevious, toggleLoop, isLooping, isShuffling, toggleShuffle, clearState
  } = usePlayer();
  const currentEpisode = episodes[currentIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying]);

  return (
    <section className={styles.playerContainer}>
      <header>
        <Image
          src="/playing.svg"
          alt="Tocando agora"
          width={32}
          height={32}
        />
        <strong>Tocando agora</strong>
      </header>

      {currentEpisode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={currentEpisode.thumbnail}
            objectFit="cover"
          />
          <strong>{currentEpisode.title}</strong>
          <span>{currentEpisode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}


      <footer className={currentEpisode ? '' : styles.empty}>
        <div className={styles.progress}>
          <span>{durationToTime(progress)}</span>

          <div className={styles.slider}>
            {currentEpisode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#9f75ff', borderWidth: 4 }}
                max={currentEpisode.duration}
                min={0}
                value={progress}
                onChange={handleSlide}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>{durationToTime(currentEpisode?.duration ?? 0)}</span>
        </div>

        {currentEpisode && (
          <audio
            src={currentEpisode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            loop={isLooping}
            onEnded={handleEnded}
            onLoadedMetadata={setProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!currentEpisode || episodes.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <Image
              src="/shuffle.svg"
              alt="Embaralhar"
              width={24}
              height={24}
            />
          </button>

          <button
            type="button"
            disabled={!currentEpisode || !currentIndex}
            onClick={playPrevious}
          >
            <Image
              src="/play-previous.svg"
              alt="Tocar anterior"
              width={24}
              height={24}
            />
          </button>

          <button
            type="button"
            disabled={!currentEpisode}
            className={styles.playButton}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Image
                src="/pause.svg"
                alt="Tocar"
                width={11}
                height={19}
              />
            ) : (
              <Image
                src="/play.svg"
                alt="Tocar"
                width={32}
                height={32}
              />
            )}
          </button>

          <button
            type="button"
            disabled={!currentEpisode || !episodes[currentIndex + 1]}
            onClick={playNext}
          >
            <Image
              src="/play-next.svg"
              alt="Tocar próxima"
              width={24}
              height={24}
            />
          </button>

          <button
            type="button"
            disabled={!currentEpisode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <Image
              src="/repeat.svg"
              alt="Repetir"
              width={24}
              height={24}
            />
          </button>

        </div>
      </footer>
    </section>
  );
}

export default Player;