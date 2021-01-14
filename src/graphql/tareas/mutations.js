import gql from "graphql-tag";

const NEW_TAREA = gql`
  mutation tareaCreate($data: TareaCreateInput!) {
      __typename
    tareaCreate(data: $data) {
      contenido
      id
      titulo
    }
  }
`;
const EDIT_TAREA = gql`
  mutation tareaUpdate($data: TareaUpdateInput!, $filter: TareaKeyFilter) {
    __typename
  tareaUpdate(data: $data, filter: $filter) {
    id
    titulo
    contenido
  }
  }
`;
const CLEAR_TAREA = gql`
  mutation tareaDeleteByFilter($filter: TareaKeyFilter) {
    __typename
  tareaDelete(filter: $filter) {
    success
  }
  }
`;
const UPDATE_STATUS = gql`
mutation tareasResolver($id: ID, $data: task) {
  __typename
  tareasResolver(id: $id, task: $data) {
    contenido
    estado
    id
  }
}`
export { NEW_TAREA, EDIT_TAREA, CLEAR_TAREA, UPDATE_STATUS };
