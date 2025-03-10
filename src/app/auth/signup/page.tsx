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
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
      .matches(/[A-Z]/, "Pelo menos uma letra maiúscula")
      .matches(/[a-z]/, "Pelo menos uma letra minúscula")
      .matches(/[0-9]/, "Pelo menos um número")
      .matches(/[?=.*\W+]/, "Pelo menos um caractere especial")
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
        router.push("/auth/signin");
      })
      .catch((err) => {
        setAlertResponse({
          statusCode: err.response.data.statusCode,
          message: err.response.data.message,
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
      <Box
        component="img"
        src="/assets/womam-worker.png"
        alt="Funcionária"
        maxWidth={"4rem"}
      ></Box>
      <Box
        sx={{
          xs: "100%",
          lg: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          padding: "2rem",
        }}
      >
        <Typography
          fontSize={{ xs: "1.5rem", lg: "2rem" }}
          marginBottom={"1.5rem"}
        >
          Cadastrar Usuário
        </Typography>

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
                  helperText={touched.name && errors.name ? errors.name : null}
                  error={touched.name && Boolean(errors.name)}
                  onChange={handleChange}
                ></TextField>
                <TextField
                  type="email"
                  label="Email"
                  id="email"
                  fullWidth
                  helperText={
                    touched.email && errors.email ? errors.email : null
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
                    touched.password && errors.password ? errors.password : null
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
      </Box>
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
  );
};

export default SignUp;
