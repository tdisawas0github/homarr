import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ContextModalProps, modals } from '@mantine/modals';
import { getStaticFallbackConfig } from '~/tools/config/getFallbackConfig';
import { api } from '~/utils/api';
import { useI18nZodResolver } from '~/utils/i18n-zod-resolver';
import { createDashboardSchemaValidation } from '~/validations/dashboards';

export const CreateDashboardModal = ({ context, id, innerProps }: ContextModalProps<{}>) => {
  const apiContext = api.useContext();
  const { isLoading, mutate } = api.config.save.useMutation({
    onSuccess: async () => {
      await apiContext.config.all.invalidate();
      modals.close(id);
    },
  });

  const { i18nZodResolver } = useI18nZodResolver();

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: i18nZodResolver(createDashboardSchemaValidation),
  });

  const handleSubmit = () => {
    const fallbackConfig = getStaticFallbackConfig(form.values.name);
    mutate({
      name: form.values.name,
      config: fallbackConfig,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Text>A name cannot be changed after a dashboard has been created.</Text>

        <TextInput label="Name" withAsterisk {...form.getInputProps('name')} />

        <Group grow>
          <Button
            onClick={() => {
              modals.close(id);
            }}
            variant="light"
            color="gray"
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={async () => {}}
            disabled={isLoading}
            variant="light"
            color="green"
          >
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
