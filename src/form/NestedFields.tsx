import React, { useEffect, useState } from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import axios from 'axios';

interface NestedFieldsProps {
  control: Control<any>;
  amount: number;
}

interface Category {
  value: string;
  label: string;
}

interface CategoryFromApi {
  slug: string;
  name: string;
  url: string;
}

const InputField: React.FC<{
  label: string;
  field: any;
  error: any;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}> = ({
  label,
  field,
  error,
  type = 'text',
  placeholder = '',
  disabled = false,
}) => (
  <div className="mb-2">
    <label>{label}</label>
    <input
      {...field}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className={`border p-2 w-full ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
);

export const NestedFields: React.FC<NestedFieldsProps> = ({
  control,
  amount,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'witnesses',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://dummyjson.com/products/categories'
        );
        setCategories(
          response?.data?.map((cat: CategoryFromApi) => ({
            label: cat.name,
            value: cat.slug,
          })) ?? []
        );
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Controller
        name="allocation"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <InputField
            label="Allocation"
            field={field}
            error={error}
            type="number"
            placeholder="Enter allocation"
            disabled={!amount}
          />
        )}
      />

      <div className="mb-2">
        <label htmlFor="category">Category</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select {...field} id="category" className="border p-2 w-full">
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div className="mb-2">
        <label>Witnesses</label>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-2">
            <div className="flex">
              <Controller
                name={`witnesses.${index}.name`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="mr-2 w-1/2">
                    <InputField
                      label=""
                      field={field}
                      error={error}
                      placeholder="Name"
                    />
                  </div>
                )}
              />
              <Controller
                name={`witnesses.${index}.email`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="w-1/2">
                    <InputField
                      label=""
                      field={field}
                      error={error}
                      placeholder="Email"
                    />
                  </div>
                )}
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm"
              >
                Remove {index}
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          disabled={fields.length >= 5}
          onClick={() => append({ name: '', email: '' })}
          className="bg-green-500 text-white p-1 text-sm rounded"
        >
          Add Witness
        </button>
      </div>
    </>
  );
};
