import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle, CheckCircle, Image as ImageIcon, Upload } from 'lucide-react';
import { Product } from '../../types';
import { ProductFormData, ValidationError } from '../../types/admin';
import { productsApi } from '../../utils/api';

interface ProductFormProps {
  product?: Product;
  onSave: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    sku: product?.sku || '',
    name: product?.name || '',
    price: product?.price ?? 0,
    image: product?.image || '',
    category: product?.category || 'taza',
    rarity: product?.rarity || 'Común',
    collection: product?.collection || '',
    description: product?.description || '',
    stock: product?.stock ?? 0
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isValidatingSku, setIsValidatingSku] = useState(false);

  const validate = async (): Promise<ValidationError[]> => {
    const newErrors: ValidationError[] = [];

    if (!formData.sku.trim()) {
      newErrors.push({ field: 'sku', message: 'El SKU es obligatorio' });
    } else if (!/^[A-Z0-9-]+$/.test(formData.sku)) {
      newErrors.push({ field: 'sku', message: 'El SKU solo puede contener letras mayúsculas, números y guiones' });
    } else {
      // Validate SKU uniqueness via API
      const result = await productsApi.validateSku(formData.sku, product?.id);
      if (result.error || !result.data?.isUnique) {
        newErrors.push({ field: 'sku', message: result.data?.message || 'Este SKU ya está en uso' });
      }
    }

    if (!formData.name.trim()) {
      newErrors.push({ field: 'name', message: 'El nombre es obligatorio' });
    } else if (formData.name.length < 5) {
      newErrors.push({ field: 'name', message: 'El nombre debe tener al menos 5 caracteres' });
    }

    if (formData.price <= 0) {
      newErrors.push({ field: 'price', message: 'El precio debe ser mayor a 0' });
    }

    if (!formData.image.trim()) {
      newErrors.push({ field: 'image', message: 'La imagen es obligatoria' });
    } else if (!formData.image.match(/^https?:\/\/.+/) && !formData.image.startsWith('data:image/')) {
      newErrors.push({ field: 'image', message: 'La imagen debe ser una URL válida o una imagen cargada' });
    }

    if (!formData.collection.trim()) {
      newErrors.push({ field: 'collection', message: 'La colección es obligatoria' });
    }

    if (!formData.description.trim()) {
      newErrors.push({ field: 'description', message: 'La descripción es obligatoria' });
    } else if (formData.description.length < 20) {
      newErrors.push({ field: 'description', message: 'La descripción debe tener al menos 20 caracteres' });
    }

    if (formData.stock < 0) {
      newErrors.push({ field: 'stock', message: 'El stock no puede ser negativo' });
    }

    return newErrors;
  };

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    setTouched(new Set(touched).add(field));
  };

  const handleBlur = (field: keyof ProductFormData) => {
    setTouched(new Set(touched).add(field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = await validate();
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      onSave(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    if (!touched.has(field)) return undefined;
    return errors.find(e => e.field === field)?.message;
  };

  const hasError = (field: string): boolean => {
    return touched.has(field) && errors.some(e => e.field === field);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es muy grande. Por favor selecciona una imagen menor a 2MB');
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleChange('image', base64String);
      setImagePreview(base64String);
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      alert('Error al cargar la imagen. Por favor intenta nuevamente.');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-2">
            {product ? 'Editar Tesoro' : 'Forjar Nuevo Tesoro'}
          </h2>
          <p className="text-sm text-gray-600">
            {product ? 'Modifica las propiedades del tesoro' : 'Crea un nuevo tesoro para el catálogo'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm text-gray-700 mb-2">
              SKU (Código Único) *
            </label>
            <input
              type="text"
              id="sku"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('sku')}
              placeholder="Ej: MUG-001"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all font-mono ${
                hasError('sku') ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!!product?.hasSales}
            />
            {getFieldError('sku') && (
              <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError('sku')}</span>
              </div>
            )}
            {product?.hasSales && (
              <p className="text-xs text-gray-500 mt-2">
                ℹ️ El SKU no se puede modificar porque el producto tiene ventas
              </p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Ej: Taza del Portal Místico"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all ${
                hasError('name') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('name') && (
              <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError('name')}</span>
              </div>
            )}
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm text-gray-700 mb-2">
              Precio (MXN) *
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
              onBlur={() => handleBlur('price')}
              placeholder="299"
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all ${
                hasError('price') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('price') && (
              <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError('price')}</span>
              </div>
            )}
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm text-gray-700 mb-2">
              Stock Inicial *
            </label>
            <input
              type="number"
              id="stock"
              value={formData.stock}
              onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
              onBlur={() => handleBlur('stock')}
              placeholder="10"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all ${
                hasError('stock') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('stock') && (
              <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError('stock')}</span>
              </div>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
            >
              <option value="taza">☕ Taza</option>
              <option value="playera">👕 Playera</option>
              <option value="peluche">🧸 Peluche</option>
              <option value="figura">🎮 Figura</option>
            </select>
          </div>

          {/* Rareza */}
          <div>
            <label htmlFor="rarity" className="block text-sm text-gray-700 mb-2">
              Rareza *
            </label>
            <select
              id="rarity"
              value={formData.rarity}
              onChange={(e) => handleChange('rarity', e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all"
            >
              <option value="Común">Común</option>
              <option value="Raro">Raro</option>
              <option value="Épico">Épico</option>
              <option value="Legendario">Legendario</option>
            </select>
          </div>
        </div>

        {/* Colección */}
        <div>
          <label htmlFor="collection" className="block text-sm text-gray-700 mb-2">
            Colección *
          </label>
          <select
            id="collection"
            value={formData.collection}
            onChange={(e) => handleChange('collection', e.target.value)}
            onBlur={() => handleBlur('collection')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all ${
              hasError('collection') ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona una colección</option>
            <option value="Mundo 1: El Despertar">🌅 Mundo 1: El Despertar</option>
            <option value="Mundo 2: El Guardián">🛡️ Mundo 2: El Guardián</option>
            <option value="Mundo 3: Determinación">⚔️ Mundo 3: Determinación</option>
            <option value="Mundo 4: El Destino Final">👑 Mundo 4: El Destino Final</option>
          </select>
          {getFieldError('collection') && (
            <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#FF4C4C' }}>
              <AlertCircle className="w-4 h-4" />
              <span>{getFieldError('collection')}</span>
            </div>
          )}
        </div>

        {/* Imagen del Producto */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Imagen del Producto *
          </label>
          <div className="space-y-3">
            {/* Preview de la imagen */}
            {formData.image && (
              <div className="w-full max-w-md mx-auto">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img 
                    src={formData.image} 
                    alt="Preview del producto"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Botones de carga */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Opción 1: Cargar desde computadora */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2563EB' }}>
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-900">
                      Subir desde computadora
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {isUploadingImage ? 'Cargando imagen...' : 'JPG, PNG (Máx. 2MB)'}
                    </p>
                  </div>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </label>
              </div>

              {/* Opción 2: URL externa */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm text-gray-900 mb-2">
                      URL de imagen externa
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      value={formData.image.startsWith('data:') ? '' : formData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      onBlur={() => handleBlur('image')}
                      placeholder="https://..."
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all ${
                        hasError('image') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje de error */}
            {getFieldError('image') && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError('image')}</span>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="mb-1">💡 <strong>Consejos para mejores resultados:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Usa imágenes cuadradas (1:1) para mejor visualización</li>
                    <li>Resolución mínima recomendada: 800x800 píxeles</li>
                    <li>Fondo claro y uniforme para resaltar el producto</li>
                    <li>Las imágenes locales se guardan en el navegador (base64)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Describe las características del producto..."
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-offset-2 outline-none transition-all resize-none ${
              hasError('description') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex items-center justify-between mt-2">
            {getFieldError('description') ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#FF4C4C' }}>
                <AlertCircle className="w-4 h-4" />
                <span>{getFieldError('description')}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">
                {formData.description.length} caracteres (mínimo 20)
              </span>
            )}
          </div>
        </div>

        {/* Mensaje de éxito */}
        {showSuccess && (
          <div 
            className="p-4 rounded-lg flex items-center gap-3"
            style={{ backgroundColor: '#50C878' }}
          >
            <CheckCircle className="w-5 h-5 text-white" />
            <p className="text-white">
              ¡Tesoro {product ? 'actualizado' : 'creado'} exitosamente!
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: '#50C878' }}
          >
            <Save className="w-5 h-5" />
            {product ? 'Actualizar Tesoro' : 'Guardar Tesoro'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}