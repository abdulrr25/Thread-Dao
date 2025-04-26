import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const IPFS_API_URL = 'https://ipfs.infura.io:5001/api/v0';
const IPFS_GATEWAY_URL = 'https://ipfs.infura.io/ipfs';

export const uploadToIPFS = async (file: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file));

    const response = await axios.post(`${IPFS_API_URL}/add`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Basic ${Buffer.from(
          `${process.env.IPFS_API_KEY}:${process.env.IPFS_API_SECRET}`
        ).toString('base64')}`,
      },
    });

    const hash = response.data.Hash;
    return `${IPFS_GATEWAY_URL}/${hash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};

export const getFromIPFS = async (hash: string): Promise<string> => {
  try {
    const response = await axios.get(`${IPFS_GATEWAY_URL}/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch file from IPFS');
  }
}; 