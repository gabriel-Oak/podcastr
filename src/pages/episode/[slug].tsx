import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import parseISO from 'date-fns/parseISO';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { FC } from 'react';
import Episode from '../../interfaces/episode';
import apiService from '../../services/api-service';
import durationToTime from '../../utils/durationToTime';
import Link from 'next/link';
import styles from './episode.module.scss';

interface EpisodePageProps {
  episode: Episode;
}

const EpisodePage: FC<EpisodePageProps> = ({ episode }): JSX.Element => {
  return (
    <article className={styles.episode}>
      <section className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <Image src="/arrow-left.svg" alt="Voltar" width={10} height={16} />
          </button>
        </Link>

        <Image
          src={episode.thumbnail}
          alt={episode.title}
          width={700}
          height={160}
          objectFit="cover"
        />

        <button type="button">
          <Image
            src="/play.svg"
            alt="Tocar episódio"
            width={32}
            height={32}
          />
        </button>
      </section>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationString}</span>
      </header>

      <main
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </article>
  );
}

export default EpisodePage;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await apiService('/episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const paths = data.map((e) => ({
    params: {
      slug: e.id,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;
  const { data } = await apiService.get(`/episodes/${slug}`);

  return {
    props: {
      episode: {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
          locale: ptBR
        }),
        duration: data.file.duration,
        durationString: durationToTime(data.file.duration),
        description: data.description,
        url: data.file.url,
      }
    },
    revalidate: 60 * 60 * 24,
  }
}