import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
    name: "project",
    initialState: {
        projects: [],
        currentProject: null
    },
    reducers: {
       setProjects: (state, action) => {
           if (Array.isArray(action.payload)) {
               state.projects = action.payload;
           } else if (action.payload && Array.isArray(action.payload.projects)) {
               state.projects = action.payload.projects;
           } else {
               state.projects = [];
           }
       },
       setCurrentProject: (state, action) => {
           state.currentProject = action.payload;
       },
       addNewProject: (state, action) => {
           if (!Array.isArray(state.projects)) state.projects = [];
           state.projects.unshift(action.payload);
       },
       starProject: (state, action) => {
           if (!Array.isArray(state.projects)) return;
           const project = state.projects.find(p => p._id == action.payload);
           if (project) {
               project.starred = !project.starred;
           }
       },
       setDeleteProject: (state, action) => {
           if (!Array.isArray(state.projects)) return;
           state.projects = state.projects.filter(p => p._id != action.payload);
       }
    }
})

export const {setProjects,addNewProject,starProject,setDeleteProject,setCurrentProject}=projectSlice.actions
export default projectSlice.reducer