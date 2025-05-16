'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import {
  DefaultValues,
  type FieldPath,
  type FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useFormContext,
  useFormState,
} from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/base/components/ui/button';
import { Checkbox } from '@/base/components/ui/checkbox';
import { DatePicker } from '@/base/components/ui/date-picker';
import { DateRangePicker } from '@/base/components/ui/date-range-picker';
import { DateTimePicker } from '@/base/components/ui/date-time-picker';
import { DateTimeRangePicker } from '@/base/components/ui/date-time-range-picker';
import { Input } from '@/base/components/ui/input';
import { Label } from '@/base/components/ui/label';
import { PasswordInput } from '@/base/components/ui/password-input';
import { Select, SelectOption } from '@/base/components/ui/select';
import { Slider } from '@/base/components/ui/slider';
import { Switch } from '@/base/components/ui/switch';
import { Textarea } from '@/base/components/ui/textarea';
import { TimePicker } from '@/base/components/ui/time-picker';
import { TimeRangePicker } from '@/base/components/ui/time-range-picker';
import { cn } from '@/base/lib';
import { withProps } from '@/base/utils';

type FormFieldRenderFn<ControlCompProps> = (comps: {
  /**
   * The component that renders the label of the field
   */
  Label: (
    props: Omit<React.ComponentProps<typeof InternalFormLabel>, 'children'>,
  ) => React.ReactElement;
  /**
   * The component that renders the control (input, picker, switch, select, ...) of the field
   */
  Control: (props: ControlCompProps) => React.ReactElement;
  /**
   * The component that renders the description of the field
   */
  Description: (props: React.ComponentProps<typeof InternalFormDescription>) => React.ReactElement;
  /**
   * The component that renders the error/success messages of the field
   */
  Message: (props: React.ComponentProps<typeof InternalFormMessage>) => React.ReactNode;
}) => React.ReactNode;

type FormFieldSpec<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  disabled?: boolean;
} & (
  | {
      type: 'text';
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof Input>>;
    }
  | {
      type: 'password';
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof PasswordInput>>;
    }
  | {
      type: 'textarea';
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof Textarea>>;
    }
  | {
      type: 'checkbox';
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof Checkbox>>;
    }
  | {
      type: 'date';
      range?: false;
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof DatePicker>>;
    }
  | {
      type: 'date';
      range: true;
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof DateRangePicker>>;
    }
  | {
      type: 'time';
      range?: false;
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof TimePicker>>;
    }
  | {
      type: 'time';
      range: true;
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof TimeRangePicker>>;
    }
  | {
      type: 'datetime';
      range?: false;
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof DateTimePicker>>;
    }
  | {
      type: 'datetime';
      range: true;
      placeholder?: string;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof DateTimeRangePicker>>;
    }
  | {
      type: 'select';
      options: SelectOption[];
      multiple?: boolean;
      placeholder?: string;
      searchable?: boolean;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<
        Omit<
          React.ComponentProps<typeof Select>,
          'options' | 'multiple' | 'searchable' | 'value' | 'onChange'
        >
      >;
    }
  | {
      type: 'slider';
      step?: number;
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof Slider>>;
    }
  | {
      type: 'switch';
      /**
       * A custom render function for the form field.
       *
       * @default
       * ```tsx
       * ({ Control, Label, Description, Message }) => (
       *   <>
       *     <Label />
       *     <Control />
       *     <Description />
       *     <Message />
       *   </>
       * )
       * ```
       */
      render?: FormFieldRenderFn<React.ComponentProps<typeof Switch>>;
    }
);

interface FormProps<TFieldValues extends FieldValues, TTransformedValues> {
  schema: z.ZodObject<z.ZodRawShape, 'strip', z.ZodTypeAny, TTransformedValues, TFieldValues>;
  fields: FormFieldSpec<TFieldValues>[];
  onSuccessSubmit: SubmitHandler<TTransformedValues>;
  onErrorSubmit?: SubmitErrorHandler<TFieldValues>;
  defaultValues?: DefaultValues<TFieldValues>;
  renderSubmitButton?: (
    Comp: (
      props: Omit<React.ComponentProps<typeof Button>, 'type' | 'loading' | 'disabled'>,
    ) => React.ReactElement,
  ) => React.ReactNode;
  i18nNamespace?: Parameters<typeof useTranslations>[0];
  className?: string;
}

