import { ISignup } from "@/interfaces/signup";
import api from "./api";
import { ISignin } from "@/interfaces/signin";

export const signIn = async (data: ISignin) => {
  const response = await api.post<{
    data: { accessToken: string; userId: string };
  }>("/auth/signin", data);
  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("userId", response.data.userId);
  return response;
};

export const signUp = async (data: ISignup) => {
  return await api.post<ISignup>("/auth/signup", data);
};
