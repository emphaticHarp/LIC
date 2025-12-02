import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();

    const agents = await User.find({ role: { $in: ["agent", "assistant", "other"] } })
      .select("-password")
      .lean();

    return NextResponse.json(
      { agents },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password, name, role, isActive } = await request.json();

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if agent already exists
    const existingAgent = await User.findOne({ email });
    if (existingAgent) {
      return NextResponse.json(
        { error: "Agent with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Normalize role to lowercase and replace spaces with hyphens
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '-');

    // Create new agent
    const newAgent = new User({
      email,
      password: hashedPassword,
      name,
      role: normalizedRole,
      isActive: isActive !== false,
      profile: {
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
    });

    await newAgent.save();

    return NextResponse.json(
      {
        message: "Agent created successfully",
        agent: {
          _id: newAgent._id,
          email: newAgent.email,
          name: newAgent.name,
          role: newAgent.role,
          isActive: newAgent.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
