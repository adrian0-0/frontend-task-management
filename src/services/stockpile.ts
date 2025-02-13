import { IFindAllStockpile } from "@/interfaces/stockpile";
import api from "./api";

export const findAllStockpile = async () => {
  return await api.get<IFindAllStockpile>("/stockpile");
};
