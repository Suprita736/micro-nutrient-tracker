import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTrackingStore } from "@/store/trackingStore";

const activityLevels = [
  "Sedentary",
  "Light activity",
  "Moderate activity",
  "Active",
  "Very active",
];

const genders = ["Male", "Female", "Other"];

const Onboarding = () => {
  const navigate = useNavigate();
  const setUserProfile = useTrackingStore((s) => s.setUserProfile);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    const ageNum = Number(age);
    if (!age || ageNum < 1 || ageNum > 120) e.age = "Age must be 1–120";
    const weightNum = Number(weight);
    if (!weight || weightNum < 20 || weightNum > 300) e.weight = "Weight must be 20–300 kg";
    if (!gender) e.gender = "Select a gender";
    if (!activityLevel) e.activityLevel = "Select activity level";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setUserProfile({
      name: name.trim(),
      age: Number(age),
      weight: Number(weight),
      gender,
      activityLevel,
    });
    navigate("/dashboard");
  };

  const inputClass =
    "w-full h-10 px-3 bg-background border border-input text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ring rounded-none";
  const selectClass =
    "w-full h-10 px-3 bg-background border border-input text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ring rounded-none appearance-none";

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-md bg-card border border-border p-8">
        <h2 className="font-serif text-2xl font-semibold text-card-foreground mb-6">
          Enter your details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Full Name" error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </Field>
          <Field label="Age" error={errors.age}>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={inputClass}
              min={1}
              max={120}
              placeholder="25"
            />
          </Field>
          <Field label="Weight (kg)" error={errors.weight}>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={inputClass}
              min={20}
              max={300}
              placeholder="65"
            />
          </Field>
          <Field label="Gender" error={errors.gender}>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
              <option value="">Select</option>
              {genders.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Activity Level" error={errors.activityLevel}>
            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className={selectClass}>
              <option value="">Select</option>
              {activityLevels.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Button type="submit" variant="hero" size="lg" className="w-full mt-2">
            Start Tracking
          </Button>
        </form>
      </div>
    </div>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-sans font-medium text-foreground mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-destructive text-xs mt-1 font-sans">{error}</p>}
  </div>
);

export default Onboarding;
