import { SHA256 as sha256 } from "crypto-js"; // Ensure you have this for password hashing
import { prisma } from "../../../../../prisma"; 
import { hashPassword } from "../create/route";

export async function POST(req: Request) {
  const resp = await loginUserHandler(req);
  
  return new Response(JSON.stringify(resp.user || { error: resp.error }), {
    status: resp.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function loginUserHandler(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return { error: "Invalid inputs", status: 400 };
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

    // Check if user exists and password matches
    if (user && user.password === hashPassword(password)) {
     
      const userResponse = exclude(user, ["password"]);
      return { user: userResponse, status: 200 };
    } else {
      return { error: "Invalid credentials", status: 401 };
    }
  } catch (e) {
    console.error(e);
    return { error: "Error signing in", status: 500 };
  }
}


// Function to exclude user password returned from prisma
function exclude(user, keys) {
 
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
