import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendWhatsAppOtp, verifyWhatsAppOtp } from "@/lib/whatsappOtpApi";
import { formatApiErrors } from "@/lib/api";
import { usePublicFormRecaptcha } from "@/context/PublicRecaptchaContext";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";

const MOBILE_OK = /^[6-9]\d{9}$/;

type WhatsAppOtpVerifyProps = {
  /** 10-digit Indian mobile (digits only). */
  mobile: string;
  /** Used in AiSensy template (FirstName / greeting). */
  displayName: string;
  /** reCAPTCHA v3 action name for send endpoint. */
  recaptchaAction: string;
  /** When false, render nothing. */
  enabled: boolean;
  /** Called with JWT after successful verify; null when mobile changes or reset. */
  onTokenChange: (token: string | null) => void;
  className?: string;
};

/**
 * WhatsApp OTP gate for public forms when API exposes `siteConfig.features.whatsappOtp`.
 */
export function WhatsAppOtpVerify({
  mobile,
  displayName,
  recaptchaAction,
  enabled,
  onTokenChange,
  className = "",
}: WhatsAppOtpVerifyProps) {
  const { getToken } = usePublicFormRecaptcha();
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setCode("");
    setSent(false);
    setVerified(false);
    onTokenChange(null);
  }, [mobile, onTokenChange]);

  const mobileOk = MOBILE_OK.test(mobile);

  const handleSend = async () => {
    if (!mobileOk) {
      toast.error("Enter a valid 10-digit mobile number first.");
      return;
    }
    setSending(true);
    try {
      let recaptchaToken: string | undefined;
      try {
        recaptchaToken = await getToken(recaptchaAction);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Security verification failed.");
        return;
      }
      await sendWhatsAppOtp({
        mobile,
        name: displayName.trim() || "Customer",
        recaptchaToken,
      });
      setSent(true);
      toast.success("Check WhatsApp for your verification code.");
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    const digits = code.replace(/\D/g, "").slice(0, 6);
    if (digits.length !== 6) {
      toast.error("Enter the 6-digit code from WhatsApp.");
      return;
    }
    setVerifying(true);
    try {
      const { data } = await verifyWhatsAppOtp({ mobile, code: digits });
      const raw = data as { verificationToken?: string };
      const token = raw?.verificationToken;
      if (!token) {
        toast.error("Verification failed. Try again.");
        return;
      }
      setVerified(true);
      onTokenChange(token);
      toast.success("Mobile verified.");
    } catch (e) {
      toast.error(formatApiErrors(e));
    } finally {
      setVerifying(false);
    }
  };

  if (!enabled) return null;

  return (
    <div
      className={`rounded-xl border border-primary/25 bg-primary/[0.06] p-4 space-y-3 ${className}`}
      role="region"
      aria-label="WhatsApp verification"
    >
      <div className="flex items-start gap-2">
        <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Verify with WhatsApp</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            We&apos;ll send a one-time code to your WhatsApp on this number so we know it&apos;s really you.
          </p>
        </div>
      </div>

      {!verified ? (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!mobileOk || sending}
            onClick={() => void handleSend()}
            className="shrink-0 border-primary/40"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              "Send code on WhatsApp"
            )}
          </Button>
          {sent && (
            <>
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="sm:max-w-[9rem] bg-background/80"
                aria-label="WhatsApp verification code"
              />
              <Button
                type="button"
                size="sm"
                disabled={verifying || code.replace(/\D/g, "").length !== 6}
                onClick={() => void handleVerify()}
                className="bg-primary text-primary-foreground shrink-0"
              >
                {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden />
          <span>Mobile verified — you can submit the form.</span>
        </div>
      )}
    </div>
  );
}
