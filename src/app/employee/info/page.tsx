"use client";

import { IFindOneEmployee } from "@/interfaces/employee";
import { findOneEmployee } from "@/services/employee";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { ArrowBack, ExpandMore } from "@mui/icons-material";
import {
  getIcon,
  IFindAllTasks,
  StatusLabel,
  StatusSeverity,
} from "@/interfaces/tasks";
import dayjs from "dayjs";
import StatusBadge from "@/components/statusBadge";

const EmployeeInfo = () => {
  const [isEmployee, setEmployee] = useState<IFindOneEmployee>();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;

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
          <Button
            sx={{ width: "max-content" }}
            variant="contained"
            onClick={() => router.push(`/employee/edit?id=${id}`)}
          >
            Editar Funcionário
          </Button>
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
        >
          Anexar tarefa ao funcionário
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeInfo;
