import { Status, StatusLabel, StatusSeverity } from "@/interfaces/tasks";
import { CheckCircle, Groups3, PendingActions } from "@mui/icons-material";
import { Chip } from "@mui/material";
import React from "react";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getIcon = (status: StatusLabel): JSX.Element => {
    switch (status) {
      case StatusLabel.OPEN:
        return <PendingActions fontSize="small" />;
      case StatusLabel.IN_PROGRESS:
        return <Groups3 fontSize="small" />;
      case StatusLabel.DONE:
        return <CheckCircle fontSize="small" />;
      default:
        return <PendingActions fontSize="small" />;
    }
  };

  return (
    <Chip
      icon={getIcon(StatusLabel[status as keyof typeof StatusLabel])}
      color={StatusSeverity[StatusLabel[status as keyof typeof StatusLabel]]}
      label={StatusLabel[status as keyof typeof StatusLabel]}
    />
  );
};

export default StatusBadge;
