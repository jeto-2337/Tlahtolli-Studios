import React, { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, X, FileText, Package } from 'lucide-react';
import { ExcelImportError } from '../../types/admin';
import { parseCSV, validateExcelRow, parseExcelRow, downloadExampleCSV } from '../../utils/excelParser';
import { ProductFormData } from '../../types/admin';

interface ExcelImportProps {
  onImport: (products: ProductFormData[]) => void;
  onCancel: () => void;
}

export function ExcelImport({ onImport, onCancel }: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ExcelImportError[]>([]);
  const [validProducts, setValidProducts] = useState<ProductFormData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrors([]);
    setValidProducts([]);
    setIsProcessing(true);

    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      const allErrors: ExcelImportError[] = [];
      const products: ProductFormData[] = [];

      rows.forEach((row, index) => {
        const rowNumber = index + 2; // +2 porque empezamos en 1 y hay header
        const rowErrors = validateExcelRow(row, rowNumber);

        if (rowErrors.length > 0) {
          allErrors.push(...rowErrors);
        } else {
          try {
            const product = parseExcelRow(row);
            products.push(product);
          } catch (error) {
            allErrors.push({
              row: rowNumber,
              field: 'general',
              value: '',
              message: 'Error al parsear la fila'
            });
          }
        }
      });

      setErrors(allErrors);
      setValidProducts(products);
    } catch (error) {
      setErrors([{
        row: 0,
        field: 'file',
        value: '',
        message: 'Error al leer el archivo. Asegúrate de que sea un archivo CSV válido.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (validProducts.length > 0) {
      onImport(validProducts);
      setShowSuccess(true);
      setTimeout(() => {
        onCancel();
      }, 2000);
    }
  };

  const handleDownloadTemplate = () => {
    downloadExampleCSV();
  };

  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.row]) {
      acc[error.row] = [];
    }
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, ExcelImportError[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-2">Importación Masiva</h2>
          <p className="text-sm text-gray-600">
            Importa múltiples tesoros desde un archivo CSV
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Instrucciones */}
      <div 
        className="p-4 rounded-lg border mb-6"
        style={{ backgroundColor: '#73C2FB' + '20', borderColor: '#73C2FB' }}
      >
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 flex-shrink-0" style={{ color: '#73C2FB' }} />
          <div>
            <p className="text-sm mb-2" style={{ color: '#73C2FB' }}>
              <strong>Formato Requerido</strong>
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Archivo en formato CSV (valores separados por comas)</li>
              <li>• Primera fila debe contener los encabezados</li>
              <li>• Columnas requeridas: SKU, Nombre, Precio, Categoria, Rareza, Coleccion, Descripcion, Stock, Imagen</li>
              <li>• Los SKU deben ser únicos</li>
              <li>• Categorías válidas: taza, playera, peluche, figura</li>
              <li>• Rarezas válidas: Común, Raro, Épico, Legendario</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botón de plantilla */}
      <div className="mb-6">
        <button
          onClick={handleDownloadTemplate}
          className="px-4 py-2 rounded-lg border-2 transition-all hover:shadow-sm flex items-center gap-2"
          style={{ borderColor: '#7B4FA6', color: '#7B4FA6' }}
        >
          <Download className="w-4 h-4" />
          Descargar Plantilla de Ejemplo
        </button>
      </div>

      {/* Selector de archivo */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-6 py-8 rounded-lg border-2 border-dashed transition-all hover:bg-gray-50 flex flex-col items-center gap-3"
          style={{ borderColor: '#73C2FB' }}
        >
          <Upload className="w-12 h-12" style={{ color: '#73C2FB' }} />
          <div>
            <p className="text-gray-900 mb-1">
              {file ? file.name : 'Seleccionar archivo CSV'}
            </p>
            <p className="text-sm text-gray-500">
              Haz clic para seleccionar o arrastra un archivo aquí
            </p>
          </div>
        </button>
      </div>

      {/* Procesando */}
      {isProcessing && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#73C2FB' + '20' }}>
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: '#73C2FB' }} />
          </div>
          <p className="text-gray-600">Procesando archivo...</p>
        </div>
      )}

      {/* Resultados */}
      {!isProcessing && file && (
        <div className="space-y-6">
          {/* Productos válidos */}
          {validProducts.length > 0 && (
            <div 
              className="p-4 rounded-lg border"
              style={{ backgroundColor: '#7B4FA6' + '20', borderColor: '#7B4FA6' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5" style={{ color: '#7B4FA6' }} />
                <p className="text-sm" style={{ color: '#7B4FA6' }}>
                  <strong>{validProducts.length} productos válidos listos para importar</strong>
                </p>
              </div>
              <div className="max-h-40 overflow-y-auto">
                <ul className="text-xs text-gray-600 space-y-1">
                  {validProducts.map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Package className="w-3 h-3" />
                      <span>{p.sku} - {p.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Errores */}
          {errors.length > 0 && (
            <div 
              className="p-4 rounded-lg border"
              style={{ backgroundColor: '#FF4C4C' + '20', borderColor: '#FF4C4C' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5" style={{ color: '#FF4C4C' }} />
                <p className="text-sm" style={{ color: '#FF4C4C' }}>
                  <strong>{errors.length} errores encontrados</strong>
                </p>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {Object.entries(groupedErrors).map(([row, rowErrors]) => (
                  <div key={row} className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs mb-2">
                      <strong>Fila {row}:</strong>
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {rowErrors.map((error, i) => (
                        <li key={i}>
                          • <strong>{error.field}:</strong> {error.message}
                          {error.value && <span className="text-gray-500"> (valor: "{error.value}")</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Corrige los errores en el archivo y vuelve a intentar
              </p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {showSuccess && (
            <div 
              className="p-4 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              <CheckCircle className="w-5 h-5 text-white" />
              <p className="text-white">
                ¡Productos importados exitosamente!
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={handleImport}
              disabled={validProducts.length === 0 || showSuccess}
              className="flex-1 px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#7B4FA6' }}
            >
              <Upload className="w-5 h-5" />
              Importar {validProducts.length} Producto{validProducts.length !== 1 ? 's' : ''}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
