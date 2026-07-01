const LOCK_PAYMENT_REFERENCE_KEY = "pendingLockPaymentReference";
const LOCK_PAYMENT_RENTAL_KEY = "pendingLockPaymentRentalId";

export const getLockPaymentReturnUrl = () =>
  typeof window === "undefined"
    ? "/tenant/payment-success?type=lock"
    : `${window.location.origin}/tenant/payment-success?type=lock`;

export const buildLockPaymentPayload = (rentalId: string) => {
  const returnUrl = getLockPaymentReturnUrl();

  return {
    rental_id: rentalId,
    callback_url: returnUrl,
    callbackUrl: returnUrl,
    return_url: returnUrl,
    returnUrl,
    redirect_url: returnUrl,
    redirectUrl: returnUrl,
  };
};

export const storePendingLockPayment = ({
  reference,
  rentalId,
}: {
  reference?: string;
  rentalId: string;
}) => {
  if (typeof window === "undefined") {
    return;
  }

  if (reference) {
    sessionStorage.setItem(LOCK_PAYMENT_REFERENCE_KEY, reference);
  }

  sessionStorage.setItem(LOCK_PAYMENT_RENTAL_KEY, rentalId);
};

export const getPendingLockPaymentReference = () =>
  typeof window === "undefined"
    ? null
    : sessionStorage.getItem(LOCK_PAYMENT_REFERENCE_KEY);

export const clearPendingLockPayment = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(LOCK_PAYMENT_REFERENCE_KEY);
  sessionStorage.removeItem(LOCK_PAYMENT_RENTAL_KEY);
};
