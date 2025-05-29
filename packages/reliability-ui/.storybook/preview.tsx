import type { Preview } from '@storybook/react';
import { Theme } from '@radix-ui/themes';
import '../src/theme.css';

const preview: Preview = {
  decorators: [
    Story => (
      <Theme>
        <Story />
      </Theme>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Components'],
      },
    },
  },
};

export default preview;
