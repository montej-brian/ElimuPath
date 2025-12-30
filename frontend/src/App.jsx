import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ResultsInput from './components/ResultsInput';
import PreviewLocked from './components/PreviewLocked';
import Payment from './components/Payment';
import FullAnalysis from './components/FullAnalysis';

export default function App() {
  const [stage, setStage] = useState('landing'); // landing, input, preview, payment, analysis
  const [analysisId, setAnalysisId] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleAnalyze = (id, previewData) => {
    setAnalysisId(id);
    setPreview(previewData);
    setStage('analysis'); // Skip preview/payment for testing
  };

  return (
    <div>
      {stage === 'landing' && (
        <LandingPage onGetStarted={() => setStage('input')} />
      )}
      {stage === 'input' && (
        <ResultsInput
          onAnalyze={handleAnalyze}
          onBack={() => setStage('landing')}
        />
      )}
      {stage === 'preview' && (
        <PreviewLocked
          preview={preview}
          onPay={() => setStage('payment')}
          onBack={() => setStage('input')}
        />
      )}
      {stage === 'payment' && (
        <Payment
          analysisId={analysisId}
          onSuccess={() => setStage('analysis')}
          onBack={() => setStage('preview')}
        />
      )}
      {stage === 'analysis' && (
        <FullAnalysis analysisId={analysisId} />
      )}
    </div>
  );
}
