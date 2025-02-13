"use client";

import {
  Box,
  Button,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ptBR } from "@mui/x-date-pickers/locales";
import { DateTimePicker } from "@mui/x-date-pickers";
import utc from "dayjs/plugin/utc";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const CreateTask = () => {
  const [dateValue, setDateValue] = React.useState<Dayjs | null>(
    dayjs.utc("2022-04-17T15:30")
  );

  const validationSchema = Yup.object({
    title: Yup.string().required("O nome é obrigatório."),
    description: Yup.string().optional(),
    createdAt: Yup.date().required("A data de criação é obrigatória"),
    expectedToFinish: Yup.date().required(
      "O prazo de finalização é obrigatório"
    ),
  });

  const handleService = async (values: any) => {
    console.log(values);
  };

  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Box width={"100%"}>
        <Box
          sx={{
            marginX: { xs: "1rem", md: "3rem", lg: "5rem" },
            padding: { xs: "1rem", md: "4rem", lg: "4rem" },
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
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
                    label="Prazo de finalização"
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
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTask;
