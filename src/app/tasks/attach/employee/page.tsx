"use client";

import StatusBadge from "@/components/statusBadge";
import { IFindAllEmployee, IFindOneEmployee } from "@/interfaces/employee";
import { IAlertResponse, Severity } from "@/interfaces/response";
import {
  IFindAllTasks,
  IFindOneTask,
  StatusLabel,
  StatusSeverity,
} from "@/interfaces/tasks";
import {
  attachTaskstoEmployee,
  findAllEmployee,
  findOneEmployee,
} from "@/services/employee";
import {
  attachEmployeesToTask,
  findAllTasks,
  findOneTask,
} from "@/services/tasks";
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

const AttachEmployee = () => {
  const [isTask, setTask] = useState<IFindOneTask>();
  const [isEmployee, setEmployee] = useState<IFindAllEmployee[]>([]);
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
    id: array().min(1, "Selecione pelo menos um funcionário"),
  });

  const handleService = (values: any) => {
    const { id: employeeId } = values;
    attachEmployeesToTask(id, employeeId)
      .then(() => {
        setAlert({
          message: "Funcionário(s) anexado(s) a tarefa com sucesso",
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
    findOneTask(id).then((response: any) => {
      setTask(response.data);
    });
  }, [id]);

  useEffect(() => {
    findAllEmployee().then((response: any) => {
      setEmployee(response.data);
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
        <Typography variant="h5">Anexar funcionário a tarefa</Typography>
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
                value={isTask?.title || ""}
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
                  Funcionários
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
                >
                  {isEmployee.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
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

export default AttachEmployee;
