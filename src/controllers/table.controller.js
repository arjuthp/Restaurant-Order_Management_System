const tableService = require('../service/table.service');

class TableController {

  //create table(admin only)
  async createTable(req, res) {
    try{
      const tableData = req.body;
      const table = await tableService.createTable(tableData);
      res.status(201).json({
        success: true,
        message: 'Table created successfully',
        data: table
      });
    }catch(error){
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  //Get all Tables
  async getAllTables(req, res){
    try{
      const tables = await tableService.getAllTables();
      res.status(200).json({
        success: true,
        count: tables.length,
        data: tables
      });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
  }

  //Get table by ID
  async getTableById(req, res){
    try{
        const { id } = req.params;
        const table = await tableService.getTableById(id);
        res.status(200).json({
            success: true,
            data: table
        });
    }catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
  }

  //Update table(Admin only)
  async updateTable(req, res){
    try{
        const {id} = req.params;
        const updateData = req.body;
        const table = await tableService.updateTable(id, updateData);
        res.status(200).json({
            success: true,
            message: 'Table updated successfully',
            data: table
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
  }

  //Delete table(Admin only)
  async deleteTable(req, res){
    try{
        const { id } = req.params;
        const result = await tableService.deleteTable(id);
        res.status(200).json({
            success: true,
            message: result.message
        });
    }catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
  }

}

module.exports = new TableController();