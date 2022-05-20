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
}
