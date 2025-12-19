import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      default: '',
    },
    genre: {
      type: String,
      default: 'Unknown',
    },
    album: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Song || mongoose.model('Song', SongSchema);
