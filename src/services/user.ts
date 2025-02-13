import { IUser } from "@/interfaces/user";
import api from "./api";

export const findUser = async (id: string) => {
  return await api.get<IUser>(`/user/${id}`);
};
