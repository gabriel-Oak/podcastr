import { episodes as episodesJson } from '../../../utils/episodes.json';
import { RawEpisode } from '../../../interfaces/episode';
import { NextApiRequest, NextApiResponse } from 'next';

interface Params {
  id: string;
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as unknown as Params;
  const episode = episodesJson.find((e: RawEpisode) => e.id === id);

  return res.status(200).json(episode);
}

export default handler;