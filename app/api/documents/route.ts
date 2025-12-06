import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Document } from "@/models/Document";

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
    const relatedId = searchParams.get("relatedId");
    const relatedType = searchParams.get("relatedType");
    const documentId = searchParams.get("documentId");

    if (documentId) {
      const doc = await Document.findById(documentId).populate("uploadedBy", "email name");
      if (!doc) {
        return NextResponse.json(
          { success: false, error: "Document not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: doc });
    }

    let query: any = {};
    if (relatedId) query.relatedId = relatedId;
    if (relatedType) query.relatedType = relatedType;

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "email name")
      .populate("verifiedBy", "email name");

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
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

    // Convert base64 to buffer
    const fileData = Buffer.from(body.fileData, "base64");

    const document = new Document({
      fileName: body.fileName,
      fileType: body.fileType,
      fileSize: fileData.length,
      fileData: fileData,
      uploadedBy: body.uploadedBy,
      relatedId: body.relatedId,
      relatedType: body.relatedType,
      documentType: body.documentType,
      description: body.description,
      expiryDate: body.expiryDate,
    });

    await document.save();

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        _id: document._id,
        fileName: document.fileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        uploadedAt: document.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: "Document ID required" },
        { status: 400 }
      );
    }

    await Document.findByIdAndDelete(documentId);

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
