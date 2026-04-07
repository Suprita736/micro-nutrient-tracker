import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center px-6">
        <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-4">
          MicroTrack
        </h1>
        <p className="text-muted-foreground font-sans text-lg md:text-xl max-w-md mx-auto mb-10">
          Track your daily micronutrient goals with precision.
        </p>
        <Button variant="hero" size="lg" onClick={() => navigate("/onboarding")}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Landing;
