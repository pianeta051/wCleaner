export const uploadFile = async (file: File, path: string): Promise<string> => {
  // await Storage.put(path, file, {
  //   level: "public",
  // });

  return path;
};

export const getFileUrl = async (key: string): Promise<string> => {
  // return await Storage.get(key);
  return "abc";
};

export const deleteFile = async (key: string): Promise<void> => {
  // await Storage.remove(key, {
  //   level: "public",
  // });
};
