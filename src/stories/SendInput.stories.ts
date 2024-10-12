import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SendInput from '../app/components/SendInput';

const meta: Meta<typeof SendInput> = {
  component: SendInput,
  title: 'Components/SendInput',
  parameters:{
    args: { onClick: fn() }
  }
};

export default meta;
type Story = StoryObj<typeof SendInput>;

export const Primary: Story = {
  args: {
  }
};

