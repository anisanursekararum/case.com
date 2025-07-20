import prisma from "../prisma/client.js";

export const requestJoinTeam = async (req, res) => {
  try {
    const { team_code } = req.body;

    if (!team_code) {
      return res
        .status(400)
        .json({ success: false, message: "Team code is required" });
    }

    const team = await prisma.teams.findUnique({
      where: { team_code },
    });

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
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

    return res
      .status(200)
      .json({ success: true, message: "Join request sent" });
  } catch (err) {
    console.error("Request Join Team Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const requestCreateTeam = async (req, res) => {
  try {
    const { team_name, description } = req.body;

    if (!team_name) {
      return res
        .status(400)
        .json({ success: false, message: "Team name is required" });
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
      message: "Successfully submitted team creation request",
    });
  } catch (err) {
    console.error("Request Create Team Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const decideJoinRequest = async (req, res) => {
  const { id } = req.params;
  const { decision, reason } = req.body;

  if (!["approved", "declined"].includes(decision)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid decision" });
  }

  if (decision === "declined" && (!reason || reason.trim() === "")) {
    return res.status(400).json({
      success: false,
      message: "Reason is required for declined requests",
    });
  }

  const joinRequest = await prisma.join_requests.findUnique({
    where: { id: parseInt(id) },
    include: {
      users_join_requests_requestorTousers: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!joinRequest)
    return res.status(404).json({ success: false, message: "Not found" });

  if (joinRequest.status !== "pending")
    return res
      .status(400)
      .json({ success: false, message: "Already processed" });

  await prisma.join_requests.update({
    where: { id: joinRequest.id },
    data: {
      status: decision,
      decision_date: new Date(),
      decided_by: req.user.id,
      reason: decision === "declined" ? reason : undefined,
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
    requestor: joinRequest.users_join_requests_requestorTousers,
  });
};

export const decideCreateTeamRequest = async (req, res) => {
  const { request_id } = req.params;
  const { decision } = req.body;

  if (!["approved", "declined"].includes(decision)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid decision" });
  }

  const request = await prisma.team_requests.findUnique({
    where: { id: parseInt(request_id) },
    include: { users_team_requests_requestorTousers: true },
  });

  if (!request)
    return res
      .status(404)
      .json({ success: false, message: "Request not found" });

  if (request.status !== "pending") {
    return res
      .status(400)
      .json({ success: false, message: "Request already processed" });
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

export const getJoinRequests = async (req, res) => {
  const {
    search,
    status,
    startDate,
    endDate,
    sort = "desc",
    page = 1,
    pageSize = 10,
  } = req.query;

  const trimmedSearch = search?.trim() || "";

  let userIds = [];
  let teamIds = [];

  if (trimmedSearch) {
    const users = await prisma.users.findMany({
      where: {
        email: {
          contains: trimmedSearch,
        },
      },
      select: { id: true },
    });

    const teams = await prisma.teams.findMany({
      where: {
        team_name: {
          contains: trimmedSearch,
        },
      },
      select: { id: true },
    });

    userIds = users.map((u) => u.id);
    teamIds = teams.map((t) => t.id);
  }

  const where = {
    ...(status && status !== "all" ? { status } : {}),
    ...(startDate && endDate
      ? {
          request_date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {}),
    ...(trimmedSearch
      ? {
          OR: [{ user_id: { in: userIds } }, { team_id: { in: teamIds } }],
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.join_requests.count({ where }),
    prisma.join_requests.findMany({
      where,
      include: {
        users_join_requests_requestorTousers: {
          select: { id: true, name: true, email: true },
        },
        teams: {
          select: { id: true, team_name: true, team_code: true },
        },
        users_join_requests_decided_byTousers: {
          select: { id: true, name: true },
        },
      },
      orderBy: { request_date: sort },
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return res.json({ data, totalPages });
};

export const getPendingTeam = async (req, res) => {
  const {
    search,
    status,
    startDate,
    endDate,
    sort = "desc",
    page = 1,
    pageSize = 10,
  } = req.query;

  const trimmedSearch = search?.trim() || "";

  const where = {
    ...(status && status !== "all" ? { status } : {}),
    ...(startDate && endDate
      ? {
          request_date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {}),
    ...(trimmedSearch
      ? {
          team_name: {
            contains: trimmedSearch,
          },
        }
      : {}),
  };

  try {
    const [total, data] = await Promise.all([
      prisma.team_requests.count({ where }),
      prisma.team_requests.findMany({
        where,
        include: {
          users_team_requests_requestorTousers: {
            select: { id: true, name: true, email: true },
          },
          users_team_requests_decision_byTousers: {
            select: { id: true, name: true },
          },
        },
        orderBy: {
          request_date: sort,
        },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize),
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return res.json({ data, totalPages });
  } catch (err) {
    console.error("Get Pending Team Requests Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeams = async (req, res) => {
  const {
    search,
    startDate,
    endDate,
    sort = "desc",
    page = 1,
    pageSize = 10,
  } = req.query;

  const trimmedSearch = search?.trim() || "";
  let teamIds = [];

  if (trimmedSearch) {
    const teams = await prisma.teams.findMany({
      where: {
        id,
        team_name: {
          contains: trimmedSearch,
        },
      },
      select: { id: true },
    });
    teamIds = teams.map((t) => t.id);
  }

  const where = {
    ...(startDate && endDate
      ? {
          created_date_time: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {}),
    ...(trimmedSearch
      ? {
          OR: [
            { team_name: { contains: trimmedSearch } },
            { team_code: { contains: trimmedSearch } },
          ],
        }
      : {}),
  };

  try {
    const [total, rawTeams] = await Promise.all([
      prisma.teams.count({ where }),
      prisma.teams.findMany({
        where,
        include: {
          users: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: {
          created_date_time: sort,
        },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize),
      }),
    ]);

    const data = rawTeams.map((team) => ({
      ...team,
      created_by: team.users?.name || null,
    }));

    const totalPages = Math.ceil(total / pageSize);

    return res.json({ data, totalPages });
  } catch (err) {
    console.error("Get Teams Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    const members = team.user_teams.map((ut) => ut.users);

    const formatted = {
      id: team.id,
      team_name: team.team_name,
      team_code: team.team_code,
      description: team.description,
      created_by: team.users?.name || null,
      created_date_time: team.created_date_time,
      members,
    };

    return res.json({ data: formatted });
  } catch (err) {
    console.error("Error getTeamDetail:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
