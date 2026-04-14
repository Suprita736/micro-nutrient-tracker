import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleUpdatePassword = async () => {
        setErrorMsg("");

        if (!password || !confirmPassword) {
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
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setErrorMsg(error.message);
                return;
            }

            // Successfully updated, go to login
            navigate("/login");

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
                    Update Password
                </h1>
                
                <p className="text-muted-foreground font-sans text-xs text-center mb-8">
                    Set a new secure password for your MicroTrack account.
                </p>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New password"
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

                <div className="flex flex-col mt-6">
                    <button
                        onClick={handleUpdatePassword}
                        disabled={loading}
                        className="w-full border border-primary text-primary h-10 font-sans tracking-wide uppercase text-xs font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update password"}
                    </button>
                </div>
            </div>
        </div>
    );
}
