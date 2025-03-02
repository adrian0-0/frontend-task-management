"use client";

import { IAlertResponse, IResponse, Severity } from "@/interfaces/response";
import { ISignup } from "@/interfaces/signup";
import { signUp } from "@/services/auth";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const SignUp = () => {
  const [isPasswordHidden, setPasswordHidden] = useState<boolean>(false);
  const [isAlertResponse, setAlertResponse] = useState<IAlertResponse>({
    statusCode: 200,
    message: "",
    severity: Severity.INFO,
  });
  const [isAlertClose, setAlertClose] = useState<boolean>(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Escreva seu nome completo")
      .max(60, "Tamanho do nome execede o limite permitido de caracteres")
      .required("O nome é obrigatório"),
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
        "Sua senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial e não conter espaços em branco."
      )
      .required("A senha é obrigatória."),
  });

  const handleService = async (data: any) => {
    await signUp(data)
      .then((data: any) => {
        setAlertResponse({
          statusCode: data.statusCode,
          message: data.message,
          severity: Severity.SUCESS,
        });
        setAlertClose(true);
      })
      .catch((err) => {
        setAlertResponse({
          statusCode: err.statusCode,
          message: err.message,
          severity: Severity.ERROR,
        });
        setAlertClose(true);
      });
  };

  const handleClose = () => {
    setAlertClose(false);
  };

  return (
    <Box
      display={"flex"}
      height={"100vh"}
      marginX={{ xs: "1rem", md: "3rem", lg: "5rem" }}
      justifyContent={"center"}
      textAlign={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <Box width={{ xs: "100%", lg: "50%" }}>
        <Typography variant="h3">Cadastrar Usuário</Typography>
        <Card>
          <CardContent>
            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values) => handleService(values)}
            >
              {({ errors, touched, handleChange, handleSubmit }) => (
                <Form>
                  <Box
                    display={"flex"}
                    flexWrap={"wrap"}
                    gap={{ xs: "0.5rem", lg: "1rem" }}
                  >
                    <TextField
                      type="text"
                      label="Nome"
                      id="name"
                      fullWidth
                      helperText={
                        touched.name && errors.name
                          ? errors.name
                          : "Por favor, insira seu nome."
                      }
                      error={touched.name && Boolean(errors.name)}
                      onChange={handleChange}
                    ></TextField>
                    <TextField
                      type="email"
                      label="Email"
                      id="email"
                      fullWidth
                      helperText={
                        touched.email && errors.email
                          ? errors.email
                          : "Por favor, insira seu email."
                      }
                      error={touched.email && Boolean(errors.email)}
                      onChange={handleChange}
                    ></TextField>
                    <TextField
                      type={isPasswordHidden ? "text" : "password"}
                      label="Senha"
                      id="password"
                      fullWidth
                      helperText={
                        touched.email && errors.email
                          ? errors.email
                          : "Por favor, insira sua senha."
                      }
                      error={touched.password && Boolean(errors.password)}
                      onChange={handleChange}
                    ></TextField>
                  </Box>
                  <Box display={"flex"} width={"100%"}>
                    <FormControlLabel
                      label="Mostrar senha"
                      control={
                        <Checkbox
                          onChange={() => setPasswordHidden(!isPasswordHidden)}
                        ></Checkbox>
                      }
                    ></FormControlLabel>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: "1.5rem" }}
                  >
                    Criar Conta
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
        <Snackbar
          open={isAlertClose}
          autoHideDuration={3000}
          onClose={handleClose}
          sx={{ width: "100%" }}
        >
          <Alert onClose={handleClose} severity={isAlertResponse.severity}>
            {isAlertResponse.statusCode} - {isAlertResponse.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SignUp;
