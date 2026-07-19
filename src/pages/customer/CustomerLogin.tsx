import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Phone, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import vinLogo from "@/assets/patliputra-vinfast-logo.png";
import { hasApi } from "@/lib/apiConfig";
import { ApiRequestError, formatApiErrors } from "@/lib/api";
import { customerCheckMobile, customerLogin } from "@/lib/customerApi";
import { setCustomerSession } from "@/lib/customerAuth";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("reason") === "session-expired";

  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      setError("Please enter your mobile number");
      return;
    }
    if (!hasApi()) {
      setError("Online login is unavailable. Please contact the showroom.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await customerCheckMobile(mobile.trim());
      setCustomerName(data.name);
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiRequestError ? formatApiErrors(err) : "Could not verify mobile number");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { token, customer } = await customerLogin(mobile.trim(), otp.trim());
      setCustomerSession(token, customer);
      navigate("/customer/bookings", { replace: true });
    } catch (err) {
      setError(err instanceof ApiRequestError ? formatApiErrors(err) : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
            <div className="text-center mb-8">
              <img
                src={vinLogo}
                alt="Patliputra VinFast"
                className="mx-auto mb-4 h-14 w-auto object-contain"
              />
              <h1 className="font-display text-2xl font-bold text-foreground">Customer Login</h1>
              <p className="text-sm text-muted-foreground mt-2">
                View and manage your test drive bookings using the mobile number from your booking form.
              </p>
            </div>

            {sessionExpired ? (
              <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
                Your session expired. Please log in again.
              </div>
            ) : null}

            {error ? (
              <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {step === "mobile" ? (
              <form onSubmit={handleCheckMobile} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="customer-mobile">Mobile number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="customer-mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="pl-10 h-12"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use the same number you entered on the test drive booking form.
                  </p>
                </div>
                <Button type="submit" className="w-full h-12" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 text-sm">
                  <p className="font-medium text-foreground">{customerName || "Customer"}</p>
                  <p className="text-muted-foreground">+91 {mobile}</p>
                  <button
                    type="button"
                    className="text-primary text-xs mt-1 hover:underline"
                    onClick={() => {
                      setStep("mobile");
                      setOtp("");
                      setError("");
                    }}
                  >
                    Change number
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-otp">OTP</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="customer-otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-10 h-12 uppercase"
                      autoComplete="one-time-code"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For now, use the default OTP: <span className="font-semibold text-foreground">4M0</span>
                  </p>
                </div>

                <Button type="submit" className="w-full h-12" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Login
                </Button>
              </form>
            )}

            <p className="text-center text-xs text-muted-foreground mt-6">
              Haven&apos;t booked yet?{" "}
              <Link to="/test-drive" className="text-primary hover:underline">
                Book a test drive
              </Link>
            </p>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Staff member?{" "}
              <Link to="/admin/login" className="text-primary hover:underline">
                Login as Admin
              </Link>
              {" · "}
              <Link to="/login" className="text-primary hover:underline">
                All login options
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
