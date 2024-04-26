import { API_PREFIX } from '@constants/config';

const api_profile_photo = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<{ message: string; imageName: string }> => {
    try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const options: any = {
            method: 'POST',
            body: formData,
            credentials: 'include'
        };

        if (onProgress) {
            options.onUploadProgress = (progressEvent: any) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress(percentCompleted);
            };
        }

        const response = await fetch(
            API_PREFIX + '/upload/profile_photo',
            options
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Something went wrong during the photo upload!'
            );
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export default api_profile_photo;
