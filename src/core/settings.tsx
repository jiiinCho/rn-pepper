import * as React from 'react';

import { IconProps, default as MaterialCommunityIcon } from '../components/MaterialCommunityIcon';

export type Settings = {
  icon: ({ name, color, size, direction }: IconProps) => React.ReactNode;
};

export const { Provider, Consumer } = React.createContext<Settings>({
  icon: MaterialCommunityIcon,
});
