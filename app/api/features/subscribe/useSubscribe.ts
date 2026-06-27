import { useMutation } from "@tanstack/react-query";
import { subscribeUser } from "./api";
import Swal from "sweetalert2";

export const useSubscribe = () => {
  return useMutation({
    mutationFn: subscribeUser,
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Subscribed!",
        text: data.message || "You've been subscribed successfully.",
        confirmButtonColor: "#4CAF50",
        confirmButtonText: "Great!",
        timer: 5000,
        timerProgressBar: true,
      });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "";

      // 401 — Not logged in
      if (status === 401) {
        Swal.fire({
          icon: "info",
          title: "Login Required",
          text: "Login to subscribe",
          confirmButtonColor: "#4CAF50",
          confirmButtonText: "Login",
          showCancelButton: true,
          cancelButtonText: "Cancel",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        });
        return;
      }

      // 400 — Already subscribed
      if (status === 400 && message.toLowerCase().includes("already")) {
        Swal.fire({
          icon: "info",
          title: "Already Subscribed",
          text: "You're already a subscriber!",
          confirmButtonColor: "#4CAF50",
          confirmButtonText: "Okay",
        });
        return;
      }

      // Generic error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message || "Something went wrong. Please try again.",
        confirmButtonColor: "#4CAF50",
        confirmButtonText: "Try Again",
      });
    },
  });
};
