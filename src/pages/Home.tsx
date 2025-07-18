import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen">
      {/* Background image (already wired) */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/backgrounds/landing.png)" }}
      />

      {/* Copy & CTA in billboard space */}
      <div className="fixed bottom-32 left-24 max-w-sm space-y-6 text-white font-semibold">
        <p className="text-lg leading-snug">
          Unmask the evil patterns haunting Siliconark.<br />
          Your case file awaits.
        </p>

        <button
          className="btn-3d"
          onClick={() => {
            localStorage.removeItem("ii-session");
            navigate("/play");
          }}
        >
          Start investigation
        </button>
      </div>
    </div>
  );
}