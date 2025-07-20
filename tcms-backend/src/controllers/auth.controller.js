import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const { sign } = pkg;

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already used" });

    const hashedPassword = await hash(password, 10);

    const role = await prisma.roles.findFirst({ where: { role: "member" } });

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles_id: role.id,
      },
      include: {
        roles: true,
        user_teams: {
          include: {
            teams: true,
          },
        },
      },
    });

    const token = sign(
      { id: user.id, email: user.email, role: user.roles.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "User successfully registered!",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.roles.role,
        teams: user.user_teams.map((ut) => ({
          id: ut.team_id,
          name: ut.teams?.team_name,
          code: ut.teams?.team_code,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      include: { roles: true, user_teams: { include: { teams: true } } },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const validPassword = await compare(password, user.password);
    if (!validPassword)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = sign(
      { id: user.id, email: user.email, role: user.roles.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles.role,
        user_teams: user.user_teams,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const activeTeamId = parseInt(req.headers["x-active-team"]);

    const { id, name, email, user_teams } = req.user;
    const teams = user_teams.map((ut) => ut.teams);

    const activeTeam = teams.find((team) => team.id === activeTeamId) || null;

    return res.json({
      id,
      name,
      email,
      teams,
      activeTeam,
    });
  } catch (err) {
    console.error("Error getCurrentUser:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
