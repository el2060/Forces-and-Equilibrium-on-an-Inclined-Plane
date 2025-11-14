import { useState } from 'react';

const Instructions = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 md:p-5 border-t border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left hover:bg-white/50 p-3 rounded-lg transition-colors"
      >
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          💡 How to Use This Simulation
        </h3>
        <span className="text-3xl text-blue-600 font-bold">
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Two Modes Section */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <h4 className="text-lg font-bold text-gray-800 mb-3">📚 Two Ways to Learn:</h4>
            
            <div className="space-y-3">
              {/* Mode 1 */}
              <div className="bg-blue-50 rounded-md p-3">
                <p className="font-bold text-blue-700 mb-1">1️⃣ GUIDED MODE (Recommended for Learning)</p>
                <p className="text-sm text-gray-700">
                  Follow the step-by-step tutorial above. The app will highlight which controls to use and ask questions to test your understanding.
                </p>
              </div>
              
              {/* Mode 2 */}
              <div className="bg-green-50 rounded-md p-3">
                <p className="font-bold text-green-700 mb-1">2️⃣ FREEFORM MODE (For Experimentation)</p>
                <p className="text-sm text-gray-700">
                  Ignore the guided steps and play with any controls you want! Adjust angles, forces, and friction to explore different scenarios.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <h4 className="text-lg font-bold text-gray-800 mb-3">🚀 Quick Start Guide:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-700">
              <li>
                <strong>Visualization Panel:</strong> Watch the block, forces, and free body diagram (FBD) in the center.
              </li>
              <li>
                <strong>Controls Panel (Right):</strong> Adjust angle, mass, tension, push force, and friction settings.
              </li>
              <li>
                <strong>Show Equations:</strong> Click "Show" button below visualization to see equilibrium equations.
              </li>
              <li>
                <strong>Reset Everything:</strong> Red button in Controls resets all settings and guided learning progress.
              </li>
            </ol>
          </div>

          {/* Force Colors Legend */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <h4 className="text-lg font-bold text-gray-800 mb-3">🎨 Force Colors:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-600"></span>
                <span className="text-gray-700"><strong>Blue:</strong> Weight (Mg)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                <span className="text-gray-700"><strong>Green:</strong> Normal (R_N)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500"></span>
                <span className="text-gray-700"><strong>Red:</strong> Tension (T)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500"></span>
                <span className="text-gray-700"><strong>Cyan:</strong> Push (P)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                <span className="text-gray-700"><strong>Yellow:</strong> Friction (F_f)</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-lg font-bold text-gray-800 mb-2">💡 Pro Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Forces automatically scale to stay visible on screen</li>
              <li>Weight (Mg) always points straight down (gravity!)</li>
              <li>Normal force is always perpendicular to the surface</li>
              <li>Friction opposes the direction of impending motion</li>
              <li>All equations assume equilibrium (net force = 0)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;
