import type { Meta, StoryObj } from '@storybook/react';

import Message from '../app/components/Message';

const meta: Meta<typeof Message> = {
  component: Message,
  title: 'Components/Messaging',
};

export default meta;
type Story = StoryObj<typeof Message>;

export const Primary: Story = {
  args: {
    id: 2345,
    sender: 'Alice',
    content: 'Hello! How are you?',
    timestamp: '10:00 AM',
    isSender: true,
  },
};


export const ReceivedMessage: Story = {
  args: {
    id: 1234,
    sender: 'Bob',
    content: 'I’m good, thanks! How about you?',
    timestamp: '10:01 AM',
    isSender: false,
  },
};

