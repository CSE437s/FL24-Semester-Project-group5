import { hashPassword } from "../create/route"; // Assuming this function is defined in your create route
import { prisma } from "../../../../../prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, newPassword } = body;

  if (!email || !newPassword) {
    return new Response(JSON.stringify({ error: "Invalid inputs" }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User does not exist" }), { status: 404 });
    }

    await prisma.user.update({
      where: { email: email },
      data: { password: hashPassword(newPassword) },
    });

    return new Response(JSON.stringify({ message: "Password reset successfully" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error resetting password" }), { status: 500 });
  }
}
