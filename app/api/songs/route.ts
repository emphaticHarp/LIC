import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('lic');
    const songs = await db.collection('songs').find({}).toArray();

    return NextResponse.json(
      {
        success: true,
        songs: songs.map((song: any) => ({
          _id: song._id?.toString() || song._id,
          title: song.title || 'Unknown Title',
          artist: song.artist || 'Unknown Artist',
          duration: song.duration || 0,
          url: song.url || '',
          cover: song.cover || '',
        })),
        total: songs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('lic');

    const body = await request.json();
    const { title, artist, duration, url, cover } = body;

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title and url are required' },
        { status: 400 }
      );
    }

    const song = {
      title,
      artist: artist || 'Unknown Artist',
      duration: duration || 0,
      url,
      cover: cover || '',
      createdAt: new Date(),
    };

    const result = await db.collection('songs').insertOne(song);

    return NextResponse.json(
      {
        success: true,
        song: {
          _id: result?.insertedId?.toString(),
          ...song,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating song:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create song';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
