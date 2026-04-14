import { useNavigate } from "react-router-dom";

export default function Privacy() {
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-8">
                MicroTrack Privacy Policy
            </h1>
            
            <div className="space-y-6 text-muted-foreground font-sans text-sm leading-relaxed">
                <p>
                    Your privacy is important to us. MicroTrack is built with data security as a priority.
                </p>
                
                <div>
                    <h2 className="text-foreground font-serif text-lg mb-3">What we store:</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Email address for account authentication.</li>
                        <li>Nutrition history snapshots for progress tracking.</li>
                        <li>Basic profile data (age, weight, activity level) for requirement calculations.</li>
                    </ul>
                </div>

                <p>
                    <strong>Data Usage:</strong> We do not sell your data. We do not share your personal 
                    information with third parties for marketing purposes.
                </p>

                <p>
                    <strong>Security:</strong> All application data is securely stored and managed using 
                    Supabase, ensuring industry-standard encryption and protection.
                </p>
            </div>

            <button
                onClick={() => navigate(-1)}
                className="mt-12 text-primary text-xs font-sans hover:underline uppercase tracking-wider font-semibold"
            >
                Back
            </button>
        </div>
    );
}