function Form<TFieldValues extends FieldValues, TTransformedValues>({
  schema,
  fields,
  className,
  defaultValues,
  i18nNamespace,
  onSuccessSubmit,
  onErrorSubmit,
  renderSubmitButton,
}: FormProps<TFieldValues, TTransformedValues>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(schema, defaultValues),
  });
  const t = useTranslations(i18nNamespace);

  const SubmitButton = Button;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSuccessSubmit, onErrorSubmit)}
        className={cn('grid gap-4', className)}
      >
        {fields.map((formField) => {
          const Label = InternalFormLabel;
          const Control = getFormControl(formField);
          const Description = InternalFormDescription;
          const Message = InternalFormMessage;
          const isFieldRequired = !(schema.shape[formField.name] instanceof z.ZodOptional);

          return (
            <InternalFormField key={formField.name} name={formField.name}>
              <InternalFormItem i18nNamespace={i18nNamespace}>
                {!formField.render ? (
                  <>
                    <Label required={isFieldRequired}>{formField.label}</Label>
                    <Control />

                    {(t.has(`fields.${formField.name}.description` as Parameters<typeof t>[0]) ||
                      formField.description) && <Description>{formField.description}</Description>}
                    <Message />
                  </>
                ) : (
                  formField.render({
                    Label: withProps(Label, {
                      required: isFieldRequired,
                      children: formField.label,
                    }),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Control: Control as any,
                    Description: (props) =>
                      t.has(`fields.${formField.name}.description` as Parameters<typeof t>[0]) ||
                      formField.description ? (
                        <Description {...props}>{formField.description}</Description>
                      ) : (
                        <></>
                      ),
                    Message,
                  })
                )}
              </InternalFormItem>
            </InternalFormField>
          );
        })}
        {!renderSubmitButton ? (
          <SubmitButton type="submit" loading={form.formState.isSubmitting}>
            Submit
          </SubmitButton>
        ) : (
          renderSubmitButton(
            withProps(SubmitButton, { type: 'submit', loading: form.formState.isSubmitting }),
          )
        )}
      </form>
    </FormProvider>
  );
}

