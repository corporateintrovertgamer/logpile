import { useState } from 'react'
import { ShieldCheck, Key, Code, Coffee, CupSoda, Github, Copy, Check, Heart, ExternalLink } from 'lucide-react'

export function AboutView() {
  const [copiedKey, setCopiedKey] = useState(null)

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => {
      setCopiedKey(null)
    }, 2000)
  }

  const cryptoWallets = [
    { key: 'btc', name: 'Bitcoin', symbol: 'BTC', address: 'bc1qcf9f3fd5q5n9gxkjz5fh74qgdv2dgryqkkdmlk' },
    { key: 'eth', name: 'Ethereum', symbol: 'ETH', address: '0xE3e9e4Dfb4c87B6101700c70F73790a903f92Ef0' },
    { key: 'usdt', name: 'Tether USD', symbol: 'USDT (ERC-20)', address: '0xE3e9e4Dfb4c87B6101700c70F73790a903f92Ef0' },
    { key: 'sol', name: 'Solana', symbol: 'SOL', address: 'F8aPJG3tUtbLHbhdfxeNFmcv8b2GK7anY3EmTr6CcHkS' },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto px-8 py-10 fade-in custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">
                Logpile Desktop <span className="text-[var(--text-muted)] font-normal text-2xl">Version 1.0.0</span>
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mt-1">An offline-first, local game library manager.</p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Current version: 1.0.0</span>
                <a
                  href="https://github.com/corporateintrovertgamer/logpile/releases"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <span>Check for updates</span>
                  <ExternalLink size={13} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                </a>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Opens the releases page on GitHub in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Support the Developer */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-rose-400 border-b border-[var(--border-color)] pb-2">
            <Heart size={24} />
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Support the Developer</h2>
          </div>
          <p className="text-[var(--text-secondary)]">
            Logpile is free, open source, and offline-first without ads or tracking. If it helps you organize your collection, consider supporting independent development.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://ko-fi.com/corporateintrovertgamer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-5 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] hover:border-amber-500/50 rounded-xl transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Coffee size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Ko-fi</h3>
                  <p className="text-xs text-[var(--text-muted)]">Tip or buy a coffee</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
            </a>

            <a
              href="https://buymeacoffee.com/Corporateintrovertgamer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-5 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] hover:border-yellow-500/50 rounded-xl transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CupSoda size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Buy Me a Coffee</h3>
                  <p className="text-xs text-[var(--text-muted)]">One-time donation</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
            </a>

            <a
              href="https://github.com/corporateintrovertgamer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-5 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] hover:border-purple-500/50 rounded-xl transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Github size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">GitHub Sponsors</h3>
                  <p className="text-xs text-[var(--text-muted)]">Sponsor on GitHub</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
            </a>
          </div>

          {/* Crypto Wallets */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              Crypto Donations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cryptoWallets.map((wallet) => {
                const isCopied = copiedKey === wallet.key
                return (
                  <div key={wallet.key} className="p-4 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[var(--text-primary)]">{wallet.name}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)]">
                        {wallet.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <code className="text-xs text-[var(--text-muted)] truncate select-all font-mono">
                        {wallet.address}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(wallet.key, wallet.address)}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)] transition-colors shrink-0 cursor-pointer"
                        title="Copy address"
                      >
                        {isCopied ? (
                          <>
                            <Check size={13} className="text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>


        </section>

        {/* Legal Disclaimer */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[var(--accent-color)] border-b border-[var(--border-color)] pb-2">
            <ShieldCheck size={24} />
            <h2 className="text-2xl font-semibold">Legal Disclaimer & Privacy</h2>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-color)]">
            <p>
              Logpile is an offline-first library manager designed to organize locally installed applications. 
              <strong> Logpile does not provide, distribute, or host any game files, and does not condone piracy.</strong> Users must legally own and provide their own software.
            </p>
            <p>
              Internet connectivity is solely used to query public APIs (IGDB and SteamGridDB) to retrieve metadata and artwork for the user's personal display. 
              Logpile does not collect, store, or transmit telemetry or personal data to any external servers. All library data is stored locally on your machine.
            </p>
            <p>
              All game titles, artwork, logos, and trademarks are the property of their respective copyright holders.
            </p>
            <div className="mt-4 p-4 bg-[var(--bg-base)] rounded-lg text-sm text-[var(--text-muted)] uppercase tracking-wide border border-[var(--border-color)] border-opacity-50">
              <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
            </div>
          </div>
        </section>

        {/* API Setup Guide */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            <Key size={24} className="text-amber-500" />
            <h2 className="text-2xl font-semibold">How to Get Your API Keys</h2>
          </div>
          <p className="text-[var(--text-secondary)]">
            Logpile requires personal API keys to automatically fetch high-quality artwork and metadata for your games. 
            Because Logpile is a local app without a central backend server, you must provide your own keys to use these public services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">1</span>
                SteamGridDB <span className="text-sm font-normal text-[var(--text-muted)]">(High-Res Artwork)</span>
              </h3>
              <ol className="list-decimal list-outside ml-4 space-y-2 text-[var(--text-secondary)] text-sm">
                <li>Create a free account at <strong>steamgriddb.com</strong>.</li>
                <li>Click your profile picture in the top right, then go to <strong>Preferences &rarr; API</strong>.</li>
                <li>Click <strong>Generate API Key</strong>.</li>
                <li>Copy the key and paste it into Logpile's <strong>Settings</strong> panel.</li>
              </ol>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">2</span>
                IGDB <span className="text-sm font-normal text-[var(--text-muted)]">(Game Metadata)</span>
              </h3>
              <ol className="list-decimal list-outside ml-4 space-y-2 text-[var(--text-secondary)] text-sm">
                <li>Log into <strong>dev.twitch.tv/console</strong> with a Twitch account (requires 2FA).</li>
                <li>Go to <strong>Applications</strong> and click <strong>Register Your Application</strong>.</li>
                <li>Set Name: <em>Logpile</em>, Category: <em>Application Integration</em>, and OAuth Redirect: <em>http://localhost</em>.</li>
                <li>Click <strong>Manage</strong> on your new app to reveal your <strong>Client ID</strong>.</li>
                <li>Click <strong>New Secret</strong> to generate your <strong>Client Secret</strong>.</li>
                <li>Paste both into Logpile's <strong>Settings</strong> panel.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Open Source Credits */}
        <section className="space-y-4 pb-12">
          <div className="flex items-center gap-3 text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            <Code size={24} className="text-emerald-500" />
            <h2 className="text-2xl font-semibold">Open Source & Credits</h2>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 text-[var(--text-secondary)] text-sm space-y-3">
            <p><strong>Developed by:</strong> Corporate Introvert Gamer (Ritesh Soni)</p>
            <p><strong>Built with:</strong> React, Vite, Electron, Tailwind CSS, and better-sqlite3</p>
            <p><strong>Branding & Icons:</strong> Generated via ChatGPT, upscaled via Seed-VR2</p>
            <p><strong>Artwork provided by:</strong> SteamGridDB</p>
            <p><strong>Game data:</strong> IGDB</p>
            <p className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
              All game titles, storefront names, and logos are trademarks or registered trademarks of their respective owners. Logpile is an independent open-source project and is not affiliated with, sponsored by, or endorsed by Valve, Epic Games, CD Projekt, Electronic Arts, or Ubisoft.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
