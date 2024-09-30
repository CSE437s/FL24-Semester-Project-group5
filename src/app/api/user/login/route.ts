import { SHA256 as sha256 } from "crypto-js";
// import prisma client
import { prisma } from "../../../../../prisma";
import { hashPassword } from "../create/route";

export async function POST (req: Request, res: Response) {
    //login uer
    const resp = await loginUserHandler(req, res);
    return new Response(JSON.stringify(resp.user || { error: resp.error }), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
async function loginUserHandler(req, res) {
  const body = await req.json()
  const { email, password } = body;
  console.log(body)
  if (!email || !password) {
    return {error: "Invalid inputs", status: 400}
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (user && user.password === hashPassword(password)) {
      // exclude password from json response
      return {user: exclude(user, ["password"]), status: 200}
    } else {
      return {error: "Invalid credentials", status: 401}
    }
  } catch (e) {
    return {error: "Error signing in", status: 400}
  }
}
// Function to exclude user password returned from prisma
function exclude(user, keys) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}