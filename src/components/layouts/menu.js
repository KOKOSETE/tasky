import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Menu(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{ backgroundColor: "#b945e8", marginBottom: "20px" }}
      >
        <Toolbar>
          <Button color="inherit" onClick={props.newTask}>
            Nueva task
          </Button>
          <Typography variant="h6" className={classes.title} align="center">
            Tasky
          </Typography>
        </Toolbar>
      </AppBar>
      
    </div>
  );
}
