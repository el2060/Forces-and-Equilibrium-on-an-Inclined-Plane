import { SimulationState } from '../types/simulation';

export const calculateForces = (state: SimulationState) => {
  const { angle, mass, mu, tension, push, motionDirection } = state;
  const g = 9.8;
  const angleRad = (angle * Math.PI) / 180;
  
  const weight = mass * g;
  
  // When there's a horizontal push force on an incline, it affects the normal force
  // Push has horizontal and perpendicular components relative to the incline
  const pushPerpendicularComponent = push * Math.sin(angleRad);
  const pushParallelComponent = push * Math.cos(angleRad);
  
  // Normal force balances weight's perpendicular component + push's perpendicular component
  const normalForce = weight * Math.cos(angleRad) + pushPerpendicularComponent;
  
  const weightParallel = weight * Math.sin(angleRad);
  const weightPerpendicular = weight * Math.cos(angleRad);
  
  let friction = 0;
  if (motionDirection !== 'none') {
    friction = mu * normalForce;
  }
  
  return {
    weight,
    normalForce,
    weightParallel,
    weightPerpendicular,
    friction,
    tension,
    push,
    pushParallelComponent,
    pushPerpendicularComponent,
    g,
    angleRad,
  };
};

export const getEquations = (state: SimulationState, forces: ReturnType<typeof calculateForces>) => {
  const { angle, mass, mu, motionDirection, showTension, showPush, push } = state;
  const { normalForce, weightPerpendicular, weightParallel, friction } = forces;
  
  const angleStr = angle.toFixed(0);
  const massStr = mass.toFixed(1);
  const muStr = mu.toFixed(2);
  
  // Y-axis (perpendicular to surface)
  let sumFy = '';
  let rnCalc = '';
  
  if (showPush && push > 0 && angle > 0) {
    sumFy = `ΣFy = +R_N - Mg·cos(${angleStr}°) - P·sin(${angleStr}°) = 0`;
    rnCalc = `R_N = ${massStr} × 9.8 × cos(${angleStr}°) + ${push} × sin(${angleStr}°) = ${normalForce.toFixed(2)} N`;
  } else {
    sumFy = `ΣFy = +R_N - Mg·cos(${angleStr}°) = 0`;
    rnCalc = `R_N = ${massStr} × 9.8 × cos(${angleStr}°) = ${normalForce.toFixed(2)} N`;
  }
  
  // X-axis (parallel to surface)
  let sumFx = '';
  let frictionCalc = '';
  
  if (motionDirection === 'up') {
    // Motion up the slope
    let forcesStr = '';
    if (showTension) forcesStr += `+T `;
    if (showPush && push > 0) forcesStr += `+P·cos(${angleStr}°) `;
    forcesStr += `- F_f - Mg·sin(${angleStr}°)`;
    
    sumFx = `ΣFx = ${forcesStr} = 0`;
    frictionCalc = `F_f = μ × R_N = ${muStr} × ${normalForce.toFixed(2)} = ${friction.toFixed(2)} N (down-slope)`;
  } else if (motionDirection === 'down') {
    // Motion down the slope
    let forcesStr = '+F_f ';
    if (showTension) forcesStr += `+ T `;
    if (showPush && push > 0) forcesStr += `+ P·cos(${angleStr}°) `;
    forcesStr += `- Mg·sin(${angleStr}°)`;
    
    sumFx = `ΣFx = ${forcesStr} = 0`;
    frictionCalc = `F_f = μ × R_N = ${muStr} × ${normalForce.toFixed(2)} = ${friction.toFixed(2)} N (up-slope)`;
  } else {
    // No motion specified
    let forcesStr = '';
    if (showTension) forcesStr += `+T `;
    if (showPush && push > 0) forcesStr += `+P·cos(${angleStr}°) `;
    forcesStr += `- Mg·sin(${angleStr}°)`;
    
    sumFx = `ΣFx = ${forcesStr} ${!showTension && !showPush ? '(unbalanced)' : ''}`;
  }
  
  return {
    sumFy,
    rnCalc,
    sumFx,
    frictionCalc,
    weightParallel: weightParallel.toFixed(2),
    weightPerpendicular: weightPerpendicular.toFixed(2),
  };
};
