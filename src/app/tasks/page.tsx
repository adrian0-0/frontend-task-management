"use client";

import {
  IFindAllTasks,
  Status,
  StatusSeverity,
  StatusLabel,
  IModalTableData,
  IModalTableContent,
} from "@/interfaces/tasks";
import { findAllTasks } from "@/services/tasks";
import { Box, Button, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PendingActions,
  Groups3,
  CheckCircle,
  AddCircle,
} from "@mui/icons-material";
import DataTables from "../components/dataTables";
import RealTimeWidthView from "../components/realTimeWidthView";
import TableModal from "../components/tableModal/page";

const Tasks = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isTasks, setTasks] = useState<IFindAllTasks[]>([]);
  const [isModalData, setModalData] = useState<IModalTableData[]>([]);
  const [isModalContent, setModalContent] = useState<IModalTableContent>({
    editText: "",
    createText: "",
    path: "",
  });
  const router = useRouter();
  const mobileWidth = 600;
  const { isViewWidth } = RealTimeWidthView();
  const taskContent = {
    title: "Lista de tarefas",
    path: "tasks",
    editName: "editTasks",
    editLabel: "Editar Tarefa",
  };

  const handleModal = (
    modalData: IModalTableData[],
    content: IModalTableContent
  ) => {
    setModalData(modalData);
    setModalContent(content);
    setModalOpen(true);
  };

  const columns = [
    {
      name: "id",
      label: "ID da Tarefa",
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
      name: "stockpileId",
      label: "Id do Objeto",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "stockpileName",
      label: "Objeto(s) em transporte",
      options: {
        filter: isViewWidth > mobileWidth ? true : false,
        display: isViewWidth > mobileWidth ? true : false,
        customBodyRender: (value: any, tableMeta: { rowData: any[] }) => {
          const stockpileIdValue =
            tableMeta.rowData[
              columns.findIndex((col) => col.name === "stockpileId")
            ];
          const stockpileIds = stockpileIdValue
            ? stockpileIdValue.split("\n")
            : [];
          const stockpiles = value
            ? value.split("\n").map((name: any, index: any) => ({
                name,
                id: stockpileIds[index],
              }))
            : [];
          const content = {
            editText: "Editar objeto em estoque",
            createText: "Adcionar objeto ao estoque",
            path: "stockpile",
          };
          switch (value) {
            case null:
              return (
                <Button
                  startIcon={<AddCircle></AddCircle>}
                  variant="text"
                  onClick={() => {
                    router.push("/stockpile/create");
                  }}
                >
                  Adcionar
                </Button>
              );
          }
          return (
            <Box>
              <Button
                onClick={() => handleModal(stockpiles, content)}
                variant="text"
                sx={{ width: "max-content" }}
              >
                Ver mais
              </Button>
            </Box>
          );
        },
      },
    },
    {
      name: "employeeId",
      label: "ID do Funcionário",
      options: {
        filter: false,
        display: false,
        customBodyRender: (value: any) => {
          return (
            <Box component={"span"} className="break-line">
              {value}
            </Box>
          );
        },
      },
    },
    {
      name: "employeeName",
      label: "Funcionário(s) Encarregado(s)",
      options: {
        customBodyRender: (value: any, tableMeta: { rowData: any[] }) => {
          const employeeIdValue =
            tableMeta.rowData[
              columns.findIndex((col) => col.name === "employeeId")
            ];
          const employeeIds = employeeIdValue
            ? employeeIdValue.split("\n")
            : [];
          const employees = value
            ? value.split("\n").map((name: any, index: any) => ({
                name,
                id: employeeIds[index],
              }))
            : [];

          const content = {
            path: "employee",
            editText: "Editar funcionário",
            createText: "Adcionar funcionário",
          };

          switch (value) {
            case null:
              return (
                <Button
                  startIcon={<AddCircle></AddCircle>}
                  variant="text"
                  onClick={() => {
                    router.push("/employee/create");
                  }}
                >
                  Adcionar
                </Button>
              );
          }
          return (
            <Box>
              <Button
                onClick={() => handleModal(employees, content)}
                variant="text"
                sx={{ width: "max-content" }}
              >
                Ver mais
              </Button>
            </Box>
          );
        },
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

  useEffect(() => {
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
  }, []);

  return (
    <Box
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      marginX={"1rem"}
      flexWrap={"wrap"}
    >
      <Box width="100%" height={"100%"} marginTop={"1rem"}>
        <DataTables
          data={isTasks}
          columns={columns}
          content={taskContent}
        ></DataTables>
      </Box>
      <TableModal
        isOpen={isModalOpen}
        setOpen={setModalOpen}
        data={isModalData}
        content={isModalContent}
      ></TableModal>
    </Box>
  );
};

export default Tasks;
