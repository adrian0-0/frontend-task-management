import { CheckCircle, Groups3, PendingActions } from "@mui/icons-material";
import { IFindAllEmployee } from "../employee";

export interface IFindAllTasks {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  expectedToFinish: string;
  alreadyFinished: string;
}

export interface IFindOneTask {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  expectedToFinish: string;
  alreadyFinished: string;
  stockpileId: string;
  stockpileName: string;
  stockpileQuant: string;
  stockpileDescription: string;
  employees: IFindAllEmployee[];
}

export interface ICreateTask {
  name: string;
  description: string;
  createdAt: string;
  expectedToFinish: string;
}

export interface IEditTask {
  name: string;
  description: string;
  createdAt: string;
  expectedToFinish: string;
  alreadyFinished: string;
}

export interface IModalTableData {
  id: string;
  name: string;
}

export interface IModalTableContent {
  editText: string;
  createText: string;
  path: string;
}

export enum Status {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum StatusLabel {
  OPEN = "Pendente",
  IN_PROGRESS = "Em Progresso",
  DONE = "Concluído",
}

export const getIcon = (status: StatusLabel): JSX.Element => {
  switch (status) {
    case StatusLabel.OPEN:
      return <PendingActions fontSize="small" />;
    case StatusLabel.IN_PROGRESS:
      return <Groups3 fontSize="small" />;
    case StatusLabel.DONE:
      return <CheckCircle fontSize="small" />;
    default:
      return <PendingActions fontSize="small" />;
  }
};

export enum StatusSeverity {
  "Pendente" = "warning",
  "Em Progresso" = "info",
  "Concluído" = "success",
}
