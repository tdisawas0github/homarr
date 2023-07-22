import { Box, Indicator, Tooltip } from '@mantine/core';
import { IconCheck, IconLoader, IconX } from '@tabler/icons-react';
import Consola from 'consola';
import { TargetAndTransition, Transition, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { api } from '~/utils/api';

import { useConfigContext } from '../../../../config/provider';
import { AppType } from '../../../../types/app';

interface AppPingProps {
  app: AppType;
}

export const AppPing = ({ app }: AppPingProps) => {
  const { t } = useTranslation('modules/ping');
  const { config } = useConfigContext();
  const active =
    (config?.settings.customization.layout.enabledPing && app.network.enabledStatusChecker) ??
    false;

  const { data, isFetching, isError, error } = api.app.ping.useQuery(app.id, {
    retry: false,
    enabled: active,
    select: (data) => {
      const isOk = getIsOk(app, data.status);
      if (isOk)
        Consola.info(`Ping of app "${app.name}" (${app.url}) returned ${data.status} (Accepted)`);
      else
        Consola.warn(`Ping of app "${app.name}" (${app.url}) returned ${data.status} (Refused)`);
      return {
        status: data.status,
        state: isOk ? ('online' as const) : ('down' as const),
        statusText: data.statusText,
      };
    },
  });

  if (!active) return null;

  const isOnline = isError ? false : data?.state === 'online';

  const disablePulse = config?.settings.customization.accessibility?.disablePingPulse ?? false;
  const replaceDotWithIcon =
    config?.settings.customization.accessibility?.replacePingDotsWithIcons ?? false;

  const scaleAnimation = isOnline ? [1, 0.7, 1] : 1;
  const animate: TargetAndTransition | undefined = disablePulse
    ? undefined
    : {
        scale: scaleAnimation,
      };
  const transition: Transition | undefined = disablePulse
    ? undefined
    : {
        repeat: Infinity,
        duration: 2.5,
        ease: 'easeInOut',
      };

  const label = () => {
    if (isFetching) return t('states.loading');
    if (isError) return  error?.message;
    if (data?.state === 'online') return t('states.online', { response: data?.status ?? 'N/A' });
    return `${data?.statusText}: ${data?.status} (denied)`;
  }
  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: replaceDotWithIcon ? 5 : 20,
        right: replaceDotWithIcon ? 8 : 20,
        zIndex: 2,
      }}
      animate={animate}
      transition={transition}
    >
      <Tooltip
        withinPortal
        radius="lg"
        label={label()}
      >
        {config?.settings.customization.accessibility?.replacePingDotsWithIcons ? (
          <Box>
            <AccessibleIndicatorPing isLoading={isFetching} isOnline={isOnline} />
          </Box>
        ) : (
          <Indicator
            size={15}
            color={isFetching ? 'yellow' : isOnline ? 'green' : 'red'}
            children={null}
          />
        )}
      </Tooltip>
    </motion.div>
  );
};

const AccessibleIndicatorPing = ({
  isLoading,
  isOnline,
}: {
  isOnline: boolean;
  isLoading: boolean;
}) => {
  if (isOnline) {
    return <IconCheck color="green" />;
  }

  if (isLoading) {
    return <IconLoader />;
  }

  return <IconX color="red" />;
};

export const getIsOk = (app: AppType, status: number) => {
  if (app.network.okStatus === undefined || app.network.statusCodes.length >= 1) {
    return app.network.statusCodes.includes(status.toString());
  }
  return app.network.okStatus.includes(status);
};
