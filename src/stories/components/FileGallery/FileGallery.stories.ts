/* eslint-disable check-file/filename-naming-convention */
import type { Meta, StoryObj } from "@storybook/react";

import { FileGallery } from "@/components/createPost/mediaFormField";

const meta = {
	title: "Components/FileGallery",
	component: FileGallery,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {},
	args: {},
} satisfies Meta<typeof FileGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	args: {
		files: [],
		onRemoveFile: () => {},
		fileProgress: {},
		restrictions: {
			maxFiles: 4,
			maxSize: 0,
			maxSizeInMB: "",
			accept: {},
		},
		isLoading: false,
	},
};


