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

const AttachStockpile = () => {
  const [isTask, setTask] = useState<IFindOneTask>();
  const [isStockpile, setStockpile] = useState<IFindAllStockpile[]>([]);
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
    stockpileId: Yup.string().required(
      "Selecione pelo menos um item do estoque"
    ),
  });

  const handleService = async (values: any) => {
    const { stockpileId } = values;
    const taskId: IEditStockpile = { taskId: id };
    editStockpile(stockpileId, taskId)
      .then((response: any) => {
        setAlert({
          message: "Objeto em estoque foi anexado a uma tarefa com sucesso",
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
    findOneTask(id).then((response: any) => {
      setTask(response.data);
    });
  }, [id]);

  useEffect(() => {
    findAllStockpile().then((response: any) => {
      setStockpile(response.data);
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
        <Typography variant="h5">Anexar objeto em estoque a tarefa</Typography>
        <Formik
          initialValues={{
            stockpileId: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await handleService(values);
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <TextField
                label="Tarefa"
                slotProps={{ inputLabel: { shrink: true } }}
                value={isTask?.title || ""}
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
                  Anexar objeto
                </InputLabel>
                <Select
                  name="stockpileId"
                  id="stockpileId"
                  labelId="demo-multiple-chip-label"
                  label="Anexar objeto"
                  value={values.stockpileId}
                  sx={{ width: "100%" }}
                  onChange={handleChange}
                >
                  {isStockpile.map((stockpile) => (
                    <MenuItem key={stockpile.id} value={stockpile.id}>
                      {stockpile.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched?.stockpileId && errors?.stockpileId && (
                  <FormHelperText sx={{ color: "#F44336" }}>
                    {errors.stockpileId}
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

export default AttachStockpile;
