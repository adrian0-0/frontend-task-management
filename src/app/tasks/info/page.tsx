"use client";
import { IFindAllEmployee } from "@/interfaces/employee";
import {
  getIcon,
  IFindOneTask,
  StatusLabel,
  StatusSeverity,
} from "@/interfaces/tasks";
import { findOneTask } from "@/services/tasks";
import {
  ArrowForward,
  ExpandMore,
  Circle,
  ArrowBack,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [isTask, setTask] = useState<IFindOneTask>();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;
  const router = useRouter();

  useEffect(() => {
    findOneTask(id).then((response: any) => {
      setTask(response.data);
    });
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
        <Typography variant="h5" justifyContent={"center"}>
          Tarefa:
        </Typography>
        <Button
          sx={{ width: "max-content" }}
          variant="contained"
          onClick={() => router.push(`/tasks/edit?id=${id}`)}
        >
          Editar Tarefa
        </Button>
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
            <Typography>Nome: {`${isTask?.stockpileName}`}</Typography>
            <Typography>
              Descrição: {`${isTask?.stockpileDescription}`}
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
            <Button sx={{ marginTop: "1rem" }} variant="contained">
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
        >
          Anexar funcionário
        </Button>
      </Box>
    </Box>
  );
}
