import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleResetRequest = async () => {
        setMessage("");
        setErrorMsg("");

        if (!email) {
            setErrorMsg("Please enter your email");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + "/update-password"
            });

            if (error) {
                setErrorMsg("Failed to send reset email");
                return;
            }

            setMessage("Check your email for the reset link");
        } catch (err) {
            setErrorMsg("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md border border-border bg-card p-8">
                <h1 className="font-serif text-2xl text-center mb-6 text-foreground">
                    Reset Password
                </h1>
                
                <p className="text-muted-foreground font-sans text-xs text-center mb-8">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 border border-border bg-background px-3 font-sans text-sm outline-none focus:border-primary text-foreground"
                    />
                </div>

                {errorMsg && (
                    <p className="text-destructive text-xs mt-3 font-sans">
                        {errorMsg}
                    </p>
                )}

                {message && (
                    <p className="text-primary text-xs mt-3 font-sans">
                        {message}
                    </p>
                )}

                <div className="flex flex-col mt-6">
                    <button
                        onClick={handleResetRequest}
                        disabled={loading}
                        className="w-full border border-primary text-primary h-10 font-sans tracking-wide uppercase text-xs font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                    
                    <button
                        onClick={() => navigate("/login")}
                        className="mt-6 text-muted-foreground text-xs font-sans hover:text-primary transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
