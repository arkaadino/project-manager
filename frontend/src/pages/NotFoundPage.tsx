import { useNavigate } from "react-router-dom";
import FaultyTerminal from "@/reactbits/FaultyTerminal/FaultyTerminal";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen bg-gray-800 flex flex-col items-center justify-center text-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <FaultyTerminal
          scale={5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0}
          tint="#305491"
          mouseReact={false}
          mouseStrength={0.5}
          pageLoadAnimation={false}
          brightness={1}
        />
      </div>
      <div className="absolute inset-0 z-5 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-blue-900/20"></div>

      {/* Centered content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-8xl text-white font-bold mb-4">404</h1>
        <span className="text-2xl text-white mb-6 block">
          There's nothing here..
        </span>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>        
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;