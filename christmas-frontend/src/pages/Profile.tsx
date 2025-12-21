import { useEffect, useState } from 'react';
import { getMyPosts, replacePost, type Post } from '../services/posts.service';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Loader, Edit2, Upload, X, Play, Music } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [showNameEdit, setShowNameEdit] = useState(false);
    const [newName, setNewName] = useState('');
    const { } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await getMyPosts();
            setPosts(data);
        } catch (error) {
            toast.error('Error al cargar tus publicaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (post: Post) => {
        setEditingPost(post);
        setDescription(post.description || '');
        setFile(null);
    };

    const handleReplace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost || !file) return;

        setIsSubmitting(true);
        try {
            await replacePost(editingPost.id, file, description);
            toast.success('Publicación actualizada correctamente');
            setEditingPost(null);
            loadPosts();
        } catch (error) {
            toast.error('Error al actualizar la publicación');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await import('../services/auth.service').then(m => m.updateUser(newName));
            toast.success('Nombre actualizado. Recargando...');
            setTimeout(() => window.location.reload(), 1000);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al actualizar nombre';
            toast.error(message);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader className="w-8 h-8 animate-spin text-[#bf152d]" /></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <header className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#bf152d] rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-friendly text-[#1e1219] dark:text-white">
                            {user?.username}
                        </h1>
                        <button
                            onClick={() => {
                                setNewName(user?.username || '');
                                setShowNameEdit(true);
                            }}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-400 hover:text-[#bf152d]"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">Gestiona tus participaciones</p>
                </div>
            </header>

            {posts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                    <p className="text-slate-500 mb-4">Aún no has participado en ninguna categoría.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-video relative bg-black group">
                                {post.type === 'VIDEO' ? (
                                    <video src={post.url} className="w-full h-full object-cover opacity-80" />
                                ) : (
                                    <img src={post.url} className="w-full h-full object-cover" />
                                )}

                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full uppercase font-bold backdrop-blur-sm">
                                    {post.category.replace('_', ' ')}
                                </div>

                                {post.type === 'VIDEO' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <Play className="w-12 h-12 text-white opacity-80" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5em] italic">
                                        "{post.description || 'Sin descripción'}"
                                    </p>
                                    <div className="flex gap-4 mt-3 text-sm font-bold text-[#1e1219] dark:text-white">
                                        <span>{post.votesCount} Votos</span>
                                        <span className="text-slate-400">•</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleEditClick(post)}
                                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold hover:bg-[#bf152d] hover:text-white dark:hover:bg-[#bf152d] transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Reemplazar Archivo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95">
                        <button
                            onClick={() => setEditingPost(null)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-[#1e1219] dark:text-white">Reemplazar Publicación</h2>

                        <form onSubmit={handleReplace} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nuevo Archivo</label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl p-8 text-center hover:border-[#bf152d] transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                        accept={editingPost.type === 'VIDEO' ? "video/*" : "image/*"}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required
                                    />
                                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-[#bf152d] transition-colors">
                                        {file ? (
                                            <>
                                                <Music className="w-8 h-8" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-white">{file.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8" />
                                                <span className="text-sm font-medium">Click para seleccionar</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Debes subir un archivo del mismo tipo ({editingPost.type === 'VIDEO' ? 'Video' : 'Imagen'}).
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#bf152d] resize-none h-24"
                                    placeholder="Escribe una descripción..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!file || isSubmitting}
                                className="w-full bg-[#bf152d] hover:bg-[#a01226] text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 dark:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Confirmar Reemplazo'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showNameEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95">
                        <button
                            onClick={() => setShowNameEdit(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-6 text-[#1e1219] dark:text-white">Editar Nombre</h2>
                        <form onSubmit={handleUpdateName} className="space-y-4">
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-zinc-800 rounded-xl px-4 py-3 font-bold text-[#1e1219] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#bf152d]"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#bf152d] hover:bg-[#a01226] text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 dark:shadow-red-900/20 transition-all"
                            >
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
