"use client";

import { IAlertResponse, Severity } from "@/interfaces/response";
import {
  IEditStockpile,
  IFindAllStockpile,
  IFindOneStockpile,
} from "@/interfaces/stockpile";
import { IFindAllTasks, IFindOneTask } from "@/interfaces/tasks";
import {
  editStockpile,
  findAllStockpile,
  findOneStockpile,
} from "@/services/stockpile";
import { findAllTasks, findOneTask } from "@/services/tasks";
import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const AttachTask = () => {
  const [isTask, setTask] = useState<IFindAllTasks[]>([]);
  const [isStockpile, setStockpile] = useState<IFindOneStockpile>();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isAlert, setAlert] = useState<IAlertResponse>();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;
  const validationSchema = Yup.object({
    taskId: Yup.string().required("Selecione pelo menos uma tarefa"),
  });

  const handleService = async (values: any) => {
    const { taskId } = values;
    const taskIdFormated: IEditStockpile = { taskId: taskId };
    editStockpile(id, taskIdFormated)
      .then((response: any) => {
        setAlert({
          message: "Tarefa anexada ao objeto com sucesso",
          statusCode: 200,
          severity: Severity.SUCESS,
        });
        setOpen(true);
      })
      .catch((err: any) => {
        setAlert({
          message: err.response.data.message,
          statusCode: err.response.data.statusCode,
          severity: Severity.ERROR,
        });
        setOpen(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    findOneStockpile(id).then((response: any) => {
      setStockpile(response.data);
    });
  }, [id]);

  useEffect(() => {
    findAllTasks().then((response: any) => {
      setTask(response.data);
    });
  });

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
        <Typography variant="h5">Anexar tarefa ao objeto</Typography>
        <Formik
          initialValues={{
            taskId: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await handleService(values);
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <TextField
                label="Objeto em estoque"
                slotProps={{ inputLabel: { shrink: true } }}
                value={isStockpile?.name || ""}
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
                  Anexar tarefa
                </InputLabel>
                <Select
                  name="taskId"
                  id="taskId"
                  labelId="demo-multiple-chip-label"
                  label="Anexar tarefa"
                  value={values.taskId}
                  sx={{ width: "100%" }}
                  onChange={handleChange}
                >
                  {isTask.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.title}
                    </MenuItem>
                  ))}
                </Select>
                {touched?.taskId && errors?.taskId && (
                  <FormHelperText sx={{ color: "#F44336" }}>
                    {errors.taskId}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginTop: "2rem" }}
              >
                Salvar
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
          severity={isAlert?.severity}
          sx={{ width: "100%" }}
        >
          {isAlert?.statusCode} - {isAlert?.message}
        </Alert>
      </Snackbar>{" "}
    </Box>
  );
};

export default AttachTask;
