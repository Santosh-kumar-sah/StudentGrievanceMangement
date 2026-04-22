import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 -z-20"
      options={{
        fullScreen: false,
        background: {
          color: "transparent"
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 70,
            density: {
              enable: true,
              area: 900
            }
          },
          color: {
            value: ["#22d3ee", "#818cf8", "#10b981"]
          },
          links: {
            enable: true,
            distance: 130,
            color: "#94a3b8",
            opacity: 0.15,
            width: 1
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            outModes: {
              default: "out"
            }
          },
          opacity: {
            value: 0.35
          },
          size: {
            value: { min: 1, max: 3 }
          }
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab"
            }
          },
          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.25
              }
            }
          }
        },
        detectRetina: true
      }}
    />
  );
};

export default ParticleBackground;
