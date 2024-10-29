// StyledButton.js
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const StyledButton = styled(Button)(({ theme, variant }) => ({
  fontSize: "1rem",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  color: "#fff",
  transition: "background-color 0.3s ease",
  ...(variant === "primary" && {
    backgroundColor: "#CE5A67",
    "&:hover": {
      backgroundColor: "#b54f5e",
    },
  }),
  ...(variant === "secondary" && {
    backgroundColor: "#1F1717",
    color: "#F4BF96",
    "&:hover": {
      backgroundColor: "#4a3a3a",
    },
  }),
  ...(variant === "icon" && {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    minWidth: "unset",
    backgroundColor: "#CE5A67",
    "&:hover": {
      backgroundColor: "#b54f5e",
    },
  }),
}));

export default StyledButton;
