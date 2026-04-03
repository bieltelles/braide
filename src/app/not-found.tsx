import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-16">
      <div className="text-center px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-4xl font-extrabold text-primary">404</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          A página que você procura não existe ou foi movida.
          Mas não se preocupe, você pode voltar ao início!
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button size="lg">
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/plano-de-governo">
            <Button size="lg" variant="outline">
              Plano de Governo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
