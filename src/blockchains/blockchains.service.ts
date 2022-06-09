import { Injectable } from '@nestjs/common';
import { BigchaindbAdapter } from './adapters/bigchain.adapter';

@Injectable()
export class BlockchainsService {
  private bigchaindbAdapter = new BigchaindbAdapter();

  async createTransaction(event, product) {
    return await this.bigchaindbAdapter.createTransaction(event, product);
  }

  async getAssets(productId) {
    return await this.bigchaindbAdapter.getAssets(productId);
  }

  async getTransactions(id) {
    return await this.bigchaindbAdapter.getTransactions(id);
  }

  async generateKeys() {
    return await this.bigchaindbAdapter.generateKeys();
  }

  // Verfify the authenticity of events from a product id
  // Return the events with the tag 'verified'
  async certifyEvents(productId) {
    return await this.bigchaindbAdapter.certifyEvents(productId);
  }

  // Verfify the authenticity of a public key
  async certifyPublicKey(id) {
    return await this.bigchaindbAdapter.certifyPublicKey(id);
  }
}
