import api from "./api";
import { IFindAllEmployee } from "@/interfaces/employee";

export const findAllEmployee = async () => {
  return await api.get<IFindAllEmployee>("/employee");
};
