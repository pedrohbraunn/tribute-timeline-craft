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
        className="relative h-[50vh] md:h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${memorial.background_image || heroDefault})`,
        }}
      >
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <h1 className="text-xl md:text-2xl font-serif text-white flex items-center gap-2">
            <span className="text-2xl">❤️</span> ETERNO RECORDAR
          </h1>
          <p className="text-white/80 text-sm md:text-base italic">Amor que transcende o tempo</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 -mt-20 md:-mt-24 mb-12">
        <div className="text-center">
          {memorial.profile_image && (
            <div className="inline-block mb-6">
              <img
                src={memorial.profile_image}
                alt={memorial.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-background object-cover shadow-2xl"
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">{memorial.name}</h1>
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-sm md:text-base mb-4">
            <span>🕊️ {new Date(memorial.birth_date).toLocaleDateString("pt-BR")}</span>
            <span>-</span>
            <span>🕊️ {new Date(memorial.death_date).toLocaleDateString("pt-BR")}</span>
          </div>
          {memorial.brief_description && (
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {memorial.brief_description}
            </p>
          )}
        </div>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground">
              Memórias em imagens
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={photo.photo_url}
                    alt="Memória"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Life Story */}
        {memorial.life_story && (
          <Card className="p-6 md:p-10 mb-16 bg-muted/30">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-foreground">
              História de Vida
            </h2>
            <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap text-center max-w-3xl mx-auto">
              {memorial.life_story}
            </p>
          </Card>
        )}

        {/* Music Section */}
        {memorial.music_file && (
          <Card className="p-6 md:p-10 mb-16 bg-muted/30">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 text-foreground">Música</h2>
            
            {memorial.music_name && (
              <p className="text-center text-muted-foreground mb-8">
                {memorial.music_name}
              </p>
            )}

            {/* Photo Row - Show first 3 photos */}
            {photos.length > 0 && (
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {photos.slice(0, 3).map((photo) => (
                    <div key={photo.id} className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={photo.photo_url}
                        alt="Memória"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Music Player */}
            <div className="bg-background/60 rounded-lg p-4 md:p-6 max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                {/* Player Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSkipBackward}
                    className="h-8 w-8"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handlePlayPause}
                    className="h-10 w-10 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSkipForward}
                    className="h-8 w-8"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Time Display */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 ml-auto">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <Slider
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  max={duration || 100}
                  step={0.1}
                  className="w-full"
                />
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
          <Card className="p-6 md:p-10 mb-16 bg-muted/30">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-foreground">
              Linha do Tempo
            </h2>
            <div className="space-y-8 max-w-2xl mx-auto">
              {timelineEvents.map((event) => (
                <div key={event.id} className="flex gap-4 md:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary flex-shrink-0 mt-2" />
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <span className="font-semibold text-lg md:text-xl text-foreground block mb-1">
                      {new Date(event.event_date).getFullYear()}
                    </span>
                    <p className="text-sm md:text-base text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tribute Form */}
        <Card className="p-6 md:p-10 mb-16 bg-muted/30">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-foreground">
            Deixe sua homenagem de carinho
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm md:text-base">
            Nome ** Deixe seu recado, foto ou vídeo da pessoa. Sua mensagem será valiosa para os amigos e familiares da pessoa!
          </p>
          <form onSubmit={handleSubmitTribute} className="max-w-2xl mx-auto space-y-6">
            <div>
              <Input
                id="name"
                value={tributeName}
                onChange={(e) => setTributeName(e.target.value)}
                required
                placeholder="Nome **"
                className="text-base"
              />
            </div>
            <div>
              <Textarea
                id="message"
                value={tributeMessage}
                onChange={(e) => setTributeMessage(e.target.value)}
                required
                placeholder="Deixe seu recado, foto ou vídeo da pessoa. Sua mensagem será valiosa para os amigos e familiares da pessoa!"
                rows={6}
                className="text-base"
              />
            </div>
            <div className="text-center">
              <Button type="submit" disabled={submittingTribute} size="lg">
                {submittingTribute ? "Enviando..." : "Enviar Homenagem"}
              </Button>
            </div>
          </form>

          {/* Display tributes */}
          {tributes.length > 0 && (
            <div className="mt-12 space-y-6 max-w-2xl mx-auto">
              <h3 className="text-xl md:text-2xl font-semibold text-center text-foreground mb-6">Homenagens Recebidas</h3>
              {tributes.map((tribute) => (
                <div key={tribute.id} className="bg-background/60 rounded-lg p-6 border border-border">
                  <p className="font-semibold mb-2 text-foreground">{tribute.author_name}</p>
                  <p className="text-muted-foreground mb-3">"{tribute.message}"</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tribute.created_at).toLocaleDateString("pt-BR", {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* QR Code Section */}
        <div className="mb-16 bg-muted/20 rounded-lg p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                Compartilhe este memorial
              </h2>
              <p className="text-muted-foreground mb-6 text-sm md:text-base">
                Use este QR Code para compartilhar o memorial. Ao escaneá-lo, as pessoas serão levadas diretamente para esta página com todas as informações, fotos e homenagens.
              </p>
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
                  <QRCodeSVG 
                    value={memorialUrl} 
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center md:text-left break-all max-w-[200px]">
                  {memorialUrl}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="text-center text-6xl md:text-8xl">
                💐👤
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-12 border-t mt-12">
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-serif mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl">❤️</span> ETERNO RECORDAR
            </h3>
            <p className="text-muted-foreground italic text-sm md:text-base">Amor que transcende o tempo</p>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            © 2025 Eterno Recordar • Rua Miguel do Sacramento • Todos os direitos reservados
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Memorial;
