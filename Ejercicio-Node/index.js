const fs = require('fs');
const os = require('os');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const DEFAULT_CONFIG = {
  intervalSeconds: 5,
  stats: {
    cpu: true,
    memory: true,
    systemUptime: true,
    nodeUptime: true
  }
};

function loadConfig() {
  try {
    const fileContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = JSON.parse(fileContent);
    const intervalSeconds = Number(config.intervalSeconds);

    if (!Number.isFinite(intervalSeconds) || intervalSeconds <= 0) {
      throw new Error('intervalSeconds debe ser un número mayor que cero');
    }

    if (!config.stats || typeof config.stats !== 'object') {
      throw new Error('stats debe ser un objeto');
    }

    const statNames = Object.keys(DEFAULT_CONFIG.stats);
    const stats = {};
    for (const statName of statNames) {
      if (typeof config.stats[statName] !== 'boolean') {
        throw new Error(`stats.${statName} debe ser true o false`);
      }
      stats[statName] = config.stats[statName];
    }

    return { intervalSeconds, stats };
  } catch (error) {
    console.warn(
      `Aviso: no se pudo cargar config.json (${error.message}). ` +
      'Se utilizarán los valores predeterminados.'
    );
    return DEFAULT_CONFIG;
  }
}

function getCpuTimes() {
  return os.cpus().reduce(
    (totals, cpu) => {
      const times = cpu.times;
      totals.idle += times.idle;
      totals.total += times.user + times.nice + times.sys + times.idle + times.irq;
      return totals;
    },
    { idle: 0, total: 0 }
  );
}

function calculateCpuUsage(previous, current) {
  const totalDifference = current.total - previous.total;
  const idleDifference = current.idle - previous.idle;

  if (totalDifference <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (1 - idleDifference / totalDifference) * 100));
}

function formatBytes(bytes) {
  const megabytes = bytes / 1024 ** 2;
  if (megabytes >= 1024) {
    return `${(megabytes / 1024).toFixed(2)} GB`;
  }
  return `${megabytes.toFixed(2)} MB`;
}

function formatDuration(seconds) {
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${hours} h ${minutes} min ${remainingSeconds} s`;
}

function showPeriodicStats(config, previousCpuTimes) {
  const currentCpuTimes = getCpuTimes();
  const lines = ['\n--- Estadísticas del sistema ---'];

  if (config.stats.cpu) {
    const cpuUsage = calculateCpuUsage(previousCpuTimes, currentCpuTimes);
    lines.push(`Uso de CPU: ${cpuUsage.toFixed(2)} %`);
  }

  if (config.stats.memory) {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedPercentage = ((totalMemory - freeMemory) / totalMemory) * 100;
    lines.push(`Memoria total: ${formatBytes(totalMemory)}`);
    lines.push(`Memoria libre: ${formatBytes(freeMemory)}`);
    lines.push(`Memoria utilizada: ${usedPercentage.toFixed(2)} %`);
  }

  if (config.stats.systemUptime) {
    lines.push(`Tiempo de actividad del sistema: ${formatDuration(os.uptime())}`);
  }

  if (config.stats.nodeUptime) {
    lines.push(`Tiempo de ejecución de Node.js: ${formatDuration(process.uptime())}`);
  }

  console.log(lines.join('\n'));
  return currentCpuTimes;
}

const config = loadConfig();
let previousCpuTimes = getCpuTimes();
let intervalId;

console.log('=== Información del sistema ===');
console.log('El programa ha arrancado correctamente.');
console.log(`Sistema operativo: ${os.type()} ${os.release()}`);
console.log(`Arquitectura: ${os.arch()}`);
console.log(`Versión de Node.js: ${process.version}`);
console.log(`Plataforma: ${process.platform}`);
console.log(`Directorio de trabajo: ${process.cwd()}`);
console.log(`Estadísticas cada: ${config.intervalSeconds} segundos`);

intervalId = setInterval(() => {
  previousCpuTimes = showPeriodicStats(config, previousCpuTimes);
}, config.intervalSeconds * 1000);

process.on('SIGINT', () => {
  clearInterval(intervalId);
  console.log('\nPrograma detenido. Hasta pronto.');
  process.exit(0);
});
