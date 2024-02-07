import { FormProvider } from 'react-hook-form';

export const Form = (props) => {
  const { form, onSubmit: submit, children, ...rest } = props;

  const onSubmit = form.handleSubmit(submit);

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} {...rest}>
        {children}
      </form>
    </FormProvider>
  );
};
