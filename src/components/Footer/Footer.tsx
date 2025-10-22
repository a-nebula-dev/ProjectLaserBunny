import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primaria)] text-white mt-16 sm:mt-20 lg:mt-24">
      <div className="w-full py-12 sm:py-16 lg:py-20 px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-secondaria)]">
              Sobre Nós
            </h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Produtos artesanais únicos, feitos com amor e dedicação para
              tornar sua casa mais especial.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-secondaria)]">
              Links Rápidos
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Novidades",
                "Decoração",
                "Presentes",
                "Personalizados",
                "Promoções",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase()}`}
                    className="text-white/80 hover:text-[var(--color-secondaria)] transition-all duration-300 text-sm sm:text-base inline-block hover:translate-x-1"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-secondaria)]">
              Atendimento
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Minha Conta",
                "Rastrear Pedido",
                "Política de Devolução",
                "Perguntas Frequentes",
                "Termos de Uso",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-white/80 hover:text-[var(--color-secondaria)] transition-all duration-300 text-sm sm:text-base inline-block hover:translate-x-1"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-secondaria)]">
              Contato
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3 text-white/80 text-sm sm:text-base group">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:text-[var(--color-secondaria)] transition-all duration-300" />
                <span className="group-hover:text-white transition-all duration-300">
                  Rua Exemplo, 123
                  <br />
                  São Paulo, SP
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/80 text-sm sm:text-base group hover:text-white transition-all duration-300 cursor-pointer">
                <Phone className="w-5 h-5 flex-shrink-0 group-hover:text-[var(--color-secondaria)] transition-all duration-300" />
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 text-sm sm:text-base group hover:text-white transition-all duration-300 cursor-pointer">
                <Mail className="w-5 h-5 flex-shrink-0 group-hover:text-[var(--color-secondaria)] transition-all duration-300" />
                <span>contato@loja.com</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="pt-4">
              <h4 className="text-base sm:text-lg font-semibold mb-3 text-[var(--color-secondaria)]">
                Redes Sociais
              </h4>
              <div className="flex gap-3 sm:gap-4">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Twitter, label: "Twitter" },
                ].map(({ icon: Icon, label }) => (
                  <Link
                    key={label}
                    href={`/${label.toLowerCase()}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-secondaria)] transition-all duration-300 hover:scale-110 group"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/70 text-sm sm:text-base">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Loja Artesanal. Todos os direitos
              reservados.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <Link
                href="/privacidade"
                className="hover:text-[var(--color-secondaria)] transition-all duration-300 hover:underline"
              >
                Privacidade
              </Link>
              <Link
                href="/cookies"
                className="hover:text-[var(--color-secondaria)] transition-all duration-300 hover:underline"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
