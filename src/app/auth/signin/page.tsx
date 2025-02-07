"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import { signIn } from "@/services/auth";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { IAlertResonse, Severity } from "@/interfaces/response";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [isPasswordHidden, setPasswordHidden] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [isAlertResponse, setAlertResponse] = useState<IAlertResonse>({
    statusCode: 200,
    message: "",
    severity: Severity.INFO,
  });
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.(com)$/,
        "O email não é valido"
      )
      .required("O email é obrigatório."),
    password: Yup.string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .max(40, "Sua senha é muita longa.")
      .matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        "Sua senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial. Além disso, não deve conter espaços em branco."
      )
      .required("A senha é obrigatória."),
  });

  const handleService = async (data: any) => {
    await signIn(data)
      .then((data: any) => {
        setAlertResponse({
          message: data.message,
          statusCode: data.statusCode,
          severity: Severity.SUCESS,
        });
        setOpen(true);
        router.push("/tasks");
      })
      .catch((err: any) => {
        setAlertResponse({
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

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        marginX: { xs: "2rem", md: "3rem", lg: "5rem" },
      }}
    >
      <Box width={{ xs: "100%", lg: "50%" }}>
        <Typography variant="h4" gutterBottom>
          Olá Mundo!
        </Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await handleService(values);
          }}
        >
          {({ errors, touched, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Box
                display={"flex"}
                flexWrap={"wrap"}
                gap={{ xs: "0.5rem", lg: "1rem" }}
              >
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  helperText={
                    touched.email && errors.email
                      ? errors.email
                      : "Por favor, insira seu email."
                  }
                  error={touched.email && Boolean(errors.email)}
                  onChange={handleChange}
                />
                <TextField
                  id="password"
                  name="password"
                  label="Senha"
                  type={isPasswordHidden ? "text" : "password"}
                  fullWidth
                  helperText={
                    touched.password && errors.password
                      ? errors.password
                      : "Por favor, insira sua senha."
                  }
                  error={touched.password && Boolean(errors.password)}
                  onChange={handleChange}
                />
              </Box>
              <Box display={"flex"} width={"100%"}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => setPasswordHidden(!isPasswordHidden)}
                    />
                  }
                  label="Mostrar Senha"
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{
                  marginTop: "1.5rem",
                }}
              >
                Logar
              </Button>
            </Form>
          )}
        </Formik>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={isAlertResponse.severity}
            sx={{ width: "100%" }}
          >
            {isAlertResponse.statusCode} - {isAlertResponse.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SignIn;
