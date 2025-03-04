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
import { IAlertResponse, Severity } from "@/interfaces/response";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [isPasswordHidden, setPasswordHidden] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [isAlertResponse, setAlertResponse] = useState<IAlertResponse>({
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
        console.log(err);
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
        marginX: { xs: "1rem", md: "3rem", lg: "5rem" },
      }}
    >
      <Box
        component="img"
        src="/assets/womam-worker.png"
        alt="Funcionária"
        maxWidth={"4rem"}
      ></Box>
      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          padding: { xs: "1rem", md: "2rem" },
        }}
      >
        <Typography fontSize={{ xs: "1.5rem", lg: "2rem" }} gutterBottom>
          Login
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
                  label="Mostrar senha"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  marginTop: "1rem",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => router.push("/auth/signup")}
                  sx={{ width: "100%" }}
                >
                  Ainda não criou sua conta?
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Logar
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
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
  );
};

export default SignIn;
