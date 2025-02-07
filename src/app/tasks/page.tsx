"use client";

import {
  IFindAllTasks,
  Status,
  StatusSeverity,
  StatusLabel,
} from "@/interfaces/tasks";
import { findAllTasks } from "@/services/tasks";
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { PendingActions, Groups3, CheckCircle } from "@mui/icons-material";

const Tasks = () => {
  const [isTasks, setTasks] = useState<IFindAllTasks[]>([]);
  const [isViewWidth, setViewWidth] = useState(0);
  const router = useRouter();
  const mobileWidth = 600;

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "title",
      label: "Titulo",
    },
    {
      name: "description",
      label: "Descrição",
      options: {
        filter: isViewWidth > mobileWidth ? true : false,
        display: isViewWidth > mobileWidth ? true : false,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value: any) => {
          let icon;
          switch (value) {
            case StatusLabel.OPEN:
              icon = <PendingActions fontSize="small" />;
              break;
            case StatusLabel.IN_PROGRESS:
              icon = <Groups3 fontSize="small" />;
              break;
            case StatusLabel.DONE:
              icon = <CheckCircle fontSize="small" />;
              break;
            default:
              icon = <PendingActions fontSize="small" />;
          }
          return (
            <Chip
              color={StatusSeverity[value as keyof typeof StatusSeverity]}
              icon={icon}
              label={value}
            />
          );
        },
      },
    },
    {
      name: "createdAt",
      label: "Criado em",
      options: {
        filter: isViewWidth > mobileWidth ? true : false,
        display: isViewWidth > mobileWidth ? true : false,
        customBodyRender: (value: string) => new Date(value).toLocaleString(),
      },
    },
    {
      name: "expectedToFinish",
      label: "Previsão de finalização",
      options: {
        filter: isViewWidth > mobileWidth ? true : false,
        display: isViewWidth > mobileWidth ? true : false,
        customBodyRender: (value: string) => new Date(value).toLocaleString(),
      },
    },
    {
      name: "alreadyFinished",
      label: "Finalizado em",
      options: {
        filter: isViewWidth > mobileWidth ? true : false,
        display: isViewWidth > mobileWidth ? true : false,
        customBodyRender: (value: string) => new Date(value).toLocaleString(),
      },
    },
  ];

  const options = {
    responsive: "standard",
    filterType: "checkbox",
    jumpToPage: true,
    selectableRows: false,
    print: isViewWidth > mobileWidth ? true : false,
    filter: isViewWidth > mobileWidth ? true : false,
    download: isViewWidth > mobileWidth ? true : false,
    rowsPerPageOptions: [5, 10, 25, 50],

    textLabels: {
      body: {
        noMatch: "Nenhum dado encontrado",
        toolTip: "Ordenar",
      },
      pagination: {
        next: "Próxima Página",
        previous: "Página Anterior",
        rowsPerPage: "Linhas por página:",
        displayRows: "de",
        jumpToPage: "",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Baixar CSV",
        print: "Imprimir",
        viewColumns: "Ver Colunas",
        filterTable: "Filtrar Tabela",
      },
      filter: {
        all: "Todos",
        title: "Filtros",
        reset: "Resetar",
      },
      viewColumns: {
        title: "Mostrar Colunas",
        titleAria: "Mostrar/Esconder Colunas",
      },
      selectedRows: {
        text: "linha(s) selecionada(s)",
        delete: "Deletar",
        deleteAria: "Deletar linhas selecionadas",
      },
    },
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            },
          },
        },
        MuiTableCell: {
          defaultProps: {
            padding: "normal",
          },
          styleOverrides: {
            root: {
              "&.MuiTableCell-footer": {
                backgroundColor: "#f4f4f4", // Cor de fundo
                padding: "0rem", // Espaçamento interno
                textAlign: "center", // Centralizar o conteúdo
              },
              boxShadow: "none",

              "@media (max-width: 600px)": {
                magin: "1rem",
                fontSize: "0.75rem",
              },
            },
            head: {
              "@media (max-width: 600px)": {
                fontSize: "0.8rem",
                fontWeight: "bold",
              },
            },
            body: {
              "@media (max-width: 600px)": {
                whiteSpace: "nowrap",
              },
            },
            sizeSmall: {
              padding: "6px",
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            h5: {
              textAlign: "center",
              fontWeight: "bold",
              "@media (max-width: 600px)": {
                fontSize: "1.25rem",
              },
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            root: {
              backgroundColor: "#f4f4f4", // Altera o fundo da paginação
              padding: "10px",
            },
            toolbar: {
              display: "flex",
              justifyContent: "center", // Centraliza a paginação
            },
            selectLabel: {
              fontSize: "14px",
              color: "#333",
            },
          },
        },
      },
    });

  useEffect(() => {
    const handleResize = async () => setViewWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    findAllTasks()
      .then((response: any) => {
        const tasksWithTranslatedStatus = response.data.map((task: any) => ({
          ...task,
          status:
            StatusLabel[task.status as keyof typeof StatusLabel] || task.status,
        }));
        setTasks(tasksWithTranslatedStatus);
      })
      .catch((err) => {
        if (err.response.data.statusCode === 401) {
          router.push("auth/signin");
        }
      });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      margin={{ xs: "1rem", md: "2rem", lg: "5rem" }}
      flexWrap={"wrap"}
    >
      <Box width="100%" height={"100%"} marginTop={"1rem"}>
        {isTasks.length > 0 ? (
          <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={
                <Typography
                  variant="h5"
                  display={"flex"}
                  justifyContent={{ xs: "center", lg: "left" }}
                >
                  Lista de Tarefas
                </Typography>
              }
              data={isTasks}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        ) : (
          //             <Paper elevation={1} sx={{ padding: { xs: "0rem", lg: "2rem" } }}>

          // </Paper>
          <CircularProgress />
        )}
      </Box>
    </Box>
  );
};

export default Tasks;