function getFormControl(formField: FormFieldSpec) {
  switch (formField.type) {
    case 'text':
      return function TextFormControl(props: React.ComponentProps<typeof Input>) {
        const form = useFormContext();
        const { i18nNamespace } = useFormField();
        const t = useTranslations(i18nNamespace);

        return (
          <InternalFormControl>
            <Input
              placeholder={
                formField.placeholder ??
                t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
              }
              {...form.register(formField.name)}
              {...props}
            />
          </InternalFormControl>
        );
      };

    case 'password':
      return function PasswordFormControl(props: React.ComponentProps<typeof PasswordInput>) {
        const form = useFormContext();
        const { i18nNamespace } = useFormField();
        const t = useTranslations(i18nNamespace);

        return (
          <InternalFormControl>
            <PasswordInput
              placeholder={
                formField.placeholder ??
                t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
              }
              {...form.register(formField.name)}
              {...props}
            />
          </InternalFormControl>
        );
      };

    case 'textarea':
      return function TextareaFormControl(props: React.ComponentProps<typeof Textarea>) {
        const form = useFormContext();
        const { i18nNamespace } = useFormField();
        const t = useTranslations(i18nNamespace);

        return (
          <InternalFormControl>
            <Textarea
              placeholder={
                formField.placeholder ??
                t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
              }
              {...form.register(formField.name)}
              {...props}
            />
          </InternalFormControl>
        );
      };

    case 'checkbox':
      return function CheckboxFormControl(props: React.ComponentProps<typeof Checkbox>) {
        const form = useFormContext();

        return (
          <InternalFormControl>
            <Checkbox
              checked={form.getValues(formField.name)}
              onChange={(checked) =>
                form.setValue(formField.name, checked, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              {...props}
            />
          </InternalFormControl>
        );
      };

    case 'date':
      if (formField.range) {
        return function DateRangeFormControl({
          triggerClassName,
          ...props
        }: React.ComponentProps<typeof DateRangePicker>) {
          const form = useFormContext();
          const { error, i18nNamespace } = useFormField();
          const t = useTranslations(i18nNamespace);

          return (
            <InternalFormControl>
              <DateRangePicker
                dateRange={form.getValues(formField.name)}
                onDateRangeChange={(dateRange) =>
                  form.setValue(formField.name, dateRange, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                disabled={formField.disabled}
                placeholder={
                  formField.placeholder ??
                  t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
                }
                triggerClassName={cn(
                  { 'ring-danger/20! dark:ring-danger/40! border-danger!': !!error },
                  triggerClassName,
                )}
                {...props}
              />
            </InternalFormControl>
          );
        };
      }

      return function DateFormControl({
        triggerClassName,
        ...props
      }: React.ComponentProps<typeof DatePicker>) {
        const form = useFormContext();
        const { error, i18nNamespace } = useFormField();
        const t = useTranslations(i18nNamespace);

        return (
          <InternalFormControl>
            <DatePicker
              date={form.getValues(formField.name)}
              onDateChange={(date) =>
                form.setValue(formField.name, date, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              disabled={formField.disabled}
              placeholder={
                formField.placeholder ??
                t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
              }
              triggerClassName={cn(
                { 'ring-danger/20! dark:ring-danger/40! border-danger!': !!error },
                triggerClassName,
              )}
              {...props}
            />
          </InternalFormControl>
        );
      };

    case 'time':
      if (formField.range) {
        return function TimeRangeFormControl({
          triggerClassName,
          ...props
        }: React.ComponentProps<typeof TimeRangePicker>) {
          const form = useFormContext();
          const { error, i18nNamespace } = useFormField();
          const t = useTranslations(i18nNamespace);

          return (
            <InternalFormControl>
              <TimeRangePicker
                dateRange={form.getValues(formField.name)}
                onDateRangeChange={(dateRange) =>
                  form.setValue(formField.name, dateRange, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                disabled={formField.disabled}
                placeholder={
                  formField.placeholder ??
                  t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
                }
                triggerClassName={cn(
                  { 'ring-danger/20! dark:ring-danger/40! border-danger!': !!error },
                  triggerClassName,
                )}
                {...props}
              />
            </InternalFormControl>
          );
        };
      }

      return function TimeFormControl({
        triggerClassName,
        ...props
      }: React.ComponentProps<typeof TimePicker>) {
        const form = useFormContext();
        const { error, i18nNamespace } = useFormField();
        const t = useTranslations(i18nNamespace);

        return (
          <InternalFormControl>
            <TimePicker
              date={form.getValues(formField.name)}
              onDateChange={(date) =>
                form.setValue(formField.name, date, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              disabled={formField.disabled}
              placeholder={
                formField.placeholder ??
                t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
              }
              triggerClassName={cn(
                { 'ring-danger/20! dark:ring-danger/40! border-danger!': !!error },
                triggerClassName,
              )}
              {...props}
            />
          </InternalFormControl>
        );
      };

    case 'datetime':
      if (formField.range) {
        return function DateTimeRangeFormControl({
          triggerClassName,
          ...props
        }: React.ComponentProps<typeof DateTimeRangePicker>) {
          const form = useFormContext();
          const { error, i18nNamespace } = useFormField();
          const t = useTranslations(i18nNamespace);

          return (
            <InternalFormControl>
              <DateTimeRangePicker
                dateRange={form.getValues(formField.name)}
                onDateRangeChange={(dateRange) =>
                  form.setValue(formField.name, dateRange, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                disabled={formField.disabled}
                placeholder={
                  formField.placeholder ??
                  t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
                }
                triggerClassName={cn(
                  { 'ring-danger/20! dark:ring-danger/40! border-danger!': !!error },
                  triggerClassName,
                )}
                {...props}
              />
            </InternalFormControl>
          );
        };
      }

      return function DateTimeFormControl({
        triggerClassName,
        ...props
      }: Omit<React.ComponentProps<typeof DateTimePicker>, 'date' | 'onDateChange'>) {
        const form = useFormContext();
        const { error, i18nNamespace } = useFormField();
        const t = useTranslations(i18nNamespace);

        return (
          <InternalFormControl>
            <DateTimePicker
              date={form.getValues(formField.name)}
              onDateChange={(date) =>
                form.setValue(formField.name, date, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              disabled={formField.disabled}
              placeholder={
                formField.placeholder ??
                t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
              }
              triggerClassName={cn(
                { 'ring-danger/20! dark:ring-danger/40! border-danger!': !!error },
                triggerClassName,
              )}
              {...props}
            />
          </InternalFormControl>
        );
      };

    case 'select':
      return function SelectFormControl({
        triggerClassName,
        ...props
      }: Omit<React.ComponentProps<typeof Select>, 'options' | 'multiple' | 'value' | 'onChange'>) {
        const form = useFormContext();
        const { error, i18nNamespace } = useFormField();
        const t = useTranslations(i18nNamespace);

        return (
          <Select
            options={formField.options}
            multiple={formField.multiple}
            searchable={formField.searchable}
            disabled={formField.disabled}
            value={form.getValues(formField.name)}
            onChange={(value: string | string[]) =>
              form.setValue(formField.name, value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            placeholder={
              formField.placeholder ??
              t(`fields.${formField.name}.placeholder` as Parameters<typeof t>[0])
            }
            triggerClassName={cn(
              {
                'ring-danger/20! dark:ring-danger/40! border-danger!': !!error,
              },
              triggerClassName,
            )}
            {...props}
          />
        );
      };

    case 'slider':
      return function SliderFormControl(props: React.ComponentProps<typeof Slider>) {
        const form = useFormContext();

        return (
          <InternalFormControl>
            <Slider
              value={form.getValues(formField.name)}
              onValueChange={([value]) =>
                form.setValue(formField.name, value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              {...props}
            />
          </InternalFormControl>
        );
      };

    case 'switch':
      return function SwitchFormControl(props: React.ComponentProps<typeof Switch>) {
        const form = useFormContext();

        return (
          <InternalFormControl>
            <Switch
              disabled={formField.disabled}
              checked={form.getValues(formField.name)}
              onCheckedChange={(check) =>
                form.setValue(formField.name, check, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              {...props}
            />
          </InternalFormControl>
        );
      };
  }
}

function getDefaultValues<TFieldValues extends FieldValues, TTransformedValues>(
  schema: z.ZodObject<z.ZodRawShape, 'strip', z.ZodTypeAny, TTransformedValues, TFieldValues>,
  defaultValues?: DefaultValues<TFieldValues>,
) {
  const zodDefaults = Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) {
        return [key, value._def.defaultValue()];
      }

      if (value instanceof z.ZodString) {
        return [key, ''];
      }

      if (value instanceof z.ZodBoolean) {
        return [key, false];
      }

      if (value instanceof z.ZodArray) {
        return [key, []];
      }

      return [key, undefined];
    }),
  );

  return {
    ...zodDefaults,
    ...defaultValues,
  } as DefaultValues<TFieldValues>;
}

type InternalFormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const InternalFormFieldContext = React.createContext<InternalFormFieldContextValue>(
  {} as InternalFormFieldContextValue,
);

type InternalFormFieldProps<TFieldValues extends FieldValues = FieldValues> =
  React.PropsWithChildren<{
    name: FieldPath<TFieldValues>;
  }>;

function InternalFormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  children,
}: InternalFormFieldProps<TFieldValues>) {
  return (
    <InternalFormFieldContext.Provider value={{ name }}>
      {children}
    </InternalFormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(InternalFormFieldContext);
  const itemContext = React.useContext(InternalFormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    i18nNamespace: itemContext.i18nNamespace,
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type InternalFormItemContextValue = {
  id: string;
  i18nNamespace?: Parameters<typeof useTranslations>[0];
};

const InternalFormItemContext = React.createContext<InternalFormItemContextValue>(
  {} as InternalFormItemContextValue,
);

function InternalFormItem({
  className,
  i18nNamespace,
  ...props
}: React.ComponentProps<'div'> & { i18nNamespace?: Parameters<typeof useTranslations>[0] }) {
  const id = React.useId();

  return (
    <InternalFormItemContext.Provider value={{ id, i18nNamespace }}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </InternalFormItemContext.Provider>
  );
}

function InternalFormLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  const { error, formItemId, i18nNamespace, name } = useFormField();
  const t = useTranslations(i18nNamespace);

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-danger', className)}
      htmlFor={formItemId}
      {...props}
    >
      {children ?? t(`fields.${name}.label` as Parameters<typeof t>[0])}
      {required && (
        <span className="text-danger" aria-hidden>
          *
        </span>
      )}
    </Label>
  );
}

function InternalFormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function InternalFormDescription({ className, children, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId, i18nNamespace, name } = useFormField();
  const t = useTranslations(i18nNamespace);

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    >
      {children ?? t(`fields.${name}.description` as Parameters<typeof t>[0])}
    </p>
  );
}

function InternalFormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId, name, i18nNamespace } = useFormField();
  const t = useTranslations(i18nNamespace);

  const body = error
    ? t(`fields.${name}.errors.${error.type}` as Parameters<typeof t>[0])
    : props.children;

  if (!body) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <InfoIcon className="text-danger size-4" />
      <p
        data-slot="form-message"
        id={formMessageId}
        className={cn('text-danger text-sm', className)}
        {...props}
      >
        {body}
      </p>
    </div>
  );
}

export { useFormField, Form };
