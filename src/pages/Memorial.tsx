import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import heroDefault from "@/assets/hero-memorial.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Slider } from "@/components/ui/slider";

interface Memorial {
  id: string;
  slug: string;
  name: string;
  birth_date: string;
  death_date: string;
  brief_description: string;
  life_story: string;
  background_image: string;
  profile_image: string;
  music_file: string;
  music_name: string;
}

interface Photo {
  id: string;
  photo_url: string;
  display_order: number;
}

interface TimelineEvent {
  id: string;
  event_date: string;
  description: string;
  display_order: number;
}

interface Tribute {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

const Memorial = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);

  // Tribute form
  const [tributeName, setTributeName] = useState("");
  const [tributeMessage, setTributeMessage] = useState("");
  const [submittingTribute, setSubmittingTribute] = useState(false);

  useEffect(() => {
    loadMemorial();
  }, [slug]);

  const loadMemorial = async () => {
    try {
      // Load memorial data
      const { data: memorialData, error: memorialError } = await supabase
        .from("memorials")
        .select("*")
        .eq("slug", slug)
        .single();

      if (memorialError) throw memorialError;

      setMemorial(memorialData);

      // Load photos
      const { data: photosData } = await supabase
        .from("memorial_photos")
        .select("*")
        .eq("memorial_id", memorialData.id)
        .order("display_order");

      if (photosData) setPhotos(photosData);

      // Load timeline events
      const { data: eventsData } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("memorial_id", memorialData.id)
        .order("event_date");

      if (eventsData) setTimelineEvents(eventsData);

      // Load tributes
      const { data: tributesData } = await supabase
        .from("tributes")
        .select("*")
        .eq("memorial_id", memorialData.id)
        .order("created_at", { ascending: false });

      if (tributesData) setTributes(tributesData);
    } catch (error: any) {
      console.error("Error loading memorial:", error);
      toast({
        title: "Erro ao carregar memorial",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      const newVolume = value[0];
      setVolume(newVolume);
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        duration
      );
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmitTribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memorial) return;

    setSubmittingTribute(true);

    try {
      const { error } = await supabase.from("tributes").insert({
        memorial_id: memorial.id,
        author_name: tributeName,
        message: tributeMessage,
      });

      if (error) throw error;

      toast({
        title: "Homenagem enviada!",
        description: "Sua mensagem foi publicada com sucesso.",
      });

      setTributeName("");
      setTributeMessage("");
      loadMemorial();
    } catch (error: any) {
      console.error("Error submitting tribute:", error);
      toast({
        title: "Erro ao enviar homenagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmittingTribute(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground">Carregando memorial...</p>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">Memorial não encontrado</h1>
          <p className="text-muted-foreground">O memorial que você procura não existe.</p>
        </div>
      </div>
    );
  }

  const memorialUrl = `${window.location.origin}/memorial/${memorial.slug}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${memorial.background_image || heroDefault})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="absolute top-8 left-8">
          <h1 className="text-2xl font-serif text-white">ETERNO RECORDAR</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative max-w-5xl mx-auto px-6 -mt-24">
        <div className="text-center mb-12">
          {memorial.profile_image && (
            <div className="inline-block mb-6">
              <img
                src={memorial.profile_image}
                alt={memorial.name}
                className="w-40 h-40 rounded-full border-8 border-background object-cover shadow-xl"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-primary mb-4">{memorial.name}</h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground mb-4">
            <span>
              {new Date(memorial.birth_date).toLocaleDateString("pt-BR")}
            </span>
            <span>•</span>
            <span>
              {new Date(memorial.death_date).toLocaleDateString("pt-BR")}
            </span>
          </div>
          {memorial.brief_description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
              "{memorial.brief_description}"
            </p>
          )}
        </div>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-semibold text-center mb-8 text-primary">
              Memórias em imagens
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square">
                  <img
                    src={photo.photo_url}
                    alt="Memória"
                    className="w-full h-full object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Life Story */}
        {memorial.life_story && (
          <Card className="p-8 mb-12 bg-card/80 backdrop-blur">
            <h2 className="text-3xl font-semibold text-center mb-8 text-primary">
              História de Vida
            </h2>
            <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap text-center max-w-3xl mx-auto">
              {memorial.life_story}
            </p>
          </Card>
        )}

        {/* Music Section */}
        {memorial.music_file && (
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-semibold text-center mb-8 text-primary">Música</h2>
            
            {memorial.life_story && (
              <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
                {memorial.life_story.substring(0, 200)}...
              </p>
            )}

            {/* Photo Carousel */}
            {photos.length > 0 && (
              <div className="mb-8 max-w-3xl mx-auto">
                <Carousel className="w-full">
                  <CarouselContent>
                    {photos.map((photo) => (
                      <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-2">
                          <img
                            src={photo.photo_url}
                            alt="Memória"
                            className="w-full aspect-square object-cover rounded-lg shadow-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}

            {/* Music Player */}
            <div className="bg-background rounded-lg p-6 max-w-3xl mx-auto border">
              <div className="flex items-center gap-6 mb-4">
                {/* Music Info */}
                <div className="flex-shrink-0">
                  <p className="font-semibold text-foreground">{memorial.music_name || "Música"}</p>
                  <p className="text-sm text-muted-foreground">
                    Composição personalizada criada especialmente para Maria Lucia de Souza
                  </p>
                </div>

                {/* Player Controls */}
                <div className="flex items-center gap-2 mx-auto">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSkipBackward}
                    className="h-10 w-10"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handlePlayPause}
                    className="h-12 w-12 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSkipForward}
                    className="h-10 w-10"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  max={duration || 100}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={memorial.music_file}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            />
          </Card>
        )}

        {/* Timeline */}
        {timelineEvents.length > 0 && (
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-semibold text-center mb-8 text-primary">
              Linha do Tempo
            </h2>
            <div className="space-y-6">
              {timelineEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="font-semibold text-xl w-20">
                      {new Date(event.event_date).getFullYear()}
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground">{event.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tribute Form */}
        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-semibold text-center mb-8 text-primary">
            Deixe sua homenagem de carinho
          </h2>
          <form onSubmit={handleSubmitTribute} className="max-w-2xl mx-auto space-y-4">
            <div>
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                value={tributeName}
                onChange={(e) => setTributeName(e.target.value)}
                required
                placeholder="Digite seu nome"
              />
            </div>
            <div>
              <Label htmlFor="message">Sua mensagem</Label>
              <Textarea
                id="message"
                value={tributeMessage}
                onChange={(e) => setTributeMessage(e.target.value)}
                required
                placeholder="Escreva sua homenagem..."
                rows={5}
              />
            </div>
            <div className="text-center">
              <Button type="submit" disabled={submittingTribute}>
                {submittingTribute ? "Enviando..." : "Enviar Homenagem"}
              </Button>
            </div>
          </form>

          {/* Display tributes */}
          {tributes.length > 0 && (
            <div className="mt-12 space-y-6">
              <h3 className="text-2xl font-semibold text-center text-primary">Homenagens</h3>
              {tributes.map((tribute) => (
                <div key={tribute.id} className="border-l-4 border-primary pl-6 py-4">
                  <p className="font-semibold mb-2">{tribute.author_name}</p>
                  <p className="text-muted-foreground italic">"{tribute.message}"</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(tribute.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* QR Code Section */}
        <Card className="p-8 mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-primary">
            Compartilhe este memorial
          </h2>
          <p className="text-muted-foreground mb-6">
            Escaneie o código QR para acessar esta homenagem
          </p>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
              <QRCodeSVG value={memorialUrl} size={200} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6 break-all">{memorialUrl}</p>
        </Card>

        {/* Footer */}
        <footer className="text-center py-12 border-t">
          <div className="mb-6">
            <h3 className="text-2xl font-serif mb-2">ETERNO RECORDAR</h3>
            <p className="text-muted-foreground italic">Amor que transcende o tempo</p>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Eterno Recordar. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Memorial;
