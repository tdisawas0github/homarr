import { v4 as uuidv4 } from 'uuid';
import { AppType } from '../../types/app';
import { AreaType } from '../../types/area';
import { CategoryType } from '../../types/category';
import { ConfigType } from '../../types/config';
import { Config, serviceItem } from '../types';

export function migrateConfig(config: Config): ConfigType {
  const newConfig: ConfigType = {
    schemaVersion: 1,
    configProperties: {
      name: config.name ?? 'default',
    },
    categories: [],
    widgets: [],
    apps: [],
    settings: {
      common: {
        searchEngine: {
          type: 'google',
          properties: {
            enabled: true,
            openInNewTab: true,
          },
        },
        defaultConfig: 'default',
      },
      customization: {
        colors: {},
        layout: {
          enabledDocker: false,
          enabledLeftSidebar: false,
          enabledPing: false,
          enabledRightSidebar: false,
          enabledSearchbar: true,
        },
      },
    },
    wrappers: [
      {
        id: 'default',
        position: 1,
      },
    ],
  };

  config.services.forEach((service, index) => {
    const { category: categoryName } = service;

    if (!categoryName) {
      newConfig.apps.push(
        migrateService(service, index, {
          type: 'wrapper',
          properties: {
            id: 'default',
          },
        })
      );
      return;
    }

    const category = getConfigAndCreateIfNotExsists(newConfig, categoryName);

    if (!category) {
      return;
    }

    newConfig.apps.push(
      migrateService(service, index, { type: 'category', properties: { id: category.id } })
    );
  });

  return newConfig;
}

const getConfigAndCreateIfNotExsists = (
  config: ConfigType,
  categoryName: string
): CategoryType | null => {
  const foundCategory = config.categories.find((c) => c.name === categoryName);
  if (foundCategory) {
    return foundCategory;
  }

  const category: CategoryType = {
    id: uuidv4(),
    name: categoryName,
    position: 0,
  };

  config.categories.push(category);
  return category;
};

const migrateService = (
  oldService: serviceItem,
  serviceIndex: number,
  areaType: AreaType
): AppType => ({
  id: uuidv4(),
  name: oldService.name,
  url: oldService.url,
  behaviour: {
    isOpeningNewTab: oldService.newTab ?? true,
    externalUrl: oldService.openedUrl ?? '',
  },
  network: {
    enabledStatusChecker: oldService.ping ?? true,
    okStatus: oldService.status?.map((str) => parseInt(str, 10)) ?? [200],
  },
  appearance: {
    iconUrl: oldService.icon,
  },
  integration: {
    type: null,
    properties: [],
  },
  area: areaType,
  shape: {
    location: {
      x: (serviceIndex * 3) % 18,
      y: Math.floor(serviceIndex / 6) * 3,
    },
    size: {
      width: 3,
      height: 3,
    },
  },
});
