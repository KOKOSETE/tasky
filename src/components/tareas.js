import React, { useState, useEffect } from "react";
import UpdateDialog from "./layouts/UpdateDialog";
import FormDialog from "./layouts/FormDialog";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Menu from "./layouts/menu";
import Delete from "@material-ui/icons/Delete";
import SnackBar from "./snackbar";
import Edit from "@material-ui/icons/Edit";
import { GET_TAREAS } from "../graphql/tareas/querys";
import {
  NEW_TAREA,
  EDIT_TAREA,
  CLEAR_TAREA,
  UPDATE_STATUS,
} from "../graphql/tareas/mutations";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";

export default function Tareas() {
  const { loading, error, data, refetch } = useQuery(GET_TAREAS, {
    fecthPolicy: "network-only",
  });
  const [newTask] = useMutation(NEW_TAREA);
  const [updateTask] = useMutation(EDIT_TAREA);
  const [borrarTask] = useMutation(CLEAR_TAREA);
  const [updateStatus] = useMutation(UPDATE_STATUS);
  var [openSnack, setOpenSnack] = useState(false);
  var [openDialogEdit, setOpenDialogEdit] = useState(false);
  var [openDialogNew, setDialogNew] = useState(false);
  var [message, setMessage] = useState("");
  var [tasks, setTasks] = useState([]);
  var [idTask, setIdTask] = useState('');
  var [color, setColor] = useState('info');
  var [tasksCompleted, setTasksCompleted] = useState([]);

  //Custom hook encargado de consultar las tareas al montarse el componente
  const useGetTasks = (error, data) => {
    useEffect(() => {
      if (data && data.tareasList) {
        let tasks = data.tareasList.items;
        let tasksC = [];
        let tasksU = [];
        tasks.map((item) => {
          if (item.estado === true) {
            tasksC.push(item);
          } else {
            tasksU.push(item);
          }
          return item;
        });
        setTasks(tasksU);
        setTasksCompleted(tasksC);
      }
      if (error) {
        console.log(error);
      }
    }, [data, error]);
  };
  //Esta funcion es la encargada de enviar la tarea nueva a traves de la mutation newTask, recibe
  //un parametro obj, que es la tarea nueva que se enviara
  const sendTask = (obj) => {
    setDialogNew(false);
    newTask({
      variables: { data: obj },
    }).then((res) => {
      setMessage("Tarea creada con exito");
      setOpenSnack(true);
      setColor('info')
      refetch();
    }).catch(err => {
      console.log(err)
      setMessage("Ocurrio un error :(");
      setOpenSnack(true);
      setColor('error')
    });
  };

  //Funcion para editar la tarea, recibe task que son los datos nuevos de la tarea,
  //y su id, se envian a la mutation updateTask
  const updateConfirm = (task) => {
    updateTask({
      variables: { data: task, filter: { id: idTask } },
    })
      .then((res) => {
        setMessage("La tarea se ha editado con exito");
        setOpenSnack(true);
        setColor('info')
        setOpenDialogEdit(false);
        refetch();
      })
      .catch(err => {
        console.log(err)
        setMessage("Ocurrio un error :(");
        setOpenSnack(true);
        setColor('error')
      });
  };
  //Funcion para eliminar la tarea llamando a borrarTask, recibe un parametro value
  //este es el id de la tarea para enviarla a la mutation

  const deleteTask = (value) => {
    borrarTask({
      variables: { filter: { id: value } },
    })
      .then((res) => {
        if (res.data.tareaDelete.success) {
          setMessage("Tarea eliminada con exito");
          setOpenSnack(true);
          setColor('info')
          refetch();
        }
      })
      .catch(err => {
        console.log(err)
        setMessage("Ocurrio un error :(");
        setOpenSnack(true);
        setColor('error')
      });
  };
  //Funcion que recibe el valor del checkbox para marcarlo y cambiar el estado de la tarea
  //llamando a la mutation y pasandole los valores necesarios
  const changeStatus = (event, obj, id) => {
    let task = {
      estado: event.target.checked,
    };
    updateStatus({
      variables: { id: id, data: task },
    })
      .then((res) => {
        setMessage("La tarea se ha movido a completadas");
        setOpenSnack(true);
        setColor('info')
        refetch();
      })
      .catch(err => {
        console.log(err)
        setMessage("Ocurrio un error :(");
        setOpenSnack(true);
        setColor('error')
      });
  };
  //Esta funcion cierra el snackbar o notificacion luego de realizar cualquier consulta
  const closeSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  //Esta funcion abre el dialog para editar la tarea, y cambia el estado de
  //idTask 
  const editTask = (value) => {
    setOpenDialogEdit(true);
    setIdTask(value);
  };

  //Funcion para cambiar el estado de openDialog y asi cerrar el dialog luego de editar una tarea
  const closeDialogEdit = () => {
    setOpenDialogEdit(false);
  };

  //Funcion para cerrar el dialog de tarea nueva
  const closeDialogNew = () => {
    setDialogNew(false);
  };
  //Funcion para abrir el dialog de tarea nueva
  const openNewTask = () => {
    setDialogNew(true);
  };
  //Custom hook para realizar la consultas de todas las tareas para que se rendericen
  useGetTasks(error, data);
  if(error){
    return <h1>Ocurrio un error de conexion, actualiza la pagina</h1>
  }
  return (
    <div>
      <UpdateDialog
        openDialog={openDialogEdit}
        updateConfirm={updateConfirm}
        closeDialog={closeDialogEdit}
        id={idTask}
      />
      <FormDialog
        openDialog={openDialogNew}
        handleClose={closeDialogNew}
        saveTask={sendTask}
      />
      <SnackBar
        openSnack={openSnack}
        closeSnack={closeSnack}
        message={message}
        color={color}
      />
      <Menu newTask={openNewTask}/>
      <Typography
        variant="h4"
        component="h4"
        gutterBottom
        style={{ color: "#b945e8" }}
        align="center"
      >
        Tareas sin completar
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {tasks.map((task, index) => (
              <Grid key={index} item xs={3}>
                <Card style={{ backgroundColor: "#b945e8", margin: "4px" }}>
                  <CardContent>
                    <Typography style={{ color: "#F8EDFD" }} gutterBottom>
                      {task.titulo}
                    </Typography>
                    <Typography style={{ color: "#F8EDFD" }} component="p">
                      {task.contenido}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Grid container justify="space-between">
                      <Checkbox
                        disabled={task.estado}
                        style={{ color: "#DDA4F4" }}
                        checked={task.estado}
                        onChange={(e) => changeStatus(e, task, task.id)}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                      <Button style={{ color: "#DDA4F4" }}>
                        <Edit onClick={(e) => editTask(task.id)}></Edit>
                      </Button>
                      <Button style={{ color: "#DDA4F4" }}>
                        <Delete onClick={(e) => deleteTask(task.id)}></Delete>
                      </Button>
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Typography
        variant="h4"
        component="h4"
        style={{ color: "#b945e8" }}
        align="center"
      >
        Tareas Completadas
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {tasksCompleted.map((task, index) => (
              <Grid key={index} item xs={3}>
                <Card style={{ backgroundColor: "#b945e8", margin: "4px" }}>
                  <CardContent>
                    <Typography style={{ color: "#F8EDFD" }} gutterBottom>
                      {task.titulo}
                    </Typography>
                    <Typography style={{ color: "#F8EDFD" }} component="p">
                      {task.contenido}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Grid container justify="space-between">
                      <Checkbox
                        disabled={task.estado}
                        style={{ color: "#DDA4F4" }}
                        checked={task.estado}
                        onChange={(e) => changeStatus(e, task, task.id)}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                      <Button style={{ color: "#DDA4F4" }}>
                        <Delete onClick={(e) => deleteTask(task.id)}></Delete>
                      </Button>
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
