declare module '@solana/web3.js' {
  export class Connection {
    constructor(endpoint: string);
  }

  export class PublicKey {
    constructor(key: string);
    toBase58(): string;
  }

  export class Keypair {
    publicKey: PublicKey;
  }

  export class Transaction {
    add(...args: any[]): void;
  }
} 