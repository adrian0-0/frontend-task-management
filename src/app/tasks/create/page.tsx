"use client";

import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import utc from "dayjs/plugin/utc";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { createTask } from "@/services/tasks";
import { IAlertResponse, Severity } from "@/interfaces/response";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

dayjs.extend(utc);
dayjs.extend(timezone);

const CreateTask = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isAlert, setAlert] = useState<IAlertResponse>({
    statusCode: 200,
    severity: Severity.INFO,
    message: "",
  });
  const router = useRouter();
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;

  const validationSchema = Yup.object({
    title: Yup.string().required("O nome é obrigatório."),
    description: Yup.string().optional(),
    createdAt: Yup.date().required("A data de criação é obrigatória"),
    expectedToFinish: Yup.date().required(
      "O prazo de finalização é obrigatório"
    ),
  });

  const handleService = (values: any) => {
    createTask(values)
      .then((response: any) => {
        setAlert({
          statusCode: response.statusCode,
          severity: Severity.SUCESS,
          message: response.message,
        });
      })
      .catch((err) => {
        setAlert({
          statusCode: err.response.data.statusCode,
          message: err.response.data.message,
          severity: Severity.ERROR,
        });
      })
      .finally(() => {
        setOpen(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Box width={"100%"}>
        <Box
          sx={{
            marginX: { xs: "1rem", md: "3rem", lg: "5rem" },
            padding: { xs: "1rem", md: "2rem", lg: "2rem" },
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: isTheme === "dark" ? "#272727" : "inherit",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => router.back()}
            startIcon={<ArrowBack></ArrowBack>}
            sx={{ marginBottom: "1rem" }}
          >
            Retornar
          </Button>
          <Typography variant="h5" fontWeight={"600"} marginBottom={"1rem"}>
            Criar Tarefa
          </Typography>
          <Formik
            initialValues={{
              title: "",
              description: "",
              createdAt: "",
              expectedToFinish: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleService(values);
            }}
          >
            {({ errors, touched, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Box display={"flex"} flexWrap={"wrap"} gap={"1.5rem"}>
                  <TextField
                    id="title"
                    name="title"
                    label="Nome"
                    placeholder="Nome da tarefa"
                    type="text"
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    helperText={
                      touched.title && errors.title ? errors.title : null
                    }
                    error={touched.title && Boolean(errors.title)}
                    onChange={handleChange}
                  />
                  <TextField
                    id="description"
                    name="description"
                    label="Descrição"
                    placeholder="Descrição da tarefa"
                    type={"text"}
                    multiline
                    rows={4}
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    helperText={
                      touched.description && errors.description
                        ? errors.description
                        : null
                    }
                    error={touched.description && Boolean(errors.description)}
                    onChange={handleChange}
                  />
                  <TextField
                    id="createdAt"
                    name="createdAt"
                    label="Data de criação"
                    type={"datetime-local"}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                    helperText={
                      touched.createdAt && errors.createdAt
                        ? errors.createdAt
                        : null
                    }
                    error={touched.createdAt && Boolean(errors.createdAt)}
                    onChange={handleChange}
                  />
                  <TextField
                    id="expectedToFinish"
                    name="expectedToFinish"
                    label="Previsão de finalização"
                    type={"datetime-local"}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                    helperText={
                      touched.expectedToFinish && errors.expectedToFinish
                        ? errors.expectedToFinish
                        : null
                    }
                    error={
                      touched.expectedToFinish &&
                      Boolean(errors.expectedToFinish)
                    }
                    onChange={handleChange}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{
                    marginTop: "2rem",
                  }}
                >
                  Enviar
                </Button>
              </Form>
            )}
          </Formik>
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
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTask;
