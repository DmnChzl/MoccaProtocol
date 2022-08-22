import { IconUpload } from '../icons';

interface UploadFileProps {
  onChange: () => void;
}

export const UploadFile = ({ onChange }: UploadFileProps) => (
  <div class="p-3 h-full">
    <label for="upload-file" class="group upload-file__label">
      <span class="upload-file__icon">
        <IconUpload class="mx-auto" />
        Choose A File
      </span>
    </label>
    <input
      type="file"
      name="file"
      id="upload-file"
      class="absolute opacity-0 -z-1"
      onChange={onChange}
    />
  </div>
);
