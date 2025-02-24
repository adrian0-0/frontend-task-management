"use client";
import StatusBadge from "@/components/statusBadge";
import { IFindOneStockpile } from "@/interfaces/stockpile";
import { getIcon, StatusLabel, StatusSeverity } from "@/interfaces/tasks";
import { findOneStockpile } from "@/services/stockpile";
import { ArrowBack } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Router } from "next/router";
import React, { useEffect, useState } from "react";

const StockpileInfo = () => {
  const [isStockpile, setStockpile] = useState<IFindOneStockpile>();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;
  const router = useRouter();

  useEffect(() => {
    findOneStockpile(id).then((response: any) => setStockpile(response.data));
  }, [id]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginX: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          gap: "1rem",
          width: "100%",
          padding: "2rem",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: isTheme === "dark" ? "#272727" : "inherit",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => router.back()}
          startIcon={<ArrowBack></ArrowBack>}
          sx={{ width: "min-content" }}
        >
          Retornar
        </Button>
        <Typography variant="h5">Inventário:</Typography>
        <Button
          sx={{ width: "max-content" }}
          variant="contained"
          onClick={() => router.push(`/stockpile/edit?id=${id}`)}
        >
          Editar Inventário
        </Button>
        <Typography>Nome: {`${isStockpile?.name}`}</Typography>
        <Typography>
          Descrição: {`${isStockpile?.description ?? ""}`}
        </Typography>
        <Typography>Quantidade estocada: {`${isStockpile?.quant}`}</Typography>
        <Divider></Divider>
        <Typography variant="h5" justifyContent={"center"}>
          Tarefa:
        </Typography>
        <Box>
          {isStockpile?.taskId ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <Button
                sx={{ width: "max-content" }}
                variant="contained"
                onClick={() =>
                  router.push(`/tasks/edit?id=${isStockpile.taskId}`)
                }
              >
                Editar Tarefa
              </Button>
              <Typography>
                Nome:{" "}
                {isStockpile?.taskTitle ? `${isStockpile?.taskTitle}` : ""}
              </Typography>
              <Typography>
                Descrição:{" "}
                {isStockpile?.taskDescription
                  ? `${isStockpile?.taskDescription}`
                  : ""}
              </Typography>
              <Box
                display={"flex"}
                alignItems={"center"}
                flexWrap={"wrap"}
                gap={"0.5rem"}
              >
                <Typography>Status: </Typography>
                {isStockpile?.taskStatus && (
                  <StatusBadge status={isStockpile.taskStatus}></StatusBadge>
                )}
              </Box>
              <Typography>
                Data de criação da tarefa: {""}
                {isStockpile?.taskCreatedAt
                  ? dayjs(isStockpile?.taskCreatedAt).format(
                      "DD/MM/YYYY - HH:mm"
                    )
                  : ""}
              </Typography>
              <Typography>
                Data de previsão de temino da tarefa: {""}
                {isStockpile?.taskExpectedToFinish
                  ? dayjs(isStockpile?.taskExpectedToFinish ?? "").format(
                      "DD/MM/YYYY - HH:mm"
                    )
                  : ""}
              </Typography>
              <Typography>
                Data de finalização da tarefa: {""}
                {isStockpile?.taskAlreadyFinished
                  ? dayjs(isStockpile?.taskAlreadyFinished ?? "").format(
                      "DD/MM/YYYY - HH:mm"
                    )
                  : ""}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography color="textSecondary">
                Nenhuma tarefa encontrada.
              </Typography>
              <Button variant="contained" sx={{ marginTop: "1rem" }}>
                Adcionar Tarefa
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StockpileInfo;
