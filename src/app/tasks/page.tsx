"use client";

import {
  IFindAllTasks,
  Status,
  StatusSeverity,
  StatusLabel,
  IModalTableData,
  IModalTableContent,
  getIcon,
} from "@/interfaces/tasks";
import { findAllTasks } from "@/services/tasks";
import { Box, Button, Chip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PendingActions,
  Groups3,
  CheckCircle,
  AddCircle,
} from "@mui/icons-material";
import DataTables from "@/components/dataTables";
import RealTimeWidthView from "@/components/realTimeWidthView";
import TableModal from "@/components/tableModal/page";

const Tasks = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isTasks, setTasks] = useState<IFindAllTasks[]>([]);
  const [isModalData, setModalData] = useState<IModalTableData[]>([]);
  const [isModalContent, setModalContent] = useState<IModalTableContent>({
    editText: "",
    createText: "",
    editPath: "",
    attachPath: "",
  });
  const router = useRouter();
  const mobileWidth = 600;
  const { isViewWidth } = RealTimeWidthView();
  const taskContent = {
    title: "Lista de tarefas",
    path: "tasks",
    editName: "editTasks",
    editLabel: "Editar",
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
        customBodyRender: (
          value: any,
          tableMeta: { rowData: any[]; columnIndex: number }
        ) => {
          console.log(
            "Renderizando célula - Value:",
            value,
            "RowData:",
            tableMeta.rowData
          );

          const getColumnIndexByName = (columns: any, name: any) =>
            columns.findIndex((col: any) => col.name === name);

          const taskIdIndex = getColumnIndexByName(columns, "id") + 1;
          const taskId = tableMeta.rowData[taskIdIndex];

          if (value === null) {
            return (
              <Button
                startIcon={<AddCircle />}
                variant="text"
                onClick={() => {
                  router.push(`tasks/attach/stockpile?id=${taskId}`);
                }}
              >
                Adicionar
              </Button>
            );
          }

          return <Box>{value}</Box>;
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
        customBodyRender: (value: any, tableMeta: any) => {
          const getColumnIndexByName = (columns: any, name: any) =>
            columns.findIndex((col: any) => col.name === name);

          const employeeIdIndex =
            getColumnIndexByName(columns, "employeeId") + 1;
          const employeeId = tableMeta.rowData[employeeIdIndex];
          const taskIdIndex = getColumnIndexByName(columns, "id") + 1;
          const taskId = tableMeta.rowData[taskIdIndex];
          const splitValue = value ? value.split("\n") : [];
          const splitEmployeeId = employeeId ? employeeId.split("\n") : [];
          const modalValue = splitEmployeeId.map(
            (id: string, index: number) => ({
              id: id,
              taskId,
              name: splitValue[index],
            })
          );

          const content = {
            editText: "Editar funcionário",
            createText: "Adcionar funcionário",
            editPath: "employee/edit",
            attachPath: "tasks/attach/employee",
          };

          switch (value) {
            case null:
              return (
                <Button
                  startIcon={<AddCircle></AddCircle>}
                  variant="text"
                  onClick={() => {
                    router.push(`${content.attachPath}?id=${taskId}`);
                  }}
                >
                  Adcionar
                </Button>
              );
          }
          return (
            <Box>
              <Button
                onClick={() => handleModal(modalValue, content)}
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
          const icon = getIcon(value);
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
        customBodyRender: (value: string) =>
          value ? new Date(value).toLocaleString() : "",
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
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      marginX={"1rem"}
      flexWrap={"wrap"}
    >
      <Box width="100%" height={"100%"} marginBottom={"1rem"}>
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
