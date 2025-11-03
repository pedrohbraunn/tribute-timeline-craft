import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface TimelineEvent {
  date: string;
  description: string;
}

const CreateMemorial = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [lifeStory, setLifeStory] = useState("");
  const [musicName, setMusicName] = useState("");

  // File states
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [memoryPhotos, setMemoryPhotos] = useState<File[]>([]);

  // Timeline states
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const addTimelineEvent = () => {
    if (newEventDate && newEventDescription) {
      setTimelineEvents([...timelineEvents, { date: newEventDate, description: newEventDescription }]);
      setNewEventDate("");
      setNewEventDescription("");
    }
  };

  const removeTimelineEvent = (index: number) => {
    setTimelineEvents(timelineEvents.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate slug from name
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Upload images
      let backgroundImageUrl = "";
      let profileImageUrl = "";
      let musicFileUrl = "";

      if (backgroundImage) {
        backgroundImageUrl = await uploadFile(
          backgroundImage,
          "memorial-images",
          `${slug}/background-${Date.now()}.${backgroundImage.name.split(".").pop()}`
        );
      }

      if (profileImage) {
        profileImageUrl = await uploadFile(
          profileImage,
          "memorial-images",
          `${slug}/profile-${Date.now()}.${profileImage.name.split(".").pop()}`
        );
      }

      if (musicFile) {
        musicFileUrl = await uploadFile(
          musicFile,
          "memorial-audio",
          `${slug}/music-${Date.now()}.${musicFile.name.split(".").pop()}`
        );
      }

      // Create memorial
      const { data: memorial, error: memorialError } = await supabase
        .from("memorials")
        .insert({
          slug,
          name,
          birth_date: birthDate,
          death_date: deathDate,
          brief_description: briefDescription,
          life_story: lifeStory,
          background_image: backgroundImageUrl,
          profile_image: profileImageUrl,
          music_file: musicFileUrl,
          music_name: musicName,
        })
        .select()
        .single();

      if (memorialError) throw memorialError;

      // Upload memory photos
      if (memoryPhotos.length > 0) {
        const photoPromises = memoryPhotos.map(async (photo, index) => {
          const photoUrl = await uploadFile(
            photo,
            "memorial-images",
            `${slug}/memory-${index}-${Date.now()}.${photo.name.split(".").pop()}`
          );

          return supabase.from("memorial_photos").insert({
            memorial_id: memorial.id,
            photo_url: photoUrl,
            display_order: index,
          });
        });

        await Promise.all(photoPromises);
      }

      // Create timeline events
      if (timelineEvents.length > 0) {
        const timelinePromises = timelineEvents.map((event, index) =>
          supabase.from("timeline_events").insert({
            memorial_id: memorial.id,
            event_date: event.date,
            description: event.description,
            display_order: index,
          })
        );

        await Promise.all(timelinePromises);
      }

      toast({
        title: "Memorial criado com sucesso!",
        description: "Redirecionando para a página do memorial...",
      });

      navigate(`/memorial/${slug}`);
    } catch (error: any) {
      console.error("Error creating memorial:", error);
      toast({
        title: "Erro ao criar memorial",
        description: error.message || "Ocorreu um erro ao criar o memorial. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps: getBgRootProps, getInputProps: getBgInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setBackgroundImage(acceptedFiles[0]),
  });

  const { getRootProps: getProfileRootProps, getInputProps: getProfileInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setProfileImage(acceptedFiles[0]),
  });

  const { getRootProps: getPhotosRootProps, getInputProps: getPhotosInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 12,
    onDrop: (acceptedFiles) => setMemoryPhotos([...memoryPhotos, ...acceptedFiles].slice(0, 12)),
  });

  const { getRootProps: getMusicRootProps, getInputProps: getMusicInputProps } = useDropzone({
    accept: { "audio/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setMusicFile(acceptedFiles[0]),
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Criar Memorial</h1>
          <p className="text-muted-foreground">
            Preencha as informações para criar uma homenagem inesquecível
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações básicas */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Informações Básicas</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nome da pessoa falecida"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deathDate">Data de Falecimento *</Label>
                  <Input
                    id="deathDate"
                    type="date"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="briefDescription">Breve Descrição</Label>
                <Textarea
                  id="briefDescription"
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  placeholder="Uma breve descrição ou frase especial..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Imagens */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Imagens</h2>
            
            <div className="space-y-6">
              <div>
                <Label>Imagem de Fundo</Label>
                <div
                  {...getBgRootProps()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input {...getBgInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {backgroundImage ? (
                    <p className="text-sm">{backgroundImage.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Clique ou arraste a imagem de fundo
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Foto de Perfil</Label>
                <div
                  {...getProfileRootProps()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input {...getProfileInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {profileImage ? (
                    <p className="text-sm">{profileImage.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Clique ou arraste a foto de perfil
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Fotos de Memórias (até 12 fotos)</Label>
                <div
                  {...getPhotosRootProps()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input {...getPhotosInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Clique ou arraste para adicionar fotos ({memoryPhotos.length}/12)
                  </p>
                </div>
                {memoryPhotos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-2">
                    {memoryPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Memória ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => setMemoryPhotos(memoryPhotos.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* História de Vida */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">História de Vida</h2>
            <div>
              <Label htmlFor="lifeStory">Conte a história</Label>
              <Textarea
                id="lifeStory"
                value={lifeStory}
                onChange={(e) => setLifeStory(e.target.value)}
                placeholder="Escreva aqui a história de vida..."
                rows={10}
                className="resize-none"
              />
            </div>
          </Card>

          {/* Música */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Música</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="musicName">Nome da Música</Label>
                <Input
                  id="musicName"
                  value={musicName}
                  onChange={(e) => setMusicName(e.target.value)}
                  placeholder="Nome da música ou artista"
                />
              </div>

              <div>
                <Label>Arquivo de Áudio</Label>
                <div
                  {...getMusicRootProps()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input {...getMusicInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {musicFile ? (
                    <p className="text-sm">{musicFile.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Clique ou arraste o arquivo de música (MP3, WAV, etc.)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Linha do Tempo */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Linha do Tempo</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="eventDate">Data</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                  />
                </div>
                <div className="flex-[2]">
                  <Label htmlFor="eventDescription">Descrição</Label>
                  <Input
                    id="eventDescription"
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    placeholder="Ex: Casamento, Nascimento do primeiro filho..."
                  />
                </div>
                <div className="flex items-end">
                  <Button type="button" onClick={addTimelineEvent} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {timelineEvents.length > 0 && (
                <div className="space-y-2 mt-6">
                  {timelineEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{new Date(event.date).getFullYear()}</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeTimelineEvent(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={loading} className="px-12">
              {loading ? "Criando memorial..." : "Criar Memorial"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMemorial;
