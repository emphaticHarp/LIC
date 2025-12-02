import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const { name, password, role, isActive } = await request.json();

    // Find agent
    const agent = await User.findById(id);
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (name) agent.name = name;
    if (role) agent.role = role;
    if (typeof isActive === "boolean") agent.isActive = isActive;

    // Update password if provided
    if (password) {
      agent.password = await bcryptjs.hash(password, 10);
    }

    await agent.save();

    return NextResponse.json(
      {
        message: "Agent updated successfully",
        agent: {
          _id: agent._id,
          email: agent.email,
          name: agent.name,
          role: agent.role,
          isActive: agent.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const agent = await User.findByIdAndDelete(id);
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Agent deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
