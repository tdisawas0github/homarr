import { Flex, Group, Indicator, Paper, Stack } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { Logo } from '~/components/layout/Common/Logo';
import { createDummyArray } from '~/tools/client/arrays';
import { useColorTheme } from '~/tools/color';
import { tss } from '~/utils/tss';

type LayoutPreviewProps = {
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  showPings: boolean;
};
export const LayoutPreview = ({
  showLeftSidebar,
  showRightSidebar,
  showPings,
}: LayoutPreviewProps) => {
  const { classes } = useStyles();

  return (
    <Stack gap="xs">
      <Paper px="xs" py={4} withBorder>
        <Group justify="apart">
          <div style={{ flex: 1 }}>
            <Logo size="xs" />
          </div>
          <BaseElement width={60} height={10} />
          <Group style={{ flex: 1 }} justify="right">
            <BaseElement width={10} height={10} />
          </Group>
        </Group>
      </Paper>

      <Flex gap={6}>
        {showLeftSidebar && (
          <Paper className={classes.secondaryWrapper} p="xs" withBorder>
            <Flex gap={5} wrap="wrap" align="end" w={65}>
              {createDummyArray(5).map((_item, index) => (
                <PlaceholderElement
                  height={index % 4 === 0 ? 60 + 5 : 30}
                  width={30}
                  key={`example-item-right-sidebard-${index}`}
                  index={index}
                  showPing={showPings}
                />
              ))}
            </Flex>
          </Paper>
        )}

        <Paper className={classes.primaryWrapper} p="xs" withBorder>
          <Flex gap={5} wrap="wrap">
            {createDummyArray(10).map((_item, index) => (
              <PlaceholderElement
                height={30}
                width={index % 5 === 0 ? 60 + 5 : 30}
                key={`example-item-main-${index}`}
                index={index}
                showPing={showPings}
              />
            ))}
          </Flex>
        </Paper>

        {showRightSidebar && (
          <Paper className={classes.secondaryWrapper} p="xs" withBorder>
            <Flex gap={5} align="start" wrap="wrap" w={65}>
              {createDummyArray(5).map((_item, index) => (
                <PlaceholderElement
                  height={30}
                  width={index % 4 === 0 ? 60 + 5 : 30}
                  key={`example-item-right-sidebard-${index}`}
                  index={index}
                  showPing={showPings}
                />
              ))}
            </Flex>
          </Paper>
        )}
      </Flex>
    </Stack>
  );
};

const useStyles = tss.create(() => ({
  primaryWrapper: {
    flexGrow: 2,
  },
  secondaryWrapper: {
    flexGrow: 1,
    maxWidth: 100,
  },
}));

const BaseElement = ({ height, width }: { height: number; width: number }) => {
  const colorScheme = useColorScheme();
  return (
    <Paper
      style={(theme) => ({
        backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[1],
      })}
      h={height}
      p={2}
      w={width}
    />
  );
};

type PlaceholderElementProps = {
  height: number;
  width: number;
  showPing: boolean;
  index: number;
};
const PlaceholderElement = ({ height, width, showPing, index }: PlaceholderElementProps) => {
  if (showPing) {
    return (
      <Indicator
        position="bottom-end"
        size={5}
        offset={10}
        color={index % 4 === 0 ? 'red' : 'green'}
      >
        <BaseElement width={width} height={height} />
      </Indicator>
    );
  }

  return <BaseElement width={width} height={height} />;
};
