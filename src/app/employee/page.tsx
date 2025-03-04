"use client";

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataTables from "@/components/dataTables";
import RealTimeWidthView from "@/components/realTimeWidthView";
import { IFindAllEmployee } from "@/interfaces/employee";
import { findAllEmployee } from "@/services/employee";
import { useRouter } from "next/navigation";

const Employee = () => {
  const [isEmployee, setEmployee] = useState<IFindAllEmployee[]>([]);
  const { isViewWidth } = RealTimeWidthView();
  const mobileWidth = 600;
  const router = useRouter();
  const employeeContent = {
    title: "Lista de Funcionários",
    path: "employee",
    editName: "editEmployee",
    editLabel: "Editar funcionário",
  };

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
      name: "name",
      label: "Nome",
    },
    {
      name: "role",
      label: "Cargo",
    },
    {
      name: "email",
      label: "E-mail",
      options: {
        filter: isViewWidth > mobileWidth ? true : false,
        display: isViewWidth > mobileWidth ? true : false,
      },
    },
    {
      name: "phone",
      label: "Número de celular",
      options: {
        filter: isViewWidth > mobileWidth ? true : false,
        display: isViewWidth > mobileWidth ? true : false,
      },
    },
    {
      name: "totalTasks",
      label: "Total de tarefas",
    },
    {
      name: "tasksOpen",
      label: "Tarefas em aberto",
    },
    {
      name: "tasksInprogress",
      label: "Tarefas em progresso",
    },
    {
      name: "tasksDone",
      label: "Tarefas concluídas",
    },
  ];

  useEffect(() => {
    findAllEmployee()
      .then((response: any) => setEmployee(response.data))
      .catch(() => router.push("/auth/signin"));
  }, []);

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      marginX={{ xs: "1rem", md: "1rem", lg: "1rem" }}
      flexWrap={"wrap"}
    >
      <Box width="100%" height={"100%"} marginTop={"1rem"}>
        <DataTables
          data={isEmployee}
          columns={columns}
          content={employeeContent}
        ></DataTables>
      </Box>
    </Box>
  );
};

export default Employee;
