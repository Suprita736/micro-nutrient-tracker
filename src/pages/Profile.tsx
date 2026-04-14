import { useState } from "react";
import { useTrackingStore } from "@/store/trackingStore";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/data/nutrients";
import { StreakCalendar } from "@/components/StreakCalendar";
import { Trophy, Flame, MapPin, User, Activity, Weight, Ruler, Calendar as CalendarIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const activityLevels = [
  "Sedentary",
  "Light activity",
  "Moderate activity",
  "Active",
  "Very active",
];

const Profile = () => {
  const userProfile = useTrackingStore((s) => s.userProfile);
  const updateProfile = useTrackingStore((s) => s.updateProfile);
  const currentStreak = useTrackingStore((s) => s.currentStreak);
  const longestStreak = useTrackingStore((s) => s.longestStreak);

  const [isEditing, setIsEditing] = useState(false);
  const [age, setAge] = useState(userProfile?.age.toString() || "");
  const [weight, setWeight] = useState(userProfile?.weight.toString() || "");
  const [height, setHeight] = useState(userProfile?.height?.toString() || "170");
  const [activityLevel, setActivityLevel] = useState(userProfile?.activityLevel || "");
  const [country, setCountry] = useState(userProfile?.country || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">Profile</h1>
        <p className="text-muted-foreground font-sans text-sm">
          No profile set. Please complete onboarding first.
        </p>
      </div>
    );
  }

  const handleUpdate = async () => {
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);

    const e: Record<string, string> = {};
    if (!age || ageNum < 1 || ageNum > 120) e.age = "Age must be 1–120";
    if (!weight || weightNum < 20 || weightNum > 300) e.weight = "Weight must be 20–300 kg";
    if (!height || heightNum < 120 || heightNum > 220) e.height = "Height must be 120–220 cm";

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const { data } = await supabase.auth.getUser();

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        name: userProfile.name,
        age: ageNum,
        weight: weightNum,
        height: heightNum,
        gender: userProfile.gender,
        activity_level: activityLevel,
        country: country
      });
    }

    updateProfile({
      ...userProfile,
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      activityLevel,
      country,
    });
    setIsEditing(false);
    setErrors({});
  };

  const details = [
    { label: "Name", value: userProfile.name },
    { label: "Age", value: `${userProfile.age} years`, editKey: "age" },
    { label: "Weight", value: `${userProfile.weight} kg`, editKey: "weight" },
    { label: "Height", value: `${userProfile.height || 170} cm`, editKey: "height" },
    { label: "Gender", value: userProfile.gender },
    { label: "Activity Level", value: userProfile.activityLevel, editKey: "activity" },
    { label: "Country", value: userProfile.country || "Not set", editKey: "country" },
  ];

  const history = useTrackingStore((s) => s.history);
  const userHistory = history.filter((entry) => entry.userId === userProfile.id);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-foreground">Profile</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Manage your information and view your consistency.</p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="rounded-none border-primary/20 text-primary hover:bg-primary/5 h-9 px-6 text-xs font-sans tracking-wide uppercase font-semibold transition-all hover:shadow-sm"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* PROFILE INFO CARD */}
        <div className="lg:col-span-2 bg-card border border-border p-8 flex flex-col h-full shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <User size={18} className="text-primary/70" />
            <h2 className="font-serif text-xl font-semibold text-foreground uppercase tracking-tight">Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {details.map((d) => (
              <div key={d.label} className="flex justify-between items-center py-4 border-b border-border/50 last:border-0 md:last:border-b">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-sans uppercase tracking-wider">{d.label}</span>
                </div>
                {isEditing && d.editKey ? (
                  <div className="w-1/2">
                    {/* ... (Existing edit inputs) */}
                    {d.editKey === "age" ? (
                      <>
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={`w-full h-8 px-2 bg-background border ${errors.age ? 'border-destructive' : 'border-border'} text-foreground font-sans text-xs`} />
                        {errors.age && <p className="text-destructive text-[10px] mt-1 font-sans">{errors.age}</p>}
                      </>
                    ) : d.editKey === "weight" ? (
                      <>
                        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={`w-full h-8 px-2 bg-background border ${errors.weight ? 'border-destructive' : 'border-border'} text-foreground font-sans text-xs`} />
                        {errors.weight && <p className="text-destructive text-[10px] mt-1 font-sans">{errors.weight}</p>}
                      </>
                    ) : d.editKey === "height" ? (
                      <>
                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={`w-full h-8 px-2 bg-background border ${errors.height ? 'border-destructive' : 'border-border'} text-foreground font-sans text-xs`} />
                        {errors.height && <p className="text-destructive text-[10px] mt-1 font-sans">{errors.height}</p>}
                      </>
                    ) : d.editKey === "country" ? (
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full h-8 px-2 bg-background border border-border text-foreground font-sans text-xs">
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="w-full h-8 px-2 bg-background border border-border text-foreground font-sans text-xs">
                        {activityLevels.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-card-foreground font-sans font-medium">{d.value}</span>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="mt-auto pt-8 flex gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="hero" className="flex-1 rounded-none h-10 text-xs">
                    Save Changes
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-none border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-serif">Update profile?</AlertDialogTitle>
                    <AlertDialogDescription className="font-sans">
                      Updating your profile will recalculate your requirements and reset today's tracking progress.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none font-sans">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-none bg-primary text-primary-foreground hover:bg-primary/80 font-sans"
                      onClick={handleUpdate}
                    >
                      Update
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                variant="outline"
                className="flex-1 rounded-none h-10 text-xs"
                onClick={() => {
                  setIsEditing(false);
                  setAge(userProfile.age.toString());
                  setWeight(userProfile.weight.toString());
                  setHeight(userProfile.height?.toString() || "170");
                  setActivityLevel(userProfile.activityLevel);
                  setCountry(userProfile.country || "");
                  setErrors({});
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* STREAK SUMMARY CARD */}
        <div className="bg-card border border-border p-8 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <Trophy size={18} className="text-primary/70" />
              <h2 className="font-serif text-xl font-semibold text-foreground uppercase tracking-tight">Consistency</h2>
            </div>

            <div className="space-y-10">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-sans uppercase tracking-[0.2em] mb-2">Current Streak</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-bold text-foreground lining-nums tabular-nums uppercase">{currentStreak}</span>
                  <span className="text-xl text-muted-foreground font-serif italic">days</span>
                  <Flame size={24} className="text-primary ml-1 animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-sans uppercase tracking-[0.2em] mb-2">Longest Streak</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-medium text-foreground lining-nums tabular-nums">{longestStreak}</span>
                  <span className="text-lg text-muted-foreground font-serif italic">days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-widest leading-relaxed">
              Your dedication to micronutrient tracking builds a foundation for long-term health.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <StreakCalendar history={userHistory} />
      </div>
    </div>
  );
};

export default Profile;


