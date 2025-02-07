import { ISignup } from "@/interfaces/signup";
import api from "./api";

export const signIn = async (data: string) => {
  const response = await api.post<{ data: string }>("/auth/signin", data);
  await localStorage.setItem("acessToken", response.data);
  return response;
};

export const signUp = async (data: ISignup) => {
  return await api.post<ISignup>("/auth/signup", data);
};
