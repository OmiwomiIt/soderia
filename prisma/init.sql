CREATE TABLE IF NOT EXISTS Cliente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Producto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL,
  presentacion TEXT NOT NULL,
  precio REAL NOT NULL,
  activo INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Presupuesto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero TEXT UNIQUE NOT NULL,
  clienteId INTEGER NOT NULL,
  subtotal REAL NOT NULL,
  iva REAL NOT NULL,
  total REAL NOT NULL,
  observaciones TEXT,
  estado TEXT DEFAULT 'BORRADOR',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clienteId) REFERENCES Cliente(id)
);

CREATE TABLE IF NOT EXISTS DetallePresupuesto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  presupuestoId INTEGER NOT NULL,
  productoId INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  precioUnitario REAL NOT NULL,
  total REAL NOT NULL,
  FOREIGN KEY (presupuestoId) REFERENCES Presupuesto(id) ON DELETE CASCADE,
  FOREIGN KEY (productoId) REFERENCES Producto(id)
);

INSERT OR IGNORE INTO Producto (id, nombre, tipo, presentacion, precio, activo) VALUES
(1, 'Agua purificada', 'AGUA', '500ml', 500, 1),
(2, 'Agua purificada', 'AGUA', '1L', 800, 1),
(3, 'Agua purificada', 'AGUA', '5L', 2500, 1),
(4, 'Agua purificada', 'AGUA', '20L', 6000, 1),
(5, 'Soda de sabores', 'SODA', '500ml', 600, 1),
(6, 'Soda de sabores', 'SODA', '1L', 1000, 1),
(7, 'Soda de sabores', 'SODA', '2L', 1800, 1);

INSERT OR IGNORE INTO Cliente (id, nombre, email, telefono, direccion) VALUES
(1, 'Empresa Demo', 'demo@ejemplo.com', '55 1234 5678', 'Ciudad de México');