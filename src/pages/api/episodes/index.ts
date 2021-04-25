import { episodes as episodesJson } from '../../../utils/episodes.json';
import { RawEpisode } from '../../../interfaces/episode';
import { NextApiRequest, NextApiResponse } from 'next';

interface Params {
  _limit: number;
  _sort: string;
  _order: string;
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { _limit = episodesJson.length, _sort, _order = 'desc' } = req.query as unknown as Params;
  const episodes = episodesJson;

  if (_sort) {
    episodes.sort((a: RawEpisode, b: RawEpisode) => {
      if (a[_sort] === b[_sort]) return 0;
      if (a[_sort] < b[_sort]) return _order === 'asc' ? -1 : 1;
      return _order === 'asc' ? 1 : -1;
    });
  }

  return res.status(200).json(episodes.slice(0, _limit - 1));
}

export default handler;