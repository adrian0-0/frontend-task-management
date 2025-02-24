"use client";

import { extendTheme } from "@mui/material/styles";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider, Navigation, Router } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@toolpad/core";
import {
  HomeWork,
  Warehouse,
  Person,
  Logout,
  Close,
  AddCircle,
  PersonAdd,
  AddHomeWork,
  Groups,
} from "@mui/icons-material";
import {
  autocompleteClasses,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { findUser } from "@/services/user";
import { IUser } from "@/interfaces/user";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function headerTitle() {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      flexWrap={"wrap"}
      gap={"0.5rem"}
      marginLeft={"1rem"}
    >
      <Typography fontWeight={"600"}>Task Management</Typography>
      <Box
        component={"img"}
        src="/task-management.png"
        alt="Gerenciador de Tarefas"
        maxWidth={"24px"}
      />
    </Box>
  );
}

function userAccount(
  isUser: IUser,
  isModalOpen: boolean,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  router: AppRouterInstance
) {
  const [size, setSize] = useState({ width: 0 });
  const boxRef = useRef();

  const loggout = () => {
    localStorage.clear();
    router.push("/auth/signin");
  };

  useEffect(() => {
    const observer: any = new ResizeObserver(([entry]) =>
      setSize(entry.contentRect)
    );
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={boxRef}>
      <Divider sx={{ marginX: "0.5rem" }}></Divider>
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        gap={"1rem"}
        padding={"1rem"}
        alignItems={"center"}
        justifyContent={size.width < 300 ? "center" : "inherit"}
      >
        <Tooltip title={isUser.name}>
          <IconButton>
            <Person
              sx={{
                maxWidth: "3rem",
                fontSize: "2.5rem",
                borderColor: "inherit",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "100%",
              }}
            ></Person>
          </IconButton>
        </Tooltip>

        <Box display={size.width < 300 ? "none" : "normal"}>
          <Typography> {isUser.name}</Typography>
          <Typography>{isUser.email}</Typography>
        </Box>
        <IconButton onClick={() => setModalOpen(true)}>
          <Logout sx={{ fontSize: "2rem" }}></Logout>
        </IconButton>
      </Box>
      <Dialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              position: "relative",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "0rem",
                right: "0rem",
              }}
            >
              <IconButton onClick={() => setModalOpen(false)}>
                <Close sx={{ fontSize: "2rem" }}></Close>
              </IconButton>
            </Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Deslogar
            </Typography>
            <Typography id="modal-modal-description">
              Esta ação irá deslogar a sua conta tem certeza?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                startIcon={<Logout></Logout>}
                variant="contained"
                color="error"
                onClick={() => loggout()}
              >
                Sair
              </Button>
            </Box>
          </Paper>
        </Box>
      </Dialog>
    </Box>
  );
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [isUser, setUser] = useState<IUser>({
    name: "",
    email: "",
  });
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isPath, setPath] = useState<string>("");
  const expandMenuButton = document.querySelector('[aria-label="Expand menu"]');
  const isMenuExpanded = expandMenuButton !== null;
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(isMenuExpanded);
  const router = useRouter();

  const theme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: "data-toolpad-color-scheme",
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const NAVIGATION: Navigation = [
    {
      kind: "header",
      title: "Visualização de Tabelas",
    },
    {
      segment: "tasks",
      title: "Tarefas",
      icon: <HomeWork />,
    },
    {
      segment: "stockpile",
      title: "Estoque",
      icon: <Warehouse />,
    },
    {
      segment: "employee",
      title: "Funcionários",
      icon: <Groups />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Adcionar elemento",
    },
    {
      title: "Adcionar",
      icon: <AddCircle />,
      children: [
        {
          segment: `${isPath}/tasks/create`,
          title: "Tarefa",
          icon: <AddHomeWork />,
        },
        {
          segment: `${isPath}/stockpile/create`,
          title: "Objeto ao Estoque",
          icon: <Warehouse />,
        },
        {
          segment: `${isPath}/employee/create`,
          title: "Funcionário",
          icon: <PersonAdd />,
        },
      ],
    },
    {
      segment: "integrations",
      title: "Integrations",
      icon: <LayersIcon />,
    },
  ];

  useEffect(() => {
    const id = localStorage.getItem("userId") ?? "";
    findUser(id)
      .then((response: any) => {
        setUser(response.data);
        setPath(window.location.host);
      })
      .catch(() => {
        router.push("/auth/signin");
      });
  }, []);

  return (
    <AppProvider>
      <DashboardLayout
        navigation={NAVIGATION}
        theme={theme}
        slots={{
          appTitle: headerTitle,
          sidebarFooter: () =>
            userAccount(isUser, isModalOpen, setModalOpen, router),
        }}
      >
        <PageContainer
          sx={{
            paddingX: "0rem !important",
            maxWidth: "100% !important",
          }}
        >
          {children}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
