import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Camera, Music, Clock, MessageCircle, QrCode } from "lucide-react";
import heroImage from "@/assets/hero-memorial.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative h-[80vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
        }}
      >
        <div className="text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">ETERNO RECORDAR</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 italic">
            Amor que transcende o tempo
          </p>
          <p className="text-lg md:text-xl mb-12 text-white/80 max-w-2xl mx-auto">
            Crie um memorial inesquecível para homenagear quem você ama. 
            Preserve memórias, compartilhe histórias e celebre uma vida especial.
          </p>
          <Link to="/criar-memorial">
            <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90">
              Criar Memorial
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">
            Uma homenagem completa e personalizada
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            Todas as ferramentas que você precisa para criar um memorial único e especial
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Galeria de Fotos</h3>
              <p className="text-muted-foreground">
                Compartilhe momentos especiais através de uma linda galeria de imagens
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Música Especial</h3>
              <p className="text-muted-foreground">
                Adicione a música favorita ou uma melodia que traga boas lembranças
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">História de Vida</h3>
              <p className="text-muted-foreground">
                Conte a história de vida de forma tocante e memorável
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Linha do Tempo</h3>
              <p className="text-muted-foreground">
                Marque os momentos mais importantes através de uma linha cronológica
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Homenagens</h3>
              <p className="text-muted-foreground">
                Permita que amigos e familiares deixem suas mensagens de carinho
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">QR Code Único</h3>
              <p className="text-muted-foreground">
                Compartilhe facilmente através de um código QR personalizado
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Como funciona
          </h2>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Preencha as informações</h3>
                <p className="text-muted-foreground text-lg">
                  Adicione fotos, datas importantes, história de vida, música especial e crie uma 
                  linha do tempo com os momentos mais marcantes.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Publique e compartilhe</h3>
                <p className="text-muted-foreground text-lg">
                  Ao publicar, você receberá um link único e um QR code para compartilhar 
                  com família e amigos.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Receba homenagens</h3>
                <p className="text-muted-foreground text-lg">
                  Amigos e familiares podem deixar suas mensagens de carinho e compartilhar 
                  suas próprias memórias especiais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-primary">
            Crie um memorial inesquecível
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Preserve as memórias e celebre a vida de quem você ama. 
            Comece agora e crie uma homenagem especial que durará para sempre.
          </p>
          <Link to="/criar-memorial">
            <Button size="lg" className="text-lg px-12 py-6">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 py-12 px-6 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-serif mb-2 text-primary">ETERNO RECORDAR</h3>
          <p className="text-muted-foreground italic mb-6">Amor que transcende o tempo</p>
          <p className="text-sm text-muted-foreground">
            © 2025 Eterno Recordar. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
