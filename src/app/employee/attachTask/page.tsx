"use client";

import StatusBadge from "@/components/statusBadge";
import { IFindOneEmployee } from "@/interfaces/employee";
import { IAlertResponse, Severity } from "@/interfaces/response";
import { IFindAllTasks, StatusLabel, StatusSeverity } from "@/interfaces/tasks";
import { attachTaskstoEmployee, findOneEmployee } from "@/services/employee";
import { findAllTasks } from "@/services/tasks";
import { ArrowBack, Task } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { array, object } from "yup";

const AttachTask = () => {
  const [isEmployee, setEmployee] = useState<IFindOneEmployee>();
  const [isTask, setTask] = useState<IFindAllTasks[]>([]);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isAlert, setAlert] = useState<IAlertResponse>({
    statusCode: 200,
    severity: Severity.INFO,
    message: "",
  });
  const router = useRouter();
  const searchParam = useSearchParams();
  const id = searchParam.get("id") ?? "";
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;
  const validationSchema = object({
    id: array().min(1, "Selecione pelo menos uma tarefa"),
  });

  const handleService = (values: any) => {
    const { id: taskId } = values;
    attachTaskstoEmployee(id, taskId)
      .then(() => {
        setAlert({
          message: "Tarefa(s) anexada(s) ao funcionário com sucesso",
          severity: Severity.SUCESS,
          statusCode: 200,
        });
        setOpen(true);
      })
      .catch((err: any) => {
        console.log(err);
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

  useEffect(() => {
    findAllTasks().then((response: any) => {
      setTask(response.data);
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginX: "1rem",
      }}
    >
      <Box
        width={"100%"}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          gap: "1.5rem",
          padding: { xs: "1rem", md: "2rem", lg: "2rem" },
          backgroundColor: isTheme === "dark" ? "#272727" : "inherit",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBack></ArrowBack>}
          sx={{ width: "min-content" }}
          onClick={() => router.back()}
        >
          Retornar
        </Button>
        <Typography variant="h5">Anexar tarefa a funcionário</Typography>
        <Formik
          initialValues={{
            id: [],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await handleService(values);
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <TextField
                label="Funcionário"
                slotProps={{ inputLabel: { shrink: true } }}
                value={isEmployee?.name || ""}
                disabled
                fullWidth
              ></TextField>
              <FormControl
                fullWidth
                sx={{ marginTop: "1.5rem", width: "100%" }}
                variant="outlined"
              >
                <InputLabel
                  id="demo-multiple-chip-label"
                  sx={{ whiteSpace: "nowrap", overflow: "visible" }}
                >
                  Tarefas
                </InputLabel>
                <Select
                  name="id"
                  id="id"
                  labelId="demo-multiple-chip-label"
                  label="Tarefas"
                  multiple
                  sx={{ width: "100%" }}
                  value={values.id}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {selected.map((value) => {
                        const selectedTask = isTask.find(
                          (task) => task.id === value
                        );
                        return (
                          <Chip
                            key={value}
                            label={selectedTask?.title}
                            color={
                              StatusSeverity[
                                StatusLabel[
                                  selectedTask?.status as keyof typeof StatusLabel
                                ]
                              ]
                            }
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {isTask.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      <StatusBadge status={task.status} />
                      <Box sx={{ marginLeft: "0.5rem" }}>{task.title}</Box>
                    </MenuItem>
                  ))}
                </Select>
                {touched?.id && errors?.id && (
                  <FormHelperText sx={{ color: "#F44336" }}>
                    {errors.id}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginTop: "2rem" }}
              >
                Enviar
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
      <Snackbar
        open={isOpen}
        onClose={handleClose}
        autoHideDuration={3000}
        autoFocus={true}
      >
        <Alert
          onClose={handleClose}
          severity={isAlert.severity}
          sx={{ width: "100%" }}
        >
          {isAlert.statusCode} - {isAlert.message}
        </Alert>
      </Snackbar>{" "}
    </Box>
  );
};

export default AttachTask;
