# G-Darko · Portafolio

Portafolio personal de **Gael Uribe (G-Darko)** — desarrollador de software y web.

Sitio interactivo con metáfora HUD (“Hologram Workshop”), misiones/proyectos reales, skills 3D, contacto y un **CV** descargable en PDF. Bilingüe **ES / EN**.

**Live:** [g-darko.github.io/portafolio](https://g-darko.github.io/portafolio/)

---

## Qué incluye

| Ruta / módulo | Descripción |
| --- | --- |
| `/` | Shell HUD: perfil, misiones, skills, certificaciones, contacto, terminal y extras |
| `/missions/...` | Casos de trabajo (Black Sheep Lab, freelance, academia) con media y stack |
| `/skills` | Catálogo de tecnologías + orbe 3D enlazado al stack de cada misión |
| `/cv` | CV curado (destacados) + descarga PDF client-side |
| Temas | Paletas HUD, modo claro/oscuro, locale ES/EN |

### Experiencia destacada (contenido)

- **Black Sheep Lab** — ownership end-to-end: LMS multi-tenant (Skool), apps Expo (Duplica / CRESER white-label), integraciones WhatsApp/ERP (OmniSIP, KRKN), WMS/etiquetas (Firebird, ZPL/TSPL).
- Freelance y formación aplicada (Astro, Aerial Depot, estancias UPVM) como soporte secundario.

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **Motion** · **Zustand**
- **Three.js** / React Three Fiber (orbe de skills)
- **@react-pdf/renderer** (export PDF del CV)
- Deploy estático a **GitHub Pages** (`output: "export"`, `basePath` en producción)

La carpeta `_LEGACY/` conserva el sitio HTML anterior; **no forma parte del build**.

---

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # export estático → dist/
npm run lint
```

---

## Deploy

CI en `.github/workflows/deploy.yml`: build Next y publicación a GitHub Pages.

El `basePath` `/portafolio` se aplica solo en producción para coincidir con la URL del project site.

---

## Contacto

- Email: [gdarko.uribe@gmail.com](mailto:gdarko.uribe@gmail.com)
- GitHub: [G-Darko](https://github.com/G-Darko)
- CV en el sitio: [/cv](https://g-darko.github.io/portafolio/cv/)

---

## Licencia / uso

Proyecto personal. El código del portafolio es de Gael Uribe; assets de proyectos de clientes siguen siendo de sus respectivos dueños.
