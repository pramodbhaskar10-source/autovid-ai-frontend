import { useState } from 'react';

function App() {
  const [script, setScript] = useState('');
  const [topic, setTopic] = useState('');
  const [inputMode, setInputMode] = useState('script'); // 'script' or 'topic'
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [userPlan, setUserPlan] = useState('none'); // 'none', 'starter', 'growth', 'pro'
  const [videoDuration, setVideoDuration] = useState(30);
  const [contentType, setContentType] = useState('random'); // 'random' or 'series'
  const [postFrequency, setPostFrequency] = useState('weekly'); // 'daily', '3xweek', '2xweek', 'weekly'
  
  const BACKEND_URL = 'https://autovid-ai-10.onrender.com';
  const userEmail = 'pramodbhaskar10@gmail.com'; // TODO: Get from auth
  
  const durationOptions = [
    { label: '30 seconds', value: 30 },
    { label: '60 seconds', value: 60 },
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
    { label: '15 minutes', value: 900 },
    { label: '20 minutes', value: 1200 },
  ];

  const planOptions = [
    { id: 'starter', name: 'Starter', price: 999, videosPerWeek: 1, freq: 'weekly' },
    { id: 'growth', name: 'Growth', price: 1999, videosPerWeek: 2, freq: '2xweek' },
    { id: 'pro', name: 'Pro', price: 2999, videosPerWeek: 3, freq: '3xweek' },
    { id: 'scale', name: 'Scale', price: 4999, videosPerWeek: 7, freq: 'daily' },
  ];

  const frequencyOptions = [
    { label: 'Daily', value: 'daily', videosPerWeek: 7 },
    { label: '3x per week', value: '3xweek', videosPerWeek: 3 },
    { label: '2x per week', value: '2xweek', videosPerWeek: 2 },
    { label: 'Weekly', value: 'weekly', videosPerWeek: 1 },
  ];

  const selectedPlan = planOptions.find(p => p.id === userPlan);
  const hasActivePlan = userPlan !== 'none';

  const handleGenerate = () => {
    if (!hasActivePlan) {
      alert('🚀 Subscribe to a plan to start creating videos!');
      return;
    }
    if (inputMode === 'script' && !script) {
      alert('Please enter a script or switch to Topic mode');
      return;
    }
    if (inputMode === 'topic' && !topic) {
      alert('Please enter a topic or switch to Script mode');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const handleUpgrade = async (planId) => {
    const plan = planOptions.find(p => p.id === planId);
    try {
      await fetch(`${BACKEND_URL}/health`);
      
      const orderRes = await fetch(`${BACKEND_URL}/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: 1, // ₹1 for test. Use plan.price for prod
          plan: planId 
        })
      });

      if (!orderRes.ok) throw new Error('Failed to create order');
      
      const order = await orderRes.json();
      
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: `AutoVid ${plan.name}`,
        description: `${plan.videosPerWeek} video${plan.videosPerWeek > 1 ? 's' : ''}/week + Motion Graphics`,
        prefill: { email: userEmail },
        handler: function (response) {
          alert(`✅ Payment Successful! Welcome to ${plan.name} 🎉\nRefreshing...`);
          setUserPlan(planId);
          window.location.reload();
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

  // If no active plan, show paywall
  if (!hasActivePlan) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white font-sans flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-4">
              A
            </div>
            <h1 className="text-4xl font-bold mb-3">AutoVid Pro</h1>
            <p className="text-gray-400 text-lg">FacelessReels Automation: 30s to 20min videos on autopilot</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {planOptions.map((plan) => (
              <div key={plan.id} className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 hover:border-[#7C3AED] transition-all">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-gray-300">
                  <li>✓ {plan.videosPerWeek} video{plan.videosPerWeek > 1 ? 's' : ''} per week</li>
                  <li>✓ 30s to 20min duration</li>
                  <li>✓ Motion graphics</li>
                  <li>✓ Auto-posting</li>
                  <li>✓ No watermark</li>
                  <li>✓ 4K export</li>
                </ul>
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white font-semibold py-3 rounded-lg"
                >
                  Start {plan.name}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500">
            🔒 No free tier. All plans include script-to-video, voice, motion graphics, and autopilot posting.
          </p>
        </div>
      </div>
    );
  }

  // Main app for paid users
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
              <p className="text-xs text-gray-400">{selectedPlan?.name} Plan · {selectedPlan?.videosPerWeek}x/week</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg text-sm font-semibold">
              💎 {selectedPlan?.name.toUpperCase()}
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
              onClick={() => setActiveTab('create')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'create' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>🎬</span> Create Video
            </button>
            <button 
              onClick={() => setActiveTab('queue')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'queue' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>📅</span> Autopilot Queue
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'analytics' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>📊</span> Analytics
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'settings' ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}
            >
              <span>⚙️</span> Settings
            </button>
          </div>

          <div className="mt-8 p-4 bg-[#1A1A1A] rounded-lg border border-[#262626]">
            <h3 className="text-sm font-semibold mb-2">Your Plan</h3>
            <p className="text-xs text-gray-400 mb-1">{selectedPlan?.name} · ₹{selectedPlan?.price}/mo</p>
            <p className="text-xs text-gray-400">{selectedPlan?.videosPerWeek} videos/week quota</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Create Video on Autopilot</h2>
              <p className="text-gray-400">Script or topic → Pick duration → Set series → Auto-post {selectedPlan?.videosPerWeek}x/week</p>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex gap-2 mb-6 bg-[#1A1A1A] p-1 rounded-lg w-fit">
              <button
                onClick={() => setInputMode('script')}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${inputMode === 'script' ? 'bg-[#7C3AED] text-white' : 'text-gray-400'}`}
              >
                📝 Your Script
              </button>
              <button
                onClick={() => setInputMode('topic')}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${inputMode === 'topic' ? 'bg-[#7C3AED] text-white' : 'text-gray-400'}`}
              >
                💡 Topic List
              </button>
            </div>

            {/* Script/Topic Input */}
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 mb-6">
              {inputMode === 'script' ? (
                <>
                  <label className="block text-sm font-semibold mb-3 text-gray-300">Your Script</label>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Paste your full script here..."
                    className="w-full h-40 bg-[#0F0F0F] border border-[#262626] rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-semibold mb-3 text-gray-300">Topic or Niche</label>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. 'Motivational quotes', 'Crypto news', 'Fitness tips'"
                    className="w-full bg-[#0F0F0F] border border-[#262626] rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED]"
                  />
                  <p className="text-xs text-gray-500 mt-2">AI will generate scripts from your topic automatically</p>
                </>
              )}
            </div>

            {/* Video Settings */}
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 mb-6">
              <h3 className="text-sm font-semibold mb-4 text-gray-300">Video Settings</h3>
              
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-3">Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {durationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setVideoDuration(opt.value)}
                      className={`p-3 rounded-lg text-sm font-semibold border transition-all ${
                        videoDuration === opt.value 
                          ? 'bg-[#7C3AED] border-[#7C3AED] text-white' 
                          : 'bg-[#1F1F1F] border-[#262626] hover:border-[#7C3AED] text-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-3">Content Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setContentType('random')}
                    className={`flex-1 p-3 rounded-lg text-sm font-semibold border ${contentType === 'random' ? 'bg-[#7C3AED] border-[#7C3AED]' : 'bg-[#1F1F1F] border-[#262626]'}`}
                  >
                    🎲 Random Videos
                  </button>
                  <button
                    onClick={() => setContentType('series')}
                    className={`flex-1 p-3 rounded-lg text-sm font-semibold border ${contentType === 'series' ? 'bg-[#7C3AED] border-[#7C3AED]' : 'bg-[#1F1F1F] border-[#262626]'}`}
                  >
                    📺 Series
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-3">Autopilot Frequency</label>
                <select
                  value={postFrequency}
                  onChange={(e) => setPostFrequency(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[#262626] rounded-lg p-3 text-white focus:outline-none focus:border-[#7C3AED]"
                >
                  {frequencyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.videosPerWeek} videos/week)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
                <div>
                  <p className="text-sm font-semibold">Motion Graphics</p>
                  <p className="text-xs text-gray-400">Auto B-roll, transitions, zoom effects</p>
                </div>
                <button
                  onClick={() => setEnableMotion(!enableMotion)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${enableMotion ? 'bg-[#7C3AED]' : 'bg-[#262626]'}`}
                >
                  {enableMotion ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-all"
            >
              {isGenerating 
                ? 'Generating & Queuing... ⏳' 
                : `🚀 Generate ${durationOptions.find(d=>d.value===videoDuration)?.label} Video`}
            </button>

            {isGenerating && (
              <div className="mt-6 bg-[#1A1A1A] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="font-semibold">Rendering + Scheduling...</p>
                    <p className="text-sm text-gray-400">Motion graphics · Voice sync · Adding to autopilot queue</p>
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
