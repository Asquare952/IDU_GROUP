const RENT_PAYMENT_REFERENCE_KEY = "pendingRentPaymentReference";
const RENT_PAYMENT_RENTAL_KEY = "pendingRentPaymentRentalId";

export const getRentPaymentReturnUrl = () =>
  typeof window === "undefined"
    ? "/tenant/payment-success"
    : `${window.location.origin}/tenant/payment-success`;

export const buildRentPaymentPayload = (rentalId: string) => {
  const returnUrl = getRentPaymentReturnUrl();

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

export const storePendingRentPayment = ({
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
    sessionStorage.setItem(RENT_PAYMENT_REFERENCE_KEY, reference);
  }

  sessionStorage.setItem(RENT_PAYMENT_RENTAL_KEY, rentalId);
};

export const getPendingRentPaymentReference = () =>
  typeof window === "undefined"
    ? null
    : sessionStorage.getItem(RENT_PAYMENT_REFERENCE_KEY);

export const clearPendingRentPayment = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(RENT_PAYMENT_REFERENCE_KEY);
  sessionStorage.removeItem(RENT_PAYMENT_RENTAL_KEY);
};
