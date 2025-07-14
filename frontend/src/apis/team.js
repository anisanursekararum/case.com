import api from "./index";

// export const requestJoinTeam = (token, team_code) => {
//   return api.post(
//     "/teams/request-join-team",
//     { team_code },
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
// };

// export const requestCreateTeam = (token, team_name, description) => {
//   return api.post(
//     "/teams/request-create-team",
//     { team_name, description },
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
// };

export const requestJoinTeam = ({ team_code }) => {
  return api.post("/teams/request-join-team", { team_code });
};

export const requestCreateTeam = ({ team_name, description }) => {
  return api.post("/teams/request-create-team", { team_name, description });
};

export const getPendingJoinRequests = () => {
  return api.get("/teams/request-join-team/pending");
};

export const getPendingTeamRequests = () => {
  return api.get("/teams/request-new-team/pending");
};

export const decideJoinRequest = (requestId, decision) => {
  return api.patch(`/teams/request-join-team/${requestId}/decide`, {
    decision,
  });
};

export const decideTeamCreation = (requestId, decision) => {
  return api.patch(`/teams/request-new-team/${requestId}/decide`, { decision });
};

export const getTeamDetail = (token, teamId) => {
  return api.get(`/teams/${teamId}/detail`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
