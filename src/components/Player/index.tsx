import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import { PlayerContext } from './Context';
import styles from './styles.module.scss';

const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodes, currentIndex, isPlaying, togglePlay, setIsPlayingState,
  } = useContext(PlayerContext);
  const episode = episodes[currentIndex];

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

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}


      <footer className={styles.empty}>
        <div className={styles.progress}>
          <span>00:00</span>

          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#9f75ff', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>00:00</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <Image
              src="/shuffle.svg"
              alt="Embaralhar"
              width={24}
              height={24}
            />
          </button>

          <button type="button" disabled={!episode}>
            <Image
              src="/play-previous.svg"
              alt="Tocar anterior"
              width={24}
              height={24}
            />
          </button>

          <button
            type="button"
            disabled={!episode}
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

          <button type="button" disabled={!episode}>
            <Image
              src="/play-next.svg"
              alt="Tocar próxima"
              width={24}
              height={24}
            />
          </button>

          <button type="button" disabled={!episode}>
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