"use client";
import StatusBadge from "@/components/statusBadge";
import { IAlertResponse, Severity } from "@/interfaces/response";
import { IFindOneStockpile } from "@/interfaces/stockpile";
import { getIcon, StatusLabel, StatusSeverity } from "@/interfaces/tasks";
import {
  deleteStockpile,
  editStockpile,
  findOneStockpile,
} from "@/services/stockpile";
import { ArrowBack, Close, Delete } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Router } from "next/router";
import React, { useEffect, useState } from "react";

const StockpileInfo = () => {
  const [isStockpile, setStockpile] = useState<IFindOneStockpile>();
  const [isAlert, setAlert] = useState<IAlertResponse>();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;
  const router = useRouter();

  const removeTask = () => {
    editStockpile(id, { taskId: null })
      .then((response: any) => {
        setAlert({
          message: "Tarefa removida do objeto estocado com sucesso",
          severity: Severity.SUCESS,
          statusCode: 204,
        });
        setOpen(true);
      })
      .catch((err) => {
        setAlert({
          message: err.response.data.message,
          severity: Severity.ERROR,
          statusCode: err.response.data.statusCode,
        });
        setOpen(true);
      });
  };

  const handleDeleteStockpileService = () => {
    deleteStockpile(id)
      .then((response: any) => {
        setAlert({
          message: "Objeto estocado deletado com sucesso",
          severity: Severity.SUCESS,
          statusCode: 204,
        });
        setOpen(true);
      })
      .catch((err: any) => {
        setAlert({
          message: err.response.data.message,
          severity: Severity.ERROR,
          statusCode: err.response.data.statusCode,
        });
        setOpen(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "inherit", sm: "space-between" },
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: { xs: "1rem", sm: "0rem" },
          }}
        >
          <Button
            sx={{ width: "max-content" }}
            variant="contained"
            onClick={() => router.push(`/stockpile/edit?id=${id}`)}
          >
            Editar Inventário
          </Button>
          <Button
            startIcon={<Delete></Delete>}
            variant="outlined"
            color="error"
            sx={{ width: "max-content" }}
            onClick={() => setModalOpen(true)}
          >
            Deletar Objeto Estocado
          </Button>
        </Box>
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
              <Button
                variant="outlined"
                color="error"
                sx={{ width: "max-content" }}
                onClick={() => removeTask()}
              >
                Remover Tarefa
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
              <Button
                variant="contained"
                sx={{ marginTop: "1rem" }}
                onClick={() => router.push(`/stockpile/attachTask?id=${id}`)}
              >
                Adcionar Tarefa
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Dialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              position: "relative",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "0rem",
                right: "0rem",
              }}
            >
              <IconButton onClick={() => setModalOpen(false)}>
                <Close sx={{ fontSize: "2rem" }}></Close>
              </IconButton>
            </Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Ação destrutiva
            </Typography>
            <Typography id="modal-modal-description">
              Esta ação irá deletar todas as informações do objeto estocado tem
              certeza que deseja prosseguir?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                startIcon={<Delete></Delete>}
                variant="contained"
                color="error"
                onClick={() => handleDeleteStockpileService()}
              >
                Deletar Objeto Estocado
              </Button>
            </Box>
          </Paper>
        </Box>
      </Dialog>
      <Snackbar
        open={isOpen}
        onClose={handleClose}
        autoHideDuration={3000}
        autoFocus={true}
      >
        <Alert
          onClose={handleClose}
          severity={isAlert?.severity}
          sx={{ width: "100%" }}
        >
          {isAlert?.statusCode} - {isAlert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockpileInfo;
