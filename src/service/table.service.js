//creteTable
//getAllTables
// getTableById(tableId)
//updateTable(tableId, updateData)
//deleteTable(tableId)

const Table = require('../models/table.model');

class TableService {
   
    //Private helper method for validation
    _validateTableData(data){
        //check if tableNumber exists and is valid
        if(!data.tableNumber || data.tableNumber < 1){
            throw new Error('Table number must be a positive number');
        }

        //check ifcapacity exists and is valid
        if(!data.capacity || data.capacity < 1){
            throw new Error('Capacity must be at least 1');
        }

        return true; //if all validation pass
    }
    //Public method: 
    async createTable(tableData){
        //1. vslidatede data first
        this._validateTableData(tableData);
        //2.create table in database
        const table = await Table.create(tableData);
        return table;
    }

    async getAllTables(){
        //fetch all ables from database
        const tables = await Table.find();
        return tables;
    }

    async getTableById(tableId){
        //1.find tableby Id
        const table = await Table.findById(tableId);
        //2. check if table exists
        if(!table){
            throw new Error('Table not found');
        }
        return table;
    }

    async updateTable(tableId, updateData){
        //1. Get the existing table first
        const existingTable = await Table.findById(tableId);
        if(!existingTable){
            throw new Error('Table not found');
        }

        //2. Create a clean copy of updateData to avoid mutation issues
        const cleanUpdateData = { ...updateData };

        //3. Check if tableNumber is being changed
        if(cleanUpdateData.tableNumber !== undefined){
            if(cleanUpdateData.tableNumber === existingTable.tableNumber){
                // Same table number, no need to update it (avoids unique constraint issue)
                delete cleanUpdateData.tableNumber;
            } else {
                // Different table number, check if it's already in use by another table
                const duplicateTable = await Table.findOne({
                    tableNumber: cleanUpdateData.tableNumber,
                    _id: { $ne: tableId }
                });
                if(duplicateTable){
                    throw new Error(`Table number ${cleanUpdateData.tableNumber} is already in use`);
                }
            }
        }

        //4. Validate the merged data (existing + updates)
        const dataToValidate = { ...existingTable.toObject(), ...cleanUpdateData };
        this._validateTableData(dataToValidate);

        //5. Update table in database
        //{new:true } returns the updated document
        //{runValidators: true} runs mongoose schema validations
        const table = await Table.findByIdAndUpdate(
            tableId,
            cleanUpdateData,
            {new: true, runValidators: true}
        );

        //6. return updated table
        return table;
    }


    async deleteTable(tableId){
        //1. delete table from databse 
        const table = await Table.findByIdAndDelete(tableId);
        //2. check if table was found
        if(!table){
            throw new Error('Table not found');
        }
        //3.return success message
        return {message: 'Table deleted successfully', deletedTable: table};

    }
}
module.exports = new TableService();
