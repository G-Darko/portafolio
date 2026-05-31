"use client";

import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-6 border-b-2 border-c1 pb-1 text-xl font-bold uppercase tracking-wide text-accent">
      {children}
    </h2>
  );
}

function Dot() {
  return <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-c1" />;
}

export default function CVPage() {
  const handleDownload = () => {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "CV_Uribe.html";
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-bg text-text">
      <div className="mx-auto max-w-[210mm] p-4 md:p-8">
        <div className="mb-4 flex flex-wrap justify-between gap-3">
          <Link
            href="/"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-110"
          >
            ← Volver al Portafolio
          </Link>
          <button
            onClick={handleDownload}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-110"
          >
            Descargar CV
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl bg-card p-6 md:grid-cols-[280px_1fr] md:p-10">
          <aside className="flex flex-col gap-5">
            <div className="mb-2 flex flex-col items-center text-center">
              <Image
                src={asset("/img/DARKO.png")}
                alt="Gael Uribe"
                width={250}
                height={250}
                className="flex h-[250px] w-[250px] items-center justify-center rounded-[30%] transition-transform duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(var(--lg))",
                }}
              />
            </div>

            <SectionTitle>Sobre mi</SectionTitle>
            <p className="text-sm leading-relaxed">
              Me apasiona el desarrollo web y de software, disfruto aprender
              nuevas tecnologías y mejorar mis habilidades en programación.
              Actualmente, estoy trabajando en proyectos que me permiten aplicar
              mis conocimientos y seguir creciendo como desarrollador.
            </p>

            <SectionTitle>Educación</SectionTitle>
            <div className="text-sm">
              <h6 className="text-lg font-semibold text-c1">
                Universidad Politécnica del Valle de México
              </h6>
              <p>Tultitlán de Mariano Escobedo, Méx.</p>
              <p>2021 - 2025 (6 meses de educación dual)</p>
              <p className="mt-1 font-bold text-c2">
                Ingeniería en Tecnologías de la Información
              </p>
              <p>
                Enfoque en áreas de software como programación e ingeniería web.
              </p>
            </div>

            <SectionTitle>Experiencia</SectionTitle>
            <div className="text-sm">
              <h6 className="text-lg font-semibold text-c1">
                Desarrollador Freelance
              </h6>
              <p>LEAMSI</p>
              <p>Julio 2025 - Agosto 2025</p>
              <p className="mt-1">
                Desarrollo de página web corporativa para una contaduría
                utilizando Astro y Tailwind CSS.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Astro", "Tailwind CSS", "JavaScript"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gris px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <SectionTitle>Contacto</SectionTitle>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-start gap-2">
                <Dot />
                <a href="mailto:gael-albuerne@hotmail.com" className="text-c1 underline decoration-current underline-offset-2 transition-colors hover:text-c2">
                  gael-albuerne@hotmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Dot />
                <a href="https://G-Darko.github.io/portafolio/ 
| CV" target="_blank" rel="noreferrer" className="text-c1 underline decoration-current underline-offset-2 transition-colors hover:text-c2">
                  G-Darko.github.io/portafolio/
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Dot />
                <a href="https://github.com/G-Darko" target="_blank" rel="noreferrer" className="text-c1 underline decoration-current underline-offset-2 transition-colors hover:text-c2">
                  github.com/G-Darko
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Dot />
                <a href="https://www.credly.com/users/g-darko" target="_blank" rel="noreferrer" className="text-c1 underline decoration-current underline-offset-2 transition-colors hover:text-c2">
                  credly.com/users/g-darko
                </a>
              </li>
            </ul>
          </aside>

          <main className="flex flex-col gap-5">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-accent drop-shadow">Gael Uribe</h1>
              <h2 className="mt-2 text-xl text-c1">Software Developer Junior</h2>
            </div>

            <SectionTitle>Skills</SectionTitle>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Dot />
                <span>HTML</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>JavaScript</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>Vue.js</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>PHP</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>Laravel</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>Java</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>MySQL</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>JQuery</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>Three.js</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>Flowbite</span>
              </li>
              <li className="flex items-center gap-2">
                <Dot />
                <span>SweetAlert2</span>
              </li>
            </div>

            <SectionTitle>Certificaciones</SectionTitle>
            <div className="text-sm">
              <div className="mb-1 flex items-start gap-3">
                <div className="shrink-0 pt-1">
                  <Dot />
                </div>
                <div>
                  <p className="font-semibold text-c1">
                    JavaScript Essentials 1
                  </p>
                  <p>
                    Cisco - Netacad | Julio 2025 |{" "}
                    <a
                      href="https://www.credly.com/badges/71c8ee70-2d13-423b-8873-961182d252c9"
                      target="_blank"
                      rel="noreferrer"
                      className="text-c1 underline"
                    >
                      Ver insignia en Credly
                    </a>
                  </p>
                </div>
              </div>

              <div className="mb-1 flex items-start gap-3">
                <div className="shrink-0 pt-1">
                  <Dot />
                </div>
                <div>
                  <p className="font-semibold text-c1">
                    Desarrollo de Codigo de Software
                  </p>
                  <p>
                    CONOCER - EC0160 | Septiembre 2022 |{" "}
                    <a
                      href="https://conocer.gob.mx/RENAP/certificaciones"
                      target="_blank"
                      rel="noreferrer"
                      className="text-c1 underline"
                    >
                      Validar en RENAP
                    </a>
                  </p>
                  <p className="mt-0.5 text-c2">Folio: 16955622</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
