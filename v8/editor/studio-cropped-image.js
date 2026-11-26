export function createCroppedImageStore({
  cloudAvailable, getTemplateId, getProjectId, getEventName,
  ensureCloudProjectFor, uploadCloudImage, toast, blobToDataUrl
}) {
  return async function storeCroppedImage(blob) {
    if (cloudAvailable()) {
      try {
        const cloudProjectId = await ensureCloudProjectFor({
          templateId: getTemplateId(),
          projectId: getProjectId(),
          name: getEventName()
        });
        return await uploadCloudImage({blob, projectId: cloudProjectId});
      } catch (err) {
        console.warn('[OnlyEvent image upload]', err);
        toast('云端上传失败，图片已保存在本机');
      }
    }
    return blobToDataUrl(blob);
  };
}
