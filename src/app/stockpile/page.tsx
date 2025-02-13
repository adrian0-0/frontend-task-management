"use client";

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTables from "../components/dataTables";
import RealTimeWidthView from "../components/realTimeWidthView";
import { IFindAllStockpile } from "@/interfaces/stockpile";
import { findAllStockpile } from "@/services/stockpile";
import { useRouter } from "next/navigation";

const Stockpile = () => {
  const [isStockpile, setStockpile] = useState<IFindAllStockpile[]>([]);
  const { isViewWidth } = RealTimeWidthView();
  const mobileWidth = 600;
  const router = useRouter();
  const stockpileContent = {
    title: "Objetos no estoque",
    path: "stockpile",
    editName: "editStockpile",
    editLabel: "Editar Objeto",
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
  ];

  useEffect(() => {
    findAllStockpile()
      .then((response: any) => setStockpile(response.data))
      .catch(() => router.push("/auth/signin"));
  }, []);

  return (
    <Box
      height={"100vh"}
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
          columns={columns}
          content={stockpileContent}
        ></DataTables>
      </Box>
    </Box>
  );
};

export default Stockpile;
