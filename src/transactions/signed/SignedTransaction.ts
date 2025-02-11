import { Autorization } from '../../entities/Autorization'
import { RawAction } from '../../entities/RawAction'
import { RawTransaction } from '../../entities/RawTransaction'
import { Transactions } from '../Transactions'

export abstract class SignedTransaction extends Transactions {

  public static prepareResponse(
    result: { transaction_id: string, processed: { block_num: number, action_traces: Array<{ receipt: { response: string }}>} } | any,
    includeTrxId: boolean = false,
  ): any {
    if (result.processed) {
      const processed = SignedTransaction.parseProcessedResult(result.processed)
      return {
          block_num: result.processed.block_num,
          transaction_id: result.transaction_id,
          ...processed,
        }

    }
    return result
  }

  public static parseProcessedResult(processed: { action_traces: Array<{ receipt: { response: string }}>}) {
    try {
      return JSON.parse(processed.action_traces[0].receipt.response)
    } catch (e) {
      console.error(e)
    }

    return {}
  }

  public abstract ENDPOINT: string
  public abstract ACTION: string
  public abstract ACCOUNT: string

  public abstract getData(): any

  public async execute(privateKey: string, publicKey: string, dryRun = false): Promise<any> {
    this.privateKey = privateKey
    this.publicKey = publicKey

    const rawTransaction = new RawTransaction()
    const rawaction = new RawAction()
    rawaction.account = this.getAccount()
    const actor = await this.getActor()

    rawaction.authorization.push(new Autorization(actor))
    rawaction.account = this.getAccount()
    rawaction.name = this.getAction()
    rawaction.data = this.getData()
    rawTransaction.actions.push(rawaction)
    const result = await this.pushToServer(rawTransaction, this.getEndPoint(), dryRun)
    return this.prepareResponse(result)
  }

  public prepareResponse(result: { processed: { action_traces: Array<{ receipt: { response: string }}>} } | any): any {
    return SignedTransaction.prepareResponse(result)
  }

  public getAction(): string {
    return this.ACTION
  }

  public getAccount(): string {
    return this.ACCOUNT
  }

  public getEndPoint(): string {
    return this.ENDPOINT
  }
}
