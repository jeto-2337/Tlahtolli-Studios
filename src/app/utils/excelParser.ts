import { ProductFormData } from '../types/admin';
import { ExcelImportResult, ExcelImportError } from '../types/admin';

interface ExcelRow {
  SKU: string;
  Nombre: string;
  Precio: string | number;
  Categoria: string;
  Rareza: string;
  Coleccion: string;
  Descripcion: string;
  Stock: string | number;
  Imagen: string;
}

const validCategories = ['taza', 'playera', 'peluche', 'figura'];
const validRarities = ['Común', 'Raro', 'Épico', 'Legendario'];

export const validateExcelRow = (row: any, rowNumber: number): ExcelImportError[] => {
  const errors: ExcelImportError[] = [];

  // Validar SKU
  if (!row.SKU || typeof row.SKU !== 'string' || !row.SKU.trim()) {
    errors.push({
      row: rowNumber,
      field: 'SKU',
      value: row.SKU || '',
      message: 'El SKU es obligatorio'
    });
  } else if (!/^[A-Z0-9-]+$/.test(row.SKU.trim())) {
    errors.push({
      row: rowNumber,
      field: 'SKU',
      value: row.SKU,
      message: 'El SKU solo puede contener letras mayúsculas, números y guiones'
    });
  }

  // Validar Nombre
  if (!row.Nombre || typeof row.Nombre !== 'string' || !row.Nombre.trim()) {
    errors.push({
      row: rowNumber,
      field: 'Nombre',
      value: row.Nombre || '',
      message: 'El nombre es obligatorio'
    });
  } else if (row.Nombre.trim().length < 5) {
    errors.push({
      row: rowNumber,
      field: 'Nombre',
      value: row.Nombre,
      message: 'El nombre debe tener al menos 5 caracteres'
    });
  }

  // Validar Precio
  const price = typeof row.Precio === 'number' ? row.Precio : parseFloat(row.Precio);
  if (isNaN(price) || price <= 0) {
    errors.push({
      row: rowNumber,
      field: 'Precio',
      value: row.Precio,
      message: 'El precio debe ser un número mayor a 0'
    });
  }

  // Validar Categoría
  const category = row.Categoria?.toLowerCase().trim();
  if (!category || !validCategories.includes(category)) {
    errors.push({
      row: rowNumber,
      field: 'Categoria',
      value: row.Categoria || '',
      message: `La categoría debe ser una de: ${validCategories.join(', ')}`
    });
  }

  // Validar Rareza
  if (!row.Rareza || !validRarities.includes(row.Rareza.trim())) {
    errors.push({
      row: rowNumber,
      field: 'Rareza',
      value: row.Rareza || '',
      message: `La rareza debe ser una de: ${validRarities.join(', ')}`
    });
  }

  // Validar Colección
  if (!row.Coleccion || typeof row.Coleccion !== 'string' || !row.Coleccion.trim()) {
    errors.push({
      row: rowNumber,
      field: 'Coleccion',
      value: row.Coleccion || '',
      message: 'La colección es obligatoria'
    });
  }

  // Validar Descripción
  if (!row.Descripcion || typeof row.Descripcion !== 'string' || !row.Descripcion.trim()) {
    errors.push({
      row: rowNumber,
      field: 'Descripcion',
      value: row.Descripcion || '',
      message: 'La descripción es obligatoria'
    });
  } else if (row.Descripcion.trim().length < 20) {
    errors.push({
      row: rowNumber,
      field: 'Descripcion',
      value: row.Descripcion,
      message: 'La descripción debe tener al menos 20 caracteres'
    });
  }

  // Validar Stock
  const stock = typeof row.Stock === 'number' ? row.Stock : parseInt(row.Stock);
  if (isNaN(stock) || stock < 0) {
    errors.push({
      row: rowNumber,
      field: 'Stock',
      value: row.Stock,
      message: 'El stock debe ser un número mayor o igual a 0'
    });
  }

  // Validar Imagen
  if (!row.Imagen || typeof row.Imagen !== 'string' || !row.Imagen.trim()) {
    errors.push({
      row: rowNumber,
      field: 'Imagen',
      value: row.Imagen || '',
      message: 'La URL de la imagen es obligatoria'
    });
  } else if (!row.Imagen.match(/^https?:\/\/.+/)) {
    errors.push({
      row: rowNumber,
      field: 'Imagen',
      value: row.Imagen,
      message: 'La URL de la imagen debe ser válida'
    });
  }

  return errors;
};

export const parseExcelRow = (row: any): ProductFormData => {
  return {
    sku: row.SKU.trim().toUpperCase(),
    name: row.Nombre.trim(),
    price: typeof row.Precio === 'number' ? row.Precio : parseFloat(row.Precio),
    image: row.Imagen.trim(),
    category: row.Categoria.toLowerCase().trim() as any,
    rarity: row.Rareza.trim() as any,
    collection: row.Coleccion.trim(),
    description: row.Descripcion.trim(),
    stock: typeof row.Stock === 'number' ? row.Stock : parseInt(row.Stock)
  };
};

// Función simulada para parsear CSV (en producción usarías una librería como papaparse)
export const parseCSV = (text: string): any[] => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }

  return rows;
};

// Generar plantilla de ejemplo
export const generateExampleCSV = (): string => {
  return `SKU,Nombre,Precio,Categoria,Rareza,Coleccion,Descripcion,Stock,Imagen
MUG-001,Taza del Portal Místico,299,taza,Épico,Mundo 1: El Despertar,Taza de cerámica con diseño del portal místico. Capacidad 350ml. Apta para lavavajillas y microondas.,10,https://images.unsplash.com/photo-1597661433965-7aec2c5b5d93
SHIRT-001,Playera del Héroe,499,playera,Legendario,Mundo 3: Determinación,Playera 100% algodón con estampado de alta calidad. Diseño exclusivo del héroe legendario.,15,https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5
PLUSH-001,Peluche del Guardián,699,peluche,Raro,Mundo 2: El Guardián,Peluche suave y adorable del guardián. Altura: 25cm. Material hipoalergénico.,20,https://images.unsplash.com/photo-1567169866456-a0759b6bb0c8`;
};

export const downloadExampleCSV = (): void => {
  const csv = generateExampleCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'plantilla_productos_tlahtolli.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};