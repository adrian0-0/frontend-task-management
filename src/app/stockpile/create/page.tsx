"use client";
import { IAlertResonse, Severity } from "@/interfaces/response";
import { createStockpile } from "@/services/stockpile";
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
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

const CreateStockpile = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isAlert, setAlert] = useState<IAlertResonse>({
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
    name: Yup.string().required("Nome é obrigatório"),
    quant: Yup.number().required("Quantidade é obrigatório"),
    description: Yup.string().optional(),
  });

  const handleService = (values: any) => {
    createStockpile(values)
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
      <Box width={{ sx: "100%", lg: "80%" }}>
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
            sx={{ marginBottom: "1rem", width: "min-content" }}
          >
            Retornar
          </Button>
          <Typography variant="h5" fontWeight={"600"} marginBottom={"1rem"}>
            Adcionar objeto ao estoque
          </Typography>
          <Formik
            initialValues={{
              name: "",
              quant: null,
              description: "",
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
                    id="name"
                    name="name"
                    label="Nome"
                    placeholder="Nome do objeto"
                    type="text"
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    helperText={
                      touched.name && errors.name ? errors.name : null
                    }
                    error={touched.name && Boolean(errors.name)}
                    onChange={handleChange}
                  />
                  <TextField
                    id="quant"
                    name="quant"
                    label="Quantidade"
                    placeholder="Quantidade de objetos"
                    type="number"
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    helperText={
                      touched.quant && errors.quant ? errors.quant : null
                    }
                    error={touched.quant && Boolean(errors.quant)}
                    onChange={handleChange}
                  />
                  <TextField
                    id="description"
                    name="description"
                    label="Descrição"
                    placeholder="Descrição da pilha de estoque"
                    type="text"
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

export default CreateStockpile;
