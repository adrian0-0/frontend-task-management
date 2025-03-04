import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  IconButton,
  ThemeProvider,
  Typography,
} from "@mui/material";
import RealTimeWidthView from "../realTimeWidthView";
import { useRouter } from "next/navigation";
import { AddHomeWork, EditNote, Groups3, Warehouse } from "@mui/icons-material";
import { table } from "console";

interface DataTablesProps {
  data: any;
  columns: any;
  content: {
    title: string;
    path: string;
    editLabel: string;
    editName: string;
  };
  tableEmpty: {
    id: string;
    name: string;
    path: string;
  };
}

const DataTables: React.FC<DataTablesProps> = ({
  data,
  columns,
  content,
  tableEmpty,
}) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { isViewWidth } = RealTimeWidthView();
  const mobileWidth = 600;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "task":
        return <AddHomeWork></AddHomeWork>;
      case "stockpile":
        return <Warehouse></Warehouse>;
      case "employee":
        return <Groups3></Groups3>;
    }
  };

  const options = {
    responsive: "standard",
    filterType: "dropdown",
    jumpToPage: true,
    selectableRows: "none",
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
        rowsPerPage: isViewWidth > mobileWidth ? "Linhas por página:" : "",
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
              margin: "0rem",
              padding: "0rem",
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
              backgroundColor: "inherit !important",
              "&.MuiTableCell-footer": {
                padding: "0rem",
                textAlign: "center",
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
        MuiFormControl: {
          styleOverrides: {
            root: {
              backgroundColor: "inherit !important",
              color: "inherit !important",
            },
          },
        },
        MuiTableBody: {
          styleOverrides: {
            root: {
              backgroundColor: "inherit !important",
            },
          },
        },

        MuiFormControlLabel: {
          styleOverrides: {
            root: {
              backgroundColor: "inherit !important",
              color: "inherit !important",
            },
          },
        },

        MuiTypography: {
          styleOverrides: {
            root: {
              color: "inherit !important",
            },
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
              padding: "10px",
            },
            toolbar: {
              display: "flex",
              justifyContent: "center",
            },
            selectLabel: {
              fontSize: "14px",
            },
          },
        },
      },
    });

  const extendedColumns = [
    {
      name: content.editName,
      label: content.editLabel,
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const rowData = data[tableMeta.rowIndex];
          const id = rowData.id;
          return (
            <IconButton
              color="primary"
              onClick={() => router.push(`/${content.path}/info?id=${id}`)}
            >
              <EditNote></EditNote>
            </IconButton>
          );
        },
      },
    },
    ...columns,
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      {isLoading ? (
        <CircularProgress />
      ) : data.length === 0 ? (
        <Box>
          <Box sx={{ marginBottom: "1.5rem" }}>
            <Typography variant="h6" textAlign="center">
              Nenhum dado disponível no momento.
            </Typography>
            <Button
              variant="contained"
              startIcon={getIcon(tableEmpty.id)}
              sx={{ marginTop: "1rem" }}
              onClick={() => router.push(tableEmpty.path)}
            >
              {tableEmpty.name}
            </Button>
          </Box>
          <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={
                <Typography
                  variant="h5"
                  display={"flex"}
                  justifyContent={{ xs: "center", lg: "left" }}
                >
                  {content.title}
                </Typography>
              }
              data={data}
              columns={extendedColumns}
              options={options}
            />
          </ThemeProvider>
        </Box>
      ) : (
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={
              <Typography
                variant="h5"
                display={"flex"}
                justifyContent={{ xs: "center", lg: "left" }}
              >
                {content.title}
              </Typography>
            }
            data={data}
            columns={extendedColumns}
            options={options}
          />
        </ThemeProvider>
      )}
    </Box>
  );
};

export default DataTables;
