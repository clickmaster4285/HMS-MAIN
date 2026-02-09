import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

 const API_URL =import.meta.env.VITE_REACT_APP_API_URL;

 export const createMedicineRecord = createAsyncThunk(
    "medicine/add-medicine",
    async (medicineData, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `${API_URL}/medicine/add-medicine`,
          medicineData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  //fetching all medicine records

  export const getAllMedicine = createAsyncThunk(
    "medicine/get-medicine",
    async(medicineData , {rejectWithValue})=>{
      try{
        const response = await axios.get(`${API_URL}/medicine/get-medicine`);
        return response.data;
      }
      catch(error){
          return rejectWithValue(error.response.data);
      }
    }
  );

  //updating record based on id
  export const updateMedicineRecord = createAsyncThunk(
    "medicine/update-medicine-by-id",
  async({id , medicineData} , {rejectWithValue})=>{
      try{
        console.log(medicineData);
          const response = await axios.put(`${API_URL}/medicine/update-medicine-by-id/${id}` , medicineData);

          return response.data;
      }
      catch(error)
      {
        return rejectWithValue(error.response.data);
      }
    }
  );

  //get medicine by id
  export const getMedicineById = createAsyncThunk(
    "medicine/get-medicine-by-id",
    async( id, {rejectWithValue})=>{
      try{
        const response = await axios.post(`${API_URL}/medicine/get-medicine-by-id/${id}`);
        return response.data;
      }
      catch(error){
        return rejectWithValue(error.response? error.response.data : error.message);
      }
    }
  );

  

const MedicineSlice = createSlice({
    name: "medicine",
    initialState:{
        medicineList :[],
        medicineDetails : null,                        
        loading : false,
        error: null,
        sucessMessage:"",
    },
    extraReducers : (builder) =>{
        builder
        //handle create medicine record method
        .addCase(createMedicineRecord.pending , (state)=>{
            state.loading=true;
        })
        .addCase(createMedicineRecord.fulfilled , (state , action)=>{
            state.loading=false;
            if(action.payload && action.payload.medicine)
            {
            state.medicineList.push(action.payload.medicine);
            state.sucessMessage = "Medicine record added sucessfully";
            }
            else{
                state.error = "Failed to create medicine record";
            }
        })
        .addCase(createMedicineRecord.rejected , (state, action)=>{
            state.loading=false;
            state.error = action.payload? action.payload: "Error creating medicine record";
        })

        
        //handle fetching all medicine record
        .addCase(getAllMedicine.pending , (state)=>{
          state.loading=true;
        })
        .addCase(getAllMedicine.fulfilled , (state,action)=>{
          state.loading=false;
          if(Array.isArray(action.payload)){
            state.medicineList=action.payload
          }
          else{
            state.error="Invalid Format"
          }
        })
        .addCase(getAllMedicine.rejected, (state,action)=>{
          state.loading=false;
          state.error = action.payload? action.payload : "Error fetching data";
        })

        //updating record based on id
        .addCase(updateMedicineRecord.pending , (state)=>{
          state.loading=true;
        })
        .addCase(updateMedicineRecord.fulfilled , (state,action)=>{
          state.loading=false;
          const updatedMedicine = action.payload;
          const index = state.medicineList.findIndex(medicine=> medicine._id === updatedMedicine._id);
          if(index !== -1)
            state.medicineList[index]= updatedMedicine;
        })
        .addCase(updateMedicineRecord.rejected , (state,action)=>{
          state.loading=false;
          state.error = action.payload ? action.payload : "Error updating data";
        })

        //geting medicine by id
        .addCase(getMedicineById.pending , (state)=>{
          state.loading=true;
        })
        .addCase(getMedicineById.fulfilled , (state , action)=>{
          state.loading=false;
          state.medicineList=action.payload;
        })
        .addCase(getMedicineById.rejected , (state,action)=>{
          state.loading=false;
          state.error = action.payload? action.payload:"Error fetching data"
        })




    }
})
export default MedicineSlice.reducer;