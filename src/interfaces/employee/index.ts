import { IFindAllTasks } from "../tasks";

export interface IFindAllEmployee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  totalTasks: number;
  tasksOpen: number;
  tasksInprogress: number;
  tasksDone: number;
}

export interface IFindOneEmployee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  tasks: IFindAllTasks[];
}

export interface ICreateEmployee {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface IEditEmployee {
  name: string;
  role: string;
  email: string;
  phone: string;
}
