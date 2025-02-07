export interface IFindAllTasks {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  expectedToFinish: string;
  alreadyFinished: string;
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

export enum StatusSeverity {
  "Pendente" = "warning",
  "Em Progresso" = "info",
  "Concluído" = "success",
}
