import { IModalTableContent, IModalTableData } from "@/interfaces/tasks";
import { AddCircle, Close, EditNote } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

interface Modal {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: IModalTableData[];
  content: IModalTableContent;
}

const TableModal: React.FC<Modal> = ({ isOpen, setOpen, data, content }) => {
  const router = useRouter();
  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      closeAfterTransition={false}
      onClose={() => setOpen(false)}
    >
      <DialogContent
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "3rem",
        }}
      >
        <Box sx={{ position: "absolute", top: "0rem", right: "0rem" }}>
          <IconButton onClick={() => setOpen(false)}>
            <Close sx={{ fontSize: "2rem" }} />
          </IconButton>
        </Box>
        <Box display="flex" flexDirection="column" gap="1rem">
          <Typography variant="h6">{content.editText}</Typography>
          <Box display={"flex"} flexWrap={"wrap"} gap={"1rem"}>
            {Array.isArray(data) &&
              data.map((data: IModalTableData) => (
                <Button
                  key={data.id}
                  startIcon={<EditNote></EditNote>}
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    router.push(`/${content.editPath}?id=${data.id}`);
                    setOpen(false);
                  }}
                >
                  {data.name}
                </Button>
              ))}
          </Box>
          <Typography variant="h6" mt={2}>
            {content.createText}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircle sx={{ fontSize: "2rem" }} />}
            onClick={() =>
              router.push(`/${content.attachPath}?id=${data[0].taskId}`)
            }
          >
            Adicionar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TableModal;
