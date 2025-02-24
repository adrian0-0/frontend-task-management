import api from "./api";
import {
  ICreateEmployee,
  IEditEmployee,
  IFindAllEmployee,
  IFindOneEmployee,
} from "@/interfaces/employee";

export const findAllEmployee = async () => {
  return await api.get<IFindAllEmployee>("/employee");
};

export const findOneEmployee = async (id: string) => {
  return await api.get<IFindOneEmployee>(`/employee/${id}`);
};

export const createEmployee = async (data: ICreateEmployee) => {
  return await api.post<ICreateEmployee>("/employee", data);
};

export const editEmployee = async (id: string, data: IEditEmployee) => {
  return await api.patch<IEditEmployee>(`/employee/${id}`, data);
};
