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
      <div className="fixed bottom-24 left-12 max-w-sm space-y-6 text-white font-semibold">
        <p className="text-lg leading-snug">
          Solve UX crimes through interactive decision-making.<br />
          Ready to crack your first case?
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