import { useTrackingStore } from "@/store/trackingStore";

const Profile = () => {
  const userProfile = useTrackingStore((s) => s.userProfile);

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

  const details = [
    { label: "Name", value: userProfile.name },
    { label: "Age", value: `${userProfile.age} years` },
    { label: "Weight", value: `${userProfile.weight} kg` },
    { label: "Gender", value: userProfile.gender },
    { label: "Activity Level", value: userProfile.activityLevel },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold text-foreground mb-8">Profile</h1>
      <div className="bg-card border border-border p-6 max-w-md">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between py-3 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground font-sans">{d.label}</span>
            <span className="text-sm text-card-foreground font-sans font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
