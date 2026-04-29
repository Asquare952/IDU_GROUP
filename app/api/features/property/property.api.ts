import api from "../../axios";

export const bookProperty = async (rentalId: string) => {
  const response = await api.post("/progress/book", { rental_id: rentalId });
  return response.data;
};
