import { useState } from 'react';

function App() {
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('script');
  const [userPlan, setUserPlan] = useState('free'); // 'free' or 'pro'
  const [videoDuration, setVideoDuration] = useState(30); // seconds
  const [enableMotion, setEnableMotion] = useState(false);
  
  const BACKEND_URL = 'https://autovid-ai-10.onrender.com';
  const userCredits = 1250; // Fixed - no setUserCredits needed yet
  const userEmail = 'pramodbhaskar10@gmail.com'; // TODO: Get from auth later
  
  // FacelessReels logic: Free = 30s max, no motion. Pro = 20min + motion
  const maxDuration = userPlan === 'pro' ? 1200 : 30; // 20min = 1200s
  const canUseMotion = userPlan === 'pro';

  const handleGenerate = () => {
    if (userPlan !== 'pro' && (videoDuration > 30 || enableMotion)) {
      alert('🚀 Upgrade to Pro for videos over 30s and motion graphics!');
      return;
    }
    if (userCredits < 50) {
      alert('Not enough credits! Upgrade or buy more.');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const handleUpgrade = async () => {
    try {
      await fetch(`${BACKEND_URL}/health`);
      
      const orderRes = await fetch(`${BACKEND_URL}/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 }) // ₹1 test. Change to 999 for prod
      });

      if (!orderRes.ok) throw new Error('Failed to create order');
      
      const order = await orderRes.json();
      
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'AutoVid Pro',
        description: 'Pro Plan - 20min videos + Motion Graphics',
        prefill: { email: userEmail },
        handler: function (response) {
          alert('✅ Payment Successful! Welcome to Pro 🎉\nRefreshing...');
          setUserPlan('pro');
          window.location.reload(); // Webhook updates DB
        },
        theme: { color: '#7C3AED' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert('Payment failed: ' + error.message);
    }
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
              <p className="text-xs text-gray-400">20min Videos + Motion Graphics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userPlan === 'pro' ? (
              <button className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg text-sm font-semibold">
                💎 PRO ACTIVE
              </button>
            ) : (
              <button 
                onClick={handleUpgrade}
                className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] rounded-lg text-sm font-semibold"
              >
                🚀 Upgrade to Pro
              </button>
            )}
            <button className="px-4 py-2 bg-[#1F1F1F] hover:bg-[#262626] rounded-lg text-sm border border-[#262626]">
              💎 {userCredits} Credits
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

          {userPlan === 'free' && (
            <div className="mt-8 p-4 bg-gradient-to-br from-[#7C3AED]/20 to-[#A855F7]/20 rounded-lg border border-[#7C3AED]/50">
              <h3 className="text-sm font-semibold mb-2">🚀 Unlock Pro</h3>
              <p className="text-xs text-gray-300 mb-3">• 20min videos<br/>• Motion graphics<br/>• No watermark<br/>• 4K export</p>
              <button 
                onClick={handleUpgrade}
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold py-2 rounded-lg"
              >
                Upgrade - ₹999/mo
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Create Viral Content up to 20 Minutes</h2>
              <p className="text-gray-400">Paste script, pick voice, add motion graphics, export 4K.</p>
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
                <span className="text-xs text-gray-500">{script.length} chars · ~{Math.ceil(script.length / 15)}s</span>
                <button className="text-xs text-[#7C3AED] hover:text-[#A855F7]">✨ Enhance with AI</button>
              </div>
            </div>

            {/* Pro Settings */}
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 mb-6">
              <h3 className="text-sm font-semibold mb-4 text-gray-300">Video Settings</h3>
              
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-2">Duration: {videoDuration}s {videoDuration > 30 && !canUseMotion && '(Pro only)'}</label>
                <input 
                  type="range" 
                  min="15" 
                  max={maxDuration} 
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15s</span>
                  <span>{maxDuration === 1200 ? '20min' : '30s'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Motion Graphics</p>
                  <p className="text-xs text-gray-400">Auto B-roll, transitions, zoom effects</p>
                </div>
                <button
                  onClick={() => canUseMotion ? setEnableMotion(!enableMotion) : handleUpgrade()}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${enableMotion ? 'bg-[#7C3AED]' : 'bg-[#262626]'} ${!canUseMotion ? 'opacity-50 cursor-pointer' : ''}`}
                >
                  {canUseMotion ? (enableMotion ? 'ON' : 'OFF') : '🔒 PRO'}
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !script}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-all"
            >
              {userPlan !== 'pro' && (videoDuration > 30 || enableMotion) 
                ? '🔒 Upgrade to Pro for 20min + Motion' 
                : isGenerating 
                ? 'Generating Video... ⏳' 
                : `🚀 Generate ${videoDuration}s Video - 50 Credits`}
            </button>

            {isGenerating && (
              <div className="mt-6 bg-[#1A1A1A] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="font-semibold">Rendering your video...</p>
                    <p className="text-sm text-gray-400">Adding motion graphics · Syncing voice · Exporting 4K</p>
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
