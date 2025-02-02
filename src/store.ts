import { configureStore } from '@reduxjs/toolkit';
import subjectReducer from './features/subjectSlice';

const store = configureStore({
  reducer: {
    subject: subjectReducer,
  },
});

export default store; 