import {
  ICreateTask,
  IEditTask,
  IFindAllTasks,
  IFindOneTask,
} from "@/interfaces/tasks";
import api from "./api";

export const findAllTasks = async () => {
  return await api.get<IFindAllTasks[]>("/tasks");
};

export const createTask = async (data: ICreateTask) => {
  return await api.post<ICreateTask>("/tasks", data);
};

export const findOneTask = async (id: string) => {
  return await api.get<IFindOneTask>(`/tasks/${id}`);
};

export const editTask = async (id: string, data: IEditTask) => {
  return await api.patch<IEditTask>(`/tasks/${id}`, data);
};

export const attachEmployeesToTask = async (id: string, employeesId: []) => {
  return await api.post<{ employeesId: [] }>(
    `/tasks/employee/${id}`,
    employeesId
  );
};

export const removeEmployeesFromTask = async (
  id: string,
  employeeId: string
) => {
  return await api.delete(`/tasks/employee/${id}/${employeeId}`);
};

export const deleteTask = async (id: string) => {
  return await api.delete(`/tasks/${id}`);
};
