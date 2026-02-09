import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

 const API_URL =import.meta.env.VITE_REACT_APP_API_URL;


 export const createInventoryRecord = createAsyncThunk(
    "inventory/add-inventory",
    async(inventoryData , {rejectWithValue}) =>{
        try{
            const response = await axios.post(`${API_URL}/inventory/add-inventory`, inventoryData,  
        {
            headers: {
              'Content-Type': 'application/json',
            },
        });
            return response.data;

        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
 );

 //fetching all records
 export const getAllInventory = createAsyncThunk(
    "inventory/get-inventory-records",
    async(_, {rejectWithValue})=>{
        try{
            const response = await axios.get(`${API_URL}/inventory/get-inventory-records`);
            return response.data.inventoryList;
        }
        catch(error){
            return rejectWithValue(error.response.data);
        }
    }

 )

 //update inventory records
 export const updateInventoryRecord = createAsyncThunk(
    "inventory/update-inventory-by-id",
    async({inventoryData , id} , {rejectWithValue})=>{
        try{
            const response = await axios.put(`${API_URL}/inventory/update-inventory-by-id/${id}` , inventoryData);
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response.data);
        }
    }
 );

 //fetch record based on id
 export const getInventoryById = createAsyncThunk(
    "inventory/get-inventory-by-id",
    async(id , {rejectWithValue}) =>{
        try{
            const response = await axios.post(`${API_URL}/inventory/get-inventory-by-id/${id}`);
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response.data);
        }
    }
 );

   export const deleteInventory = createAsyncThunk(
  'inventory/delete-inventory-by-id',
  async (id, { rejectWithValue }) => {
    try {
       const response = await axios.delete(`${API_URL}/inventory/delete-inventory-by-id/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


 const inventorySlice = createSlice({
    name:"inventory",
    initialState:{
        inventoryList : [],
        inventoryDetails : null,
        loading: false,
        error: null,
        sucessMessage : "",
    },
    extraReducers : (builder)=>{
        builder
          
        //for adding new record
        .addCase(createInventoryRecord.pending , (state)=>{
            state.loading=true;
        })
        .addCase(createInventoryRecord.fulfilled , (state,action)=>{
            state.loading=false;
            if(action.payload && action.payload.inventory){
                state.inventoryList.push(action.payload.inventory);
                state.sucessMessage = "Inventory data added sucessfully";
            }
            else{
                state.error = "Failed to create new record";
            }
        })
        .addCase(createInventoryRecord.rejected , (state,action)=>{
            state.loading= false;
            state.error = action.payload? action.payload: "Error creating a new record"
        })
        //fetching inventory all record//
       
        .addCase(getAllInventory.pending , (state)=>{
            state.loading=true;
                })
        .addCase(getAllInventory.fulfilled , (state,action)=>{
            state.loading=false;
            if(Array.isArray(action.payload)){
            state.inventoryList=action.payload
            }
            else{
            state.error="Invalid Format"
            }
            })
            .addCase(getAllInventory.rejected, (state,action)=>{
            state.loading=false;
            state.error = action.payload? action.payload : "Error fetching data";
            })

        //for updating inventory record
        .addCase(updateInventoryRecord.pending , (state)=>{
            state.loading=true;
        })
        .addCase(updateInventoryRecord.fulfilled , (state,action)=>{
            state.loading=false;
            const updatedList= action.payload;
            const index = state.inventoryList.findIndex(inventory => inventory._id === updatedList._id);
            if(index !==-1)
            state.inventoryList[index]= updatedList;
        })

        .addCase(updateInventoryRecord.rejected , (state, action)=>{
            state.loading=false;
            state.error = action.payload? action.payload: "Error updating record"
        })

        //for geting inventory by id//
        .addCase(getInventoryById.pending , (state)=>{
            state.loading=true;
        })
        .addCase(getInventoryById.fulfilled , (state,action)=>{
            state.loading=false;
            state.inventoryDetails = action.payload;;
        })
        .addCase(getInventoryById.rejected , (state,action)=>{
            state.loading=false;
            state.error = action.payload? action.payload: "Error fetching record"
        })

        //deleting inventory by id 
        .addCase(deleteInventory.pending, (state) => {
         state.loading = true;
        })
        .addCase(deleteInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryList = state.inventoryList.filter(item => item._id !== action.meta.arg);
        state.sucessMessage = "Inventory item deleted successfully";
        })
      .addCase(deleteInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete inventory item';
      });
    }
 })
 export default inventorySlice.reducer;