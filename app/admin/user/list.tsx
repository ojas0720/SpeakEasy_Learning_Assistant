import { Datagrid, ImageField, List, NumberField, ReferenceField, TextField } from "react-admin";

export const UsersList = () => (
  <List>
    <Datagrid rowClick={false} bulkActionButtons={false}>
      <TextField source="userId" label="User ID" />
      <TextField source="userName" label="Name" />
      <ImageField source="userImageSrc" label="Avatar" sx={{ '& img': { width: 40, height: 40, borderRadius: '50%' } }} />
      <NumberField source="points" label="Points" />
      <NumberField source="hearts" label="Hearts" />
      <NumberField source="activeCourseId" label="Active Course" />
    </Datagrid>
  </List>
);
