import { Status } from "../tasks";

export interface IFindAllStockpile {
  id: string;
  name: string;
  description: string;
  quant: number;
  taskTitle: string;
  taskStatus: Status;
}

export interface IFindOneStockpile {
  id: string;
  name: string;
  description: string;
  quant: number;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  taskStatus: Status;
  taskCreatedAt: string;
  taskExpectedToFinish: string;
  taskAlreadyFinished: string;
}

export interface ICreateStockpile {
  name: string;
  description: string;
  quant: string;
}

export interface IEditStockpile {
  name: string;
  description: string;
  quant: string;
}
