"use client";

import { IFindOneEmployee } from "@/interfaces/employee";
import {
  deleteEmployee,
  findOneEmployee,
  removeTasksFromEmployee,
} from "@/services/employee";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowBack, Close, Delete, ExpandMore } from "@mui/icons-material";
import { IFindAllTasks, StatusLabel } from "@/interfaces/tasks";
import dayjs from "dayjs";
import StatusBadge from "@/components/statusBadge";
import { IAlertResponse, Severity } from "@/interfaces/response";

const EmployeeInfo = () => {
  const [isEmployee, setEmployee] = useState<IFindOneEmployee>();
  const searchParams = useSearchParams();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isAlert, setAlert] = useState<IAlertResponse>();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;

  const removeTask = (taskId: string) => {
    removeTasksFromEmployee(id, taskId)
      .then((response: any) => {
        setAlert({
          message: "Tarefa removida do funcionário com sucesso",
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

  const handleDeleteStockpileService = async () => {
    deleteEmployee(id)
      .then((response: any) => {
        setAlert({
          message: "Funcionário deletado com sucesso",
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
    findOneEmployee(id).then((response: any) => {
      setEmployee(response.data);
    });
  }, [id]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          marginX: { xs: "1rem" },
          padding: "2rem",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: isTheme === "dark" ? "#272727" : "inherit",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1rem",
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
          <Typography variant="h5">Funcionário:</Typography>
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
              onClick={() => router.push(`/employee/edit?id=${id}`)}
            >
              Editar Funcionário
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete></Delete>}
              sx={{
                display: isEmployee?.tasks.length ? "none" : "inherit",
                width: "max-content",
              }}
              onClick={() => setModalOpen(true)}
            >
              Deletar Funcionário
            </Button>
          </Box>
          <Typography>Nome: {`${isEmployee?.name}`}</Typography>
          <Typography>Cargo: {`${isEmployee?.role}`}</Typography>
          <Typography>E-mail: {`${isEmployee?.email}`}</Typography>
          <Typography>Número de celular: {`${isEmployee?.phone}`}</Typography>
          <Divider></Divider>
          <Typography variant="h5">Tarefas do funcionário:</Typography>
        </Box>

        {(isEmployee?.tasks ?? []).length > 0 ? (
          isEmployee?.tasks?.map((tasks: IFindAllTasks) => (
            <Accordion
              key={tasks.id}
              sx={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
            >
              <AccordionSummary expandIcon={<ExpandMore></ExpandMore>}>
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  Nome: {tasks.title}
                </Typography>
                <Box
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    marginLeft: "0.5rem",
                  }}
                >
                  <StatusBadge status={tasks.status}></StatusBadge>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: "inline-flex", md: "none" },
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ marginRight: "0.5rem" }}>
                      Status:{" "}
                    </Typography>
                    <StatusBadge status={tasks.status}></StatusBadge>
                  </Box>
                  <Typography>Descrição: {tasks.description}</Typography>
                  <Typography>
                    Data de criação da tarefa:{" "}
                    {dayjs(tasks?.createdAt ?? "").format("DD/MM/YYYY - HH:mm")}
                  </Typography>
                  <Typography>
                    Data de previsão de término da tarefa:{" "}
                    {dayjs(tasks?.expectedToFinish ?? "").format(
                      "DD/MM/YYYY - HH:mm"
                    )}
                  </Typography>
                  <Typography>
                    Data de finalização da tarefa:{" "}
                    {tasks?.alreadyFinished &&
                      dayjs(tasks?.alreadyFinished ?? "").format(
                        "DD/MM/YYYY - HH:mm"
                      )}
                  </Typography>
                </Box>
                <AccordionActions
                  sx={{
                    padding: { xs: "0rem", lg: "inherit" },
                    flexDirection: { xs: "column", lg: "inherit" },
                    marginTop: { xs: "1rem", md: "1rem", lg: "0rem" },
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ width: { xs: "100%", lg: "inherit" } }}
                    onClick={() => removeTask(tasks.id)}
                  >
                    Remover tarefa
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      width: { xs: "100%", lg: "inherit" },
                      marginLeft: {
                        xs: "0rem !important",
                        lg: "1rem !important",
                      },
                      marginTop: {
                        xs: "1.5rem",
                        md: "1.5rem",
                        lg: "0rem",
                      },
                    }}
                    onClick={() => router.push(`/tasks/edit?id=${tasks.id}`)}
                  >
                    Editar tarefa
                  </Button>
                </AccordionActions>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            Nenhuma tarefa encontrada.
          </Typography>
        )}

        <Button
          color="primary"
          variant="contained"
          sx={{
            justifyContent: "left",
            alignItems: "flex-start",
            width: "max-content",
            mt: "1rem",
          }}
          onClick={() => router.push(`/employee/attachTask?id=${id}`)}
        >
          Anexar tarefa ao funcionário
        </Button>
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
              Esta ação irá deletar todas as informações do funcionário tem
              certeza que deseja prosseguir?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                startIcon={<Delete></Delete>}
                variant="contained"
                color="error"
                onClick={() => handleDeleteStockpileService()}
              >
                Deletar Funcionário
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

export default EmployeeInfo;
