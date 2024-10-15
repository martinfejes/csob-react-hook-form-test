import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { NestedFields } from './NestedFields';

interface FormData {
  amount: number;
  damagedParts: string[];
  allocation: number;
  category: string;
  witnesses: { name: string; email: string }[];
}

const schema = yup.object().shape({
  amount: yup.number().min(0).max(300).required('Amount is required'),
  damagedParts: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Select at least one damaged part')
    .required(),
  allocation: yup.number().required('Allocation is required'),
  category: yup.string().required('Category is required'),
  witnesses: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Name is required'),
        email: yup
          .string()
          .email('Invalid email')
          .required('Email is required'),
      })
    )
    .required('Witnesses are required'),
});

const initialValues: FormData = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
};

const damagedPartsOptions = ['roof', 'front', 'side', 'rear'];

export const MainForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const amount = watch('amount');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
      <div className="mb-2">
        <label htmlFor="amount">Amount</label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              id="amount"
              placeholder="Enter amount"
              className={`border w-full p-2 ${
                errors.amount ? 'border-red-500' : ''
              }`}
            />
          )}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>

      <div className="mb-2">
        <label>Damaged Parts</label>
        <div className="flex">
          {damagedPartsOptions.map((part) => (
            <div key={part} className="mr-2">
              <Controller
                name="damagedParts"
                control={control}
                render={({ field }) => (
                  <label>
                    <input
                      type="checkbox"
                      {...field}
                      value={part}
                      checked={field.value.includes(part)}
                      onChange={(e) => {
                        const updatedValue = e.target.checked
                          ? [...field.value, part]
                          : field.value.filter((v) => v !== part);
                        field.onChange(updatedValue);
                      }}
                    />
                    <span className="ml-1">{part}</span>
                  </label>
                )}
              />
            </div>
          ))}
        </div>
        {errors.damagedParts && (
          <p className="text-red-500 text-sm">{errors.damagedParts.message}</p>
        )}
      </div>

      <NestedFields control={control} amount={amount} />

      <div className="mt-4">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </div>
    </form>
  );
};
