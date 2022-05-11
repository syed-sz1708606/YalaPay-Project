import EmployeeRepo from "../repository/employee-repo.js";

const employeeRepo = new EmployeeRepo();

export default class YalaPayService {
  async getEmployees(req, res) {
    try {
      const id = req.query.eid;
      if (id) {
        const employee = await employeeRepo.getEmployee(id);
        res.json(employee);
      } else {
        const employees = await employeeRepo.getEmployees();
        res.json(employees);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async getEmployee(req, res) {
    try {
      const employee = await employeeRepo.getEmployee(req.query.eid);
      res.json(employee);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async addEmployee(req, res) {
    try {
      const response = await employeeRepo.addEmployee(req.body);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async deleteEmployee(req, res) {
    try {
      const response = await employeeRepo.deleteEmployee(req.params.eid);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async updateEmployee(req, res) {
    try {
      const response = await employeeRepo.updateEmployee(req.body);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async deleteAllEmployees(req, res) {
    try {
      const response = await employeeRepo.deleteAllEmployees();
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}
