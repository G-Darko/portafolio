"use client";

import Link from "next/link";

export default function CVPage() {
  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            margin: 1cm;
          }
          .cv-header {
            padding: 1rem 0 !important;
          }
          .cv-body {
            zoom: 0.9;
          }
          .cv-ignore-print {
            display: none !important;
          }
          .cv-container {
            width: 1100px !important;
            grid-template-columns: 400px 1fr !important;
          }
          .cv-show-print {
            display: flex !important;
          }
          a.cv-attr[href^="http"]::after {
            content: " (" attr(href) ")";
            font-size: 0.8em;
            color: #555;
            font-weight: normal;
            text-decoration: none !important;
          }
        }
      `}</style>

      <div className="cv-body min-h-screen bg-bg text-text">
        <div className="cv-ignore-print mx-auto flex max-w-[210mm] justify-between px-4 py-4 md:px-8">
          <Link
            href="/"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            ← Volver al Portafolio
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Descargar CV
          </button>
        </div>

        <header className="cv-header border-b-2 border-accent bg-header py-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-accent">Isaac Gael Uribe Ortiz</h1>
          <p className="text-lg opacity-90">Desarrollador de Software y Web</p>
        </header>

        <div className="cv-container mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[1fr_2fr] md:px-8">
          <aside className="flex flex-col gap-6">
            <section className="rounded-lg bg-section p-6 shadow-md">
              <h2 className="mb-4 border-b-4 border-accent/40 pb-2 text-2xl font-bold text-accent">
                Perfil
              </h2>
              <p className="leading-relaxed">
                Ingeniero en Tecnologías de la Información. Apasionado por el desarrollo
                web y de software, con experiencia en proyectos académicos y personales en
                áreas como bases de datos, backend, frontend y videojuegos. Destaco por mi
                capacidad de adaptación, aprendizaje rápido y enfoque en la eficiencia.
              </p>
            </section>

            <section className="rounded-lg bg-section p-6 shadow-md">
              <h2 className="mb-4 border-b-4 border-accent/40 pb-2 text-2xl font-bold text-accent">
                Habilidades
              </h2>
              <ul className="list-none">
                <li className="mb-2">
                  <strong>Técnicas:</strong>
                  <ul className="mt-1 list-none pl-4">
                    <li>
                      <i>Backend:</i> PHP, Java, Laravel, MySQL, PostgreSQL, MongoDB
                    </li>
                    <li>
                      <i>Frontend:</i> HTML, CSS, JavaScript, Vue.js.
                    </li>
                    <li>
                      <i>Otras:</i> Git, GitHub, Sweetalert, Tailwind CSS,
                      Flowbite, JQuery, Godot Engine.
                    </li>
                  </ul>
                </li>
                <li className="mb-2">
                  <strong>Blandas:</strong><br />
                  Resolución de problemas, aprendizaje rápido, adaptabilidad, altamente
                  comprometido, trabajo en equipo, liderazgo.
                </li>
              </ul>
            </section>

            <section className="rounded-lg bg-section p-6 shadow-md">
              <h2 className="mb-4 border-b-4 border-accent/40 pb-2 text-2xl font-bold text-accent">
                Idiomas
              </h2>
              <ul className="list-none">
                <li className="mb-2">Español: Nativo</li>
                <li className="mb-2">Inglés: Intermedio (B1)</li>
              </ul>
            </section>

            <section className="rounded-lg bg-section p-6 shadow-md">
              <h2 className="mb-4 border-b-4 border-accent/40 pb-2 text-2xl font-bold text-accent">
                Contacto
              </h2>
              <ul className="list-none">
                <li className="mb-3 flex items-start gap-2">
                  <strong>🌐 Portafolio:</strong>
                  <a
                    href="https://g-darko.github.io/portafolio/"
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-accent transition-opacity hover:opacity-80"
                  >
                    g-darko.github.io/portafolio
                  </a>
                </li>
                <li className="mb-3 flex items-start gap-2">
                  <span className="shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" />
                    </svg>
                  </span>
                  <strong>GitHub:</strong>
                  <a
                    href="https://github.com/G-Darko"
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-accent transition-opacity hover:opacity-80"
                  >
                    github.com/G-Darko
                  </a>
                </li>
                <li className="cv-show-print mb-3 hidden items-start gap-2">
                  <strong>📞 Teléfono:</strong>
                  7202948727
                </li>
                <li className="cv-show-print mb-3 hidden items-start gap-2">
                  <strong>📧 Correo:</strong>
                  <a
                    href="mailto:gdarko.uribe@gmail.com"
                    className="break-all text-accent transition-opacity hover:opacity-80"
                  >
                    gdarko.uribe@gmail.com
                  </a>
                </li>
              </ul>
            </section>
          </aside>

          <main className="flex flex-col gap-6">
            <section className="rounded-lg bg-section p-6 shadow-md">
              <h2 className="mb-4 border-b-4 border-accent/40 pb-2 text-2xl font-bold text-accent">
                Proyectos Académicos y Personales
              </h2>
              <ul className="list-none">
                <li className="mb-4">
                  <strong className="mb-1 block text-accent">
                    Sistema de Inventarios (2025, Educación Dual - AERIAL DEPOT):
                  </strong>
                  Aplicación web desarrollada con Laravel, Vue.js y MySQL, incluye
                  visualización 3D del almacén mediante Three.js para facilitar la
                  localización de productos.
                </li>
                <li className="mb-4">
                  <strong className="mb-1 block text-accent">Gestor de Ventas (2024):</strong>
                  Sistema completo con registro de productos, ventas y reportes,
                  desarrollado en Java con base de datos MySQL.
                </li>
                <li className="mb-4">
                  <strong className="mb-1 block text-accent">
                    Página Posgrados UPVM (2024, Estancia I):
                  </strong>
                  Sitio web informativo para los aspirantes y estudiantes de postgrados
                  de la Universidad Politécnica de Valle de México, desarrollada con
                  HTML, CSS y JS, PHP y MySQL.
                </li>
                <li className="mb-4">
                  <strong className="mb-1 block text-accent">Portafolio Personal (2022):</strong>
                  Sitio estático para mostrar mis proyectos, desarrollado con HTML, CSS y
                  JS, alojado en GitHub Pages.
                </li>
                <li className="mb-4">
                  <strong className="mb-1 block text-accent">
                    E-Commerce (2022, Educación Dual):
                  </strong>
                  Plataforma simulada de comercio electrónico desarrollada con HTML, CSS,
                  JS, PHP y MySQL.
                </li>
              </ul>
            </section>

            <section className="rounded-lg bg-section p-6 shadow-md">
              <h2 className="mb-4 border-b-4 border-accent/40 pb-2 text-2xl font-bold text-accent">
                Formación Académica
              </h2>
              <ul className="mb-4 list-none">
                <li className="mb-3">
                  <strong>Ingeniería en Tecnologías de la Información</strong><br />
                  Universidad Politécnica del Valle de México (UPVM)<br />
                  2023 – Actualidad
                </li>
                <li className="mb-3">
                  <strong>Técnico en Programación</strong><br />
                  CECyTEM Tultitlán<br />
                  2019 – 2022
                </li>
              </ul>

              <h3 className="mb-2 text-xl font-bold text-accent">Certificaciones y Credenciales</h3>
              <p className="mb-1">
                <strong>CONOCER</strong><br />
                EC0160 – Desarrollo de Código de Software<br />
                Septiembre 2022
              </p>
              <p className="mb-1">
                Folio: (D-00)<strong>16955622</strong>
              </p>
              <p className="mb-3">
                <a
                  className="cv-attr text-accent transition-opacity hover:opacity-80"
                  href="https://conocer.gob.mx/RENAP/certificaciones"
                  target="_blank"
                  rel="noreferrer"
                >
                  Verificación en RENAP
                </a>
              </p>

              <p className="mb-1">
                <strong>Perfil de Credly (Netacad)</strong><br />
                <a
                  href="https://www.credly.com/users/g-darko"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent transition-opacity hover:opacity-80"
                >
                  credly.com/users/g-darko
                </a>
              </p>
            </section>
          </main>
        </div>

        <footer className="cv-ignore-print border-t border-accent bg-header py-6 text-center text-sm">
          <p>&copy; 2025 G-Darko</p>
        </footer>
      </div>
    </>
  );
}
