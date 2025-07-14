import prisma from "../prisma/client.js";

// Member minta bergabung ke tim
export const requestJoinTeam = async (req, res) => {
  try {
    const { team_code } = req.body;

    if (!team_code) {
      return res.status(400).json({ success: false, message: "Team code is required" });
    }

    const team = await prisma.teams.findUnique({
      where: { team_code },
    });

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const existingRequest = await prisma.join_requests.findFirst({
      where: {
        user_id: req.user.id,
        team_id: team.id,
        status: "pending",
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You have already requested to join this team",
      });
    }

    await prisma.join_requests.create({
      data: {
        user_id: req.user.id,
        team_id: team.id,
        requestor: req.user.id,
      },
    });

    return res.status(200).json({ success: true, message: "Join request sent" });
  } catch (err) {
    console.error("Request Join Team Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Member minta buat tim (disetujui admin nanti)
export const requestCreateTeam = async (req, res) => {
  try {
    const { team_name, description } = req.body;

    if (!team_name) {
      return res.status(400).json({ success: false, message: "Team name is required" });
    }

    const existingRequest = await prisma.team_requests.findFirst({
      where: {
        requestor: req.user.id,
        status: "pending",
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending team creation request",
      });
    }

    await prisma.team_requests.create({
      data: {
        team_name,
        description,
        requestor: req.user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successfully submitted team creation request" 
    });
  } catch (err) {
    console.error("Request Create Team Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: Approve/Decline join request
export const decideJoinRequest = async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  if (!["approved", "declined"].includes(decision)) {
    return res.status(400).json({ success: false, message: "Invalid decision" });
  }

  const joinRequest = await prisma.join_requests.findUnique({
    where: { id: parseInt(id) },
    include: { users_join_requests_requestorTousers: true },
  });

  if (!joinRequest) {
    return res.status(404).json({ success: false, message: "Join request not found" });
  }

  if (joinRequest.status !== "pending") {
    return res.status(400).json({ success: false, message: "Request already processed" });
  }

  await prisma.join_requests.update({
    where: { id: joinRequest.id },
    data: {
      status: decision,
      decision_date: new Date(),
      decided_by: req.user.id,
    },
  });

  if (decision === "approved") {
    await prisma.user_teams.create({
      data: {
        user_id: joinRequest.user_id,
        team_id: joinRequest.team_id,
      },
    });
  }

  res.json({
    success: true,
    message: `Join request ${decision}`,
    requestor: {
      id: joinRequest.users_join_requests_requestorTousers.id,
      name: joinRequest.users_join_requests_requestorTousers.name,
      email: joinRequest.users_join_requests_requestorTousers.email,
    },
  });
};

// Admin: Approve/Decline team creation request
export const decideCreateTeamRequest = async (req, res) => {
  const { request_id } = req.params;
  const { decision } = req.body;

  if (!["approved", "declined"].includes(decision)) {
    return res.status(400).json({ success: false, message: "Invalid decision" });
  }

  const request = await prisma.team_requests.findUnique({
    where: { id: parseInt(request_id) },
    include: { users_team_requests_requestorTousers: true },
  });

  if (!request) return res.status(404).json({ success: false, message: "Request not found" });

  if (request.status !== "pending") {
    return res.status(400).json({ success: false, message: "Request already processed" });
  }

  if (decision === "approved") {
    const teamCode = `TEAM${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const team = await prisma.teams.create({
      data: {
        team_name: request.team_name,
        description: request.description,
        team_code: teamCode,
        created_by: request.requestor,
      },
    });

    await prisma.team_requests.update({
      where: { id: request.id },
      data: {
        status: "approved",
        decision_date: new Date(),
        decision_by: req.user.id,
      },
    });

    await prisma.user_teams.create({
      data: {
        user_id: request.requestor,
        team_id: team.id,
      },
    });

    return res.json({
      success: true,
      message: "Team creation approved",
      team_code: teamCode,
      requestor: {
        id: request.users_team_requests_requestorTousers.id,
        name: request.users_team_requests_requestorTousers.name,
        email: request.users_team_requests_requestorTousers.email,
      },
    });
  } else {
    await prisma.team_requests.update({
      where: { id: request.id },
      data: {
        status: "declined",
        decision_date: new Date(),
        decision_by: req.user.id,
      },
    });

    return res.json({
      success: true,
      message: "Team creation request declined",
      requestor: {
        id: request.users_team_requests_requestorTousers.id,
        name: request.users_team_requests_requestorTousers.name,
        email: request.users_team_requests_requestorTousers.email,
      },
    });
  }
};

// Admin: Lihat semua join requests yang pending
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.join_requests.findMany({
      where: {
        status: "pending",
      },
      include: {
        users_join_requests_requestorTousers: {
          select: { id: true, name: true, email: true },
        },
        teams: {
          select: { id: true, team_name: true, team_code: true },
        },
      },
      orderBy: {
        request_date: "desc",
      },
    });

    return res.json({ pending_requests: requests });
  } catch (err) {
    console.error("Get Pending Requests Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: Lihat semua team creation requests yang pending
export const getPendingTeam = async (req, res) => {
  try {
    const requests = await prisma.team_requests.findMany({
      where: {
        status: "pending",
      },
      include: {
        users_team_requests_requestorTousers: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        request_date: "desc",
      },
    });

    return res.json({ pending_requests: requests });
  } catch (err) {
    console.error("Get Pending Team Requests Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/teams/:id/detailss
export const getTeamDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const team = await prisma.teams.findUnique({
      where: { id: parseInt(id) },
      include: {
        user_teams: {
          include: {
            users: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!team) return res.status(404).json({ success: false, message: "Team not found" });

    const members = team.user_teams.map((ut) => ut.users);

    return res.json({
      id: team.id,
      team_name: team.team_name,
      team_code: team.team_code,
      description: team.description,
      created_at: team.created_at,
      members,
    });
  } catch (err) {
    console.error("Error getTeamDetail:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
