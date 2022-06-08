import { Injectable } from '@nestjs/common';
import { BigchaindbAdapter } from './adapters/bigchain.adapter';

@Injectable()
export class BlockchainsService {
  private bigchaindbAdapter = new BigchaindbAdapter();

  async createTransaction(event, product) {
    return await this.bigchaindbAdapter.createTransaction(event, product);
  }

  async getTransactions(productId) {
    return await this.bigchaindbAdapter.getTransactions(productId);
  }

  async generateKeys() {
    return await this.bigchaindbAdapter.generateKeys();
  }

  // Verfify the authenticity of events from a product id
  // Return the events with the tag 'verified'
  async verifyEvents(productId) {
    return await this.bigchaindbAdapter.verifyEvents(productId);
  }

  // Verfify the authenticity of a public key
  async verifyPublicKey(id) {
    return await this.bigchaindbAdapter.verifyPublicKey(id);
  }

  async test(id) {
    return await this.bigchaindbAdapter.test(id);
  }
}
