import { create } from 'ipfs-http-client';
import type { NextApiRequest, NextApiResponse } from 'next'

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { content } = req.body;
      const result = await ipfs.add(JSON.stringify(content));
      res.status(200).json({ uri: `ipfs://${result.path}` });
    } catch (error) {
      res.status(500).json({ error: 'Error uploading to IPFS' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}