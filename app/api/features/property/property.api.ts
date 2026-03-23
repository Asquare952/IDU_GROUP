import axiosInstance from "../../axios";
import Cookies from "js-cookie";

export const bookProperty = async (rentalId: string) => {
  const token = Cookies.get("token");
  const response = await axiosInstance.post(
    "/progress/book",
    { rental_id: rentalId },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  );
  return response.data;
};
