import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  throw new Error('Missing Pinata API keys');
}

export const ipfsService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY,
          },
        }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  },

  async uploadJSON(data: any): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY,
          },
        }
      );

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  },

  getGatewayUrl(ipfsUrl: string): string {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  },
}; 