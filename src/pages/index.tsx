import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { FC, useContext } from 'react';
import apiService from '../services/api-service';
import durationToTime from '../utils/durationToTime';
import Image from 'next/image';
import styles from './home.module.scss';
import Episode from '../interfaces/episode';
import { PlayerContext } from '../components/Player/Context';

interface HomeProps {
  latestsEpisodes: Episode[];
  allEpisodes: Episode[];
}

const Home: FC<HomeProps> = ({ allEpisodes, latestsEpisodes }) => {
  const { playList } = useContext(PlayerContext);
  const episodes = [...latestsEpisodes, ...allEpisodes];

  return (
    <article className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>

        <ul>
          {latestsEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image
                src={episode.thumbnail}
                alt={episode.title}
                width={423}
                height={233}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episode/${episode.id}`}>
                  {episode.title}
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationString}</span>
              </div>

              <button type="button" onClick={() => playList(episodes, index + 2)}>
                <Image
                  src="/play-green.svg"
                  alt="Tocar"
                  width={20}
                  height={20}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os espisódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episode/${episode.id}`}>
                    {episode.title}
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td className={styles.publishedAt}>{episode.publishedAt}</td>
                <td>{episode.durationString}</td>
                <td>
                  <button type="button" onClick={() => playList(episodes, index)}>
                    <Image
                      src="/play-green.svg"
                      alt="Trocar episódio"
                      height={20}
                      width={20}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}
export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await apiService.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const episodes = data.map((e) => ({
    id: e.id,
    title: e.title,
    thumbnail: e.thumbnail,
    members: e.members,
    publishedAt: format(parseISO(e.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    duration: e.file.duration,
    durationString: durationToTime(e.file.duration),
    description: e.description,
    url: e.file.url,
  }));

  const latestsEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestsEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}