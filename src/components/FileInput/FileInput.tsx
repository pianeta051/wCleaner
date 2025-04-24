import { useEffect, useRef, FC } from "react";

export type FileInputProps = {
  value: File[];
  onChange(files: File[]): void;
};

export const FileInput: FC<FileInputProps> = ({ value = [], onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      value.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }
  }, [value]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      onChange([]);
      return;
    }
    const newFiles = Array.from(e.target.files);
    onChange(newFiles);
  };

  return <input type="file" ref={inputRef} onChange={changeHandler} multiple />;
};
