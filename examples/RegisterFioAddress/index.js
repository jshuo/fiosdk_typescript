/*
This is an example, of how to instantiate the FIOSDK and register a fio address.

Use testnet to register your private/public keys and fund your account.

See the main readme.md for complete details on how to work with testnet:
https://github.com/fioprotocol/fiosdk_typescript/blob/master/README.md

*/

const fio = require('@fioprotocol/fiosdk');

fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}
// let privateKey = '5JHy4Q5P1FvqTsfRBzbHVTFE83LepHvmQyjRt1AW677tazuZ4ne',
//   publicKey = 'FIO6QhxLWAVaydsgbGWYaS9rcVBMytHK34jDkTWdboSspCKMaYDmB',
const privateKey = '5KDEgao6gCx8KvCgJVn5Nm6W4X9EkS8Uap4QydX2yezZrvkT9E6'
const publicKey = 'FIO5QvSU16Z6h57WhfqBJ1z1TrLUvUW5etmeHygfGhDFz6mQiJdcE'
// Public Key: FIO5QvSU16Z6h57WhfqBJ1z1TrLUvUW5etmeHygfGhDFz6mQiJdcE
// Private key: 5KDEgao6gCx8KvCgJVn5Nm6W4X9EkS8Uap4QydX2yezZrvkT9E6

// FIO Internal Account (actor name): 5tfohgxic314


const generateTestingFioDomain = () => {
  return `testing-domain-${Math.floor(Math.random() * 1000)}`
}


const baseUrl = 'https://fiotestnet.blockpane.com/v1/'

const timeout = async (ms) => {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const payerfioAddress = 'jshuo@fiotestnet'
const payeefioAddress = 'secux@fiotestnet'

const defaultFee = 800 * fio.FIOSDK.SUFUnit

async function main() {

  const fioSdk = new fio.FIOSDK(privateKey, publicKey, baseUrl, fetchJson)
  const newFioDomain = generateTestingFioDomain()
  // console.log("")
  // console.log("Register this FIO Address:")
  // console.log(fioAddress)
  // console.log("")

  // const result = await fioSdk.registerFioAddress (fioAddress, defaultFee)

  // console.log ("Registration Results: ")
  // console.log(result)

  // const result = await fioSdk.registerFioDomain ('secux', defaultFee, fioAddress)
  // const result = await fioSdk.getTechnologyProviderId (fioAddress)
  let result = await fioSdk.getPublicAddress(payeefioAddress, "FIO", "FIO")
  const { fee } = await fioSdk.getFee('transfer_tokens_pub_key');
  console.log(result)
    try {
        const { public_address: payeePublicKey } = await fioSdk.getPublicAddress(payeefioAddress, "FIO", "FIO")



        const transferAmount = 168000000   // 1 FIO

        result = await fioSdk.pushTransaction(
            'fio.token',
            'trnsfiopubky',
            {
                payee_public_key: payeePublicKey,
                amount: transferAmount,
                max_fee: fee,
                tpid: payerfioAddress
            }
        )
  console.log(result)
    } catch (e) {
      console.log(e);
    }
  // await timeout(4000)
  // console.log(newFioDomain)
  // result = await fioSdk.genericAction('registerFioDomain', {
  //   fioDomain: newFioDomain
  //   , maxFee: fee
  // })
  // console.log(result)


}

main()
