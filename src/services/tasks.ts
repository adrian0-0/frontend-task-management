import { IFindAllTasks } from "@/interfaces/tasks";
import api from "./api";

export const findAllTasks = async () => {
  return await api.get<IFindAllTasks[]>("/tasks");
};
