import { SimulationState } from '../types/simulation';

interface GuidedLearningProps {
  currentStep: number;
  answeredQuestions: Set<string>;
  onNextStep: (step: number) => void;
  onReset: () => void;
  onShowFeedback: (text: string) => void;
  onMarkAnswered: (questionId: string) => void;
  simulation: SimulationState;
  onUpdateSimulation: (updates: Partial<SimulationState>) => void;
}

const GuidedLearning = ({
  currentStep,
  answeredQuestions,
  onNextStep,
  onReset,
  onShowFeedback,
  onMarkAnswered,
  simulation,
  onUpdateSimulation,
}: GuidedLearningProps) => {
  
  const checkAnswer = (questionId: string, answer: string, correctAnswer: string, correctFeedback: string, incorrectFeedback: string) => {
    if (answer === correctAnswer) {
      onShowFeedback(correctFeedback);
      onMarkAnswered(questionId);
    } else {
      onShowFeedback(incorrectFeedback);
    }
  };

  return (
    <div className="p-4 md:p-5 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 flex items-center gap-2">
        <span className="text-3xl">📖</span>
        Guided Learning
      </h2>
      
      {/* Info Banner */}
      <div className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-3">
        <p className="text-sm md:text-base text-gray-800">
          <strong className="text-blue-700">💡 Tip:</strong> Follow these steps to learn, 
          <strong className="text-green-700"> OR</strong> skip ahead and experiment freely with the Controls panel! →
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
        
        {/* Step 1 */}
        {currentStep === 1 && (
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-md inline-block mb-3 text-base font-bold">
              STEP 1: FLAT SURFACE BASICS
            </div>
            <p className="mt-3 leading-relaxed text-base md:text-lg text-gray-700">
              Let's start simple. A block resting on a <strong className="text-blue-600">flat (horizontal) surface</strong> where the angle θ = 0°.
            </p>
            {simulation.angle !== 0 && (
              <div className="mt-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md px-3 py-2 text-sm font-semibold">
                Current angle is {simulation.angle}°. Set it to 0° in Controls → Angle slider.
              </div>
            )}
            <ol className="list-decimal list-inside mt-3 space-y-2 leading-relaxed text-base md:text-lg text-gray-700">
              <li>Set <strong className="text-blue-600">Angle</strong> to <strong>0°</strong>.</li>
              <li>Check <strong className="text-green-600">"Mass (Mg) & R_N"</strong>.</li>
              <li>Optionally toggle <strong className="text-blue-600">"Show Equations"</strong>.</li>
            </ol>
            <div className="mt-4 p-4 bg-white rounded-md border-l-4 border-blue-500">
              <p className="font-semibold text-base text-gray-800 mb-2">Key Concepts:</p>
              <ul className="list-disc list-inside leading-relaxed text-base text-gray-700 space-y-1.5">
                <li><strong className="text-blue-600">Weight (Mg)</strong> acts <em>vertically downward</em> regardless of surface.</li>
                <li><strong className="text-green-600">Normal Force (R_N)</strong> acts <em>perpendicular</em> to the surface (so vertical up when flat).</li>
                <li>When flat (θ = 0°) the axes align with forces → no need to resolve Mg into components.</li>
                <li>Equilibrium in y: <strong>ΣF<sub>y</sub> = R_N − Mg = 0</strong></li>
              </ul>
            </div>
            <div className="mt-4 p-3 bg-white rounded-md border-l-4 border-blue-500">
              <p className="font-semibold text-base text-gray-800 mb-2">Question:</p>
              <p className="text-base text-gray-700">On a flat surface, what is the direction of the Normal Reaction Force R_N?</p>
            </div>
            {!answeredQuestions.has('step1-q1') ? (
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={() => {
                    onShowFeedback("Correct! On a flat surface, R_N points vertically upward, perpendicular to the surface.");
                    onMarkAnswered('step1-q1');
                  }}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Vertically Upward
                </button>
                <button
                  onClick={() => onShowFeedback("Not quite. 'Parallel to surface' would mean horizontal. Normal means perpendicular. Try again.")}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Parallel to Surface
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNextStep(2)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6 py-3 uppercase text-base shadow transition-all duration-200"
              >
                Got it! Next →
              </button>
            )}
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-md inline-block mb-3 text-base font-bold">
              STEP 2: FLAT SURFACE (FRICTION)
            </div>
            <p className="mt-3 leading-relaxed text-base md:text-lg text-gray-700">
              Now, let's try to move the block.
            </p>
            <ol className="list-decimal list-inside mt-3 space-y-2 leading-relaxed text-base md:text-lg text-gray-700">
              <li>Keep angle at <strong>0°</strong>.</li>
              <li>Add <strong className="text-red-600">"Tension (T)"</strong>.</li>
              <li>Select <strong className="text-yellow-600">"Impending Motion Up-Slope"</strong> (i.e., "to the right").</li>
            </ol>
            <div className="mt-4 p-4 bg-white rounded-md border-l-4 border-blue-500">
              <p className="font-semibold text-base text-gray-800 mb-2">Question:</p>
              <p className="text-base text-gray-700">The block is *about* to move right. What is the direction of the friction force (F_f)?</p>
            </div>
            {!answeredQuestions.has('step2') ? (
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={() => checkAnswer(
                    'step2',
                    'left',
                    'left',
                    "Correct! Friction always opposes the impending motion. The block wants to move right, so friction pulls left.",
                    "Not quite. Friction *opposes* motion. Try again."
                  )}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Opposite (Left)
                </button>
                <button
                  onClick={() => checkAnswer(
                    'step2',
                    'right',
                    'left',
                    "Correct! Friction always opposes the impending motion.",
                    "Not quite. Friction *opposes* motion. Try again."
                  )}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Same (Right)
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onUpdateSimulation({ showTension: true, motionDirection: 'up' });
                  onNextStep(3);
                }}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6 py-3 uppercase text-base shadow transition-all duration-200"
              >
                Next Step: Inclined Planes →
              </button>
            )}
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-md inline-block mb-3 text-base font-bold">
              STEP 3: INCLINED PLANE
            </div>
            <p className="mt-2 leading-relaxed text-sm md:text-base text-gray-700">
              This is the most important part. <strong className="text-red-600">Uncheck all forces first.</strong>
            </p>
            <ol className="list-decimal list-inside mt-3 space-y-1 leading-relaxed text-sm md:text-base text-gray-700">
              <li>Click <strong className="text-red-600">"Reset Everything"</strong> (in Controls panel).</li>
              <li>Set <strong className="text-blue-600">Angle</strong> to <strong>30°</strong>.</li>
              <li>Check <strong className="text-blue-600">"Mass (Mg) & R_N"</strong>.</li>
            </ol>
            <div className="mt-4 p-3 bg-white rounded-md border-l-4 border-blue-500">
              <p className="font-semibold text-base text-gray-800 mb-2">Question 1:</p>
              <p className="text-base text-gray-700">What is the direction of the Weight (Mg)?</p>
            </div>
            {!answeredQuestions.has('step3-q1') ? (
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={() => checkAnswer(
                    'step3-q1',
                    'down',
                    'down',
                    "Correct! Weight (Mg) *always* acts vertically down, towards the center of the Earth, regardless of the incline.",
                    "Not quite. That's the direction of the Normal Force. Weight always points straight down. Try again."
                  )}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Vertically Down
                </button>
                <button
                  onClick={() => checkAnswer(
                    'step3-q1',
                    'perp',
                    'down',
                    "Correct!",
                    "Not quite. That's the direction of the Normal Force. Weight always points straight down. Try again."
                  )}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Perpendicular
                </button>
              </div>
            ) : !answeredQuestions.has('step3-q2') ? (
              <>
                <div className="mt-4 p-3 bg-white rounded-md border-l-4 border-blue-500">
                  <p className="font-semibold text-base text-gray-800 mb-2">Question 2:</p>
                  <p className="text-base text-gray-700">Excellent. Now, what is the direction of the Normal Force (R_N)?</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <button
                    onClick={() => {
                      onShowFeedback("Perfect! The Normal Force (R_N) is *always* perpendicular to the surface that provides the support.");
                      onMarkAnswered('step3-q2');
                      onNextStep(4);
                    }}
                    className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                  >
                    Perpendicular
                  </button>
                  <button
                    onClick={() => onShowFeedback("Not quite. The Normal Force must be perpendicular (or 'normal') to the surface. Try again.")}
                    className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                  >
                    Vertically Up
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-md inline-block mb-3 text-base font-bold">
              STEP 4: WHEN & HOW TO RESOLVE WEIGHT
            </div>
            <p className="mt-2 leading-relaxed text-sm md:text-base text-gray-700">
              On an incline, our analysis axes (x' parallel to plane, y' perpendicular) are <em>tilted</em>. The Weight (Mg) is vertical, so it does not lie purely along either axis — we must resolve it.
            </p>
            <div className="mt-4 p-3 bg-white rounded-md border-l-4 border-blue-500">
              <p className="font-semibold text-base text-gray-800 mb-2">Question 1:</p>
              <p className="text-base text-gray-700">When do we need to split (resolve) the Weight into x- and y-components?</p>
            </div>
            {!answeredQuestions.has('step4-q1') && (
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={() => {
                    onShowFeedback("Correct! Only when axes are not aligned with the force — e.g. on an inclined plane (θ ≠ 0°) or using rotated axes.");
                    onMarkAnswered('step4-q1');
                  }}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  When θ ≠ 0° (Incline)
                </button>
                <button
                  onClick={() => onShowFeedback("Not quite. On a flat surface (θ = 0°) Mg already aligns with the y-axis. No need to resolve. Try again.")}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Always
                </button>
              </div>
            )}
            {answeredQuestions.has('step4-q1') && (
              <>
                <ol className="list-decimal list-inside mt-4 space-y-1 leading-relaxed text-sm md:text-base text-gray-700">
                  <li>Components: <strong className="text-blue-600">Mg·sin(θ)</strong> (parallel, drives motion) & <strong className="text-blue-600">Mg·cos(θ)</strong> (perpendicular, balanced by R_N).</li>
                  <li>Toggle <strong className="text-blue-600">"Show Equations"</strong> to see ΣF expressions.</li>
                </ol>
                <div className="mt-4 p-3 bg-white rounded-md border-l-4 border-blue-500">
                  <p className="font-semibold text-base text-gray-800 mb-2">Question 2:</p>
                  <p className="text-base text-gray-700">Look at the ΣF<sub>y'</sub> equation. Which component of weight does the Normal Force (R_N) balance?</p>
                </div>
                {!answeredQuestions.has('step4-q2') ? (
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button
                      onClick={() => {
                        onShowFeedback("Exactly! R_N balances Mg·cos(θ), the perpendicular component.");
                        onMarkAnswered('step4-q2');
                      }}
                      className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                    >
                      Mg·cos(θ)
                    </button>
                    <button
                      onClick={() => onShowFeedback("Not quite. Mg·sin(θ) lies along the plane (x'). R_N is perpendicular (y'). Try again.")}
                      className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                    >
                      Mg·sin(θ)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onNextStep(5)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6 py-3 uppercase text-base shadow transition-all duration-200"
                  >
                    Next Step →
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-md inline-block mb-3 text-base font-bold">
              STEP 5: EQUILIBRIUM ON INCLINE
            </div>
            <p className="mt-2 leading-relaxed text-sm md:text-base text-gray-700">
              The component <strong className="text-blue-600">Mg·sin(θ)</strong> is trying to pull the block *down* the incline. Let's add friction to stop it.
            </p>
            <ol className="list-decimal list-inside mt-3 space-y-1 leading-relaxed text-sm md:text-base text-gray-700">
              <li>Select <strong className="text-yellow-600">"Impending Motion Down-Slope"</strong>.</li>
            </ol>
            <div className="mt-4 p-3 bg-white rounded-md border-l-4 border-blue-500">
              <p className="font-semibold text-base text-gray-800 mb-2">Question:</p>
              <p className="text-base text-gray-700">To prevent the block from sliding down, what direction must the friction force (F_f) act?</p>
            </div>
            {!answeredQuestions.has('step5') ? (
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={() => {
                    onShowFeedback("You got it! The block wants to slide *down* due to Mg·sin(θ), so the friction force (F_f) must act *up* the incline to oppose it.");
                    onMarkAnswered('step5');
                    onUpdateSimulation({ motionDirection: 'down' });
                  }}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Up the Incline
                </button>
                <button
                  onClick={() => onShowFeedback("Not quite. Remember, friction *opposes* impending motion. The block is about to slide *down*. Try again.")}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-5 py-3 font-bold text-base uppercase hover:bg-gray-100 transition-all duration-200"
                >
                  Down the Incline
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNextStep(6)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6 py-3 uppercase text-base shadow transition-all duration-200"
              >
                Finish Module →
              </button>
            )}
          </div>
        )}

        {/* Step 6 - Complete */}
        {currentStep === 6 && (
          <div>
            <div className="bg-green-600 text-white px-4 py-2 rounded-md inline-block mb-3 text-base font-bold">
              ✓ MODULE COMPLETE!
            </div>
            <p className="mt-2 leading-relaxed text-sm md:text-base font-semibold text-gray-700">
              You've mastered the core concepts!
            </p>
            <div className="mt-4 p-4 bg-white rounded-md border-l-4 border-green-500">
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong className="text-green-600">Normal Force (R_N)</strong> is *perpendicular* to the surface.</li>
                <li><strong className="text-blue-600">Weight (Mg)</strong> is *vertically down*.</li>
                <li>Weight is resolved into <strong className="text-blue-600">Mg·cos(θ)</strong> and <strong className="text-blue-600">Mg·sin(θ)</strong>.</li>
                <li><strong className="text-yellow-600">Friction (F_f)</strong> *opposes* impending motion.</li>
              </ul>
            </div>
            <p className="mt-4 font-bold text-sm text-blue-600">
              You are now in "Free Play" mode.
            </p>
            <div className="mt-3 p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
              <p className="font-bold text-sm text-gray-800">Note on Ch 5.3:</p>
              <p className="text-xs text-gray-700 mt-1">
                For forces at an angle (like the 120N example), you must first resolve that force into its *own* parallel (x') and perpendicular (y') components. Then, add them to the ΣFx and ΣFy equations.
              </p>
            </div>
            <button
              onClick={onReset}
              className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold uppercase rounded-lg px-6 py-3 text-sm shadow transition-all duration-200"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidedLearning;
