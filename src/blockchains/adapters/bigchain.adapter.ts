import { Ed25519Keypair, Transaction, Connection } from 'bigchaindb-driver';

export class BigchaindbAdapter {
  async createTransaction(event, product) {
    const tx = Transaction.makeCreateTransaction(
      // Store the event, the product, and a timestamp
      { event: event, product: product, created_at: new Date().toString() },

      // Metadata contains information about the transaction itself
      // (can be `null` if not needed)
      { what: event.content },

      // A transaction needs an output
      [
        Transaction.makeOutput(
          Transaction.makeEd25519Condition(process.env.public_key),
        ),
      ],
      process.env.public_key,
    );

    const txSigned = Transaction.signTransaction(tx, process.env.private_key);

    const conn = new Connection(process.env.API_PATH);

    return await conn
      .postTransactionCommit(txSigned)
      .then((retrievedTx) => retrievedTx);
  }

  async getTransactions(productId) {
    const conn = new Connection(process.env.API_PATH);

    return await conn.searchAssets(productId).then((assets) => assets);
  }

  // Dev options, use to generate an ed25519 keypair
  // Normally keys should be buy on the internet (AKA wallet) but with bigchain service we can generate them with dev-tools
  async generateKeys() {
    return await new Ed25519Keypair();
  }
}
