import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: any; // validation rules
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: CustomInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View className="mb-4">
          <TextInput
            {...props}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 rounded-lg text-black placeholder-gray-500 
                        ${error ? 'border border-red-500 bg-red-50' : 'border border-neutral-300 bg-neutral-300'}`}
          />
          {error && (
            <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
