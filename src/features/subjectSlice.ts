import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

interface Topic {
  id: string;
  title: string;
  video_links: string[];
  pdf_path: string;
}

interface Unit {
  id: string;
  name: string;
  order_no: number;
  topics: Topic[];
}

interface Subject {
  id: string;
  name: string;
  semester_id: string;
  units: Unit[];
}

interface SubjectState {
  subject: Subject | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubjectState = {
  subject: null,
  loading: false,
  error: null,
};

export const fetchSubjectData = createAsyncThunk(
  'subject/fetchSubjectData',
  async (subjectId: string) => {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        units (
          *,
          topics (*)
        )
      `)
      .eq('id', subjectId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectData.fulfilled, (state, action) => {
        state.loading = false;
        state.subject = action.payload;
      })
      .addCase(fetchSubjectData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subject data';
      });
  },
});

export default subjectSlice.reducer; 