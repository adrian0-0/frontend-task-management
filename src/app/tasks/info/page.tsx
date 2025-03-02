"use client";
import { IFindAllEmployee } from "@/interfaces/employee";
import { IAlertResponse, Severity } from "@/interfaces/response";
import { IEditStockpile } from "@/interfaces/stockpile";
import {
  getIcon,
  IFindOneTask,
  StatusLabel,
  StatusSeverity,
} from "@/interfaces/tasks";
import { editStockpile } from "@/services/stockpile";
import {
  deleteTask,
  findOneTask,
  removeEmployeesFromTask,
} from "@/services/tasks";
import {
  ExpandMore,
  Circle,
  ArrowBack,
  Delete,
  Close,
} from "@mui/icons-material";
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [isTask, setTask] = useState<IFindOneTask>();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isAlert, setAlert] = useState<IAlertResponse>();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;
  const router = useRouter();

  const removeStockpilefromTask = async () => {
    editStockpile(isTask?.stockpileId ?? "", { taskId: null })
      .then((response: any) => {
        console.log(response);
        setAlert({
          message: "Objeto em estoque removido da tarefa",
          severity: Severity.SUCESS,
          statusCode: response.statusCode,
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

  const removeEmployee = (employeeId: string) => {
    removeEmployeesFromTask(id, employeeId)
      .then((response: any) => {
        console.log(response);
        setAlert({
          message: "Encarregado removido da tarefa com sucesso",
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

  const handleDeleteTaskService = async () => {
    deleteTask(id)
      .then((response: any) => {
        setAlert({
          message: "Tarefa deletada com sucesso",
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
    findOneTask(id).then((response: any) => {
      setTask(response.data);
    });
  }, [id]);

  useEffect(() => {
    console.log(isTask);
  }, [isTask]);

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
        <Typography variant="h5" justifyContent={"center"}>
          Tarefa:
        </Typography>
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
            onClick={() => router.push(`/tasks/edit?id=${id}`)}
          >
            Editar Tarefa
          </Button>
          <Button
            startIcon={<Delete></Delete>}
            sx={{
              display:
                isTask?.stockpileId || isTask?.employees.length
                  ? "none"
                  : "inherit",
              width: "max-content",
            }}
            variant="outlined"
            color="error"
            onClick={() => setModalOpen(true)}
          >
            Deletar Tarefa
          </Button>
        </Box>
        <Typography>Nome: {`${isTask?.title}`}</Typography>
        <Typography>Descrição: {`${isTask?.description ?? ""}`}</Typography>
        <Box
          display={"flex"}
          alignItems={"center"}
          flexWrap={"wrap"}
          gap={"0.5rem"}
        >
          <Typography>Status: </Typography>
          <Chip
            icon={getIcon(
              StatusLabel[`${isTask?.status as keyof typeof StatusLabel}`]
            )}
            color={
              StatusSeverity[
                StatusLabel[`${isTask?.status as keyof typeof StatusLabel}`]
              ]
            }
            label={StatusLabel[`${isTask?.status as keyof typeof StatusLabel}`]}
          ></Chip>
        </Box>
        <Typography>
          Data de criação da tarefa: {""}
          {dayjs(isTask?.createdAt).format("DD/MM/YYYY - HH:mm")}
        </Typography>
        <Typography>
          Data de previsão de temino da tarefa: {""}
          {dayjs(isTask?.expectedToFinish).format("DD/MM/YYYY - HH:mm")}
        </Typography>
        <Typography>
          Data de finalização da tarefa: {""}
          {isTask?.alreadyFinished
            ? dayjs(isTask?.alreadyFinished).format("DD/MM/YYYY - HH:mm")
            : ""}
        </Typography>
        <Divider></Divider>
        <Typography variant="h5">Inventário:</Typography>
        {isTask?.stockpileId ? (
          <>
            {" "}
            <Button
              sx={{ width: "max-content" }}
              variant="contained"
              onClick={() =>
                router.push(`/stockpile/edit?id=${isTask?.stockpileId}`)
              }
            >
              Editar Inventário
            </Button>
            <Button
              sx={{ width: "max-content" }}
              variant="outlined"
              startIcon={<Delete></Delete>}
              color="error"
              onClick={() => removeStockpilefromTask()}
            >
              Remover Item
            </Button>
            <Typography>Nome: {`${isTask?.stockpileName}`}</Typography>
            <Typography>
              Descrição: {`${isTask?.stockpileDescription ?? ""}`}
            </Typography>
            <Typography>
              Quantidade estocada: {`${isTask?.stockpileQuant}`}
            </Typography>
          </>
        ) : (
          <Box>
            <Typography color="textSecondary">
              Nenhum item anexado para transporte
            </Typography>
            <Button
              sx={{ marginTop: "1rem" }}
              variant="contained"
              onClick={() => router.push(`/tasks/attach/stockpile?id=${id}`)}
            >
              Anexar item
            </Button>
          </Box>
        )}

        <Divider></Divider>
        <Typography variant="h5">Funcionários Encarregados:</Typography>
        <Box>
          {isTask?.employees.length ? (
            isTask?.employees.map((employees: IFindAllEmployee) => (
              <Accordion
                key={employees.id}
                sx={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Nome: {employees.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ padding: "0rem" }}>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: "1.5rem" }}>
                        <Circle
                          sx={{
                            fontSize: "0.5rem",
                            color: isTheme === "dark" ? "#fff" : "#000",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={`Cargo: ${employees.role}`} />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: "1.5rem" }}>
                        <Circle
                          sx={{
                            fontSize: "0.5rem",
                            color: isTheme === "dark" ? "#fff" : "#000",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={`E-mail: ${employees.email}`} />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: "1.5rem" }}>
                        <Circle
                          sx={{
                            fontSize: "0.5rem",
                            color: isTheme === "dark" ? "#fff" : "#000",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Número de Celular: ${employees.phone}`}
                      />
                    </ListItem>
                  </List>
                  <AccordionActions
                    sx={{
                      padding: { xs: "0rem", lg: "inherit" },
                      flexDirection: {
                        xs: "column",
                        lg: "inherit",
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ width: { xs: "100%", lg: "inherit" } }}
                      onClick={() => removeEmployee(employees.id)}
                    >
                      Remover encarregado
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        width: { xs: "100%", lg: "inherit" },
                        marginTop: {
                          xs: "1rem",
                          md: "0rem",
                        },
                        marginLeft: {
                          xs: "0rem !important",
                          lg: "1rem !important",
                        },
                      }}
                      onClick={() =>
                        router.push(`/employee/edit?id=${employees.id}`)
                      }
                    >
                      Editar funcionário
                    </Button>
                  </AccordionActions>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhum funcionário encarregado
            </Typography>
          )}
        </Box>
        <Button
          color="primary"
          variant="contained"
          sx={{
            justifyContent: "left",
            alignItems: "flex-start",
            width: "max-content",
          }}
          onClick={() => router.push(`/tasks/attach/employee?id=${id}`)}
        >
          Anexar funcionário
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
              Esta ação irá deletar todas as informações dessa tarefa tem
              certeza que deseja prosseguir?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                startIcon={<Delete></Delete>}
                variant="contained"
                color="error"
                onClick={() => handleDeleteTaskService()}
              >
                Deletar Tarefa
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
}
