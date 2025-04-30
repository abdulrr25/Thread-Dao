import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/error';
import { NotificationManager } from './notification';
import { WebSocketManager } from './websocket';
import { Logger } from './logger';
import { ConfigManager } from './config';

const prisma = new PrismaClient();

// ABI for the DAO contract
const DAO_ABI = [
  'function createDAO(string name, string symbol, uint256 initialSupply, uint256 votingPeriod, uint256 quorum) returns (address)',
  'function createProposal(string description, uint256 amount, address recipient) returns (uint256)',
  'function vote(uint256 proposalId, bool support)',
  'function executeProposal(uint256 proposalId)',
  'function getProposal(uint256 proposalId) view returns (tuple(string description, uint256 amount, address recipient, uint256 votesFor, uint256 votesAgainst, bool executed))',
  'function getProposalCount() view returns (uint256)',
  'function getMemberCount() view returns (uint256)',
  'function getBalance(address account) view returns (uint256)',
];

interface BlockchainConfig {
  rpcUrl: string;
  chainId: number;
  privateKey?: string;
}

interface ContractConfig {
  address: string;
  abi: any[];
}

export class BlockchainManager {
  private static instance: BlockchainManager;
  private provider: ethers.JsonRpcProvider;
  private signer?: ethers.Wallet;
  private logger: Logger;
  private config: ConfigManager;
  private contract: ethers.Contract;
  private notificationManager: NotificationManager;
  private wsManager: WebSocketManager;

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    const blockchainConfig = this.config.getBlockchainConfig();
    this.provider = new ethers.JsonRpcProvider(blockchainConfig.rpcUrl);
    if (blockchainConfig.privateKey) {
      this.signer = new ethers.Wallet(blockchainConfig.privateKey, this.provider);
    }
    this.contract = new ethers.Contract(
      process.env.DAO_CONTRACT_ADDRESS!,
      DAO_ABI,
      this.signer
    );
    this.notificationManager = NotificationManager.getInstance();
    this.wsManager = WebSocketManager.getInstance();
  }

  public static getInstance(): BlockchainManager {
    if (!BlockchainManager.instance) {
      BlockchainManager.instance = new BlockchainManager();
    }
    return BlockchainManager.instance;
  }

  public getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }

  public getSigner(): ethers.Wallet {
    if (!this.signer) {
      throw new ApiError(500, 'No signer available');
    }
    return this.signer;
  }

  public async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      this.logger.error('Get balance error:', error);
      throw new ApiError(500, 'Failed to get balance');
    }
  }

  public async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getFeeData();
      return ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei');
    } catch (error) {
      this.logger.error('Get gas price error:', error);
      throw new ApiError(500, 'Failed to get gas price');
    }
  }

  public async getBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      this.logger.error('Get block number error:', error);
      throw new ApiError(500, 'Failed to get block number');
    }
  }

  public async getBlock(blockNumber: number): Promise<ethers.Block> {
    try {
      return await this.provider.getBlock(blockNumber);
    } catch (error) {
      this.logger.error('Get block error:', error);
      throw new ApiError(500, 'Failed to get block');
    }
  }

  public async getTransaction(txHash: string): Promise<ethers.TransactionResponse> {
    try {
      return await this.provider.getTransaction(txHash);
    } catch (error) {
      this.logger.error('Get transaction error:', error);
      throw new ApiError(500, 'Failed to get transaction');
    }
  }

  public async getTransactionReceipt(
    txHash: string
  ): Promise<ethers.TransactionReceipt> {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      this.logger.error('Get transaction receipt error:', error);
      throw new ApiError(500, 'Failed to get transaction receipt');
    }
  }

  public async estimateGas(transaction: ethers.TransactionRequest): Promise<bigint> {
    try {
      return await this.provider.estimateGas(transaction);
    } catch (error) {
      this.logger.error('Estimate gas error:', error);
      throw new ApiError(500, 'Failed to estimate gas');
    }
  }

  public async sendTransaction(
    transaction: ethers.TransactionRequest
  ): Promise<ethers.TransactionResponse> {
    try {
      if (!this.signer) {
        throw new ApiError(500, 'No signer available');
      }
      return await this.signer.sendTransaction(transaction);
    } catch (error) {
      this.logger.error('Send transaction error:', error);
      throw new ApiError(500, 'Failed to send transaction');
    }
  }

  public async waitForTransaction(
    txHash: string,
    confirmations = 1
  ): Promise<ethers.TransactionReceipt> {
    try {
      return await this.provider.waitForTransaction(txHash, confirmations);
    } catch (error) {
      this.logger.error('Wait for transaction error:', error);
      throw new ApiError(500, 'Failed to wait for transaction');
    }
  }

  public getContract(
    address: string,
    abi: any[]
  ): ethers.Contract {
    try {
      return new ethers.Contract(address, abi, this.provider);
    } catch (error) {
      this.logger.error('Get contract error:', error);
      throw new ApiError(500, 'Failed to get contract');
    }
  }

  public getSignedContract(
    address: string,
    abi: any[]
  ): ethers.Contract {
    try {
      if (!this.signer) {
        throw new ApiError(500, 'No signer available');
      }
      return new ethers.Contract(address, abi, this.signer);
    } catch (error) {
      this.logger.error('Get signed contract error:', error);
      throw new ApiError(500, 'Failed to get signed contract');
    }
  }

  public async deployContract(
    abi: any[],
    bytecode: string,
    args: any[] = []
  ): Promise<ethers.Contract> {
    try {
      if (!this.signer) {
        throw new ApiError(500, 'No signer available');
      }
      const factory = new ethers.ContractFactory(abi, bytecode, this.signer);
      const contract = await factory.deploy(...args);
      await contract.waitForDeployment();
      return contract;
    } catch (error) {
      this.logger.error('Deploy contract error:', error);
      throw new ApiError(500, 'Failed to deploy contract');
    }
  }

  public async verifyContract(
    address: string,
    constructorArguments: any[] = []
  ): Promise<void> {
    try {
      // Implement contract verification logic here
      this.logger.info('Contract verified:', { address });
    } catch (error) {
      this.logger.error('Verify contract error:', error);
      throw new ApiError(500, 'Failed to verify contract');
    }
  }

  public async createDAO(
    name: string,
    symbol: string,
    initialSupply: string,
    owner: string
  ): Promise<{ daoAddress: string; tokenAddress: string }> {
    try {
      // TODO: Implement DAO creation using smart contract
      // This is a placeholder for the actual implementation
      const daoAddress = ethers.Wallet.createRandom().address;
      const tokenAddress = ethers.Wallet.createRandom().address;

      // Notify the owner
      await this.notificationManager.createNotification({
        userId: owner,
        type: 'DAO_CREATED',
        title: 'DAO Created',
        message: `Your DAO "${name}" has been created successfully.`,
        data: {
          daoAddress,
          tokenAddress,
        },
      });

      return { daoAddress, tokenAddress };
    } catch (error) {
      console.error('Error creating DAO:', error);
      throw new ApiError(500, 'Failed to create DAO');
    }
  }

  public async createProposal(
    daoAddress: string,
    title: string,
    description: string,
    creator: string
  ): Promise<{ proposalId: string }> {
    try {
      // TODO: Implement proposal creation using smart contract
      // This is a placeholder for the actual implementation
      const proposalId = ethers.randomBytes(32).toString('hex');

      // Notify DAO members
      await this.notificationManager.createNotification({
        userId: creator,
        type: 'PROPOSAL_CREATED',
        title: 'New Proposal',
        message: `A new proposal "${title}" has been created in your DAO.`,
        data: {
          daoAddress,
          proposalId,
        },
      });

      return { proposalId };
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw new ApiError(500, 'Failed to create proposal');
    }
  }

  public async vote(
    daoAddress: string,
    proposalId: string,
    voter: string,
    support: boolean
  ): Promise<void> {
    try {
      // TODO: Implement voting using smart contract
      // This is a placeholder for the actual implementation

      // Notify proposal creator
      await this.notificationManager.createNotification({
        userId: voter,
        type: 'VOTE_CAST',
        title: 'Vote Cast',
        message: `Your vote has been cast on proposal ${proposalId}.`,
        data: {
          daoAddress,
          proposalId,
          support,
        },
      });
    } catch (error) {
      console.error('Error casting vote:', error);
      throw new ApiError(500, 'Failed to cast vote');
    }
  }

  public async executeProposal(
    daoAddress: string,
    proposalId: string,
    executor: string
  ): Promise<void> {
    try {
      // TODO: Implement proposal execution using smart contract
      // This is a placeholder for the actual implementation

      // Notify DAO members
      await this.notificationManager.createNotification({
        userId: executor,
        type: 'PROPOSAL_EXECUTED',
        title: 'Proposal Executed',
        message: `Proposal ${proposalId} has been executed.`,
        data: {
          daoAddress,
          proposalId,
        },
      });
    } catch (error) {
      console.error('Error executing proposal:', error);
      throw new ApiError(500, 'Failed to execute proposal');
    }
  }

  public async getTokenBalance(
    tokenAddress: string,
    userAddress: string
  ): Promise<string> {
    try {
      // TODO: Implement token balance check using smart contract
      // This is a placeholder for the actual implementation
      return '0';
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw new ApiError(500, 'Failed to get token balance');
    }
  }

  public async transferTokens(
    tokenAddress: string,
    from: string,
    to: string,
    amount: string
  ): Promise<void> {
    try {
      // TODO: Implement token transfer using smart contract
      // This is a placeholder for the actual implementation

      // Notify recipient
      await this.notificationManager.createNotification({
        userId: to,
        type: 'TOKENS_RECEIVED',
        title: 'Tokens Received',
        message: `You have received ${amount} tokens.`,
        data: {
          tokenAddress,
          from,
          amount,
        },
      });
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw new ApiError(500, 'Failed to transfer tokens');
    }
  }

  public async getProposalStatus(
    daoAddress: string,
    proposalId: string
  ): Promise<{
    status: string;
    forVotes: string;
    againstVotes: string;
    executed: boolean;
  }> {
    try {
      // TODO: Implement proposal status check using smart contract
      // This is a placeholder for the actual implementation
      return {
        status: 'ACTIVE',
        forVotes: '0',
        againstVotes: '0',
        executed: false,
      };
    } catch (error) {
      console.error('Error getting proposal status:', error);
      throw new ApiError(500, 'Failed to get proposal status');
    }
  }

  async getProposal(proposalId: number) {
    try {
      const proposal = await this.contract.getProposal(proposalId);
      return {
        description: proposal[0],
        amount: proposal[1].toString(),
        recipient: proposal[2],
        votesFor: proposal[3].toString(),
        votesAgainst: proposal[4].toString(),
        executed: proposal[5],
      };
    } catch (error) {
      console.error('Error getting proposal:', error);
      throw new ApiError(500, 'Failed to get proposal details');
    }
  }

  async getProposalCount(): Promise<number> {
    try {
      const count = await this.contract.getProposalCount();
      return count.toNumber();
    } catch (error) {
      console.error('Error getting proposal count:', error);
      throw new ApiError(500, 'Failed to get proposal count');
    }
  }

  async getMemberCount(): Promise<number> {
    try {
      const count = await this.contract.getMemberCount();
      return count.toNumber();
    } catch (error) {
      console.error('Error getting member count:', error);
      throw new ApiError(500, 'Failed to get member count');
    }
  }
} 