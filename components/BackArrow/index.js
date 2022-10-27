import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from 'next/router';

export default function BackArrow(props) {
  const router = useRouter()
  const {href} = props
  return (
    <div
      style={{
        padding: "30px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        router.push({pathname: href || "/"});
      }}
    >
      <ArrowBackIcon sx={{ color: "#1976D2" }} />
      <div style={{ marginLeft: "10px", color: "#1976D2" }}>Quay về</div>
    </div>
  );
}
