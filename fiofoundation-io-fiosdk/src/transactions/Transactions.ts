import { Fio } from 'fiojs'
import { TextDecoder, TextEncoder } from 'text-encoding'
import { AbiResponse } from '../entities/AbiResponse'
import { RawTransaction } from '../entities/RawTransaction'
import { ValidationError } from '../entities/ValidationError'
import { validate } from '../utils/validation'

type FetchJson = (uri: string, opts?: Object) => Object
const textEncoder: TextEncoder = new TextEncoder()
const textDecoder: TextDecoder = new TextDecoder()

export class Transactions {
  public static baseUrl: string
  public static abiMap: Map<string, AbiResponse> = new Map<string, AbiResponse>()
  public static FioProvider: {
    prepareTransaction(param: any): Promise<any>;
    accountHash(pubkey: string): string
  }

  public static fetchJson: FetchJson
  public publicKey: string = ''
  public privateKey: string = ''
  public serilizeEndpoint: string = 'chain/serialize_json'

  public validationData: object = {}
  public validationRules: object | null = null

  public getActor(publicKey: string = ''): string {
    const actor = Transactions.FioProvider.accountHash((publicKey == '') ? this.publicKey : publicKey)
    return actor
  }

  public async getChainInfo(): Promise<any> {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }
    const res = await Transactions.fetchJson(Transactions.baseUrl + 'chain/get_info', options)
    return res
  }

  public async getBlock(chain: any): Promise<any> {
    if (chain == undefined) {
      throw new Error('chain undefined')
    }
    if (chain.last_irreversible_block_num == undefined) {
      throw new Error('chain.last_irreversible_block_num undefined')
    }
    const res = await Transactions.fetchJson(Transactions.baseUrl + 'chain/get_block', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        block_num_or_id: chain.last_irreversible_block_num,
      }),
    })
    return res
  }

  public async pushToServer(transaction: RawTransaction, endpoint: string, dryRun: boolean): Promise<any> {
    const privky: string[] = new Array<string>()
    privky.push(this.privateKey)
    const chain = await this.getChainInfo().catch((error) => console.error('chain:: ' + error))
    const block = await this.getBlock(chain).catch((error) => console.error('block: ' + error))
    transaction.ref_block_num = block.block_num & 0xFFFF
    transaction.ref_block_prefix = block.ref_block_prefix
    const expiration = new Date(block.timestamp + 'Z')
    expiration.setSeconds(expiration.getSeconds() + 1200)
    const expirationStr = expiration.toISOString()
    transaction.expiration = expirationStr.substr(0, expirationStr.length - 1)
    if (dryRun) {
      return Transactions.FioProvider.prepareTransaction({
        transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
        textDecoder: new TextDecoder(), textEncoder: new TextEncoder(),
      })
    } else {
      const signedTransaction = await Transactions.FioProvider.prepareTransaction({
        transaction, chainId: chain.chain_id, privateKeys: privky, abiMap: Transactions.abiMap,
        textDecoder: new TextDecoder(), textEncoder: new TextEncoder(),
      })
      return this.executeCall(endpoint, JSON.stringify(signedTransaction))
    }

  }

  public executeCall(endPoint: string, body: string, fetchOptions?: any): any {
    let options: any
    this.validate()
    if (fetchOptions != null) {
      options = fetchOptions
      if (body != null) {
        options.body = body
      }
    } else {
      options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body,
      }
    }
    /* const res =  Transactions.fetchJson(Transactions.baseUrl + endPoint,options)
    return res*/
    return Transactions.fetchJson(Transactions.baseUrl + endPoint, options)
  }

  public getCipherContent(contentType: string, content: any, privateKey: string, publicKey: string) {
    const cipher = Fio.createSharedCipher({ privateKey, publicKey, textEncoder, textDecoder })
    return cipher.encrypt(contentType, content)
  }

  public getUnCipherContent(contentType: string, content: any, privateKey: string, publicKey: string) {
    const cipher = Fio.createSharedCipher({ privateKey, publicKey, textEncoder, textDecoder })
    return cipher.decrypt(contentType, content)
  }

  public validate() {
    if (this.validationRules) {
      const validation = validate(this.validationData, this.validationRules)
      if (!validation.isValid) {
        throw new ValidationError(validation.errors, `Validation error`)
      }
    }
  }
}
