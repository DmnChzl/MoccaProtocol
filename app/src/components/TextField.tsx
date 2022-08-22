import { mergeProps } from 'solid-js';

interface TextFieldProps {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  placeholder?: string;
  defaultValue: string;
  type?: string;
  onInput: () => void;
}

export const TextField = props => {
  const merged = mergeProps(
    { placeholder: '> input value goes here <', type: 'text' },
    props
  );

  return (
    <label class="relative flex m-3">
      {props.startAdornment}
      <input
        class="text-field__input"
        classList={{
          'pl-4': !props.startAdornment,
          'pl-10': props.startAdornment,
          'pr-4': !props.endAdornment,
          'pr-10': props.endAdornment
        }}
        placeholder={merged.placeholder}
        value={props.defaultValue}
        type={merged.type}
        onInput={props.onInput}
      />
      {props.endAdornment}
    </label>
  );
};
