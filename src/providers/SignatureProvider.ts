export interface SignatureProvider {
  prepareTransaction: string
  prepareTransactionWithHardwareSign:string
  accountHash: string
}
