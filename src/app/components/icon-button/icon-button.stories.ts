import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';

import { IconButton } from './icon-button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<IconButton> = {
  title: 'IconButton',
  component: IconButton,
  tags: ['autodocs'],
  // argTypes: {
  //   backgroundColor: {
  //     control: 'color',
  //   },
  // },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  // args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<IconButton>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Add: Story = {
  args: {
    icon: 'add',
  },
};

export const Delete: Story = {
  args: {
    icon: 'delete',
  },
};

export const Settings: Story = {
  args: {
    icon: 'settings',
  },
};
