import React, { useEffect, useRef } from 'react';

interface RadarChartProps {
  scores: {
    before: number;
    during: number;
    after: number;
    shared: number;
    storytelling: number;
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    const labels = [
      'Interactive (Before)',
      'Interactive (During)',
      'Interactive (After)',
      'Shared Reading',
      'Storytelling'
    ];
    
    const maxScores = [3, 9, 3, 9, 9];
    const data = [
      scores.before,
      scores.during,
      scores.after,
      scores.shared,
      scores.storytelling
    ];

    const numAxes = labels.length;
    const angleStep = (Math.PI * 2) / numAxes;

    ctx.clearRect(0, 0, width, height);

    // Draw concentric rings
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      const r = (radius / 4) * i;
      for (let j = 0; j <= numAxes; j++) {
        const x = centerX + r * Math.cos(j * angleStep - Math.PI / 2);
        const y = centerY + r * Math.sin(j * angleStep - Math.PI / 2);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axes and labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    for (let i = 0; i < numAxes; i++) {
      const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Label positioning
      const labelX = centerX + (radius + 25) * Math.cos(i * angleStep - Math.PI / 2);
      const labelY = centerY + (radius + 25) * Math.sin(i * angleStep - Math.PI / 2);
      ctx.fillText(labels[i], labelX, labelY);
    }

    // Draw data polygon
    ctx.beginPath();
    ctx.strokeStyle = '#006B2B';
    ctx.fillStyle = 'rgba(0, 107, 43, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < numAxes; i++) {
      const valueRatio = data[i] / maxScores[i];
      const r = radius * valueRatio;
      const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#006B2B';
    for (let i = 0; i < numAxes; i++) {
      const valueRatio = data[i] / maxScores[i];
      const r = radius * valueRatio;
      const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [scores]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={400} 
      className="max-w-full h-auto"
    />
  );
};

export default RadarChart;
