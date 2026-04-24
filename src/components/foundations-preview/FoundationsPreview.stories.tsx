import type { Meta, StoryObj } from '@storybook/react-vite';
import { FoundationsPreview } from './FoundationsPreview';

const meta = {
  title: 'Foundations/Preview',
  component: FoundationsPreview,
  tags: ['autodocs'],
  parameters: {
    controls: {
      disable: true
    }
  }
} satisfies Meta<typeof FoundationsPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
