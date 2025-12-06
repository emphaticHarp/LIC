import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Notification } from "@/models/Notification";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(MONGODB_URI || "");
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const isRead = searchParams.get("isRead");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (isRead !== null) {
      query.isRead = isRead === "true";
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "email name");

    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const notification = new Notification({
      userId: body.userId,
      type: body.type,
      title: body.title,
      message: body.message,
      relatedId: body.relatedId,
      relatedType: body.relatedType,
      priority: body.priority || "MEDIUM",
      actionUrl: body.actionUrl,
    });

    await notification.save();

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { notificationId, isRead } = body;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
