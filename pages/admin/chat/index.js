import { Divider, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ListUserHaveChat from "../../../components/AdminChat/ListUser";
import UserChat from "../../../components/AdminChat/UserChat";

export default function AdminChat() {
  const [userSelected, setUserSelected] = useState("");

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <ListUserHaveChat
          changeUserSelected={(user) => {
            setUserSelected(user);
          }}
        />
      </Grid>

      <Grid item xs={8}>
        <UserChat user={userSelected}/>
      </Grid>
    </Grid>
  );
}
