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

const privateKey = '5JHy4Q5P1FvqTsfRBzbHVTFE83LepHvmQyjRt1AW677tazuZ4ne'
const publicKey = 'FIO6QhxLWAVaydsgbGWYaS9rcVBMytHK34jDkTWdboSspCKMaYDmB'
// 5KTnvc9BwSoWNfowKL4D54yEAJwyshn3abyDBW8DGQjQwT2orT8
// FIO6kWGTVSftKN3FwgiqDGoEwFKHoM7z5CG2rPL3XFTGiAjoLBfTJ


const baseUrl = 'https://fiotestnet.blockpane.com/v1/'

const timeout = async (ms) => {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const payeefioAddress = 'jshuo@fiotestnet'
const payerfioAddress = 'secux@fiotestnet'

const defaultFee = 800 * fio.FIOSDK.SUFUnit

async function main () {

	const fioSdk = new fio.FIOSDK(privateKey, publicKey, baseUrl, fetchJson)

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
        
        
        
            const transferAmount = 1000000000   // 100 FIO
        
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
    await timeout(4000)
	  result = await fioSdk.genericAction('registerFioDomain', { fioDomain: 'testing-domain-1630870012'
    , maxFee: 800000000000 })


}

main()
