const tableService = require('../service/table.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

class TableController {

  //create table(admin only)
  async createTable(req, res) {
    try{
      const tableData = req.body;
      const table = await tableService.createTable(tableData);
      res.status(201).json(successResponse(table, 'Table created successfully'));
    }catch(error){
      const status = error.status || 400;
      res.status(status).json(errorResponse(error.message, status));
    }
  }

  //Get all Tables
  async getAllTables(req, res){
    try{
      const tables = await tableService.getAllTables();
      res.status(200).json(successResponse(tables));
    }catch(error){
      const status = error.status || 500;
      res.status(status).json(errorResponse(error.message, status));
    }
  }

  //Get table by ID
  async getTableById(req, res){
    try{
        const { id } = req.params;
        const table = await tableService.getTableById(id);
        res.status(200).json(successResponse(table));
    }catch(error){
        const status = error.status || 404;
        res.status(status).json(errorResponse(error.message, status));
    }
  }

  //Update table(Admin only)
  async updateTable(req, res){
    try{
        const {id} = req.params;
        const updateData = req.body;
        const table = await tableService.updateTable(id, updateData);
        res.status(200).json(successResponse(table, 'Table updated successfully'));
    }catch(error){
        const status = error.status || 400;
        res.status(status).json(errorResponse(error.message, status));
    }
  }

  //Delete table(Admin only)
  async deleteTable(req, res){
    try{
        const { id } = req.params;
        const result = await tableService.deleteTable(id);
        res.status(200).json(successResponse(result, result.message || 'Table deleted successfully'));
    }catch(error){
        const status = error.status || 404;
        res.status(status).json(errorResponse(error.message, status));
    }
  }

}

module.exports = new TableController();