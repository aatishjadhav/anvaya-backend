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
const { authorizeRole } = require("../middleware/authorizeRole");

router.get("/", verifyToken, getLeads);
router.post("/", verifyToken, authorizeRole("admin"), addNewLead);
router.put("/:id", verifyToken, authorizeRole("admin"), updateLead);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteLead);
router.get("/report/last-week", getLeadReportLastWeek);
router.get("/report/pipeline", getLeadsInPipelineReport);

module.exports = router;
