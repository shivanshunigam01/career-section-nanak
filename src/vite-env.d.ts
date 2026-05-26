/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  /** When not `"false"`, public form POSTs are skipped (WhatsApp OTP still works). */
  readonly VITE_PUBLIC_FORM_POST_DISABLED?: string;
  /** Meta Lead page — direct axios URL (no JWT). */
  readonly VITE_META_LEADS_API_URL?: string;
}
