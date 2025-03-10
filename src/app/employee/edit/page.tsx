"use client";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import { IMaskInput } from "react-imask";
import {
  createEmployee,
  editEmployee,
  findOneEmployee,
} from "@/services/employee";
import { IAlertResponse, Severity } from "@/interfaces/response";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { IFindOneEmployee } from "@/interfaces/employee";

const EditEmployee = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isAlert, setAlert] = useState<IAlertResponse>({
    statusCode: 200,
    severity: Severity.INFO,
    message: "",
  });
  const [isEmployee, setEmployee] = useState<IFindOneEmployee>();
  const validationSchema = Yup.object({
    name: Yup.string().required("Nome é obrigatório"),
    role: Yup.string().required("Cargo é obrigatório"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.(com)$/,
        "O email não é valido"
      )
      .required("O email é obrigatório."),
    phone: Yup.string()
      .matches(/^\+55 \(\d{2}\) \d{5}-\d{4}$/, "Número de celular não é válido")
      .required("O telefone é obrigatório"),
  });
  const router = useRouter();
  const theme = useTheme();
  const {
    palette: { mode: isTheme },
  } = theme;
  const searchParam = useSearchParams();
  const id = searchParam.get("id") ?? "";

  const handleService = (values: any) => {
    editEmployee(id, values)
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

  const phoneMask = React.forwardRef<HTMLInputElement>(
    function TextMaskCustom(props, ref) {
      const { ...other } = props;
      return (
        <IMaskInput
          {...other}
          mask="{+55} (00) 00000-0000"
          definitions={{
            "#": /[1-9]/,
          }}
          inputRef={ref}
          overwrite
        />
      );
    }
  );

  useEffect(() => {
    findOneEmployee(id).then((response: any) => {
      setEmployee(response.data);
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
            sx={{ width: "min-content", marginBottom: "1rem" }}
          >
            Retornar
          </Button>
          <Typography variant="h5" fontWeight={"600"} marginBottom={"1.5rem"}>
            Editar Funcionário
          </Typography>
          <Formik
            enableReinitialize
            initialValues={{
              name: isEmployee?.name,
              role: isEmployee?.role,
              email: isEmployee?.email,
              phone: isEmployee?.phone,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleService(values);
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Box display={"flex"} flexWrap={"wrap"} gap={"1.5rem"}>
                  <TextField
                    id="name"
                    name="name"
                    label="Nome"
                    type="text"
                    placeholder="Seu nome completo"
                    defaultValue={isEmployee?.name}
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
                    id="role"
                    name="role"
                    label="Cargo"
                    placeholder="Administrador"
                    type={"text"}
                    defaultValue={isEmployee?.role}
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    helperText={
                      touched.role && errors.role ? errors.role : null
                    }
                    error={touched.role && Boolean(errors.role)}
                    onChange={handleChange}
                  />
                  <TextField
                    id="email"
                    name="email"
                    label="E-mail"
                    placeholder="email@gmail.com"
                    type={"email"}
                    defaultValue={isEmployee?.email}
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    helperText={
                      touched.email && errors.email ? errors.email : null
                    }
                    error={touched.email && Boolean(errors.email)}
                    onChange={handleChange}
                  />
                  <TextField
                    id="phone"
                    variant="outlined"
                    name="phone"
                    label="Número de celular"
                    placeholder="+55 (99) 99999-9999"
                    defaultValue={isEmployee?.phone}
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      touched?.phone && errors?.phone ? errors.phone : null
                    }
                    error={touched?.phone && Boolean(errors?.phone)}
                    slotProps={{
                      input: {
                        inputComponent: phoneMask as any,
                      },
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    value={values.phone}
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
                  Salvar
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

export default EditEmployee;
