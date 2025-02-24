import {
  ICreateStockpile,
  IEditStockpile,
  IFindAllStockpile,
  IFindOneStockpile,
} from "@/interfaces/stockpile";
import api from "./api";

export const findAllStockpile = async () => {
  return await api.get<IFindAllStockpile>("/stockpile");
};

export const findOneStockpile = async (id: string) => {
  return await api.get<IFindOneStockpile>(`/stockpile/${id}`);
};

export const createStockpile = async (data: ICreateStockpile) => {
  return await api.post<ICreateStockpile>("/stockpile", data);
};

export const editStockpile = async (id: string, data: IEditStockpile) => {
  return await api.patch<IEditStockpile>(`/stockpile/${id}`, data);
};
