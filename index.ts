import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'


const rpc = 'https://opbnb-mainnet-rpc.bnbchain.org'
const pk = '' // private key
const batch = 6 // how many transactions to send in concurrent
const limit = Infinity // how many transactions to send in total

async function main() {
  const opBNB = new ethers.providers.JsonRpcProvider(rpc)
  const wallet = new ethers.Wallet(pk, opBNB)
  while (true) {
    try {
      const nonce = await opBNB.getTransactionCount(wallet.address)
      for (let i = 0; i < limit; i += batch) {
        const requests: Promise<unknown>[] = []
        for (let j = 0; j < batch; j++) {
          requests.push(
            wallet
              .sendTransaction({
                to: '0x83b978cf73ee1d571b1a2550c5570861285af337',
                data: '0x646174613a6170706c69636174696f6e2f6a736f6e2c7b2270223a226f70627263222c226f70223a226d696e74222c227469636b223a226f70626e227d',
                nonce: nonce + i + j,
                gasLimit: 22000,
                maxFeePerGas: parseUnits('15', 'wei'),
                maxPriorityFeePerGas: parseUnits('10', 'wei'),
              })
              .then(tx => {
                console.log(`[${dayjs().format('DD.MM.YYYY HH:mm.ss.SSS')}] ${nonce + i + j} https://opbnbscan.com/tx/${tx.hash}`)
              }),
          )
          await new Promise(resolve => setTimeout(resolve, 64))
        }
        await Promise.all(requests)
      }
    } catch (e) {
      console.log(e)
      console.log('sleep 15s')
      await new Promise(resolve => setTimeout(resolve, 15000))
    }
  }
}

main()
