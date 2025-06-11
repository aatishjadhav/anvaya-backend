const express = require("express");
const router = express.Router();
const {
  getLeads,
  addNewLead,
  updateLead,
  deleteLead,
  getLeadReportLastWeek,
  getLeadsInPipelineReport,
} = require("../controllers/leads.controller");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/", getLeads);
router.post("/", verifyToken, addNewLead);
router.put("/:id", verifyToken, updateLead);
router.delete("/:id", verifyToken, deleteLead);
router.get("/report/last-week", getLeadReportLastWeek);
router.get("/report/pipeline", getLeadsInPipelineReport);

module.exports = router;
