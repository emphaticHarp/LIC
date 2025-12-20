import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
          isValid: song.url && (song.url.startsWith('data:') || song.url.startsWith('blob:') === false),
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
    const { title, artist, duration, url, cover, audioData } = body;

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title and url are required' },
        { status: 400 }
      );
    }

    // If audioData is provided (base64), store it; otherwise store the URL
    const songUrl = audioData || url;

    const song = {
      title,
      artist: artist || 'Unknown Artist',
      duration: duration || 0,
      url: songUrl,
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

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('lic');

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing song ID' },
        { status: 400 }
      );
    }

    const result = await db.collection('songs').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Song not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Song deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting song:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete song';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
