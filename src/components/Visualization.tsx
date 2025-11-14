import { SimulationState } from '../types/simulation';
import { calculateForces } from '../utils/physics';

interface VisualizationProps {
  simulation: SimulationState;
}

const Visualization = ({ simulation }: VisualizationProps) => {
  const forces = calculateForces(simulation);
  const { angle, showMass, showTension, showPush, motionDirection, push } = simulation;
  const { weight, normalForce, friction, tension } = forces;

  // SVG dimensions - increased for better visibility
  const width = 800;
  const height = 600;
  const padding = 60; // Padding to keep arrows inside
  const centerX = width / 2;
  const centerY = height * 0.6;

  // Incline parameters
  const inclineLength = 280;
  const angleRad = (angle * Math.PI) / 180;
  const inclineEndX = centerX + inclineLength * Math.cos(angleRad);
  const inclineEndY = centerY - inclineLength * Math.sin(angleRad);

  // Block position (middle of incline)
  const blockX = centerX + (inclineLength / 2) * Math.cos(angleRad);
  const blockY = centerY - (inclineLength / 2) * Math.sin(angleRad);
  const blockSize = 45;

  // Dynamic force scaling - ensures arrows stay within bounds
  const maxForce = Math.max(weight, normalForce, friction, tension, push, 1);
  const availableSpace = Math.min(width - 2 * padding, height - 2 * padding);
  const forceScale = Math.min(0.7, availableSpace / maxForce / 2);
  
  // Force origin offsets to prevent overlap
  const getForceOrigin = (offsetType: 'center' | 'left' | 'right' | 'top') => {
    const offset = 18; // pixels from center
    switch (offsetType) {
      case 'left':
        return { x: blockX - offset * Math.cos(angleRad), y: blockY + offset * Math.sin(angleRad) };
      case 'right':
        return { x: blockX + offset * Math.cos(angleRad), y: blockY - offset * Math.sin(angleRad) };
      case 'top':
        return { x: blockX, y: blockY - offset };
      default:
        return { x: blockX, y: blockY };
    }
  };

  // Helper to draw arrows with better label positioning
  const drawArrow = (
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    color: string, 
    label: string,
    labelOffset: { x: number; y: number } = { x: 0, y: 0 }
  ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length < 1) return null; // Don't draw zero-length arrows
    
    const arrowAngle = Math.atan2(dy, dx);
    const headLength = 15;
    const headAngle = Math.PI / 6;

    // Calculate label position with offset
    const labelX = (x1 + x2) / 2 + labelOffset.x;
    const labelY = (y1 + y2) / 2 + labelOffset.y;

    return (
      <g key={label}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" />
        <polygon
          points={`${x2},${y2} ${x2 - headLength * Math.cos(arrowAngle - headAngle)},${y2 - headLength * Math.sin(arrowAngle - headAngle)} ${x2 - headLength * Math.cos(arrowAngle + headAngle)},${y2 - headLength * Math.sin(arrowAngle + headAngle)}`}
          fill={color}
        />
        <text
          x={labelX}
          y={labelY}
          fill={color}
          fontSize="16"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ textShadow: '1px 1px 2px white, -1px -1px 2px white' }}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-white border-b border-gray-200">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Visualization
      </h2>
      <div className="bg-gray-50 rounded-lg border-2 border-gray-300 p-4 flex items-center justify-center overflow-hidden">
        <svg 
          width={width} 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          className="max-w-full h-auto"
          style={{ minHeight: '400px' }}
        >
          {/* Ground */}
          <line
            x1={centerX - 280}
            y1={centerY}
            x2={inclineEndX + 60}
            y2={centerY}
            stroke="#666"
            strokeWidth="3"
          />
          
          {/* Incline */}
          <line
            x1={centerX}
            y1={centerY}
            x2={inclineEndX}
            y2={inclineEndY}
            stroke="#383838"
            strokeWidth="5"
          />
          
          {/* Angle arc */}
          {angle > 0 && (
            <>
              <path
                d={`M ${centerX + 60} ${centerY} A 60 60 0 0 0 ${centerX + 60 * Math.cos(angleRad)} ${centerY - 60 * Math.sin(angleRad)}`}
                fill="none"
                stroke="#007AFF"
                strokeWidth="3"
              />
              <text
                x={centerX + 80}
                y={centerY + 20}
                fill="#007AFF"
                fontSize="18"
                fontWeight="bold"
              >
                θ = {angle}°
              </text>
            </>
          )}
          
          {/* Block */}
          <rect
            x={blockX - blockSize / 2}
            y={blockY - blockSize / 2}
            width={blockSize}
            height={blockSize}
            fill="#FFD700"
            stroke="#383838"
            strokeWidth="3"
            transform={`rotate(${angle} ${blockX} ${blockY})`}
          />
          
          {/* Forces */}
          {showMass && (
            <>
              {/* Weight (straight down - always vertical) - originates from center */}
              {drawArrow(
                blockX,
                blockY,
                blockX,
                blockY + weight * forceScale,
                '#007AFF',
                `Mg=${weight.toFixed(1)}N`,
                { x: 40, y: 0 }
              )}
              
              {/* Normal Force (perpendicular to surface - pointing AWAY from surface) */}
              {(() => {
                const normalOrigin = getForceOrigin('center');
                return drawArrow(
                  normalOrigin.x,
                  normalOrigin.y,
                  normalOrigin.x - normalForce * forceScale * Math.sin(angleRad),
                  normalOrigin.y - normalForce * forceScale * Math.cos(angleRad),
                  '#21AD93',
                  `R_N=${normalForce.toFixed(1)}N`,
                  { x: -45, y: -25 }
                );
              })()}
              
              {/* Weight components (if inclined) - Only show labels, not the dashed lines */}
              {angle > 0 && (
                <>
                  {/* Parallel component label only */}
                  <text
                    x={blockX + 70}
                    y={blockY + 80}
                    fill="#0056b3"
                    fontSize="15"
                    fontWeight="700"
                  >
                    Mg·sin({angle}°)
                  </text>
                  
                  {/* Perpendicular component label only */}
                  <text
                    x={blockX - 95}
                    y={blockY + 50}
                    fill="#0056b3"
                    fontSize="15"
                    fontWeight="700"
                  >
                    Mg·cos({angle}°)
                  </text>
                </>
              )}
            </>
          )}
          
          {/* Tension (up the slope) - originates from right side of block */}
          {showTension && tension > 0 && (() => {
            const tensionOrigin = getForceOrigin('right');
            return drawArrow(
              tensionOrigin.x,
              tensionOrigin.y,
              tensionOrigin.x + tension * forceScale * Math.cos(angleRad),
              tensionOrigin.y - tension * forceScale * Math.sin(angleRad),
              '#FF6E6C',
              `T=${tension}N`,
              { x: 0, y: -25 }
            );
          })()}
          
          {/* Push (horizontal - parallel to ground) - originates from left side */}
          {showPush && push > 0 && (() => {
            const pushOrigin = { x: blockX - 45, y: blockY };
            return drawArrow(
              pushOrigin.x,
              pushOrigin.y,
              pushOrigin.x + push * forceScale,
              pushOrigin.y,
              '#00CED1',
              `P=${push}N`,
              { x: 0, y: -22 }
            );
          })()}
          
          {/* Friction - opposes motion - originates from left side for down motion, right for up */}
          {motionDirection !== 'none' && friction > 0 && (() => {
            // Friction origin depends on motion direction to avoid overlap
            const frictionOrigin = motionDirection === 'up' ? getForceOrigin('left') : getForceOrigin('right');
            return drawArrow(
              frictionOrigin.x,
              frictionOrigin.y,
              // If motion is UP slope, friction points DOWN slope (negative direction)
              // If motion is DOWN slope, friction points UP slope (positive direction)
              frictionOrigin.x + (motionDirection === 'down' ? 1 : -1) * friction * forceScale * Math.cos(angleRad),
              frictionOrigin.y - (motionDirection === 'down' ? 1 : -1) * friction * forceScale * Math.sin(angleRad),
              '#FFDE00',
              `F_f=${friction.toFixed(1)}N`,
              { x: 0, y: motionDirection === 'down' ? -28 : 28 }
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

export default Visualization;
