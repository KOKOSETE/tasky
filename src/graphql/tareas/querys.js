import gql from "graphql-tag";

const GET_TAREAS = gql`
  query tareasList {
  tareasList {
    items {
      contenido
      titulo
      id
      estado
    }
  }
}
`;
export { GET_TAREAS };
