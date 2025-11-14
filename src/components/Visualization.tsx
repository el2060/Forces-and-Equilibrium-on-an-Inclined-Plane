import { SimulationState } from '../types/simulation';
import { calculateForces } from '../utils/physics';

interface VisualizationProps {
  simulation: SimulationState;
}

const Visualization = ({ simulation }: VisualizationProps) => {
  const forces = calculateForces(simulation);
  const { angle, showMass, showTension, showPush, motionDirection, push } = simulation;
  const { weight, normalForce, friction, tension } = forces;

  // SVG dimensions - increased for better visibility & responsiveness
  const width = 900;
  const height = 650;
  const padding = 70; // Padding to keep arrows inside
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

  // Track placed label bounding boxes to avoid overlap (simple collision avoidance)
  const placedLabels: { x: number; y: number; w: number; h: number }[] = [];

  const registerLabelPosition = (x: number, y: number, text: string, fontSize = 16) => {
    const approxCharWidth = fontSize * 0.6; // heuristic
    const paddingBox = 6;
    const w = text.length * approxCharWidth + paddingBox * 2;
    const h = fontSize + paddingBox * 2;
    let newX = x - w / 2; // convert to top-left
    let newY = y - h / 2;

    // Try shifting if overlapping existing labels (spiral / iterative offset)
    const maxAttempts = 25;
    let attempt = 0;
    let offsetRadius = 0;
    let angleStep = Math.PI / 4; // 45 deg increments
    while (attempt < maxAttempts) {
      const overlaps = placedLabels.some(b => !(newX + w < b.x || newX > b.x + b.w || newY + h < b.y || newY > b.y + b.h));
      if (!overlaps) break;
      attempt++;
      offsetRadius += 10; // increase radius gradually
      const theta = attempt * angleStep;
      newX = x - w / 2 + offsetRadius * Math.cos(theta);
      newY = y - h / 2 + offsetRadius * Math.sin(theta);
    }
    placedLabels.push({ x: newX, y: newY, w, h });
    return { x: newX + w / 2, y: newY + h / 2, w, h }; // return center-based for text anchor
  };
  
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
    labelOffset: { x: number; y: number } = { x: 0, y: 0 },
    fontSize = 16
  ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length < 1) return null; // Don't draw zero-length arrows
    
    const arrowAngle = Math.atan2(dy, dx);
    const headLength = 15;
    const headAngle = Math.PI / 6;

  // Preferred label position (midpoint + offset)
  const preferredX = (x1 + x2) / 2 + labelOffset.x;
  const preferredY = (y1 + y2) / 2 + labelOffset.y;

  // Adjust to avoid collisions & register
  const adjusted = registerLabelPosition(preferredX, preferredY, label, fontSize);

    return (
      <g key={label}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" />
        <polygon
          points={`${x2},${y2} ${x2 - headLength * Math.cos(arrowAngle - headAngle)},${y2 - headLength * Math.sin(arrowAngle - headAngle)} ${x2 - headLength * Math.cos(arrowAngle + headAngle)},${y2 - headLength * Math.sin(arrowAngle + headAngle)}`}
          fill={color}
        />
        {/* Text background for readability */}
        <rect
          x={adjusted.x - adjusted.w / 2}
          y={adjusted.y - adjusted.h / 2}
          width={adjusted.w}
          height={adjusted.h}
          rx={6}
          ry={6}
          fill="rgba(255,255,255,0.85)"
          stroke={color}
          strokeWidth={1.2}
        />
        <text
          x={adjusted.x}
          y={adjusted.y}
          fill={color}
          fontSize={fontSize}
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ pointerEvents: 'none' }}
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
      <div className="bg-gray-50 rounded-lg border-2 border-gray-300 p-4 flex items-center justify-center overflow-auto">
        <svg 
          width={width} 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          className="max-w-full h-auto"
          style={{ minHeight: '450px' }}
        >
          {/* Subtle background grid */}
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="1" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d0d0d0" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect x={0} y={0} width={width} height={height} fill="url(#grid)" />
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
                { x: 40, y: 0 },
                18
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
                  { x: -45, y: -25 },
                  18
                );
              })()}
              
              {/* Weight components (if inclined) - Only show labels, not the dashed lines */}
              {angle > 0 && (
                <>
                  {/* Parallel component label only */}
                  {(() => {
                    const label = `Mg·sin(${angle}°)`;
                    const pos = registerLabelPosition(blockX + 70, blockY + 80, label, 15);
                    return (
                      <g key="mg-sin">
                        <rect
                          x={pos.x - pos.w / 2}
                          y={pos.y - pos.h / 2}
                          width={pos.w}
                          height={pos.h}
                          rx={6}
                          ry={6}
                          fill="rgba(255,255,255,0.85)"
                          stroke="#0056b3"
                          strokeWidth={1}
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          fill="#0056b3"
                          fontSize={15}
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })()}
                  
                  {/* Perpendicular component label only */}
                  {(() => {
                    const label = `Mg·cos(${angle}°)`;
                    const pos = registerLabelPosition(blockX - 95, blockY + 50, label, 15);
                    return (
                      <g key="mg-cos">
                        <rect
                          x={pos.x - pos.w / 2}
                          y={pos.y - pos.h / 2}
                          width={pos.w}
                          height={pos.h}
                          rx={6}
                          ry={6}
                          fill="rgba(255,255,255,0.85)"
                          stroke="#0056b3"
                          strokeWidth={1}
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          fill="#0056b3"
                          fontSize={15}
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })()}
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
              { x: 0, y: -25 },
              16
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
              { x: 0, y: -22 },
              16
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
              { x: 0, y: motionDirection === 'down' ? -28 : 28 },
              16
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

export default Visualization;
