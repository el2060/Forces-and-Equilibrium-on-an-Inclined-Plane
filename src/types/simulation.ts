export interface SimulationState {
  angle: number;
  mass: number;
  mu: number;
  tension: number;
  push: number;
  showMass: boolean;
  showTension: boolean;
  showPush: boolean;
  motionDirection: 'none' | 'up' | 'down';
  showEquations: boolean;
}

export interface GuidedLearningState {
  currentStep: number;
  answeredQuestions: Set<string>;
}

export const initialSimulationState: SimulationState = {
  angle: 0,
  mass: 10,
  mu: 0.3,
  tension: 0,
  push: 0,
  showMass: false,
  showTension: false,
  showPush: false,
  motionDirection: 'none',
  showEquations: false,
};

export const initialGuidedLearningState: GuidedLearningState = {
  currentStep: 1,
  answeredQuestions: new Set(),
};
