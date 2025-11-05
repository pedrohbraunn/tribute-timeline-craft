import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Camera, Music, Clock, MessageCircle, QrCode, LogOut, User, Shield, Globe, Sparkles, MapPin, Users, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-memorial.jpg";
import casalIlustracao from "@/assets/home/casal-ilustracao.jpg";
import passo1Hands from "@/assets/home/passo1-hands.png";
import passo2Placa from "@/assets/home/passo2-placa.png";
import passo3PlacaRosa from "@/assets/home/passo3-placa-rosa.jpg";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleCreateMemorial = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/criar-memorial");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-primary">ETERNO RECORDAR</h1>
                <p className="text-xs text-muted-foreground italic">Amor que transcende o tempo</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Como funciona
              </a>
              <a href="#planos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Planos
              </a>
              <a href="#depoimentos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Depoimentos
              </a>
              <a href="#parceiros" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Parceiros
              </a>
              <a href="#contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contato
              </a>

              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sair
                  </Button>
                </div>
              ) : null}

              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={handleCreateMemorial}
              >
                Criar Memorial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] bg-cover bg-center flex items-center justify-center pt-24"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${heroImage})`,
        }}
      >
        <div className="text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-800">
            Transforme Uma Memória<br />Em Uma Recordação Eterna.
          </h1>
          <p className="text-base md:text-lg mb-12 text-gray-600 max-w-2xl mx-auto">
            O primeiro memorial online que transforma a história de quem você ama
            em uma experiência viva - com música exclusiva, fotos e memórias que
            atravessam gerações, tudo isso com apenas um Qr Code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base px-10 py-6 bg-primary hover:bg-primary/90 rounded-md"
              onClick={handleCreateMemorial}
            >
              Criar Meu Memorial Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-10 py-6 border-2 rounded-md"
              onClick={() => navigate("/exemplos")}
            >
              Ver Exemplos
            </Button>
          </div>
        </div>
      </section>

      {/* Saudade Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 leading-tight">
                O tempo não apaga<br />a saudade. Mas pode<br />apagar as memórias.
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-base text-gray-600">
                Imagine abrir o memorial de quem você ama e ser recebido
                por uma música criada especialmente para ela. Uma trilha
                sonora única que captura a essência da sua história.
              </p>
              <p className="text-base text-gray-600">
                Fotos, vídeos e momentos organizados em uma linha do
                tempo interativa - acessível de qualquer lugar do mundo, a
                qualquer momento. E uma placa com QR Code no túmulo que
                permite que qualquer pessoa conheça o legado dessa vida
                extraordinária com um simples toque.
              </p>
              <p className="text-base font-semibold text-gray-800">
                O Eterno Recordar não é apenas um site.<br />
                É um santuário digital onde a saudade encontra
                beleza, e cada lembrança ganha vida.
              </p>
              <Button
                size="lg"
                className="text-base px-10 py-6 bg-primary hover:bg-primary/90 rounded-md mt-6"
                onClick={handleCreateMemorial}
              >
                Criar Memorial Agora
              </Button>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <img
              src={casalIlustracao}
              alt="Casal ilustração"
              className="w-64 h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
            Mais Que Um Memorial.<br />Uma Ponte Entre Gerações.
          </h2>

          {/* Decorative vertical line */}
          <div className="flex justify-center mb-12">
            <div className="relative h-32">
              <div className="w-0.5 h-full bg-gray-300 mx-auto"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rotate-45"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rotate-45"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 bg-white border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-xs font-bold text-gray-600">01</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Preservação<br />Eterna e Segura
              </h3>
              <p className="text-sm text-gray-600">
                Suas memórias em um único lugar protegido, acessível para sempre.
                Sem risco de perder arquivos ou fotos deterioradas pelo tempo.
              </p>
            </Card>

            <Card className="p-6 bg-white border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-xs font-bold text-gray-600">02</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Conexão Familiar<br />Sem Fronteiras
              </h3>
              <p className="text-sm text-gray-600">
                Familiares e amigos de qualquer lugar do mundo podem visitar o
                memorial, deixar mensagens e se conectar através das lembranças
                compartilhadas.
              </p>
            </Card>

            <Card className="p-6 bg-white border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-xs font-bold text-gray-600">03</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Uma Homenagem<br />Multissensorial
              </h3>
              <p className="text-sm text-gray-600">
                Não apenas fotos. Uma experiência completa com música, vídeos,
                histórias escritas e uma linha do tempo que conta a jornada completa
                dessa vida.
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-white border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-xs font-bold text-gray-600">04</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Acesso Direto no<br />Local da Saudade
              </h3>
              <p className="text-sm text-gray-600">
                A placa com QR Code no túmulo permite que visitantes conheçam a
                história completa com um simples toque no celular. Uma ponte entre o
                físico e o eterno.
              </p>
            </Card>

            <Card className="p-6 bg-white border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-xs font-bold text-gray-600">05</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Legado para<br />Futuras Gerações
              </h3>
              <p className="text-sm text-gray-600">
                Seus netos e bisnetos poderão conhecer a história dos avós que
                nunca conheceram. O memorial atravessa o tempo e mantém viva a
                essência familiar.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Como funciona
          </h2>

          <div className="space-y-20">
            {/* Passo 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img
                  src={passo1Hands}
                  alt="Passo 1 - Compartilhe as Memórias"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">01</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Passo 1</h3>
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">Compartilhe as Memórias</h4>
                <p className="text-base text-gray-600">
                  Envie fotos, vídeos, histórias e detalhes sobre a pessoa amada.
                  Quanto mais você compartilhar, mais rico será o memorial.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">02</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Passo 2</h3>
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">Nós Criamos a Magia</h4>
                <p className="text-base text-gray-600">
                  Você mesmo monta o perfil do memorial: escreve a biografia, organiza as
                  fotos e vídeos como preferir, igual a um perfil de Instagram ou Facebook.
                  Nossa equipe cuida apenas da criação de música exclusiva personalizada.
                </p>
              </div>
              <div className="order-1 lg:order-3">
                <img
                  src={passo2Placa}
                  alt="Passo 2 - Nós Criamos a Magia"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Passo 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img
                  src={passo3PlacaRosa}
                  alt="Passo 3 - Receba e Eternize"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">03</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Passo 3</h3>
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">Receba e Eternize</h4>
                <p className="text-base text-gray-600">
                  Você recebe o link do memorial digital pronto + a música personalizada
                  (com direito a ajustes). Dependendo do plano escolhido, você também
                  recebe a placa física de inox com QR Code para instalar no túmulo.
                  Pronto! A memória está eternizada e acessível.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Histórias que tocam o coração
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <p className="text-muted-foreground mb-6 italic">
                "Meu pai era um homem simples, mas tinha histórias incríveis. O
                memorial do Eterno Recordar organizou tudo de forma tão linda
                que parece que ele está aqui, contando suas aventuras
                novamente. A placa no túmulo foi o toque final. Agora ele não é apenas
                uma lápide, é uma vida completa que todos podem conhecer."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold">Pedro Luiz Bianchi</p>
                <p className="text-sm text-muted-foreground">São Paulo, SP</p>
              </div>
            </Card>

            <Card className="p-8">
              <p className="text-muted-foreground mb-6 italic">
                "Perdi meu marido há dois anos e tinha tanto medo de esquecer os
                detalhes. O memorial me deu paz. Agora visito o site toda semana,
                releio as mensagens que os amigos deixaram e ouço a música
                dele. É como se ele estivesse vivo de outra forma. Uma forma
                eterna."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold">Ana Müller</p>
                <p className="text-sm text-muted-foreground">Erechim, RS</p>
              </div>
            </Card>

            <Card className="p-8">
              <p className="text-muted-foreground mb-6 italic">
                "Quando ouvi a música que criaram para o memorial do meu pai, chorei
                por 20 minutos. Era como se cada nota contasse um pedaço da
                história dele. Meus filhos agora conhecem o avô que nunca
                tiveram a chance de abraçar. Obrigada por devolver essa
                conexão para nossa família."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold">Kátia Schmidt</p>
                <p className="text-sm text-muted-foreground">Porto Alegre, RS</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Escolha o plano ideal para eternizar essa história
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano 1: Digital com QR */}
            <Card className="p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-4 text-center">PLANO 1: Digital com QR</h3>
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground line-through">De R$ 249</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg">Por apenas</span>
                  <span className="text-4xl font-bold text-primary">R$ 149</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Pagamento único</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Memorial editável (15 fotos, 2 vídeos, biografia)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Música personalizada (letra + MP3/WAV, player integrado)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Arquivo QR Code (PDF/PNG) para imprimir/compartilhar</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">2 anos de hospedagem incluídos</span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mb-4 text-center">
                Após 2 anos: R$ 19,90/ano<br />
                Upgrade para 10 anos: +R$ 99
              </p>
              <Button
                className="w-full"
                onClick={handleCreateMemorial}
              >
                Adquirir Esse Plano
              </Button>
            </Card>

            {/* Plano 2: Placa de Inox - DESTAQUE */}
            <Card className="p-8 flex flex-col border-2 border-primary relative shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">PLANO 2: Placa de Inox</h3>
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground line-through">De R$ 449</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg">Por apenas</span>
                  <span className="text-4xl font-bold text-primary">R$ 399</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Pagamento único</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Memorial editável (15 fotos, 2 vídeos, biografia)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Música personalizada (letra + MP3/WAV, player integrado)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Arquivo QR Code (PDF/PNG) para imprimir/compartilhar</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Placa física de inox com QR Code</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">3 anos de hospedagem incluídos</span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mb-4 text-center">
                Após 3 anos: R$ 19,90/ano<br />
                Upgrade para 10 anos: +R$ 99
              </p>
              <Button
                className="w-full"
                onClick={handleCreateMemorial}
              >
                Adquirir Esse Plano
              </Button>
            </Card>

            {/* Plano 3: Premium */}
            <Card className="p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-4 text-center">PLANO 3: Premium</h3>
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground line-through">De R$ 749</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg">Por apenas</span>
                  <span className="text-4xl font-bold text-primary">R$ 649</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Pagamento único</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Memorial editável (15 fotos, 2 vídeos, biografia)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Música personalizada (letra + MP3/WAV, player integrado)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Arquivo QR Code (PDF/PNG) para imprimir/compartilhar</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Placa física de inox com QR Code</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Até 2 ajustes na letra/versos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Suporte prioritário</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">10 anos de hospedagem incluídos</span>
                </li>
              </ul>
              <Button
                className="w-full"
                onClick={handleCreateMemorial}
              >
                Adquirir Esse Plano
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Perguntas Frequentes
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Por quanto tempo o memorial fica disponível?
              </AccordionTrigger>
              <AccordionContent>
                O memorial fica disponível durante todo o período de hospedagem contratado.
                Todos os planos incluem anos de hospedagem, e após esse período, você pode
                renovar anualmente por apenas R$ 19,90/ano para manter o memorial ativo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Como funciona a criação da música exclusiva?
              </AccordionTrigger>
              <AccordionContent>
                Nossa equipe de compositores cria uma música original personalizada baseada
                nas informações e histórias que você compartilhar sobre a pessoa homenageada.
                A música é única e exclusiva, criada especialmente para o memorial. Você
                receberá a letra e o arquivo de áudio em MP3/WAV, que será integrado
                diretamente ao memorial.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Posso modificar o conteúdo do memorial depois?
              </AccordionTrigger>
              <AccordionContent>
                Sim! Todos os planos incluem memorial editável. Você pode adicionar, remover
                ou modificar fotos, vídeos e a biografia a qualquer momento através da sua
                área de acesso. As alterações são atualizadas instantaneamente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                A placa com QR Code é resistente?
              </AccordionTrigger>
              <AccordionContent>
                Sim! A placa é confeccionada em aço inox de alta qualidade, material
                extremamente resistente às condições climáticas, oxidação e desgaste do
                tempo. O QR Code é gravado permanentemente na placa, garantindo durabilidade
                e legibilidade mesmo após anos de exposição.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Como funciona o envio da placa?
              </AccordionTrigger>
              <AccordionContent>
                Para os planos que incluem a placa física (Plano 2 e 3), o envio é feito
                pelos Correios para todo o Brasil. Após a conclusão do memorial e aprovação
                da música, a placa é produzida e enviada em até 15 dias úteis. Você receberá
                um código de rastreamento para acompanhar a entrega.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                Quantas fotos e vídeos posso adicionar?
              </AccordionTrigger>
              <AccordionContent>
                Todos os planos incluem capacidade para até 15 fotos e 2 vídeos. Esse limite
                garante um memorial completo e visualmente rico, mantendo um bom desempenho
                de carregamento para todos os visitantes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">
                O que é o arquivo QR Code digital?
              </AccordionTrigger>
              <AccordionContent>
                É um arquivo em formato PDF/PNG com o QR Code do memorial que você pode
                imprimir, compartilhar digitalmente ou usar da forma que preferir. Mesmo no
                Plano 1 (que não inclui a placa física), você recebe esse arquivo e pode
                imprimir o QR Code em gráficas locais ou compartilhá-lo online.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                Posso mudar de plano depois?
              </AccordionTrigger>
              <AccordionContent>
                Sim! Você pode fazer upgrade do seu plano a qualquer momento. Entre em
                contato conosco e faremos o ajuste, cobrando apenas a diferença entre os
                planos. O downgrade não é permitido após a criação da música e/ou envio da
                placa.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-left">
                O pagamento é parcelado?
              </AccordionTrigger>
              <AccordionContent>
                Atualmente os planos são oferecidos com pagamento único. Em breve
                disponibilizaremos opções de parcelamento. Entre em contato pelo WhatsApp
                para consultar condições especiais.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="text-left">
                Quem pode ver o memorial?
              </AccordionTrigger>
              <AccordionContent>
                O memorial é público e pode ser acessado por qualquer pessoa que tenha o
                link ou escaneie o QR Code. Isso permite que familiares, amigos e até
                visitantes do cemitério possam conhecer e prestar homenagem à pessoa
                querida. Não é necessário login ou cadastro para visualizar.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger className="text-left">
                Posso solicitar reembolso ou devolução?
              </AccordionTrigger>
              <AccordionContent>
                Por se tratar de um serviço personalizado (especialmente a criação da música
                exclusiva), não oferecemos reembolso após o início da produção. Você tem até
                7 dias após a compra para solicitar o cancelamento, desde que a produção da
                música ainda não tenha sido iniciada.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Não deixe que o tempo apague<br />o que o amor construiu
              </h2>
              <p className="text-base text-gray-600 mb-8">
                A cada dia que passa, uma memória se torna mais distante.
                Mas não precisa ser assim. Transforme a saudade em legado
                eterno e crie um lugar onde cada lembrança ganha vida.
              </p>
              <Button
                size="lg"
                className="text-base px-10 py-6 bg-primary hover:bg-primary/90 rounded-md"
                onClick={handleCreateMemorial}
              >
                Criar Memorial Agora
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🧓👵</div>
                <p className="text-sm text-gray-500 italic">QR Code de exemplo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 py-12 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-serif mb-2 text-primary">ETERNO RECORDAR</h3>
              <p className="text-muted-foreground italic">Amor que transcende o tempo</p>
            </div>

            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#como-funciona" className="text-muted-foreground hover:text-primary transition-colors">
                Como funciona
              </a>
              <a href="#planos" className="text-muted-foreground hover:text-primary transition-colors">
                Planos
              </a>
              <a href="#depoimentos" className="text-muted-foreground hover:text-primary transition-colors">
                Depoimentos
              </a>
              <a href="#contato" className="text-muted-foreground hover:text-primary transition-colors">
                Contato
              </a>
              <Button
                variant="link"
                className="p-0 h-auto text-muted-foreground hover:text-primary"
                onClick={handleCreateMemorial}
              >
                Criar Memorial
              </Button>
            </nav>
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/5549999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                WhatsApp
              </a>
              <span>São Miguel do Oeste, SC</span>
            </div>
            <p>
              Copyright © 2025 - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
