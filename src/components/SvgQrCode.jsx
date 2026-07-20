import React from 'react';

// Lightweight pure SVG QR Code pattern generator (No third party dependencies)
export default function SvgQrCode({ value, size = 180, className = "" }) {
  // Generate a deterministic 21x21 QR matrix based on value hash
  const matrixSize = 21;
  const modules = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // Helper to draw QR finder patterns (3 corners)
  const drawFinder = (startX, startY) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          modules[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(14, 0); // Top-right
  drawFinder(0, 14); // Bottom-left

  // Fill data modules deterministically using value string code points
  let strIndex = 0;
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c > 12;
      const inBottomLeft = r > 12 && c < 8;

      if (!inTopLeft && !inTopRight && !inBottomLeft) {
        const charCode = value.charCodeAt(strIndex % value.length);
        const seed = (r * 17 + c * 31 + charCode * 13) % 100;
        modules[r][c] = seed > 42;
        strIndex++;
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`} 
      className={`bg-white p-2 rounded-lg ${className}`}
    >
      {modules.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          cell ? (
            <rect
              key={`${rIndex}-${cIndex}`}
              x={cIndex * cellSize}
              y={rIndex * cellSize}
              width={cellSize - 0.5}
              height={cellSize - 0.5}
              fill="#090d16"
              rx={1}
            />
          ) : null
        )
      )}
    </svg>
  );
}
