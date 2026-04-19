import { useState } from 'react';

function App() {
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('script');
  
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans">
      {/* Header */}
      <header className="border-b border-[#262626] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-lg flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold">AutoVid Pro</h1>
              <p className="text-xs text-gray-400">AI Video Automation Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-[#1F1F1F] hover:bg-[#262626] rounded-lg text-sm border border-[#262626]">
              💎 1,250 Credits
            </button>
            <div className="w-9 h-9 bg-[#262626] rounded-full flex items-center justify-center">
              P
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[#262626] h-[calc(100vh-73px)] p-4">
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('script')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'script' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>📝</span> Script Studio
            </button>
            <button 
              onClick={() => setActiveTab('voice')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'voice' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>🎙️</span> Voice Engine
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'media' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>🎬</span> Media Vault
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'timeline' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>✂️</span> Timeline Editor
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'analytics' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>📊</span> Analytics
            </button>
          </div>

          <div className="mt-8 p-4 bg-[#1A1A1A] rounded-lg border border-[#262626]">
            <h3 className="text-sm font-semibold mb-2">Pro Tips</h3>
            <p className="text-xs text-gray-400">Keep scripts under 60s for best retention. Use hooks in first 3 seconds.</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Create Viral Shorts in Minutes</h2>
              <p className="text-gray-400">Paste your script, pick a voice, get a full video with captions.</p>
            </div>

            {/* Script Input */}
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 mb-6">
              <label className="block text-sm font-semibold mb-3 text-gray-300">Your Script</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Did you know that 90% of creators fail because they don't hook viewers in 3 seconds? Here's how to fix it..."
                className="w-full h-40 bg-[#0F0F0F] border border-[#262626] rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{script.length} characters · ~{Math.ceil(script.length / 15)}s</span>
                <button className="text-xs text-[#7C3AED] hover:text-[#A855F7]">✨ Enhance with AI</button>
              </div>
            </div>

            {/* Voice Selector */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#1A1A1A] border border-[#7C3AED] rounded-lg p-4 cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#7C3AED] rounded-full"></div>
                  <div>
                    <p className="font-semibold text-sm">Emma Pro</p>
                    <p className="text-xs text-gray-400">Confident · US</p>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-white">▶ Preview</button>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-4 cursor-pointer hover:border-[#7C3AED]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#262626] rounded-full"></div>
                  <div>
                    <p className="font-semibold text-sm">Marcus</p>
                    <p className="text-xs text-gray-400">Deep · UK</p>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-white">▶ Preview</button>
              </div>

              <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-4 cursor-pointer hover:border-[#7C3AED]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#262626] rounded-full"></div>
                  <div>
                    <p className="font-semibold text-sm">Sofia</p>
                    <p className="text-xs text-gray-400">Warm · IN</p>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-white">▶ Preview</button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !script}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-all"
            >
              {isGenerating ? 'Generating Video... ⏳' : '🚀 Generate Video - 50 Credits'}
            </button>

            {isGenerating && (
              <div className="mt-6 bg-[#1A1A1A] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="font-semibold">Rendering your video...</p>
                    <p className="text-sm text-gray-400">Adding captions · Syncing voice · Exporting 1080p</p>
                  </div>
                </div>
                <div className="w-full bg-[#262626] rounded-full h-2">
                  <div className="bg-[#7C3AED] h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;