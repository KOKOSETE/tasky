import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function FormDialog(props) {
  var [task, setTask] = useState({
    titulo: "",
    contenido: "",
  });
  return (
    <div>
      <Dialog
        open={props.openDialog}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Nota</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => {
              setTask({
                titulo: e.target.value,
                contenido: task.contenido,
              });
            }}
            autoFocus
            margin="dense"
            id="name"
            value={task.titulo}
            label="Titulo"
            fullWidth
          />
          <TextField
            onChange={(e) => {
              setTask({
                titulo: task.titulo,
                contenido: e.target.value,
              });
            }}
            autoFocus
            margin="dense"
            id="contenido"
            value={task.contenido}
            label="Contenido"
            multiline
            rows={4}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={(e) => props.saveTask(task)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
