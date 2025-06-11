const Lead = require("../models/leads.models");

const getLeads = async (req, res) => {
  const allowedStatuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];
  const allowedSources = [
    "Website",
    "Referral",
    "Social Media",
    "Advertisement",
    "Cold Call",
    "Email",
  ];

  try {
    const { salesAgent, status, tags, source } = req.query;
    let filter = {};

    if (salesAgent && !mongoose.Types.ObjectId.isValid(salesAgent)) {
      return res.status(400).json({
        error: "Invalid input: 'salesAgent' must be a valid ObjectId.",
      });
    }
    if (salesAgent) filter.salesAgent = salesAgent;

    // Validate status
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid input: 'status' must be one of ${JSON.stringify(
          allowedStatuses
        )}.`,
      });
    }
    if (status) filter.status = status;

    // Validate source
    if (source && !allowedSources.includes(source)) {
      return res.status(400).json({
        error: `Invalid input: 'source' must be one of ${JSON.stringify(
          allowedSources
        )}.`,
      });
    }
    if (source) filter.source = source;

    // Handle tags as an array if provided
    if (tags) filter.tags = { $in: tags.split(",") };

    const getAllLeads = await Lead.find(filter).populate("salesAgent", "name");
    res.status(200).json(getAllLeads);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const addNewLead = async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;
    if (!name) {
      res.status(400).json({ error: "Invalid input: 'name' is required." });
    }
    const newLeads = new Lead({
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
    });
    await newLeads.save();

    // Populate the salesAgent field before sending response
    await newLeads.populate("salesAgent", "name");

    if (!newLeads) {
      res
        .status(404)
        .json({ error: `Sales agent with ID ${salesAgent._id} not found.` });
    }
    res
      .status(201)
      .json({ message: "New Lead created successfully", lead: newLeads });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const updateLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const dataToUpdate = req.body;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ error: "Invalid Lead Id" });
    }

    // Allowed status and source values
    const validStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed",
    ];
    const validSources = [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ];

    // Validate status
    if (dataToUpdate.status && !validStatuses.includes(dataToUpdate.status)) {
      return res.status(400).json({
        error: `Invalid input: 'status' must be one of ${JSON.stringify(
          validStatuses
        )}.`,
      });
    }

    // Validate source
    if (dataToUpdate.source && !validSources.includes(dataToUpdate.source)) {
      return res.status(400).json({
        error: `Invalid input: 'source' must be one of ${JSON.stringify(
          validSources
        )}.`,
      });
    }

    // ✅ Ensure closedAt is set if the status is changed to "Closed"
    if (dataToUpdate.status === "Closed" && !dataToUpdate.closedAt) {
      dataToUpdate.closedAt = new Date();
    }

    const updatedLead = await Lead.findByIdAndUpdate(leadId, dataToUpdate, {
      new: true,
    });

    if (!updatedLead) {
      return res
        .status(404)
        .json({ error: `Lead with id ${leadId} not found` });
    }

    res.status(200).json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const deleteLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const deletedLead = await Lead.findByIdAndDelete(leadId);
    if (!deletedLead) {
      res.status(404).json({ error: `Lead with ID ${leadId} not found.` });
    } else {
      res.status(200).json({ message: "Lead deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const getLeadReportLastWeek = async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const closedLeads = await Lead.find({
      status: "Closed",
      closedAt: { $gte: lastWeek },
    }).populate("salesAgent", "name");

    const response = closedLeads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      salesAgent: lead.salesAgent.name,
      closedAt: lead.closedAt,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const getLeadsInPipelineReport = async (re, res) => {
  try {
    const totalLeadsInPipeline = await Lead.countDocuments({
      status: { $ne: "Closed" },
    });
    res.status(200).json({ totalLeadsInPipeline });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getLeads, addNewLead, updateLead, deleteLead, getLeadReportLastWeek, getLeadsInPipelineReport };
