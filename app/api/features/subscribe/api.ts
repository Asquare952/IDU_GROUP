import api from "../../axios";

export const subscribeUser = async () => {
  const response = await api.post("/subscriptions/subscribe");
  return response.data;
};
