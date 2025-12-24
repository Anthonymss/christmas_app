import { useState } from 'react';
import { createDrawing } from '../services/drawings.service';
import { toast } from 'sonner';

interface Props {
    category: 'CONCURSO' | 'NAVIDAD_FEA';
    onUploadSuccess: () => void;
}

export default function UploadDrawing({
    category,
    onUploadSuccess,
}: Props) {
    const [uploading, setUploading] = useState(false);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            toast.error('Selecciona una imagen por favor');
            return;
        }

        try {
            setUploading(true);
            await createDrawing(file, category);
            toast.success('¡Imagen subida con éxito!');
            onUploadSuccess();
        } catch (error: any) {
            console.error(error);
            console.error(error);
            const message = error.response?.data?.message || 'Falló la subida.';
            // Detailed error for debugging
            alert(`Error detallado: ${JSON.stringify(error.response?.data || error.message)}`);
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border rounded p-3 mb-4">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            {uploading && <p className="text-sm text-center mt-2 text-rose-500 animate-pulse">Subiendo imagen...</p>}
        </div>
    );
}
