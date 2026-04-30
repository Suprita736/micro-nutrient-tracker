import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const slides = [
    {
        title: "Why micronutrients matter",
        description:
            "Your body needs more than calories. Nutrients like iron, magnesium, zinc, vitamins, and omega-3 support energy, immunity, focus, and long-term health.",
    },
    {
        title: "Your targets are personalized",
        description:
            "MicroTrack calculates daily nutrient requirements based on your age, weight, height, gender, and activity level.",
    },
    {
        title: "Track daily and build consistency",
        description:
            "Log foods you eat throughout the day. MicroTrack shows real-time progress and helps you maintain streaks.",
    },
];

export default function Intro() {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const next = () => {
        if (step === slides.length - 1) {
            localStorage.setItem("hasSeenIntro", "true");
            navigate("/dashboard");
        } else {
            setStep(step + 1);
        }
    };
    useEffect(() => {
        const hasSeen = localStorage.getItem("hasSeenIntro");
        if (hasSeen) {
            navigate("/dashboard", { replace: true });
        }
    }, []);
    const back = () => setStep(step - 1);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-card border border-border p-8 text-center">

                <h2 className="font-serif text-2xl mb-4">
                    {slides[step].title}
                </h2>

                <p className="text-muted-foreground mb-8">
                    {slides[step].description}
                </p>

                <div className="flex justify-between items-center">

                    {step > 0 ? (
                        <Button variant="outline" onClick={back}>
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    <Button onClick={next}>
                        {step === slides.length - 1 ? "Start Tracking" : "Next"}
                    </Button>

                </div>

                <div className="mt-6 flex justify-center gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 w-6 ${i === step ? "bg-primary" : "bg-border"
                                }`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}