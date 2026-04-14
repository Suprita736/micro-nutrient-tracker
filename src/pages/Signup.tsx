import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff } from "lucide-react";

// New Signup Page

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async () => {
        setErrorMsg("");

        if (!email || !password || !confirmPassword) {
            setErrorMsg("Please fill in all fields");
            return;
        }

        if (password.length < 8) {
            setErrorMsg("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setErrorMsg(error.message);
                return;
            }

            // show confirmation message instead of redirecting
            setSuccessMsg(
                "Confirmation email sent. Please check your inbox before logging in."
            );
        } catch (err) {
            setErrorMsg("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    async function handleGoogleSignup() {
        setErrorMsg("");
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) {
            setErrorMsg(error.message);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md border border-border bg-card p-8">
                <h1 className="font-serif text-2xl text-center mb-6 text-foreground">
                    Create your MicroTrack account
                </h1>

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 border border-border bg-background px-3 font-sans text-sm outline-none focus:border-primary text-foreground"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-10 border border-border bg-background pl-3 pr-10 font-sans text-sm outline-none focus:border-primary text-foreground"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-10 border border-border bg-background px-3 font-sans text-sm outline-none focus:border-primary text-foreground"
                    />
                </div>

                {errorMsg && (
                    <p className="text-destructive text-xs mt-3 font-sans">
                        {errorMsg}
                    </p>
                )}
                {successMsg && (
                    <p className="text-green-500 text-xs mt-3 font-sans">
                        {successMsg}
                    </p>
                )}
                <div className="flex flex-col mt-6">
                    <button
                        onClick={handleSignup}
                        disabled={loading}
                        className="w-full border border-primary text-primary h-10 font-sans tracking-wide uppercase text-xs font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "CREATE ACCOUNT"}
                    </button>

                    <p className="mt-4 text-[11px] text-muted-foreground font-sans text-center leading-relaxed">
                        By signing up, you agree to our <br />
                        <button onClick={() => navigate("/terms")} className="text-primary hover:underline">Terms of Service</button>
                        {" and "}
                        <button onClick={() => navigate("/privacy")} className="text-primary hover:underline">Privacy Policy</button>
                    </p>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-3 text-muted-foreground font-sans">OR</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center border border-border text-foreground h-10 font-sans text-sm hover:bg-muted/50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Sign up with Google
                    </button>
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground font-sans">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-primary hover:underline bg-transparent border-none p-0 outline-none font-semibold"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
