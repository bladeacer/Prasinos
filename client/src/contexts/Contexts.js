import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  setUser: () => { }
});
const StaffContext = createContext({
  staff: null,
  setStaff: () => { }
})

export { UserContext, StaffContext };