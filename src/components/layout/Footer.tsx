export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-sm text-foreground/70">
        <p>Pago seguro con Mercado Pago</p>
        <p>© {new Date().getFullYear()} Camisetas10. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
