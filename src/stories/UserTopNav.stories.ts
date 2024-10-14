import type { Meta, StoryObj } from '@storybook/react';

import UserTopNav from '../app/components/UserTopNav';

const meta: Meta<typeof UserTopNav> = {
    component: UserTopNav,
    title: 'Components/UserTopNav',
};

export default meta;
type Story = StoryObj<typeof UserTopNav>;

export const Primary: Story = {
    args: {
        userName: 'John Doe'
    },
};



