'use client';

import { useState, useRef } from 'react';

interface VoiceCommandButtonProps {
  onScanTriggered: () => void;
}

const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({ onScanTriggered }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle voice command activation
  const handleVoiceCommand = () => {
    setIsListening(true);
    setTranscript('Listening...');
    
    // Simulate voice recognition with a timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // First update - show "Listening..."
    timeoutRef.current = setTimeout(() => {
      setTranscript('"Alexa, scan my room"');
      
      // Second update - show recognized command
      timeoutRef.current = setTimeout(() => {
        setTranscript('Scanning room...');
        
        // Third update - trigger scan
        timeoutRef.current = setTimeout(() => {
          setIsListening(false);
          setTranscript('');
          onScanTriggered();
        }, 1000);
      }, 1500);
    }, 1000);
  };

  // Show tooltip on hover
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  // Hide tooltip on mouse leave
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
      <button
        onClick={handleVoiceCommand}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={isListening}
        className={`flex items-center justify-center p-3 rounded-full ${isListening ? 'bg-blue-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg transition-all`}
        aria-label="Voice Command"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
          />
        </svg>
      </button>
      
      {/* Voice command tooltip */}
      {showTooltip && !isListening && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
          Try voice command
        </div>
      )}
      
      {/* Voice recognition feedback */}
      {isListening && (
        <div className="absolute top-0 left-full ml-3 px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-gray-800 whitespace-nowrap">
          {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceCommandButton;