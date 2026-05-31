export function parseCommand(raw: string): string[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.split(/\s+/);
}

export function linkifyText(raw: string): string[] {
  const cmd = parseCommand(raw);
  if (!cmd) return [];
  const command = cmd[0].toLowerCase();

  switch (command) {
    case "help":
      return [
        "> COMANDOS DISPONIBLES:",
        ">  help        - Muestra esta ayuda",
        ">  status      - Estado del sistema",
        ">  open [mod]  - Abre modo (sphere, minigame, mission)",
        ">  clear       - Limpia terminal",
        ">  cv          - Abre CV",
        ">  github      - Abre GitHub",
        ">  hack        - ???",
      ];
    case "status":
      return ["> SISTEMA OPERATIVO // TODOS MODULOS ONLINE"];
    case "clear":
      return [];
    case "cv":
      return ["> Abriendo CV...", ">>> window.open('/cv')"];
    case "github":
      return ["> Abriendo github.com/G-Darko"];
    case "hack":
      return [
        "> INICIANDO PROTOCOLO DE ACCESO...",
        ">  [####............] 25%",
        ">  [##########......] 62%",
        ">  [##############..] 88%",
        ">  ACCESO DENEGADO. INTENTE DE NUEVO.",
      ];
    case "open":
      if (cmd[1] === "sphere") return ["> Abriendo visualizador de stack..."];
      if (cmd[1] === "minigame") return ["> Cargando Knight's Slash..."];
      if (cmd[1] === "mission") return ["> Seleccione mision del dock"];
      return ["> USO: open [sphere|minigame|mission]"];
    default:
      return [`> Comando no reconocido: "${cmd[0]}". Escribe 'help'.`];
  }
}
