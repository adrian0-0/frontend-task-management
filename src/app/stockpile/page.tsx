"use client";

import { Box, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTables from "@/components/dataTables";
import RealTimeWidthView from "@/components/realTimeWidthView";
import { IFindAllStockpile } from "@/interfaces/stockpile";
import { findAllStockpile } from "@/services/stockpile";
import { useRouter } from "next/navigation";
import { getIcon, StatusLabel, StatusSeverity } from "@/interfaces/tasks";

const Stockpile = () => {
  const [isStockpile, setStockpile] = useState<IFindAllStockpile[]>([]);
  const { isViewWidth } = RealTimeWidthView();
  const mobileWidth = 600;
  const router = useRouter();
  const stockpileContent = {
    title: "Objetos no estoque",
    path: "stockpile",
    editName: "editStockpile",
    editLabel: "Editar Inventário",
  };
  const tableEmpty = {
    id: "stockpile",
    name: "Adcionar objeto ao estoque",
    path: "/stockpile/create",
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "name",
      label: "Nome",
    },
    {
      name: "quant",
      label: "Quantidade",
    },
    {
      name: "description",
      label: "Descrição",
      options: {
        filter: isViewWidth > mobileWidth ? true : false,
        display: isViewWidth > mobileWidth ? true : false,
      },
    },
    {
      name: "taskTitle",
      label: "Tarefa",
    },
    {
      name: "taskStatus",
      label: "Status da Tarefa",
      options: {
        customBodyRender: (value: any) => {
          const icon = getIcon(value);
          switch (value) {
            case null:
              return null;
            default:
              return (
                <Chip
                  color={StatusSeverity[value as keyof typeof StatusSeverity]}
                  icon={icon}
                  label={value}
                />
              );
          }
        },
      },
    },
  ];

  useEffect(() => {
    findAllStockpile()
      .then((response: any) => {
        const stockpileWithTranslatedStatus = response.data.map(
          (stockpile: any) => ({
            ...stockpile,
            taskStatus:
              StatusLabel[stockpile.taskStatus as keyof typeof StatusLabel] ||
              stockpile.taskStatus,
          })
        );
        setStockpile(stockpileWithTranslatedStatus);
      })
      .catch(() => router.push("/auth/signin"));
  }, []);

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      marginX={{ xs: "1rem", md: "1rem", lg: "1rem" }}
      flexWrap={"wrap"}
    >
      <Box width="100%" height={"100%"} marginTop={"1rem"}>
        <DataTables
          data={isStockpile}
          tableEmpty={tableEmpty}
          columns={columns}
          content={stockpileContent}
        ></DataTables>
      </Box>
    </Box>
  );
};

export default Stockpile;
