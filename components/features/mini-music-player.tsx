"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Menu, Heart, Plus, SkipBack, SkipForward, Play, Pause, Music, Folder, Trash2, ListPlus, Upload, Loader } from "lucide-react";

interface Song {
  id: string;
  title: string;
  url: string;
  albumArt?: string;
  album?: string;
  artist?: string;
}

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
}

export function MiniMusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Song[]>([]);
  const [dbSongs, setDbSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("canplay", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("canplay", updateDuration);
    };
  }, []);

  useEffect(() => {
    // Reset progress and duration when song changes
    setProgress(0);
    setDuration(0);
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log("Play error:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    fetchSongsFromDB();
  }, []);

  const fetchSongsFromDB = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/songs");
      
      if (!response.ok) {
        console.error("API error:", response.status);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        console.error("Invalid response type:", contentType);
        return;
      }

      const data = await response.json();
      if (data.success && data.songs) {
        setDbSongs(
          data.songs.map((song: any) => ({
            id: song._id,
            title: song.title,
            url: song.url,
            artist: song.artist,
            album: song.album,
            albumArt: song.cover,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractMetadata = async (file: File): Promise<Partial<Song>> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const metadata: Partial<Song> = {
          title: file.name.replace(/\.[^/.]+$/, ""),
        };

        // Try to extract ID3 tags for album art
        try {
          const view = new Uint8Array(arrayBuffer);
          // Simple ID3v2 check
          if (view[0] === 0x49 && view[1] === 0x44 && view[2] === 0x33) {
            // ID3v2 detected, but extracting is complex
            // For now, we'll just use the file name
          }
        } catch (err) {
          console.log("Could not extract metadata");
        }

        resolve(metadata);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget?.files;
    if (files) {
      const newSongs: Song[] = [];
      for (const file of Array.from(files)) {
        const url = URL.createObjectURL(file);
        const metadata = await extractMetadata(file);
        const song = {
          id: Date.now().toString() + Math.random(),
          url,
          ...metadata,
        } as Song;
        newSongs.push(song);
      }
      setUploadedFiles((prev) => [...prev, ...newSongs]);
    }
    if (e.currentTarget) {
      e.currentTarget.value = "";
    }
  };

  const addToPlaylist = (song: Song) => {
    setSongs((prev) => [...prev, song]);
    if (currentIndex === null) {
      setCurrentIndex(0);
    }
  };

  const playFromLibrary = (song: Song) => {
    const existingIndex = songs.findIndex((s) => s.id === song.id);
    if (existingIndex !== -1) {
      setCurrentIndex(existingIndex);
    } else {
      setSongs((prev) => [...prev, song]);
      setCurrentIndex(songs.length);
    }
    setIsPlaying(true);
  };

  const deleteFromLibrary = (id: string) => {
    setUploadedFiles((prev) => prev.filter((song) => song.id !== id));
  };

  const uploadToDatabase = async (song: Song) => {
    try {
      setIsUploading(true);
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: song.title,
          artist: song.artist || "Unknown Artist",
          duration: duration || 0,
          url: song.url,
          cover: song.albumArt || "",
        }),
      });

      const contentType = response.headers.get("content-type");
      
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid response type:", contentType, text);
        toast.error("Server error", {
          description: "MongoDB connection failed. Check server logs.",
        });
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Upload error:", response.status, data);
        toast.error("Failed to upload song", {
          description: data.error || "Please try again later",
        });
        return;
      }

      if (data.success) {
        setUploadedFiles((prev) => prev.filter((s) => s.id !== song.id));
        await fetchSongsFromDB();
        toast.success("Song uploaded successfully!", {
          description: `"${song.title}" has been added to database`,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo upload"),
          },
        });
      } else {
        toast.error(data.error || "Failed to upload song", {
          description: "Please check your connection and try again",
        });
      }
    } catch (error) {
      console.error("Error uploading song:", error);
      toast.error("Error uploading song", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current && currentIndex !== null) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => {
      const next = prev === null ? 0 : (prev + 1) % songs.length;
      setIsPlaying(true);
      return next;
    });
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => {
      const next = prev === null ? 0 : (prev - 1 + songs.length) % songs.length;
      setIsPlaying(true);
      return next;
    });
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const playSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const removeSong = (index: number) => {
    setSongs((prev) => prev.filter((_, i) => i !== index));
    if (currentIndex === index) {
      if (songs.length > 1) {
        setCurrentIndex(index < songs.length - 1 ? index : index - 1);
      } else {
        setCurrentIndex(null);
      }
    }
  };

  const currentSong = currentIndex !== null ? songs[currentIndex] : null;
  const [activeTab, setActiveTab] = useState<"local" | "database">("database");

  return (
    <div className="flex gap-6 p-6">
      {/* File Browser Section */}
      <Card className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab("database")}
              className={`px-4 py-2 font-medium text-sm transition ${
                activeTab === "database"
                  ? "border-b-2 border-black text-black"
                  : "text-muted-foreground hover:text-black"
              }`}
            >
              Database
            </button>
            <button
              onClick={() => setActiveTab("local")}
              className={`px-4 py-2 font-medium text-sm transition ${
                activeTab === "local"
                  ? "border-b-2 border-black text-black"
                  : "text-muted-foreground hover:text-black"
              }`}
            >
              Local Files
            </button>
          </div>

          {/* Database Songs Tab */}
          {activeTab === "database" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Database Songs
                </h2>
                <Button
                  size="sm"
                  onClick={fetchSongsFromDB}
                  disabled={isLoading}
                  className="bg-black hover:bg-black/90"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dbSongs.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No songs in database. Upload from local files.
                  </p>
                ) : (
                  dbSongs.map((song) => (
                    <div
                      key={song.id}
                      className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between gap-2 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{song.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {song.artist || "Unknown Artist"}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => playFromLibrary(song)}
                          title="Play"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => addToPlaylist(song)}
                          title="Add to Playlist"
                        >
                          <ListPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Local Files Tab */}
          {activeTab === "local" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Local Files
                </h2>
                <Button
                  size="sm"
                  onClick={() => folderInputRef.current?.click()}
                  className="bg-black hover:bg-black/90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <input
                  key={uploadedFiles.length}
                  ref={folderInputRef}
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uploadedFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No music files. Click Add to upload.
                  </p>
                ) : (
                  uploadedFiles.map((song) => (
                    <div
                      key={song.id}
                      className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between gap-2 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{song.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {song.artist || "Unknown Artist"}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => playFromLibrary(song)}
                          title="Play"
                          disabled={isUploading}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => addToPlaylist(song)}
                          title="Add to Playlist"
                          disabled={isUploading}
                        >
                          <ListPlus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:text-blue-500"
                          onClick={() => uploadToDatabase(song)}
                          title="Upload to Database"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:text-red-500"
                          onClick={() => deleteFromLibrary(song.id)}
                          title="Delete"
                          disabled={isUploading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Player Section */}
      <div className="w-80 space-y-4">
      <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <audio
          ref={audioRef}
          src={currentSong?.url}
          onEnded={nextSong}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        <div className="p-6 space-y-6">
          {/* Album Art */}
          <div className="w-full aspect-square bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl flex items-center justify-center">
            {currentSong?.albumArt ? (
              <img src={currentSong.albumArt} alt="Album" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Music className="w-16 h-16 text-slate-500" />
            )}
          </div>

          {/* Song Info */}
          {currentSong && (
            <div className="text-center">
              <p className="font-semibold text-sm truncate">{currentSong.title}</p>
              {currentSong.artist && <p className="text-xs text-muted-foreground">{currentSong.artist}</p>}
              <p className="text-xs text-muted-foreground">{currentIndex! + 1} / {songs.length}</p>
            </div>
          )}

          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowPlaylist(!showPlaylist)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="w-5 h-5" />
            </Button>
            <input
              key={songs.length}
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Progress Bar */}
          {currentSong && (
            <div className="space-y-2">
              <Slider
                value={[progress]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleProgressChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.floor(progress)}s</span>
                <span>{Math.floor(duration)}s</span>
              </div>
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-8">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={prevSong}
              className="h-10 w-10"
              disabled={songs.length === 0}
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            <Button 
              onClick={togglePlay}
              className="h-12 w-12 rounded-full bg-black hover:bg-black/90"
              size="icon"
              disabled={songs.length === 0}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={nextSong}
              className="h-10 w-10"
              disabled={songs.length === 0}
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Playlist */}
      {showPlaylist && (
        <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
            {songs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No songs added. Click + to add music.</p>
            ) : (
              songs.map((song, index) => (
                <div
                  key={song.id}
                  className={`p-2 rounded cursor-pointer text-xs truncate ${
                    currentIndex === index ? "bg-black text-white" : "hover:bg-slate-100"
                  }`}
                  onClick={() => playSong(index)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 truncate">{song.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSong(index);
                      }}
                      className="text-xs hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
      </div>
    </div>
  );
}
