export async function uploadToS3(uploadUrl: string, file: File) {
    const res = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
    });
    if (!res.ok) throw new Error(`S3 PUT failed: ${res.status}`);
}
