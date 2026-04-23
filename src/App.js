import { useState, useEffect } from 'react';

function App() {
  const [script, setScript] = useState('');
  const [topic, setTopic] = useState('');
  const [inputMode, setInputMode] = useState('script');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [userPlan, setUserPlan] = useState('none');
  const [userCredits, setUserCredits] = useState(0);
  const [videoDuration, setVideoDuration] = useState(30);
  const [selectedStyle, setSelectedStyle] = useState('studio Ghibli');
  const [selectedVoice, setSelectedVoice] = useState('Rachel');
  const [contentType, setContentType] = useState('random');
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  
  const BACKEND_URL = 'https://autovid-ai-10.onrender.com';
  const userEmail = 'pramodbhaskar10@gmail.com'; // TODO: Get from auth
  const API_KEY = 'avp_live_' + process.env.REACT_APP_MASTER_KEY; // Add to Vercel env
  
  const durationOptions = [
    { label: '30 seconds', value: '0.5' },
    { label: '60 seconds', value: '1' },
    { label: '5 minutes', value: '5' },
    { label: '10 minutes', value: '10' },
    { label: '15 minutes', value: '15' },
    { label: '20 minutes', value: '20' },
  ];

  const styleOptions = Object.keys({
    'studio Ghibli': 1, 'LEGO': 1, 'pixar': 1, 'cyberpunk': 1, 'anime': 1, 
    'realistic': 1, 'watercolor': 1, 'comic book': 1, 'oil painting': 1
  });

  const voiceOptions = ['Rachel', 'Domi', 'Bella', 'Antoni', 'Elli', 'Nova'];

  // Check user plan on load
  useEffect(() => {
    fetch(`${BACKEND_URL}/user/${userEmail}`)
      .then(res => res.json())
      .then(data => {
        setUserPlan(data.plan || 'free');
        setUserCredits(data.credits || 0);
      });
  }, []);

  // Poll job status
  useEffect(() => {
    if (!jobId || !isGenerating) return;
    const interval = setInterval(async () => {
      const res = await fetch(`${BACKEND_URL}/api/status/${jobId}`);
      const data = await res.json();
      setJobStatus(data);
      if (data.status === 'completed' || data.status === 'failed') {
        setIsGenerating(false);
        clearInterval(interval);
        if (data.status === 'completed') {
          alert(`✅ Video ready! ${data.videoUrl}`);
          window.open(data.videoUrl, '_blank');
        } else {
          alert(`❌ Failed: ${data.error}`);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [jobId, isGenerating]);

  const handleGenerate = async () => {
    if (userPlan === 'free' && userCredits <= 0) {
      alert('🚀 No credits left. Upgrade to Pro!');
      return;
    }
    
    const finalTopic = inputMode === 'script' ? script : topic;
    if (!finalTopic) {
      alert('Please enter a script or topic');
      return;
    }

    setIsGenerating(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/generate-pro`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          topic: finalTopic,
          style: selectedStyle,
          voice: selectedVoice,
          aspectRatio: 'vertical',
          duration: videoDuration,
          brandName: 'AutoVidPro',
          email: userEmail
        })
      });
      
      const data = await res.json();
      if (data.jobId) {
        setJobId(data.jobId);
        setJobStatus({ status: 'queued', progress: 0 });
      } else {
        throw new Error(data.error || 'Failed to start job');
      }
    } catch (err) {
      alert('Generation failed: ' + err.message);
      setIsGenerating(false);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1, plan: planId }) // ₹1 test
      });
      const order = await res.json();
      
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: `AutoVid Pro`,
        description: `Pro Plan`,
        prefill: { email: userEmail },
        handler: () => {
          alert('✅ Payment Successful! Refreshing...');
          window.location.reload();
        },
        theme: { color: '#7C3AED' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment failed: ' + err.message);
    }
  };

  // Paywall if no plan
  if (userPlan === 'none' || userPlan === 'free') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white font-sans flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-4">A</div>
          <h1 className="text-4xl font-bold mb-3">AutoVid Pro</h1>
          <p className="text-gray-400 mb-8">Your backend is ready. Subscribe to unlock video generation.</p>
          <button onClick={() => handleUpgrade('pro')} className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-semibold py-4 rounded-lg text-lg">
            🚀 Start Pro - ₹999/mo
          </button>
          <p className="text-xs text-gray-500 mt-4">Credits: {userCredits} | Plan: {userPlan}</p>
        </div>
      </div>
    );
  }

  // Main app for paid users
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans">
      <header className="border-b border-[#262626] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-lg flex items-center justify-center font-bold">A</div>
            <div>
              <h1 className="text-xl font-bold">AutoVid Pro</h1>
              <p className="text-xs text-gray-400">{userPlan.toUpperCase()} · {userCredits} credits left</p>
            </div>
          <div className="w-9 h-9 bg-[#262626] rounded-full flex items-center justify-center">P</div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-[#262626] h-[calc(100vh-73px)] p-4">
          <div className="space-y-2">
            {['create', 'queue', 'analytics', 'settings'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg capitalize ${activeTab === tab ? 'bg-[#7C3AED] text-white' : 'hover:bg-[#1F1F1F] text-gray-300'}`}>
                {tab === 'create' && '🎬'} {tab === 'queue' && '📅'} {tab === 'analytics' && '📊'} {tab === 'settings' && '⚙️'} {tab}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Create Video - Backend Connected</h2>

            <div className="flex gap-2 mb-6 bg-[#1A1A1A] p-1 rounded-lg w-fit">
              <button onClick={() => setInputMode('script')} className={`px-4 py-2 rounded-md text-sm font-semibold ${inputMode === 'script' ? 'bg-[#7C3AED]' : 'text-gray-400'}`}>
                📝 Script
              </button>
              <button onClick={() => setInputMode('topic')} className={`px-4 py-2 rounded-md text-sm font-semibold ${inputMode === 'topic' ? 'bg-[#7C3AED]' : 'text-gray-400'}`}>
                💡 Topic
              </button>
            </div>

            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 mb-6">
              {inputMode === 'script' ? (
                <textarea value={script} onChange={e => setScript(e.target.value)} placeholder="Paste script..."
                  className="w-full h-32 bg-[#0F0F0F] border border-[#262626] rounded-lg p-4 text-white" />
              ) : (
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. 'Motivational quotes'"
                  className="w-full bg-[#0F0F0F] border border-[#262626] rounded-lg p-4 text-white" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4">
                <label className="block text-xs text-gray-400 mb-2">Style</label>
                <select value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[#262626] rounded-lg p-2 text-white">
                  {styleOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4">
                <label className="block text-xs text-gray-400 mb-2">Voice</label>
                <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[#262626] rounded-lg p-2 text-white">
                  {voiceOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4 mb-6">
              <label className="block text-xs text-gray-400 mb-3">Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map(opt => (
                  <button key={opt.value} onClick={() => setVideoDuration(opt.value)}
                    className={`p-3 rounded-lg text-sm border ${videoDuration === opt.value ? 'bg-[#7C3AED] border-[#7C3AED]' : 'bg-[#1F1F1F] border-[#262626]'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={isGenerating}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] disabled:from-gray-600 text-white font-bold py-4 rounded-xl text-lg">
              {isGenerating ? `Generating... ${jobStatus?.progress || 0}%` : '🚀 Generate Real Video'}
            </button>

            {jobStatus && (
              <div className="mt-6 bg-[#1A1A1A] border border-[#262626] rounded-xl p-6">
                <p className="font-semibold mb-2">Status: {jobStatus.status}</p>
                <div className="w-full bg-[#262626] rounded-full h-2">
                  <div className="bg-[#7C3AED] h-2 rounded-full" style={{width: `${jobStatus.progress}%`}}></div>
                </div>
                {jobStatus.videoUrl && <a href={jobStatus.videoUrl} target="_blank" className="text-[#7C3AED] text-sm mt-2 block">Open Video →</a>}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
