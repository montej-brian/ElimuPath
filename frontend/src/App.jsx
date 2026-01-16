import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ResultsInput from './components/ResultsInput';
import PreviewLocked from './components/PreviewLocked';
import Payment from './components/Payment';
import FullAnalysis from './components/FullAnalysis';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [stage, setStage] = useState('landing'); // landing, input, preview, payment, analysis
  const [analysisId, setAnalysisId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  // Synchronize state with browser history
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setStage(event.state.stage);
        setAnalysisId(event.state.analysisId || null);
        setPreview(event.state.preview || null);
        setShowSplash(false);
      } else {
        // Initial state
        setStage('landing');
        setAnalysisId(null);
        setPreview(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newStage, data = {}) => {
    setStage(newStage);
    if (data.analysisId !== undefined) setAnalysisId(data.analysisId);
    if (data.preview !== undefined) setPreview(data.preview);

    window.history.pushState(
      { stage: newStage, analysisId: data.analysisId, preview: data.preview },
      '',
      ''
    );
  };

  const handleAnalyze = (id, previewData) => {
    navigateTo('analysis', { analysisId: id, preview: previewData });
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    // Initialize history state on splash finish
    window.history.replaceState({ stage: 'landing' }, '', '');
  };

  return (
    <div>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <>
          {stage === 'landing' && (
            <LandingPage onGetStarted={() => navigateTo('input')} />
          )}
          {stage === 'input' && (
            <ResultsInput
              onAnalyze={handleAnalyze}
              onBack={() => navigateTo('landing')}
            />
          )}
          {stage === 'preview' && (
            <PreviewLocked
              preview={preview}
              onPay={() => navigateTo('payment')}
              onBack={() => navigateTo('input')}
            />
          )}
          {stage === 'payment' && (
            <Payment
              analysisId={analysisId}
              onSuccess={() => navigateTo('analysis')}
              onBack={() => navigateTo('preview')}
            />
          )}
          {stage === 'analysis' && (
            <FullAnalysis
              analysisId={analysisId}
              onBack={() => navigateTo('input')}
            />
          )}
        </>
      )}
    </div>
  );
}
