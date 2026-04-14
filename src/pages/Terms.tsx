import { useNavigate } from "react-router-dom";

export default function Terms() {
    const navigate = useNavigate();
    
    return (
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-8">
                MicroTrack Terms of Service
            </h1>
            
            <div className="space-y-6 text-muted-foreground font-sans text-sm leading-relaxed">
                <p>
                    This application provides nutrition tracking guidance only. 
                    It is designed to help you monitor your micronutrient intake based on general 
                    nutritional guidelines.
                </p>
                <p>
                    <strong>Important:</strong> MicroTrack does not replace professional medical advice, 
                    diagnosis, or treatment. Always seek the advice of your physician or other qualified 
                    health provider with any questions you may have regarding a medical condition.
                </p>
                <p>
                    Users are solely responsible for how they interpret and act upon the nutritional data 
                    provided by this application.
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
