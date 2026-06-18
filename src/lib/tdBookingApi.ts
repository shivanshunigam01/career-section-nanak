import { adminRequest, formatApiErrors, ApiRequestError } from "@/lib/api";

export type TdBookingDlFields = {
  dlVerified: boolean;
  dlImageUrl?: string | null;
  dlVerifiedAt?: string | null;
  dlNumber?: string | null;
  dlValidUntil?: string | null;
};

export async function verifyTdBookingDrivingLicence(
  bookingId: string,
  payload: { file: File; dlNumber: string; dlValidUntil: string },
): Promise<TdBookingDlFields & { _id: string }> {
  const fd = new FormData();
  fd.append("dlImage", payload.file);
  fd.append("dlNumber", payload.dlNumber.trim());
  fd.append("dlValidUntil", payload.dlValidUntil);

  const { res, json } = await adminRequest(`/admin/td/bookings/${bookingId}/verify-dl`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    throw new ApiRequestError(
      String(json.message ?? "Could not verify driving licence"),
      res.status,
      json.errors as ApiRequestError["errors"],
    );
  }

  return json.data as TdBookingDlFields & { _id: string };
}

export { formatApiErrors };
