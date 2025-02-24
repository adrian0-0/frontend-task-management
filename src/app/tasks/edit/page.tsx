"use client";

import { IAlertResonse, Severity } from "@/interfaces/response";
import { IFindOneTask } from "@/interfaces/tasks";
import { editTask, findOneTask } from "@/services/tasks";
import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const EditTask = () => {
  const [isTask, setTask] = useState<IFindOneTask>();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isAlert, setAlert] = useState<IAlertResonse>({
    statusCode: 200,
    severity: Severity.INFO,
    message: "",
  });
  const searchParam = useSearchParams();
  const id = searchParam.get("id") ?? "";
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
    alreadyFinished: Yup.string().optional().nullable(),
  });

  const handleService = (values: any) => {
    editTask(id, values)
      .then((response: any) => {
        setAlert({
          statusCode: response.statusCode,
          message: response.message,
          severity: Severity.SUCESS,
        });
        setOpen(true);
      })
      .catch((err: any) => {
        setAlert({
          statusCode: err.response.data.statusCode,
          message: err.response.data.message,
          severity: Severity.ERROR,
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
          <Typography variant="h5" fontWeight={"600"} marginBottom={"1.5rem"}>
            Editar Tarefa
          </Typography>
          <Formik
            enableReinitialize
            initialValues={{
              title: isTask?.title,
              description: isTask?.description,
              createdAt: dayjs(isTask?.createdAt).format("YYYY-MM-DDTHH:mm"),
              expectedToFinish: dayjs(isTask?.expectedToFinish).format(
                "YYYY-MM-DDTHH:mm"
              ),
              alreadyFinished: dayjs(isTask?.alreadyFinished).isValid()
                ? dayjs(isTask?.alreadyFinished).format("YYYY-MM-DDTHH:mm")
                : null,
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
                    defaultValue={isTask?.title}
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
                    defaultValue={isTask?.description}
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
                    defaultValue={
                      isTask?.createdAt &&
                      dayjs(isTask?.createdAt).format("YYYY-MM-DDTHH:mm")
                    }
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
                    defaultValue={
                      isTask?.expectedToFinish &&
                      dayjs(isTask?.expectedToFinish).format("YYYY-MM-DDTHH:mm")
                    }
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
                  <TextField
                    id="alreadyFinished"
                    name="alreadyFinished"
                    label="Data de conclusão"
                    defaultValue={
                      isTask?.alreadyFinished &&
                      dayjs(isTask?.alreadyFinished).format("YYYY-MM-DDTHH:mm")
                    }
                    type={"datetime-local"}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                    helperText={
                      touched.alreadyFinished && errors.alreadyFinished
                        ? errors.alreadyFinished
                        : null
                    }
                    error={
                      touched.alreadyFinished && Boolean(errors.alreadyFinished)
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

export default EditTask;
