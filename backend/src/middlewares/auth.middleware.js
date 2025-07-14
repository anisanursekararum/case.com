import pkg from "jsonwebtoken";
import prisma from "../prisma/client.js";

const { verify } = pkg;

async function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = verify(token.split(" ")[1], process.env.JWT_SECRET);

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      include: {
        roles: true,
        user_teams: {
          include: {
            teams: true, // ini penting untuk fitur team list
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid token: User not found" });
    }

    req.user = user; // simpan semua ke req.user, termasuk user_teams dan teams
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
}

export const protect = verifyToken;
