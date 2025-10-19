'use client'

import { useAccount, useSignMessage, useBalance, useSwitchChain } from 'wagmi'
import { useState, useEffect } from 'react'
import { verifyMessage } from 'viem'
import { base } from '@reown/appkit/networks'

export default function Home() {
  const { address, isConnected, chain } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { switchChain } = useSwitchChain()
  const { data: balance } = useBalance({
    address: address,
  })

  const [message, setMessage] = useState('')
  const [signedMessage, setSignedMessage] = useState('') // Store the message that was actually signed
  const [signature, setSignature] = useState('')
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [wrongNetwork, setWrongNetwork] = useState(false)

  // Check if user is on Base network
  useEffect(() => {
    if (isConnected && chain) {
      setWrongNetwork(chain.id !== base.id && chain.id !== 84532) // 84532 is Base Sepolia
    }
  }, [chain, isConnected])

  const handleSignMessage = async () => {
    if (!message.trim()) {
      alert('Please enter a message to sign')
      return
    }

    setIsSigning(true)
    setIsVerified(null)
    setSignature('')

    try {
      const sig = await signMessageAsync({ message })
      setSignature(sig)
      setSignedMessage(message) // Store the exact message that was signed
      setIsVerified(null)
    } catch (error) {
      console.error('Error signing message:', error)
      alert('Failed to sign message')
    } finally {
      setIsSigning(false)
    }
  }

  const handleVerifySignature = async () => {
    if (!signature || !address || !signedMessage) return

    setIsVerifying(true)

    try {
      const valid = await verifyMessage({
        address,
        message: signedMessage, // Use the original signed message
        signature: signature as `0x${string}`,
      })
      setIsVerified(valid)
    } catch (error) {
      console.error('Error verifying signature:', error)
      setIsVerified(false)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSwitchToBase = async () => {
    try {
      await switchChain({ chainId: base.id })
    } catch (error) {
      console.error('Error switching chain:', error)
      alert('Failed to switch to Base network')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Base Wallet Connect
          </h1>
          <p className="text-gray-600 text-lg">
            Connect your wallet to Base network and sign messages securely
          </p>
        </header>

        {/* Connect Wallet Button */}
        <div className="flex justify-center mb-8">
          <appkit-button />
        </div>

        {/* Wrong Network Warning */}
        {isConnected && wrongNetwork && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 mb-1">Wrong Network</h3>
                <p className="text-yellow-700 mb-3">
                  You are connected to {chain?.name}. Please switch to Base network to continue.
                </p>
                <button
                  onClick={handleSwitchToBase}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Switch to Base
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Info */}
        {isConnected && !wrongNetwork && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Information
            </h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1 font-medium">Connected Address</p>
                <p className="text-lg font-mono text-gray-800 break-all">{address}</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1 font-medium">Balance</p>
                <p className="text-lg font-semibold text-gray-800">
                  {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1 font-medium">Network</p>
                <p className="text-lg font-semibold text-gray-800">{chain?.name || 'Unknown'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Message Section */}
        {isConnected && !wrongNetwork && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Sign Message
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
                  rows={4}
                />
              </div>

              <button
                onClick={handleSignMessage}
                disabled={!message.trim() || isSigning}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isSigning ? 'Signing...' : 'Sign Message'}
              </button>

              {signature && (
                <div className="mt-6 space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-medium text-blue-700 mb-2">Signed Message</p>
                    <p className="text-sm text-blue-900 break-words">{signedMessage}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Signature</p>
                    <p className="text-xs font-mono text-gray-600 break-all">{signature}</p>
                  </div>

                  <button
                    onClick={handleVerifySignature}
                    disabled={isVerifying}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Signature'}
                  </button>

                  {isVerified !== null && (
                    <div className={`rounded-lg p-4 ${isVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        {isVerified ? (
                          <>
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold text-green-800">Signature Verified!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold text-red-800">Verification Failed</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not Connected State */}
        {!isConnected && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600">
              Click the button above to connect your wallet and start using the app
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with Reown AppKit + Wagmi + Base Network</p>
        </footer>
      </div>
    </main>
  )
}
