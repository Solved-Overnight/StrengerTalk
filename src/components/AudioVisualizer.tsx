import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioLevel: number;
  isSpeaking?: boolean;
}

const AudioVisualizer = ({ audioLevel, isSpeaking = false }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set colors
    const isDarkMode = document.documentElement.classList.contains('dark');
    const primaryColor = isDarkMode ? '#38bdf8' : '#0ea5e9'; // primary-400 or primary-500
    const secondaryColor = isDarkMode ? '#0c4a6e' : '#e0f2fe'; // primary-900 or primary-100
    
    // Calculate wave amplitude (normalize audio level to 0-1 range, max level is around 130)
    const normalizedLevel = Math.min(audioLevel / 100, 1);
    const amplitude = 25 * normalizedLevel;
    
    // Draw wave
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    for (let x = 0; x < width; x++) {
      // Multiple sine waves with different frequencies and phases
      const y = centerY + 
        Math.sin(x * 0.02 + Date.now() * 0.002) * amplitude + 
        Math.sin(x * 0.03 + Date.now() * 0.003) * amplitude * 0.5;
      
      ctx.lineTo(x, y);
    }
    
    // Fill gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, secondaryColor);
    
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // If not speaking or very low level, fade out the animation
    if (!isSpeaking && normalizedLevel < 0.1) {
      ctx.globalAlpha = 0.3;
    }
    
    // Request next frame
    requestAnimationFrame(() => {
      // This creates a continuous animation loop
    });
  }, [audioLevel, isSpeaking]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={80} 
      className="w-full"
    />
  );
};

export default AudioVisualizer;