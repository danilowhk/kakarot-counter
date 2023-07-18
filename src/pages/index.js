import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
// Import just a few select items
import { BrowserProvider, parseUnits } from "ethers";

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "retrieve",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]


export default function Home() {
  const [account, setAccount] = useState(null)
  const [number, setNumber] = useState(0)
  const [storedNumber, setStoredNumber] = useState(null)
  const [status, setStatus] = useState('')

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
    } else {
      setStatus('Metamask is not installed. Please install it first.')
    }
  }

  async function storeNumber() {
    if (!window.ethereum) {
      setStatus('Please connect to MetaMask.')
      return
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const transaction = await contract.store(number)
      setStatus('Transaction sent, waiting for confirmation...')
  
      await transaction.wait()
      setStatus('Transaction confirmed, number stored!')

      // Update the stored number
      retrieveNumber()
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }
  }

  async function retrieveNumber() {
    if (!window.ethereum) {
      setStatus('Please connect to MetaMask.')
      return
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, contractABI, provider)
  
      const number = await contract.retrieve()
      setStoredNumber(number.toString())
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }
  }

  useEffect(() => {
    if (account) {
      retrieveNumber()
    }
  }, [account])

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <img src="/dbz-logo.svg" className="h-21 sm:h-24" />
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {account ? (
                  <>
                    <p className="font-bold text-2xl">Connected Account:</p>
                    <p className="text-orange-600 text-2xl truncate hover:overflow-visible" title={account}>{account}</p>
                    <input
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="mt-8 border rounded-lg px-3 py-2 w-full"
                    />
                    <button onClick={storeNumber} className="mt-8 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
                      Store Number
                    </button>
                    <p className="mt-8">Stored Number: <span className="font-bold">{storedNumber}</span></p>
                  </>
                ) : (
                  <button onClick={connectWallet} className="mt-8 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
                    Connect Wallet
                  </button>
                )}
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>{status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
}
